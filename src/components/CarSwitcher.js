'use client'
import { useState } from 'react'
import { CAR_BRANDS, defaultCar, generateId, fmt } from '@/lib/constants'

function IconClose() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
}
function IconPlus() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 3v12M3 9h12" /></svg>
}
function IconCheck() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C8A45C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 5" /></svg>
}

function QuickAddCar({ onAdd, onBack }) {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')

  const selectedBrand = CAR_BRANDS.find((b) => b.name === brand)

  return (
    <div className="px-5 pt-4 pb-8">
      <button onClick={onBack} className="text-subtle text-sm mb-4">← Назад</button>
      <h3 className="text-lg font-semibold text-dark mb-5">Новый автомобиль</h3>

      {/* Brand quick select */}
      <div className="flex flex-wrap gap-2 mb-3">
        {CAR_BRANDS.slice(0, 6).map((b) => (
          <button key={b.name} onClick={() => setBrand(b.name)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${brand === b.name ? 'bg-gold-50 border border-gold text-dark' : 'bg-surface border border-border text-subtle'}`}>
            {b.logo} {b.name}
          </button>
        ))}
      </div>
      <input type="text" placeholder="Марка" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full mb-3" />

      {selectedBrand && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedBrand.models.slice(0, 6).map((m) => (
            <button key={m} onClick={() => setModel(m)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${model === m ? 'bg-gold-50 border border-gold text-dark' : 'bg-surface border border-border text-subtle'}`}>
              {m}
            </button>
          ))}
        </div>
      )}
      <input type="text" placeholder="Модель" value={model} onChange={(e) => setModel(e.target.value)} className="w-full mb-3" />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <input type="number" placeholder="Год" value={year} onChange={(e) => setYear(e.target.value)} className="w-full" />
        <input type="number" placeholder="Пробег (км)" value={mileage} onChange={(e) => setMileage(e.target.value)} className="w-full" />
      </div>

      <button
        onClick={() => {
          if (!brand || !model) return
          onAdd({ ...defaultCar, id: generateId(), brand, model, year, mileage, createdAt: new Date().toISOString() })
        }}
        disabled={!brand || !model}
        className={`w-full btn-primary ${!brand || !model ? 'opacity-30' : ''}`}
      >
        Добавить
      </button>
    </div>
  )
}

export default function CarSwitcher({ cars, activeCarId, onSelect, onAddCar, onClose }) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="fixed inset-0 z-[60] bg-dark/40 fade-in" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl slide-up max-h-[85dvh] overflow-y-auto max-w-[430px] mx-auto"
        onClick={(e) => e.stopPropagation()}>

        {showAdd ? (
          <QuickAddCar onAdd={onAddCar} onBack={() => setShowAdd(false)} />
        ) : (
          <div className="px-5 pt-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-dark">Ваши автомобили</h3>
              <button onClick={onClose} className="p-1 text-subtle"><IconClose /></button>
            </div>

            <div className="space-y-2 mb-5">
              {cars.map((car) => (
                <button
                  key={car.id}
                  onClick={() => onSelect(car.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                    car.id === activeCarId ? 'border-gold bg-gold-50' : 'border-border bg-white'
                  }`}
                >
                  <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#C8A45C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15h14M5 15l1-5h10l1 5M7 10l1-4h6l1 4" />
                      <circle cx="6.5" cy="15" r="1.5" /><circle cx="15.5" cy="15" r="1.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-dark">{car.brand} {car.model}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {[car.year, car.mileage && `${fmt(car.mileage)} км`, car.engine].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {car.id === activeCarId && <IconCheck />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border text-subtle font-medium active:bg-surface transition-colors"
            >
              <IconPlus /> Добавить автомобиль
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
