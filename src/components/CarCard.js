'use client'
import { useState, useRef } from 'react'
import { fmt, fmtCurrency } from '@/lib/constants'

const DRIVE_LABELS = {
  rwd: 'RWD', fwd: 'FWD', awd: 'AWD', '4wd': '4WD',
  xdrive: 'xDrive', quattro: 'quattro', '4matic': '4MATIC',
}
const FUEL_LABELS = { petrol: 'Бензин', diesel: 'Дизель', hybrid: 'Гибрид', electric: 'Электро' }

const THEMES = [
  { id: 'dark', label: '🌙', bg: 'from-[#0f0f1a] via-[#1a1a2e] to-[#16213e]' },
  { id: 'gold', label: '✨', bg: 'from-[#2a2218] via-[#1a1510] to-[#0f0d0a]' },
  { id: 'blue', label: '🌊', bg: 'from-[#0a1628] via-[#0f2440] to-[#0a1e3a]' },
  { id: 'green', label: '🌲', bg: 'from-[#0a1a14] via-[#0f2a1e] to-[#0a2018]' },
]

export default function CarCard({ car, expenses, currency, onClose, onUpdateCarPhoto }) {
  const [shared, setShared] = useState(false)
  const [theme, setTheme] = useState(0)
  const fileRef = useRef(null)
  const cur = currency || 'RUB'
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const fuelExp = expenses.filter((e) => e.category === 'fuel')
  const totalL = fuelExp.reduce((s, e) => s + (e.liters || 0), 0)
  const daysOwned = car.createdAt ? Math.max(1, Math.ceil((Date.now() - new Date(car.createdAt).getTime()) / 86400000)) : 1
  const monthsOwned = Math.max(1, Math.round(daysOwned / 30))

  const specs = [
    car.year && car.year,
    car.engine && car.engine,
    car.fuelType && FUEL_LABELS[car.fuelType],
    car.drivetrain && DRIVE_LABELS[car.drivetrain],
  ].filter(Boolean)

  const t = THEMES[theme]

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 800
        let w = img.width, h = img.height
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX }
          else { w = Math.round(w * MAX / h); h = MAX }
        }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        onUpdateCarPhoto(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleShare = async () => {
    const cardEl = document.getElementById('car-card-capture')
    if (!cardEl) return
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(cardEl, { scale: 3, backgroundColor: null, useCORS: true })
      canvas.toBlob(async (blob) => {
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], `${car.brand}_${car.model}.png`, { type: 'image/png' })
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: `${car.brand} ${car.model}` })
            return
          }
        }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `${car.brand}_${car.model}_CarNote.png`; a.click()
        URL.revokeObjectURL(url)
        setShared(true); setTimeout(() => setShared(false), 2000)
      }, 'image/png')
    } catch (err) { console.error('Share error:', err) }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col fade-in" onClick={onClose}>
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start pt-8 pb-6 px-5" onClick={(e) => e.stopPropagation()}>
        <div className="w-full max-w-[360px]">

          {/* Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1.5">
              {THEMES.map((th, i) => (
                <button key={th.id} onClick={() => setTheme(i)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${i === theme ? 'bg-white/25 ring-2 ring-gold' : 'bg-white/10'}`}>
                  {th.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => fileRef.current?.click()}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">📷</button>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/60">✕</button>
            </div>
          </div>

          {/* The card */}
          <div id="car-card-capture" className={`rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br ${t.bg} relative`}>

            {car.photo ? (
              <>
                {/* Full-bleed photo with gradient overlay */}
                <div className="relative">
                  <img src={car.photo} alt={`${car.brand} ${car.model}`}
                    className="w-full aspect-[4/3] object-cover" />
                  {/* Gradient overlay — dark at bottom for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  {/* Logo top-left */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-white/15 backdrop-blur-md rounded-md flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                    </div>
                    <span className="text-[8px] font-bold text-white/50 tracking-[0.25em]">CARNOTE</span>
                  </div>
                  {/* Car name on photo bottom */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h1 className="text-white text-[30px] font-black tracking-tight leading-none drop-shadow-lg">{car.brand}</h1>
                    <h2 className="text-gold text-[20px] font-light tracking-tight mt-0.5 drop-shadow-lg">{car.model}</h2>
                  </div>
                </div>
              </>
            ) : (
              /* No photo */
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                  </div>
                  <span className="text-[8px] font-bold text-white/35 tracking-[0.25em]">CARNOTE</span>
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="w-full py-10 rounded-2xl border border-dashed border-white/20 flex flex-col items-center gap-2 mb-4">
                  <span className="text-2xl">📷</span>
                  <span className="text-xs text-white/40 font-medium">Добавить фото</span>
                </button>
                <h1 className="text-white text-[28px] font-black tracking-tight leading-none">{car.brand}</h1>
                <h2 className="text-gold text-[18px] font-light tracking-tight mt-0.5">{car.model}</h2>
              </div>
            )}

            {/* Bottom section */}
            <div className="px-5 pt-3 pb-4">
              {/* Specs */}
              {specs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {specs.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white/8 border border-white/10 rounded-full text-[9px] font-semibold text-white/75 tracking-wide">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-white/8 mb-3" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[18px] font-black text-white leading-none">{fmt(totalExpenses)}</p>
                  <p className="text-[8px] text-white/30 font-bold tracking-wider mt-1">{cur === 'RUB' ? '₽ РАСХОДЫ' : cur}</p>
                </div>
                <div>
                  <p className="text-[18px] font-black text-white leading-none">{expenses.length}</p>
                  <p className="text-[8px] text-white/30 font-bold tracking-wider mt-1">ЗАПИСЕЙ</p>
                </div>
                <div>
                  <p className="text-[18px] font-black text-white leading-none">{monthsOwned}</p>
                  <p className="text-[8px] text-white/30 font-bold tracking-wider mt-1">{monthsOwned === 1 ? 'МЕСЯЦ' : monthsOwned < 5 ? 'МЕСЯЦА' : 'МЕСЯЦЕВ'}</p>
                </div>
              </div>

              {totalL > 0 && (
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-center gap-4">
                  <span className="text-[10px] text-white/40">⛽ <span className="text-white/70 font-semibold">{fmt(totalL)} л</span></span>
                  {car.mileage && <span className="text-[10px] text-white/40">🛣 <span className="text-white/70 font-semibold">{fmt(car.mileage)} км</span></span>}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <div className="w-3 h-3 bg-white/10 rounded flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-gold rounded-full" />
                </div>
                <span className="text-[8px] text-white/20 font-bold tracking-[0.2em]">carnote.fun</span>
              </div>
            </div>
          </div>

          {/* Share button */}
          <button onClick={handleShare}
            className="w-full mt-4 py-3.5 rounded-2xl bg-white font-bold text-sm flex items-center justify-center gap-2" style={{ color: '#1a1a2e' }}>
            {shared ? '✓ Готово' : '↑ Поделиться'}
          </button>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
      </div>
    </div>
  )
}
