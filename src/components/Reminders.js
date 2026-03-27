'use client'
import { useState, useMemo, useEffect } from 'react'
import { fmt, generateId } from '@/lib/constants'

function IconPlus() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 3v12M3 9h12" /></svg>
}
function IconCheck() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 5" /></svg>
}
function IconClock() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="8" cy="8" r="6" /><path d="M8 4.5v4l2.5 1.5" /></svg>
}
function IconAlert() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2l6.5 11H1.5L8 2z" /><path d="M8 6.5v2.5M8 11v.5" /></svg>
}
function IconBell() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M5 8a4 4 0 018 0c0 4 2 6 2 6H3s2-2 2-6z" /><path d="M7.5 16a2 2 0 003 0" /></svg>
}

const SERVICE_TYPES = [
  { id: 'oil', label: 'Замена масла', icon: '🛢️', defaultKm: 10000, defaultDays: 365 },
  { id: 'brakes', label: 'Тормозные колодки', icon: '🔴', defaultKm: 30000, defaultDays: 730 },
  { id: 'tires', label: 'Шиномонтаж', icon: '🛞', defaultKm: null, defaultDays: 180 },
  { id: 'filters', label: 'Фильтры', icon: '🌀', defaultKm: 15000, defaultDays: 365 },
  { id: 'coolant', label: 'Антифриз', icon: '❄️', defaultKm: 60000, defaultDays: 730 },
  { id: 'battery', label: 'Аккумулятор', icon: '🔋', defaultKm: null, defaultDays: 1095 },
  { id: 'insurance', label: 'ОСАГО', icon: '🛡️', defaultKm: null, defaultDays: 365 },
  { id: 'inspection', label: 'Техосмотр', icon: '📋', defaultKm: null, defaultDays: 365 },
  { id: 'custom', label: 'Своё напоминание', icon: '🔔', defaultKm: null, defaultDays: null },
]

// ── Push notification helper ─────────────────────────────────────
async function requestLocalPushPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

function schedulePush(title, body, dateTime) {
  const delay = new Date(dateTime).getTime() - Date.now()
  if (delay <= 0) return null
  return setTimeout(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, { body, icon: '/icon-192.png', tag: 'automind-' + Date.now(), badge: '/favicon-32x32.png' })
      })
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192.png' })
    }
  }, delay)
}

// ── Add Reminder (fullscreen) ────────────────────────────────────
function AddReminder({ car, onAdd, onClose }) {
  const [type, setType] = useState('')
  const [customName, setCustomName] = useState('')
  const [lastDate, setLastDate] = useState(new Date().toISOString().split('T')[0])
  const [lastMileage, setLastMileage] = useState(car.mileage || '')
  const [intervalKm, setIntervalKm] = useState('')
  const [intervalDays, setIntervalDays] = useState('')
  const [pushDate, setPushDate] = useState('')
  const [pushTime, setPushTime] = useState('09:00')
  const [pushEnabled, setPushEnabled] = useState(false)

  const selected = SERVICE_TYPES.find((t) => t.id === type)
  const isCustom = type === 'custom'

  const handleSelect = (t) => {
    setType(t.id)
    setIntervalKm(t.defaultKm || '')
    setIntervalDays(t.defaultDays || '')
    if (t.id === 'custom') {
      // For custom, default push to tomorrow
      const tomorrow = new Date(Date.now() + 86400000)
      setPushDate(tomorrow.toISOString().split('T')[0])
      setPushEnabled(true)
    }
  }

  const handleSave = async () => {
    if (!type) return
    const label = isCustom ? (customName || 'Напоминание') : selected.label

    // Request push permission if push enabled
    if (pushEnabled && pushDate) {
      const granted = await requestLocalPushPermission()
      if (granted) {
        const dateTime = `${pushDate}T${pushTime}:00`
        schedulePush(`🔔 ${label}`, `Пора: ${label} для ${car.brand} ${car.model}`, dateTime)
      }
    }

    onAdd({
      id: generateId(), type, label, icon: selected.icon,
      lastDate: isCustom ? new Date().toISOString() : new Date(lastDate).toISOString(),
      lastMileage: lastMileage ? Number(lastMileage) : null,
      intervalKm: intervalKm ? Number(intervalKm) : null,
      intervalDays: intervalDays ? Number(intervalDays) : null,
      pushDate: pushEnabled && pushDate ? `${pushDate}T${pushTime}:00` : null,
      pushSent: false,
    })
    onClose()
  }

  // Step 1: type select
  if (!type) {
    return (
      <div className="fixed inset-0 z-[60] bg-white fade-in flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border shrink-0">
          <button onClick={onClose} className="text-subtle text-[15px] font-medium py-1">Отмена</button>
          <span className="text-[15px] font-semibold text-dark">Тип напоминания</span>
          <div className="w-16" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
          {SERVICE_TYPES.map((t) => (
            <button key={t.id} onClick={() => handleSelect(t)}
              className="w-full flex items-center gap-3.5 py-3.5 px-4 rounded-2xl border border-border bg-white active:bg-surface transition-all text-left mb-1.5">
              <span style={{ fontSize: '20px' }}>{t.icon}</span>
              <span className="text-[15px] font-semibold text-dark flex-1">{t.label}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b0b0be" strokeWidth="1.4" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Step 2: details
  return (
    <div className="fixed inset-0 z-[60] bg-white fade-in flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border shrink-0">
        <button onClick={() => setType('')} className="text-subtle text-[15px] font-medium py-1">Назад</button>
        <span className="text-[15px] font-semibold text-dark">{selected.icon} {selected.label}</span>
        <button onClick={handleSave} className="text-[15px] font-semibold text-gold-dark py-1">Сохранить</button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8">
        {/* Custom name */}
        {isCustom && (
          <div className="mb-4">
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1">О ЧЁМ НАПОМНИТЬ</label>
            <input type="text" placeholder="Напр. Записаться на ТО" value={customName}
              onChange={(e) => setCustomName(e.target.value)} className="w-full" />
          </div>
        )}

        {/* Push notification date/time */}
        <div className="mb-5 p-4 bg-gold-50 border border-gold/30 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconBell />
              <span className="text-sm font-semibold text-dark">Push-уведомление</span>
            </div>
            <button onClick={() => setPushEnabled(!pushEnabled)}
              className={`w-11 h-6 rounded-full transition-all relative ${pushEnabled ? 'bg-gold' : 'bg-border'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${pushEnabled ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
          {pushEnabled && (
            <div className="space-y-2.5 fade-in">
              <div>
                <label className="text-xs text-subtle block mb-1">Дата</label>
                <input type="date" value={pushDate} onChange={(e) => setPushDate(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="text-xs text-subtle block mb-1">Время</label>
                <input type="time" value={pushTime} onChange={(e) => setPushTime(e.target.value)} className="w-full" />
              </div>
            </div>
          )}
        </div>

        {/* Service-specific fields */}
        {!isCustom && (
          <>
            <div className="mb-4">
              <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ДАТА ПОСЛЕДНЕГО ТО</label>
              <input type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} className="w-full" />
            </div>
            <div className="mb-4">
              <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ПРОБЕГ НА МОМЕНТ ТО (КМ)</label>
              <input type="number" inputMode="numeric" placeholder={car.mileage || '0'} value={lastMileage}
                onChange={(e) => setLastMileage(e.target.value)} className="w-full" />
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-subtle tracking-wide mb-3">ИНТЕРВАЛ</p>
              <div className="mb-4">
                <label className="text-xs text-muted block mb-1">Каждые (км)</label>
                <input type="number" inputMode="numeric" placeholder="—" value={intervalKm}
                  onChange={(e) => setIntervalKm(e.target.value)} className="w-full" />
              </div>
              <div className="mb-4">
                <label className="text-xs text-muted block mb-1">Каждые (дней)</label>
                <input type="number" inputMode="numeric" placeholder="—" value={intervalDays}
                  onChange={(e) => setIntervalDays(e.target.value)} className="w-full" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Status logic ─────────────────────────────────────────────────
function getStatus(r, mileage) {
  const now = Date.now()
  let daysLeft = null, kmLeft = null, status = 'ok'

  // Custom reminders with push date
  if (r.type === 'custom' && r.pushDate) {
    daysLeft = Math.ceil((new Date(r.pushDate).getTime() - now) / 86400000)
    if (daysLeft <= 0) status = 'overdue'
    else if (daysLeft <= 3) status = 'soon'
    return { status, daysLeft, kmLeft }
  }

  const last = new Date(r.lastDate).getTime()
  if (r.intervalDays) {
    daysLeft = Math.ceil((last + r.intervalDays * 86400000 - now) / 86400000)
    if (daysLeft <= 0) status = 'overdue'
    else if (daysLeft <= 30) status = 'soon'
  }
  if (r.intervalKm && r.lastMileage && mileage) {
    kmLeft = r.lastMileage + r.intervalKm - mileage
    if (kmLeft <= 0) status = 'overdue'
    else if (kmLeft <= 1000 && status !== 'overdue') status = 'soon'
  }
  return { status, daysLeft, kmLeft }
}

const STATUS = {
  overdue: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'Просрочено' },
  soon: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'Скоро' },
  ok: { bg: 'bg-surface', border: 'border-border', text: 'text-subtle', badge: 'В норме' },
}

// ═══════════════════════════════════════════════════════════════════
export default function Reminders({ car, reminders, onAdd, onComplete, onDelete, notifSupported, notifPermission, requestNotifPermission, sendTestNotif }) {
  const [showAdd, setShowAdd] = useState(false)
  const mileage = car.mileage ? Number(car.mileage) : null

  // Check and fire pending push notifications on load
  useEffect(() => {
    reminders.forEach((r) => {
      if (r.pushDate && !r.pushSent) {
        const delay = new Date(r.pushDate).getTime() - Date.now()
        if (delay > 0 && delay < 86400000 * 7) { // within next 7 days
          schedulePush(`🔔 ${r.label}`, `${car.brand} ${car.model}: ${r.label}`, r.pushDate)
        }
      }
    })
  }, [reminders, car])

  const items = useMemo(() =>
    reminders.map((r) => ({ ...r, ...getStatus(r, mileage) })),
    [reminders, mileage]
  )

  const overdue = items.filter((r) => r.status === 'overdue')
  const soon = items.filter((r) => r.status === 'soon')
  const ok = items.filter((r) => r.status === 'ok')

  const renderItem = (r) => {
    const s = STATUS[r.status]
    return (
      <div key={r.id} className={`${s.bg} border ${s.border} rounded-2xl p-4 mb-2`}>
        <div className="flex items-start gap-3">
          <span style={{ fontSize: '20px' }} className="mt-0.5 shrink-0">{r.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[14px] font-semibold text-dark truncate">{r.label}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.text} border ${s.border} shrink-0`}>{s.badge}</span>
            </div>
            <div className="flex flex-wrap gap-x-3">
              {r.daysLeft !== null && (
                <p className={`text-xs ${r.daysLeft <= 0 ? 'text-red-500 font-semibold' : r.daysLeft <= 30 ? 'text-amber-600' : 'text-subtle'}`}>
                  {r.daysLeft <= 0 ? `Просрочено ${Math.abs(r.daysLeft)} дн.` : `Через ${r.daysLeft} дн.`}
                </p>
              )}
              {r.kmLeft !== null && (
                <p className={`text-xs ${r.kmLeft <= 0 ? 'text-red-500 font-semibold' : r.kmLeft <= 1000 ? 'text-amber-600' : 'text-subtle'}`}>
                  {r.kmLeft <= 0 ? `+${fmt(Math.abs(r.kmLeft))} км` : `Через ${fmt(r.kmLeft)} км`}
                </p>
              )}
            </div>
            {r.pushDate && (
              <p className="text-xs text-gold-dark mt-1 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3.5 5.5a2.5 2.5 0 015 0c0 2.5 1.2 3.5 1.2 3.5H2.3s1.2-1 1.2-3.5z" /><path d="M5 10a1.2 1.2 0 002 0" /></svg>
                Push: {new Date(r.pushDate).toLocaleDateString('ru-RU')} в {new Date(r.pushDate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            {!r.pushDate && r.lastDate && (
              <p className="text-xs text-muted mt-1">
                Последнее: {new Date(r.lastDate).toLocaleDateString('ru-RU')}
                {r.lastMileage ? ` · ${fmt(r.lastMileage)} км` : ''}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 shrink-0 mt-0.5">
            <button onClick={() => { if (window.confirm(`Отметить «${r.label}» выполненным?`)) onComplete(r.id) }}
              className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-subtle">
              <IconCheck />
            </button>
            <button onClick={() => { if (window.confirm(`Удалить «${r.label}»?`)) onDelete(r.id) }}
              className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center text-red-400">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M3 3l8 8M11 3l-8 8" /></svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white pb-4">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0">
        <div>
          <p className="text-xs font-medium text-muted tracking-wider">СЕРВИС</p>
          <h1 className="text-[22px] font-semibold text-dark tracking-tight mt-1">Напоминания</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="w-9 h-9 bg-dark rounded-xl flex items-center justify-center text-gold">
          <IconPlus />
        </button>
      </div>

      {/* Notification prompt */}
      {notifSupported && notifPermission !== 'granted' && reminders.length > 0 && (
        <div className="px-5 mb-3">
          <button onClick={async () => {
            const granted = await requestNotifPermission()
            if (granted) sendTestNotif()
          }} className="w-full flex items-center gap-3 p-3.5 bg-gold-50 border border-gold/30 rounded-2xl text-left">
            <div className="w-9 h-9 bg-gold/20 rounded-xl flex items-center justify-center shrink-0 text-gold-dark">
              <IconBell />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-dark">Включить уведомления</p>
              <p className="text-xs text-subtle mt-0.5">Чтобы push-напоминания работали</p>
            </div>
          </button>
        </div>
      )}

      {/* Summary */}
      {reminders.length > 0 && (
        <div className="px-5 mb-4 flex gap-2 shrink-0">
          {overdue.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
              <IconAlert /><span className="text-xs font-semibold text-red-600">{overdue.length} просрочено</span>
            </div>
          )}
          {soon.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <IconClock /><span className="text-xs font-semibold text-amber-700">{soon.length} скоро</span>
            </div>
          )}
          {overdue.length === 0 && soon.length === 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
              <IconCheck /><span className="text-xs font-semibold text-emerald-700">Всё в порядке</span>
            </div>
          )}
        </div>
      )}

      {/* Lists */}
      {reminders.length > 0 ? (
        <div className="px-5">
          {overdue.length > 0 && <><p className="text-xs font-medium text-red-500 tracking-wider mb-2">ТРЕБУЕТ ВНИМАНИЯ</p>{overdue.map(renderItem)}<div className="mb-3" /></>}
          {soon.length > 0 && <><p className="text-xs font-medium text-amber-600 tracking-wider mb-2">СКОРО</p>{soon.map(renderItem)}<div className="mb-3" /></>}
          {ok.length > 0 && <><p className="text-xs font-medium text-subtle tracking-wider mb-2">В НОРМЕ</p>{ok.map(renderItem)}</>}
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mx-5 w-[calc(100%-40px)] text-center py-16 rounded-2xl border-2 border-dashed border-border active:bg-surface transition-colors mb-5">
          <div className="w-14 h-14 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A45C" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </div>
          <p className="text-base font-semibold text-dark mb-1">Добавить напоминание</p>
          <p className="text-sm text-subtle">ТО, страховка или своё напоминание</p>
        </button>
      )}

      {showAdd && <AddReminder car={car} onAdd={onAdd} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
