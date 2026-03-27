'use client'
import { useState, useRef, useEffect } from 'react'
import { CAR_BRANDS, fmt, fmtCurrency } from '@/lib/constants'
import CarCard from './CarCard'

function IconEdit() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2l3 3-8.5 8.5H2.5v-3L11 2z" /></svg>
}
function IconExport() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l3-3 3 3M8 5v7M3 13h10" /></svg>
}
function IconTrash() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M3 4h10M5.5 4V3a1 1 0 011-1h3a1 1 0 011 1v1M6 7v4M8 7v4M10 7v4" /><path d="M4 4l.7 8.5a1.5 1.5 0 001.5 1.5h3.6a1.5 1.5 0 001.5-1.5L12 4" /></svg>
}

const fuelLabels = { petrol: 'Бензин', diesel: 'Дизель', hybrid: 'Гибрид', electric: 'Электро' }
const driveLabels = { rwd: 'RWD', fwd: 'FWD', awd: 'AWD', xdrive: 'xDrive', quattro: 'quattro', '4matic': '4MATIC' }

// ── Edit Modal ───────────────────────────────────────────────
function EditModal({ car, onSave, onClose }) {
  const [edited, setEdited] = useState({ ...car })

  const fuelTypes = [
    { id: 'petrol', label: 'Бензин' },
    { id: 'diesel', label: 'Дизель' },
    { id: 'hybrid', label: 'Гибрид' },
    { id: 'electric', label: 'Электро' },
  ]

  const driveTypes = [
    { id: 'rwd', label: 'RWD' },
    { id: 'fwd', label: 'FWD' },
    { id: 'awd', label: 'AWD' },
    { id: 'xdrive', label: 'xDrive' },
    { id: 'quattro', label: 'quattro' },
    { id: '4matic', label: '4MATIC' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-dark/40 fade-in" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10 slide-up max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dark">Редактировать</h3>
          <button onClick={onClose} className="text-subtle text-sm font-medium">Отмена</button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">МАРКА</label>
            <input type="text" value={edited.brand} onChange={(e) => setEdited({ ...edited, brand: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">МОДЕЛЬ</label>
            <input type="text" value={edited.model} onChange={(e) => setEdited({ ...edited, model: e.target.value })} className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">ГОД</label>
              <input type="number" value={edited.year} onChange={(e) => setEdited({ ...edited, year: e.target.value })} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">ПРОБЕГ (КМ)</label>
              <input type="number" value={edited.mileage} onChange={(e) => setEdited({ ...edited, mileage: e.target.value })} className="w-full" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">ДВИГАТЕЛЬ</label>
            <input type="text" value={edited.engine} onChange={(e) => setEdited({ ...edited, engine: e.target.value })} className="w-full" placeholder="Напр. 3.0 B58 Twin-Turbo" />
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-2">ТИП ТОПЛИВА</label>
            <div className="grid grid-cols-4 gap-2">
              {fuelTypes.map((ft) => (
                <button key={ft.id} onClick={() => setEdited({ ...edited, fuelType: ft.id })}
                  className={`py-2.5 rounded-xl text-xs font-medium transition-all text-center ${edited.fuelType === ft.id ? 'bg-gold-50 border border-gold text-dark' : 'bg-surface border border-border text-subtle'}`}>
                  {ft.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-2">ПРИВОД</label>
            <div className="grid grid-cols-3 gap-2">
              {driveTypes.map((dt) => (
                <button key={dt.id} onClick={() => setEdited({ ...edited, drivetrain: dt.id })}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all text-center ${edited.drivetrain === dt.id ? 'bg-gold-50 border border-gold text-dark' : 'bg-surface border border-border text-subtle'}`}>
                  {dt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">VIN</label>
            <input type="text" value={edited.vin} onChange={(e) => setEdited({ ...edited, vin: e.target.value.toUpperCase() })} className="w-full font-mono tracking-wider" maxLength={17} placeholder="Необязательно" />
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-2">ВАЛЮТА</label>
            <div className="grid grid-cols-5 gap-2">
              {[{ id: 'RUB', label: '₽' }, { id: 'USD', label: '$' }, { id: 'EUR', label: '€' }, { id: 'AED', label: 'AED' }, { id: 'VND', label: '₫' }].map((c) => (
                <button key={c.id} onClick={() => setEdited({ ...edited, currency: c.id })}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all text-center ${(edited.currency || 'RUB') === c.id ? 'bg-gold-50 border border-gold text-dark' : 'bg-surface border border-border text-subtle'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => { onSave(edited); onClose() }} className="w-full btn-primary mt-7">Сохранить</button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Main Profile Screen
// ═══════════════════════════════════════════════════════════════════
export default function CarProfile({ car, expenses, currency, onUpdateCar, onDeleteCar, user, onSignIn, onSignOut, syncing }) {
  const [showEdit, setShowEdit] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const photoRef = useRef(null)
  const [isDark, setIsDark] = useState(false)

  // Sync dark mode state on mount
  useState(() => {
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
    }
  })

  // Recover photo from separate storage if car.photo is missing
  useEffect(() => {
    if (!car.photo && car.id) {
      try {
        const saved = localStorage.getItem(`carnote_photo_${car.id}`)
        if (saved) onUpdateCar({ ...car, photo: saved })
      } catch {}
    }
  }, [car.id])

  // Compress photo to max 800px and save as JPEG
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 500
        let w = img.width, h = img.height
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX }
          else { w = Math.round(w * MAX / h); h = MAX }
        }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        const compressed = canvas.toDataURL('image/jpeg', 0.5)
        // Store photo separately to avoid localStorage overflow
        try {
          localStorage.setItem(`carnote_photo_${car.id}`, compressed)
        } catch (err) {
          console.error('Photo too large:', err)
        }
        onUpdateCar({ ...car, photo: compressed })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const fuelExpenses = expenses.filter((e) => e.category === 'fuel')
  const totalLiters = fuelExpenses.reduce((s, e) => s + (e.liters || 0), 0)
  const daysOwned = car.createdAt ? Math.max(1, Math.floor((Date.now() - new Date(car.createdAt).getTime()) / 86400000)) : 1

  const handleExport = async (format) => {
    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
    const catLabels = { fuel: 'Топливо', service: 'Сервис', wash: 'Мойка', parking: 'Парковка', insurance: 'Страховка', tires: 'Шины', fines: 'Штрафы', other: 'Другое' }

    if (format === 'csv') {
      const header = 'Дата;Категория;Описание;Сумма;Литры;Пробег;Заметка'
      const rows = sorted.map(e => {
        const d = new Date(e.date).toLocaleDateString('ru-RU')
        return `${d};${catLabels[e.category] || e.category};${e.description || ''};${e.amount};${e.liters || ''};${e.mileage || ''};${e.notes || ''}`
      })
      const csv = '\uFEFF' + [header, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `CarNote_${car.brand}_${car.model}.csv`; a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'json') {
      const data = { car, expenses: sorted, exportedAt: new Date().toISOString() }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `CarNote_${car.brand}_${car.model}.json`; a.click()
      URL.revokeObjectURL(url)
    }
    setShowExportMenu(false)
  }

  const [showExportMenu, setShowExportMenu] = useState(false)

  // Build specs array for the card
  const specs = [
    car.year && { label: car.year },
    car.engine && { label: car.engine },
    car.fuelType && { label: fuelLabels[car.fuelType] },
    car.drivetrain && { label: driveLabels[car.drivetrain] || car.drivetrain },
  ].filter(Boolean)

  return (
    <div className="bg-white fade-in pb-4">
      {/* Header */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-muted tracking-wider">ПРОФИЛЬ</p>
        <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 text-sm font-medium text-gold-dark">
          <IconEdit /> Изменить
        </button>
      </div>

      {/* ── Car Card with Circle Photo ──────────────────────────── */}
      <div className="px-5 mt-3 mb-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative px-6 pt-6 pb-5">
            {/* Top — Logo + photo button */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                </div>
                <span className="text-[9px] font-bold text-white/40 tracking-[0.2em]">CARNOTE</span>
              </div>
              <button onClick={() => photoRef.current?.click()} className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round">
                  <rect x="1.5" y="3" width="11" height="8.5" rx="1.5" /><path d="M5 3l.8-1.5h2.4L9 3" /><circle cx="7" cy="7.5" r="2" />
                </svg>
              </button>
            </div>

            {/* Circle photo + name */}
            <div className="flex flex-col items-center">
              {car.photo ? (
                <button onClick={() => photoRef.current?.click()} className="relative mb-4 group">
                  <div className="w-28 h-28 rounded-full overflow-hidden ring-[3px] ring-gold/40 ring-offset-2 ring-offset-[#1a1a2e]">
                    <img src={car.photo} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/0 group-active:bg-black/30 transition-colors flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round" className="opacity-0 group-active:opacity-100 transition-opacity">
                      <rect x="2" y="5" width="16" height="11" rx="2" /><path d="M7 5l1.2-2.5h3.6L13 5" /><circle cx="10" cy="11" r="3" />
                    </svg>
                  </div>
                </button>
              ) : (
                <button onClick={() => photoRef.current?.click()}
                  className="w-28 h-28 rounded-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1.5 mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A45C" strokeWidth="1.3" strokeLinecap="round">
                    <rect x="2" y="5" width="20" height="15" rx="3" /><path d="M8 5l1.5-3h5L16 5" /><circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="text-[9px] text-white/30 font-medium">Фото</span>
                </button>
              )}

              <h1 className="text-[28px] font-black text-white tracking-tight leading-none text-center">{car.brand}</h1>
              <h2 className="text-[20px] font-light text-gold tracking-tight mt-1 text-center">{car.model}</h2>

              {specs.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                  {specs.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/8 border border-white/10 rounded-full text-[10px] font-semibold text-white/75 tracking-wide">
                      {s.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="border-t border-white/10 mt-5 pt-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-white/30 font-medium tracking-wider">РАСХОДЫ</p>
                  <p className="text-base font-bold text-white mt-1">{fmtCurrency(totalExpenses, currency)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-medium tracking-wider">ВЛАДЕНИЕ</p>
                  <p className="text-base font-bold text-white mt-1">{daysOwned} дн</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-medium tracking-wider">ЗАПИСЕЙ</p>
                  <p className="text-base font-bold text-white mt-1">{expenses.length}</p>
                </div>
              </div>
            </div>

            {car.vin && (
              <div className="mt-3 bg-white/5 rounded-xl px-3 py-2">
                <p className="text-[10px] text-white/30 font-medium">VIN</p>
                <p className="text-[11px] font-mono text-white/60 tracking-widest mt-0.5">{car.vin}</p>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Hidden photo input */}
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

      {/* Actions */}
      <div className="px-5 space-y-1">
        <button onClick={() => setShowCard(true)} className="w-full flex items-center gap-4 py-3.5 text-left">
          <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center border border-gold/30">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C8A45C" strokeWidth="1.4" strokeLinecap="round"><rect x="2" y="2" width="14" height="14" rx="3" /><path d="M6 9h6M9 6v6" /></svg>
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-dark">Карточка авто</p>
            <p className="text-xs text-muted mt-0.5">Поделиться в соцсетях</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C8A45C" strokeWidth="1.4" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
        </button>

        <div className="relative">
          <button onClick={() => setShowExportMenu(!showExportMenu)} className="w-full flex items-center gap-4 py-3.5 text-left">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border"><IconExport /></div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-dark">Экспорт данных</p>
              <p className="text-xs text-muted mt-0.5">CSV или JSON</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className={`text-muted transition-transform ${showExportMenu ? 'rotate-180' : ''}`}><path d="M4 6l4 4 4-4" /></svg>
          </button>
          {showExportMenu && (
            <div className="ml-14 mb-2 flex gap-2 fade-in">
              <button onClick={() => handleExport('csv')}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-700">
                📊 CSV (Excel)
              </button>
              <button onClick={() => handleExport('json')}
                className="px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-semibold text-dark">
                { } JSON
              </button>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-4 py-3.5">
          <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 1.5a7.5 7.5 0 000 15 6 6 0 010-15z" /><circle cx="9" cy="9" r="7.5" /></svg>
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-dark">Тёмная тема</p>
          </div>
          <button onClick={() => {
            const html = document.documentElement
            if (isDark) {
              html.removeAttribute('data-theme')
              localStorage.setItem('automind_theme', 'light')
              setIsDark(false)
            } else {
              html.setAttribute('data-theme', 'dark')
              localStorage.setItem('automind_theme', 'dark')
              setIsDark(true)
            }
          }}
            className={`w-11 h-6 rounded-full transition-all relative ${isDark ? 'bg-gold' : 'bg-border'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${isDark ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Account */}
        <div className="border-t border-border pt-2">
          {user ? (
            <div className="flex items-center gap-4 py-3.5">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round"><circle cx="9" cy="6" r="3" /><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-dark">{user.email}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{syncing ? '↻ Синхронизация...' : '✓ Данные в облаке'}</p>
              </div>
              <button onClick={onSignOut} className="text-sm text-subtle font-medium px-3 py-1.5 rounded-lg border border-border">Выйти</button>
            </div>
          ) : (
            <button onClick={onSignIn} className="w-full flex items-center gap-4 py-3.5 text-left">
              <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C8A45C" strokeWidth="1.4" strokeLinecap="round"><circle cx="9" cy="6" r="3" /><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-dark">Войти / Регистрация</p>
                <p className="text-xs text-subtle mt-0.5">Сохранить данные в облаке</p>
              </div>
            </button>
          )}
        </div>

        <button onClick={onDeleteCar} className="w-full flex items-center gap-4 py-3.5 text-left border-t border-border">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-400"><IconTrash /></div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-red-500">Удалить автомобиль</p>
            <p className="text-xs text-red-300 mt-0.5">Авто, расходы, напоминания</p>
          </div>
        </button>
      </div>

      {showEdit && <EditModal car={car} onSave={onUpdateCar} onClose={() => setShowEdit(false)} />}
      {showCard && <CarCard car={car} expenses={expenses} currency={currency} onClose={() => setShowCard(false)} onUpdateCarPhoto={(photo) => onUpdateCar({ ...car, photo })} />}
    </div>
  )
}
