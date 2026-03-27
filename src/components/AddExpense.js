'use client'
import { useState } from 'react'
import { CATEGORIES, CURRENCIES, generateId } from '@/lib/constants'

export default function AddExpense({ editData, onAdd, onClose, currency }) {
  const cur = currency || 'RUB'
  const curSymbol = CURRENCIES[cur]?.symbol || '₽'
  const isEdit = !!editData
  const [category, setCategory] = useState(editData?.category || 'fuel')
  const [amount, setAmount] = useState(editData ? String(editData.amount) : '')
  const [description, setDescription] = useState(editData?.description || '')
  const [liters, setLiters] = useState(editData?.liters ? String(editData.liters) : '')
  const [mileage, setMileage] = useState(editData?.mileage ? String(editData.mileage) : '')
  const [date, setDate] = useState(
    editData ? new Date(editData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [showExtra, setShowExtra] = useState(isEdit && (editData?.mileage || editData?.description || editData?.notes))
  const [notes, setNotes] = useState(editData?.notes || '')

  const canSave = amount && Number(amount) > 0

  const handleSubmit = () => {
    if (!canSave) return
    onAdd({
      id: editData?.id || generateId(),
      category, amount: Number(amount),
      description: description || CATEGORIES[category].label,
      liters: liters ? Number(liters) : null,
      mileage: mileage ? Number(mileage) : null,
      notes: notes || null,
      date: new Date(date).toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] bg-white fade-in flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border shrink-0">
        <button onClick={onClose} className="text-subtle text-[15px] font-medium py-1 min-w-[70px] text-left">Отмена</button>
        <span className="text-[15px] font-semibold text-dark">{isEdit ? 'Редактировать' : 'Новый расход'}</span>
        <button onClick={handleSubmit} disabled={!canSave}
          className={`text-[15px] font-semibold py-1 min-w-[70px] text-right ${canSave ? 'text-gold-dark' : 'text-muted'}`}>
          {isEdit ? 'Готово' : 'Сохранить'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Big amount input */}
        <div className="px-5 pt-8 pb-6 text-center">
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="!border-0 !ring-0 !bg-transparent text-center !text-[48px] font-bold !p-0 !rounded-none w-48 focus:!ring-0 focus:!border-0"
              style={{ fontSize: '48px' }}
            />
            <span className="text-2xl text-muted font-light">{curSymbol}</span>
          </div>
          {category === 'fuel' && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                className="!border-0 !ring-0 !bg-transparent text-center !text-lg !p-0 !rounded-none w-16 text-subtle focus:!ring-0 focus:!border-0 font-medium"
              />
              <span className="text-sm text-muted">литров</span>
            </div>
          )}
        </div>

        {/* Category grid */}
        <div className="px-5 pb-5">
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button key={key} onClick={() => setCategory(key)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                  category === key
                    ? 'bg-gold-50 border border-gold text-dark'
                    : 'bg-surface border border-border text-subtle'
                }`}>
                <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                <span className="leading-tight">{cat.label.split(' / ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date picker */}
        <div className="px-5 pb-3">
          <div className="flex gap-2">
            {[
              { label: 'Сегодня', value: new Date().toISOString().split('T')[0] },
              { label: 'Вчера', value: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
            ].map((d) => (
              <button key={d.label} onClick={() => setDate(d.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  date === d.value ? 'bg-dark text-white' : 'bg-surface border border-border text-subtle'
                }`}>
                {d.label}
              </button>
            ))}
            <div className="flex-1 relative">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full !py-2 !text-sm !rounded-xl" />
            </div>
          </div>
        </div>

        {/* Extra fields toggle */}
        {!showExtra ? (
          <div className="px-5 pb-5">
            <button onClick={() => setShowExtra(true)}
              className="text-sm text-gold-dark font-medium">
              + Описание, заметка, пробег
            </button>
          </div>
        ) : (
          <div className="px-5 pb-5 space-y-3 fade-in">
            <input type="text" placeholder="Описание (необязательно)" value={description}
              onChange={(e) => setDescription(e.target.value)} className="w-full" />
            <textarea placeholder="Заметка — почему, где, детали... (необязательно)" value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[70px] resize-none" rows={2} />
            <input type="number" inputMode="numeric" placeholder="Пробег, км (необязательно)" value={mileage}
              onChange={(e) => setMileage(e.target.value)} className="w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
