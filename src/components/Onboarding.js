'use client'
import { useState } from 'react'
import { CAR_BRANDS, defaultCar, generateId } from '@/lib/constants'

function IconChevronLeft() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4l-6 6 6 6" /></svg>
}
function IconSearch() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="5.5" /><path d="M12 12l3.5 3.5" /></svg>
}
function IconFuel() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="12" rx="1.5" /><path d="M11 7l2.5-2.5M13.5 4.5v5a2 2 0 004 0V7" /></svg>
}
function IconDiesel() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 2v4M6 8c0-2 6-2 6 0v5a3 3 0 01-6 0V8z" /></svg>
}
function IconElectric() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L5 10h4l-1 6 5-8h-4l1-6z" /></svg>
}

const fuelTypes = [
  { id: 'petrol', label: 'Бензин', Icon: IconFuel },
  { id: 'diesel', label: 'Дизель', Icon: IconDiesel },
  { id: 'hybrid', label: 'Гибрид', Icon: IconElectric },
  { id: 'electric', label: 'Электро', Icon: IconElectric },
]

function WelcomeScreen({ onNext }) {
  return (
    <div className="fixed inset-0 flex flex-col justify-center px-7 bg-white overflow-hidden fade-in">
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 bg-dark px-4 py-1.5 rounded-full">
          <div className="w-3.5 h-3.5 bg-gold rounded-full" />
          <span className="text-xs font-semibold text-gold tracking-[0.15em]">AUTOMIND</span>
        </div>
      </div>
      <h1 className="text-center text-[28px] font-light text-dark leading-[1.2] tracking-tight mb-2">
        Интеллектуальный<br />ассистент
      </h1>
      <p className="text-center text-[15px] text-subtle mb-8">для вашего автомобиля</p>
      <div className="border-t border-border pt-6 mb-8 space-y-4">
        {[
          ['Контроль расходов', 'Текстом, голосом или фото чека'],
          ['Аналитика и прогнозы', 'Тренды, графики, предсказание расходов'],
          ['Сервисный календарь', 'Напоминания о ТО, страховке, шинах'],
        ].map(([title, desc], i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-[3px] h-9 bg-gold rounded-full shrink-0 mt-0.5" />
            <div>
              <p className="text-[15px] font-semibold text-dark leading-tight">{title}</p>
              <p className="text-[13px] text-subtle mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="btn-primary w-full">Добавить автомобиль</button>
      <p className="text-center text-xs text-muted mt-3">Данные хранятся на устройстве</p>
    </div>
  )
}

function BrandScreen({ car, setCar, onNext, onBack }) {
  const [search, setSearch] = useState('')
  const filtered = search ? CAR_BRANDS.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())) : CAR_BRANDS
  return (
    <div className="min-h-[100dvh] px-7 pt-12 pb-8 bg-white fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-subtle text-sm mb-6"><IconChevronLeft /> Назад</button>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1.5"><div className="w-8 h-1 bg-gold rounded-full" /><div className="w-8 h-1 bg-border rounded-full" /><div className="w-8 h-1 bg-border rounded-full" /></div>
        <span className="text-xs text-muted">1 / 3</span>
      </div>
      <h2 className="text-[24px] font-light text-dark tracking-tight mb-5">Марка автомобиля</h2>
      <div className="relative mb-4">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><IconSearch /></div>
        <input type="text" placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11" />
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {filtered.map((brand) => (
          <button key={brand.name} onClick={() => { setCar({ ...car, brand: brand.name }); onNext() }}
            className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.97] ${car.brand === brand.name ? 'border-gold bg-gold-50' : 'border-border bg-white'}`}>
            <span className="text-base mr-2">{brand.logo}</span>
            <span className="text-[15px] font-semibold text-dark">{brand.name}</span>
          </button>
        ))}
      </div>
      <input type="text" placeholder="Другая марка..." className="w-full" onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) { setCar({ ...car, brand: e.target.value }); onNext() } }} />
    </div>
  )
}

function ModelScreen({ car, setCar, onNext, onBack }) {
  const brandData = CAR_BRANDS.find((b) => b.name === car.brand)
  return (
    <div className="min-h-[100dvh] px-7 pt-12 pb-8 bg-white fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-subtle text-sm mb-6"><IconChevronLeft /> Назад</button>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1.5"><div className="w-8 h-1 bg-gold rounded-full" /><div className="w-8 h-1 bg-gold rounded-full" /><div className="w-8 h-1 bg-border rounded-full" /></div>
        <span className="text-xs text-muted">2 / 3</span>
      </div>
      <h2 className="text-[24px] font-light text-dark tracking-tight mb-1">{car.brand}</h2>
      <p className="text-subtle text-[15px] mb-5">Выберите модель</p>
      {brandData && (
        <div className="flex flex-wrap gap-2 mb-4">
          {brandData.models.map((model) => (
            <button key={model} onClick={() => setCar({ ...car, model })}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${car.model === model ? 'bg-gold-50 border border-gold text-dark' : 'bg-surface border border-border text-subtle'}`}>
              {model}
            </button>
          ))}
        </div>
      )}
      <input type="text" placeholder="Или введите модель" value={car.model} onChange={(e) => setCar({ ...car, model: e.target.value })} className="w-full mb-5" />
      <button onClick={() => car.model && onNext()} disabled={!car.model} className={`w-full btn-primary ${!car.model ? 'opacity-30' : ''}`}>Далее</button>
    </div>
  )
}

function DetailsScreen({ car, setCar, onComplete, onBack }) {
  return (
    <div className="min-h-[100dvh] px-7 pt-12 pb-8 bg-white fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-subtle text-sm mb-6"><IconChevronLeft /> Назад</button>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1.5"><div className="w-8 h-1 bg-gold rounded-full" /><div className="w-8 h-1 bg-gold rounded-full" /><div className="w-8 h-1 bg-gold rounded-full" /></div>
        <span className="text-xs text-muted">3 / 3</span>
      </div>
      <h2 className="text-[24px] font-light text-dark tracking-tight mb-1">{car.brand} {car.model}</h2>
      <p className="text-subtle text-sm mb-5">Детали помогут AI давать точные рекомендации</p>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ГОД ВЫПУСКА</label>
          <input type="number" placeholder="2024" value={car.year} onChange={(e) => setCar({ ...car, year: e.target.value })} className="w-full" />
        </div>
        <div>
          <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ПРОБЕГ</label>
          <input type="number" placeholder="Текущий пробег (км)" value={car.mileage} onChange={(e) => setCar({ ...car, mileage: e.target.value })} className="w-full" />
        </div>
        <div>
          <label className="text-xs font-medium text-subtle tracking-wide block mb-1">ДВИГАТЕЛЬ</label>
          <input type="text" placeholder="Напр. 3.0 B58 Twin-Turbo" value={car.engine} onChange={(e) => setCar({ ...car, engine: e.target.value })} className="w-full" />
        </div>
        <div>
          <label className="text-xs font-medium text-subtle tracking-wide block mb-2">ТИП ТОПЛИВА</label>
          <div className="grid grid-cols-4 gap-2">
            {fuelTypes.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setCar({ ...car, fuelType: id })}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all ${car.fuelType === id ? 'bg-gold-50 border border-gold text-dark' : 'bg-surface border border-border text-subtle'}`}>
                <Icon />{label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={onComplete} className="w-full btn-primary mt-6">Начать</button>
      <button onClick={onComplete} className="w-full py-2.5 text-subtle text-sm mt-1">Пропустить</button>
    </div>
  )
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [car, setCar] = useState({ ...defaultCar })
  const handleComplete = () => { onComplete({ ...car, id: generateId(), createdAt: new Date().toISOString() }) }
  if (step === 0) return <WelcomeScreen onNext={() => setStep(1)} />
  if (step === 1) return <BrandScreen car={car} setCar={setCar} onNext={() => setStep(2)} onBack={() => setStep(0)} />
  if (step === 2) return <ModelScreen car={car} setCar={setCar} onNext={() => setStep(3)} onBack={() => setStep(1)} />
  if (step === 3) return <DetailsScreen car={car} setCar={setCar} onComplete={handleComplete} onBack={() => setStep(2)} />
}
