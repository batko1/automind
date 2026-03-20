'use client'
import { useState } from 'react'
import { CAR_BRANDS, fmt } from '@/lib/constants'

// ── Icons ────────────────────────────────────────────────────────
function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4l-6 6 6 6" />
    </svg>
  )
}
function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2l3 3-8.5 8.5H2.5v-3L11 2z" />
    </svg>
  )
}
function IconCar() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17h14M6 17l1-5h10l1 5M8 12l1-4h6l1 4" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  )
}
function IconEngine() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="12" height="8" rx="2" />
      <path d="M7 6V4M13 6V4M4 10H2M18 10h-2" />
    </svg>
  )
}
function IconRoad() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18l2-14h8l2 14M10 5v2M10 10v2M10 15v2" />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="13" rx="2" />
      <path d="M7 2v3M13 2v3M3 9h14" />
    </svg>
  )
}
function IconFuel() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="8" height="12" rx="1.5" />
      <path d="M12 8l2.5-2.5M14.5 5.5v5a2 2 0 004 0V8" />
    </svg>
  )
}
function IconVin() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="16" height="8" rx="1.5" />
      <path d="M5 9h2M9 9h2M13 9h2M6 11h8" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h10M5.5 4V3a1 1 0 011-1h3a1 1 0 011 1v1M6 7v4M8 7v4M10 7v4" />
      <path d="M4 4l.7 8.5a1.5 1.5 0 001.5 1.5h3.6a1.5 1.5 0 001.5-1.5L12 4" />
    </svg>
  )
}
function IconExport() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v8M4 6l4-4 4 4M3 12h10" />
    </svg>
  )
}

const fuelLabels = {
  petrol: 'Бензин',
  diesel: 'Дизель',
  hybrid: 'Гибрид',
  electric: 'Электро',
}

// ═══════════════════════════════════════════════════════════════════
// Edit Modal
// ═══════════════════════════════════════════════════════════════════
function EditModal({ car, onSave, onClose }) {
  const [edited, setEdited] = useState({ ...car })

  const fuelTypes = [
    { id: 'petrol', label: 'Бензин' },
    { id: 'diesel', label: 'Дизель' },
    { id: 'hybrid', label: 'Гибрид' },
    { id: 'electric', label: 'Электро' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-dark/40 fade-in" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10 slide-up max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dark">Редактировать</h3>
          <button onClick={onClose} className="text-subtle text-sm font-medium">
            Отмена
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">МАРКА</label>
            <input
              type="text"
              value={edited.brand}
              onChange={(e) => setEdited({ ...edited, brand: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">МОДЕЛЬ</label>
            <input
              type="text"
              value={edited.model}
              onChange={(e) => setEdited({ ...edited, model: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">ГОД</label>
              <input
                type="number"
                value={edited.year}
                onChange={(e) => setEdited({ ...edited, year: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">ПРОБЕГ (КМ)</label>
              <input
                type="number"
                value={edited.mileage}
                onChange={(e) => setEdited({ ...edited, mileage: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">ДВИГАТЕЛЬ</label>
            <input
              type="text"
              value={edited.engine}
              onChange={(e) => setEdited({ ...edited, engine: e.target.value })}
              className="w-full"
              placeholder="Напр. 3.0 B58 Twin-Turbo"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-2">ТИП ТОПЛИВА</label>
            <div className="grid grid-cols-4 gap-2">
              {fuelTypes.map((ft) => (
                <button
                  key={ft.id}
                  onClick={() => setEdited({ ...edited, fuelType: ft.id })}
                  className={`
                    py-2.5 rounded-xl text-xs font-medium transition-all text-center
                    ${edited.fuelType === ft.id
                      ? 'bg-gold-50 border border-gold text-dark'
                      : 'bg-surface border border-border text-subtle'
                    }
                  `}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-1.5">VIN</label>
            <input
              type="text"
              value={edited.vin}
              onChange={(e) => setEdited({ ...edited, vin: e.target.value.toUpperCase() })}
              className="w-full font-mono tracking-wider"
              maxLength={17}
              placeholder="Необязательно"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-subtle tracking-wide block mb-2">ВАЛЮТА</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'RUB', label: '₽' },
                { id: 'USD', label: '$' },
                { id: 'EUR', label: '€' },
                { id: 'AED', label: 'AED' },
                { id: 'VND', label: '₫' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setEdited({ ...edited, currency: c.id })}
                  className={`
                    py-2.5 rounded-xl text-sm font-semibold transition-all text-center
                    ${(edited.currency || 'RUB') === c.id
                      ? 'bg-gold-50 border border-gold text-dark'
                      : 'bg-surface border border-border text-subtle'
                    }
                  `}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => { onSave(edited); onClose() }}
          className="w-full btn-primary mt-7"
        >
          Сохранить
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Main Profile Screen
// ═══════════════════════════════════════════════════════════════════
export default function CarProfile({ car, expenses, currency, onUpdateCar, onDeleteCar }) {
  const [showEdit, setShowEdit] = useState(false)

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const fuelExpenses = expenses.filter((e) => e.category === 'fuel')
  const totalLiters = fuelExpenses.reduce((s, e) => s + (e.liters || 0), 0)

  const daysOwned = car.createdAt
    ? Math.max(1, Math.floor((Date.now() - new Date(car.createdAt).getTime()) / 86400000))
    : 1
  const avgPerDay = totalExpenses / daysOwned

  const handleExport = () => {
    const data = {
      car,
      expenses,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `automind_${car.brand}_${car.model}_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white fade-in">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-muted tracking-wider">ПРОФИЛЬ</p>
        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-gold-dark"
        >
          <IconEdit /> Изменить
        </button>
      </div>

      {/* Car card */}
      <div className="px-6 mt-4 mb-6">
        <div className="bg-dark rounded-3xl p-6 text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <IconCar />
            </div>
            <div>
              <p className="text-[11px] font-medium text-white/50 tracking-wider">АВТОМОБИЛЬ</p>
              <p className="text-xl font-semibold tracking-tight">
                {car.brand} {car.model}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[11px] text-white/40 font-medium">ГОД</p>
              <p className="text-[15px] font-semibold mt-0.5">{car.year || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-white/40 font-medium">ПРОБЕГ</p>
              <p className="text-[15px] font-semibold mt-0.5">{car.mileage ? `${fmt(car.mileage)}` : '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-white/40 font-medium">ТОПЛИВО</p>
              <p className="text-[15px] font-semibold mt-0.5">{fuelLabels[car.fuelType] || '—'}</p>
            </div>
          </div>

          {(car.engine || car.vin) && (
            <div className="border-t border-white/10 mt-4 pt-4 grid grid-cols-2 gap-3">
              {car.engine && (
                <div>
                  <p className="text-[11px] text-white/40 font-medium">ДВИГАТЕЛЬ</p>
                  <p className="text-[14px] font-medium mt-0.5">{car.engine}</p>
                </div>
              )}
              {car.vin && (
                <div>
                  <p className="text-[11px] text-white/40 font-medium">VIN</p>
                  <p className="text-[12px] font-mono font-medium mt-0.5 tracking-wider">{car.vin}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats summary */}
      <div className="px-6 mb-6">
        <p className="text-xs font-medium text-muted tracking-wider mb-3">СТАТИСТИКА ВЛАДЕНИЯ</p>
        <div className="space-y-0.5">
          <div className="flex items-center gap-4 py-3.5 border-b border-border/60">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-subtle">
              <IconCalendar />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-dark">Дней в учёте</p>
              <p className="text-xs text-muted mt-0.5">С момента добавления</p>
            </div>
            <p className="text-[15px] font-semibold text-dark">{daysOwned}</p>
          </div>

          <div className="flex items-center gap-4 py-3.5 border-b border-border/60">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-subtle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M3 15V5l5 4 4-7 5 8v5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-dark">Всего расходов</p>
              <p className="text-xs text-muted mt-0.5">{expenses.length} записей</p>
            </div>
            <p className="text-[15px] font-semibold text-dark">
              {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(totalExpenses)}
            </p>
          </div>

          <div className="flex items-center gap-4 py-3.5 border-b border-border/60">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-subtle">
              <IconRoad />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-dark">Средние расходы</p>
              <p className="text-xs text-muted mt-0.5">В день</p>
            </div>
            <p className="text-[15px] font-semibold text-dark">
              {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(Math.round(avgPerDay))}
            </p>
          </div>

          {totalLiters > 0 && (
            <div className="flex items-center gap-4 py-3.5">
              <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-subtle">
                <IconFuel />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-dark">Топливо залито</p>
                <p className="text-xs text-muted mt-0.5">За всё время</p>
              </div>
              <p className="text-[15px] font-semibold text-dark">{fmt(totalLiters)} л</p>
            </div>
          )}
        </div>
      </div>

      {/* Currency */}
      <div className="px-6 mb-6">
        <p className="text-xs font-medium text-muted tracking-wider mb-3">ВАЛЮТА</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { code: 'RUB', label: '₽ Рубль' },
            { code: 'USD', label: '$ Доллар' },
            { code: 'EUR', label: '€ Евро' },
            { code: 'AED', label: 'د.إ Дирхам' },
          ].map((c) => (
            <button key={c.code}
              onClick={() => onUpdateSettings({ ...settings, currency: c.code })}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currency === c.code ? 'bg-gold-50 border border-gold text-dark' : 'bg-surface border border-border text-subtle'
              }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6">
        <p className="text-xs font-medium text-muted tracking-wider mb-3">ДЕЙСТВИЯ</p>

        <button
          onClick={handleExport}
          className="w-full flex items-center gap-4 py-3.5 border-b border-border/60 text-left"
        >
          <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-subtle">
            <IconExport />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-dark">Экспорт данных</p>
            <p className="text-xs text-muted mt-0.5">Скачать JSON с расходами</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b0b0be" strokeWidth="1.4" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>

        <button
          onClick={onDeleteCar}
          className="w-full flex items-center gap-4 py-3.5 text-left"
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-400">
            <IconTrash />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-red-500">Удалить автомобиль</p>
            <p className="text-xs text-red-300 mt-0.5">Авто, расходы, напоминания</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <EditModal
          car={car}
          onSave={onUpdateCar}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}
