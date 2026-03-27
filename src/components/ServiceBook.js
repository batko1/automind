'use client'
import { useState, useMemo } from 'react'
import { fmt, fmtCurrency, generateId } from '@/lib/constants'
import { getEngineTemplate, TO_CHECKLIST } from '@/lib/service-data'

function IconPlus() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 3v12M3 9h12" /></svg>
}
function IconCheck() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 5" /></svg>
}

const TABS = [
  { id: 'history', label: 'История' },
  { id: 'checklist', label: 'Чеклист' },
  { id: 'specs', label: 'Спецификации' },
  { id: 'reminders', label: 'Напоминания' },
]

// ── Add Service Record ───────────────────────────────────────────
function AddServiceRecord({ car, onAdd, onClose }) {
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [mileage, setMileage] = useState(car.mileage || '')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')

  const serviceTypes = [
    { id: 'oil_change', label: 'Замена масла', icon: '🛢️' },
    { id: 'filters', label: 'Замена фильтров', icon: '🌀' },
    { id: 'brakes', label: 'Тормоза', icon: '🔴' },
    { id: 'tires', label: 'Шины / шиномонтаж', icon: '🛞' },
    { id: 'spark_plugs', label: 'Свечи зажигания', icon: '⚡' },
    { id: 'coolant', label: 'Антифриз', icon: '❄️' },
    { id: 'transmission', label: 'Масло АКПП / МКПП', icon: '⚙️' },
    { id: 'suspension', label: 'Подвеска', icon: '🔩' },
    { id: 'electrical', label: 'Электрика', icon: '🔌' },
    { id: 'body', label: 'Кузов / покраска', icon: '🎨' },
    { id: 'diagnostics', label: 'Диагностика', icon: '📋' },
    { id: 'other', label: 'Другое', icon: '🔧' },
  ]

  if (!type) {
    return (
      <div className="fixed inset-0 z-[60] bg-white fade-in flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border shrink-0">
          <button onClick={onClose} className="text-subtle text-[15px] font-medium py-1">Отмена</button>
          <span className="text-[15px] font-semibold text-dark">Тип работы</span>
          <div className="w-16" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
          {serviceTypes.map((t) => (
            <button key={t.id} onClick={() => { setType(t.id); setDescription(t.label) }}
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

  const selectedType = serviceTypes.find((t) => t.id === type)
  return (
    <div className="fixed inset-0 z-[60] bg-white fade-in flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border shrink-0">
        <button onClick={() => setType('')} className="text-subtle text-[15px] font-medium py-1">Назад</button>
        <span className="text-[15px] font-semibold text-dark">{selectedType?.icon} {selectedType?.label}</span>
        <button onClick={() => {
          onAdd({
            id: generateId(), type, description: description || selectedType?.label,
            icon: selectedType?.icon || '🔧', date: new Date(date).toISOString(),
            mileage: mileage ? Number(mileage) : null, cost: cost ? Number(cost) : null, notes,
          })
          onClose()
        }} className="text-[15px] font-semibold text-gold-dark py-1">Сохранить</button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8 space-y-4">
        <div>
          <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ОПИСАНИЕ</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder={selectedType?.label} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ДАТА</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ПРОБЕГ (КМ)</label>
            <input type="number" inputMode="numeric" value={mileage}
              onChange={(e) => setMileage(e.target.value)} placeholder={car.mileage || '0'} className="w-full" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-subtle tracking-wide block mb-1">СТОИМОСТЬ (НЕОБЯЗАТЕЛЬНО)</label>
          <input type="number" inputMode="numeric" value={cost}
            onChange={(e) => setCost(e.target.value)} placeholder="0" className="w-full" />
        </div>
        <div>
          <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ЗАМЕТКИ</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Детали, запчасти, место обслуживания..."
            className="w-full min-h-[80px] resize-none" rows={3} />
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
export default function ServiceBook({ car, onUpdateCar, serviceRecords, reminders, onRequireAuth, onAddRecord, onDeleteRecord, onAddReminder, onCompleteReminder, onDeleteReminder, notifSupported, notifPermission, requestNotifPermission, sendTestNotif }) {
  const [activeTab, setActiveTab] = useState('history')
  const [showAdd, setShowAdd] = useState(false)

  const engineTemplate = useMemo(() => getEngineTemplate(car.engine, car.fuelType), [car.engine, car.fuelType])
  const isDiesel = car.fuelType === 'diesel'
  const currency = car.currency || 'RUB'

  // ── History tab ────────────────────────────────────────────────
  const renderHistory = () => {
    const sorted = [...serviceRecords].sort((a, b) => new Date(b.date) - new Date(a.date))

    if (sorted.length === 0) {
      return (
        <button onClick={() => { if (onRequireAuth && !onRequireAuth()) return; setShowAdd(true) }} className="mx-5 w-[calc(100%-40px)] text-center py-14 rounded-2xl border-2 border-dashed border-border active:bg-surface transition-colors">
          <div className="w-14 h-14 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A45C" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </div>
          <p className="text-base font-semibold text-dark mb-1">Добавить запись</p>
          <p className="text-sm text-subtle">Замена масла, фильтры, ремонт...</p>
        </button>
      )
    }

    return (
      <div className="px-5">
        {sorted.map((rec) => (
          <div key={rec.id} className="flex items-start gap-3 py-3.5 border-b border-border/50 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5" style={{ fontSize: '18px' }}>
              {rec.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-dark">{rec.description}</p>
              <p className="text-xs text-muted mt-0.5">
                {new Date(rec.date).toLocaleDateString('ru-RU')}
                {rec.mileage ? ` · ${fmt(rec.mileage)} км` : ''}
                {rec.cost ? ` · ${fmtCurrency(rec.cost, currency)}` : ''}
              </p>
              {rec.notes && <p className="text-xs text-subtle mt-1 leading-relaxed">{rec.notes}</p>}
            </div>
            <button onClick={() => { if (window.confirm('Удалить запись?')) onDeleteRecord(rec.id) }}
              className="p-1.5 text-muted mt-0.5 shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M3 3l8 8M11 3l-8 8" /></svg>
            </button>
          </div>
        ))}
      </div>
    )
  }

  // ── Checklist tab ──────────────────────────────────────────────
  const renderChecklist = () => {
    const regularItems = TO_CHECKLIST.regular.items.filter((i) => {
      if (i.diesel && !isDiesel) return false
      if (i.petrol && isDiesel) return false
      return true
    })
    const majorItems = TO_CHECKLIST.major.items.filter((i) => {
      if (i.diesel && !isDiesel) return false
      if (i.petrol && isDiesel) return false
      return true
    })

    const renderSection = (title, interval, items) => (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted tracking-wider">{title.toUpperCase()}</p>
          <span className="text-xs text-gold-dark font-medium">{interval}</span>
        </div>
        <div className="space-y-1.5">
          {items.map((item) => {
            const lastRecord = serviceRecords
              .filter((r) => r.type === item.id || r.description.toLowerCase().includes(item.label.toLowerCase().split(' ')[1] || item.label.toLowerCase()))
              .sort((a, b) => new Date(b.date) - new Date(a.date))[0]

            return (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-dark">{item.label}</p>
                  {lastRecord ? (
                    <p className="text-[11px] text-subtle mt-0.5">
                      Последнее: {new Date(lastRecord.date).toLocaleDateString('ru-RU')}
                      {lastRecord.mileage ? ` · ${fmt(lastRecord.mileage)} км` : ''}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted mt-0.5">Нет записей</p>
                  )}
                </div>
                {lastRecord ? (
                  <div className="w-6 h-6 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6.5l3 3L10 3" /></svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-surface border border-border rounded-full" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )

    return (
      <div className="px-5">
        {renderSection(TO_CHECKLIST.regular.title, TO_CHECKLIST.regular.interval, regularItems)}
        {renderSection(TO_CHECKLIST.major.title, TO_CHECKLIST.major.interval, majorItems)}
      </div>
    )
  }

  // ── Specs tab (editable) ─────────────────────────────────────────
  const renderSpecs = () => {
    const t = engineTemplate
    const ci = car.customIntervals || {}

    const getVal = (key, defaultVal) => ci[key] !== undefined ? ci[key] : defaultVal
    const setVal = (key, value) => {
      onUpdateCar({ ...car, customIntervals: { ...ci, [key]: value } })
    }

    const EditableField = ({ label, unit, valueKey, defaultValue }) => {
      const [editing, setEditing] = useState(false)
      const [tempVal, setTempVal] = useState(String(getVal(valueKey, defaultValue)))
      const currentVal = getVal(valueKey, defaultValue)

      if (editing) {
        return (
          <div>
            <p className="text-[11px] text-muted font-medium">{label}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <input type="number" inputMode="numeric" value={tempVal}
                onChange={(e) => setTempVal(e.target.value)}
                className="!py-1.5 !px-2 !text-base !font-semibold w-20 !rounded-lg"
                autoFocus />
              <span className="text-xs text-muted">{unit}</span>
              <button onClick={() => { setVal(valueKey, Number(tempVal) || defaultValue); setEditing(false) }}
                className="ml-1 px-2 py-1 bg-gold text-white text-xs font-medium rounded-lg">OK</button>
              <button onClick={() => { setTempVal(String(currentVal)); setEditing(false) }}
                className="px-2 py-1 text-xs text-muted">✕</button>
            </div>
          </div>
        )
      }

      return (
        <button onClick={() => setEditing(true)} className="text-left w-full group">
          <p className="text-[11px] text-muted font-medium">{label}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <p className="text-lg font-semibold text-dark">{typeof currentVal === 'number' ? fmt(currentVal) : currentVal} {unit}</p>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#C8A45C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
              className="opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
              <path d="M8 1.5l2.5 2.5-6 6H2v-2.5l6-6z" />
            </svg>
          </div>
          {ci[valueKey] !== undefined && ci[valueKey] !== defaultValue && (
            <p className="text-[10px] text-gold-dark mt-0.5">Изменено (стандарт: {fmt(defaultValue)})</p>
          )}
        </button>
      )
    }

    return (
      <div className="px-5">
        <p className="text-xs text-subtle mb-4">Нажмите на значение, чтобы изменить интервал</p>

        {/* Engine card */}
        <div className="bg-dark rounded-2xl p-5 text-white mb-5">
          <p className="text-[11px] font-medium text-white/50 tracking-wider mb-1">ДВИГАТЕЛЬ</p>
          <p className="text-lg font-semibold">{t.name}</p>
          {car.engine && <p className="text-sm text-white/50 mt-0.5">{car.engine}</p>}
        </div>

        {/* Oil */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted tracking-wider mb-2.5">МОТОРНОЕ МАСЛО</p>
          <div className="bg-surface rounded-2xl border border-border p-4">
            <div className="grid grid-cols-2 gap-4">
              <EditableField label="ОБЪЁМ" unit="л" valueKey="oil_liters" defaultValue={t.oil.liters} />
              <EditableField label="ИНТЕРВАЛ" unit="км" valueKey="oil_interval" defaultValue={t.oil.interval_km} />
            </div>
            <div className="border-t border-border mt-3 pt-3">
              <p className="text-[11px] text-muted font-medium">СПЕЦИФИКАЦИЯ</p>
              <p className="text-sm font-medium text-dark mt-1">{t.oil.type}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted tracking-wider mb-2.5">ФИЛЬТРЫ</p>
          <div className="space-y-1.5">
            {t.filters.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                <span style={{ fontSize: '16px' }}>🔧</span>
                <span className="text-[13px] font-medium text-dark">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spark plugs */}
        {t.spark_plugs && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted tracking-wider mb-2.5">СВЕЧИ ЗАЖИГАНИЯ</p>
            <div className="bg-surface rounded-2xl border border-border p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-muted font-medium">КОЛИЧЕСТВО</p>
                  <p className="text-lg font-semibold text-dark mt-0.5">{t.spark_plugs.count} шт</p>
                </div>
                <EditableField label="ИНТЕРВАЛ" unit="км" valueKey="spark_interval" defaultValue={t.spark_plugs.interval_km} />
              </div>
            </div>
          </div>
        )}

        {/* Coolant & brake fluid */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted tracking-wider mb-2.5">ЖИДКОСТИ</p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-surface rounded-2xl border border-border p-3.5">
              <EditableField label="АНТИФРИЗ" unit="л" valueKey="coolant_liters" defaultValue={t.coolant.liters} />
              <div className="mt-2">
                <EditableField label="ИНТЕРВАЛ" unit="км" valueKey="coolant_interval" defaultValue={t.coolant.interval_km} />
              </div>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-3.5">
              <p className="text-[11px] text-muted font-medium">ТОРМОЗНАЯ</p>
              <p className="text-base font-semibold text-dark mt-0.5">DOT 4</p>
              <div className="mt-2">
                <EditableField label="ИНТЕРВАЛ" unit="км" valueKey="brake_fluid_interval" defaultValue={t.brake_fluid.interval_km} />
              </div>
            </div>
          </div>
        </div>

        {/* Transmission */}
        {t.transmission && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted tracking-wider mb-2.5">ТРАНСМИССИЯ</p>
            <div className="bg-surface rounded-2xl border border-border p-4">
              <p className="text-[11px] text-muted font-medium">ТИП</p>
              <p className="text-sm font-semibold text-dark mt-1">{t.transmission.type}</p>
              <div className="mt-3">
                <EditableField label="ИНТЕРВАЛ ЗАМЕНЫ" unit="км" valueKey="transmission_interval" defaultValue={t.transmission.interval_km} />
              </div>
            </div>
          </div>
        )}

        {/* Reset button */}
        {Object.keys(ci).length > 0 && (
          <button onClick={() => { if (window.confirm('Сбросить все интервалы к стандартным?')) onUpdateCar({ ...car, customIntervals: {} }) }}
            className="w-full text-center text-sm text-muted py-3 mt-2">
            Сбросить к стандартным значениям
          </button>
        )}
      </div>
    )
  }

  // ── Reminders tab (existing logic) ─────────────────────────────
  const renderReminders = () => {
    const mileage = car.mileage ? Number(car.mileage) : null

    const getStatus = (r) => {
      const now = Date.now()
      let daysLeft = null, kmLeft = null, status = 'ok'
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

    const STATUS_STYLE = {
      overdue: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'Просрочено' },
      soon: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'Скоро' },
      ok: { bg: 'bg-surface', border: 'border-border', text: 'text-subtle', badge: 'В норме' },
    }

    const items = reminders.map((r) => ({ ...r, ...getStatus(r) }))

    if (items.length === 0) {
      return (
        <div className="px-5 text-center py-10">
          <p className="text-sm text-subtle">Нет напоминаний. Добавьте через «+»</p>
        </div>
      )
    }

    return (
      <div className="px-5">
        {/* Notification prompt */}
        {notifSupported && notifPermission !== 'granted' && (
          <button onClick={async () => { const ok = await requestNotifPermission(); if (ok) sendTestNotif() }}
            className="w-full flex items-center gap-3 p-3.5 bg-gold-50 border border-gold/30 rounded-2xl text-left mb-4">
            <span style={{ fontSize: '18px' }}>🔔</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-dark">Включить push-уведомления</p>
              <p className="text-xs text-subtle mt-0.5">Напомним о ТО вовремя</p>
            </div>
          </button>
        )}

        {items.map((r) => {
          const s = STATUS_STYLE[r.status]
          return (
            <div key={r.id} className={`${s.bg} border ${s.border} rounded-2xl p-3.5 mb-2`}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '18px' }}>{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-dark truncate">{r.label}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.text} border ${s.border} shrink-0`}>{s.badge}</span>
                  </div>
                  <p className="text-xs text-subtle mt-0.5">
                    {r.daysLeft != null && (r.daysLeft <= 0 ? `Просрочено ${Math.abs(r.daysLeft)} дн.` : `Через ${r.daysLeft} дн.`)}
                    {r.kmLeft != null && ` · ${r.kmLeft <= 0 ? `+${fmt(Math.abs(r.kmLeft))}` : fmt(r.kmLeft)} км`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { if (window.confirm('Выполнено?')) onCompleteReminder(r.id) }}
                    className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-subtle">
                    <IconCheck />
                  </button>
                  <button onClick={() => { if (window.confirm('Удалить?')) onDeleteReminder(r.id) }}
                    className="w-8 h-8 rounded-lg border border-red-200 bg-red-50 flex items-center justify-center text-red-400">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M2 2l8 8M10 2l-8 8" /></svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-white pb-4">
      {/* Header */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted tracking-wider">СЕРВИС</p>
          <h1 className="text-[22px] font-semibold text-dark tracking-tight mt-1">Сервисная книжка</h1>
        </div>
        <button onClick={() => { if (onRequireAuth && !onRequireAuth()) return; setShowAdd(true) }} className="w-9 h-9 bg-dark rounded-xl flex items-center justify-center text-gold">
          <IconPlus />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex bg-surface rounded-xl border border-border p-0.5">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === t.id ? 'bg-white text-dark shadow-sm' : 'text-muted'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'checklist' && renderChecklist()}
      {activeTab === 'specs' && renderSpecs()}
      {activeTab === 'reminders' && renderReminders()}

      {showAdd && <AddServiceRecord car={car} onAdd={onAddRecord} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
