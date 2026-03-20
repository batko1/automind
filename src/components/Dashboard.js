'use client'
import { useState, useMemo, useRef } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CATEGORIES, fmt, fmtCurrency, fmtDate, getMonthName, generateId } from '@/lib/constants'
import AddExpense from './AddExpense'

function IconSettings() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="9" cy="9" r="3" /><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4" /></svg>
}
function IconPlus() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 3v12M3 9h12" /></svg>
}
function IconUp() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8l4-4 4 4" /></svg>
}
function IconDown() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l4 4 4-4" /></svg>
}
function IconCamera() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="16" height="11" rx="2" /><path d="M7 5l1-2h4l1 2" /><circle cx="10" cy="11" r="3" /></svg>
}

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border rounded-xl px-3 py-2 text-sm shadow-sm">
      <p className="text-subtle text-xs">{label}</p>
      <p className="font-semibold text-dark">{fmtCurrency(payload[0].value, currency)}</p>
    </div>
  )
}

export default function Dashboard({ car, cars, expenses, currency, onAddExpense, onEditExpense, onDeleteExpense, onOpenProfile, onOpenStats, onSwitchCar }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editExpense, setEditExpense] = useState(null)
  const [actionExpense, setActionExpense] = useState(null)
  const [chartPeriod, setChartPeriod] = useState('month') // week, month, year
  const longPressTimer = useRef(null)

  const handleLongPress = (exp) => { longPressTimer.current = setTimeout(() => setActionExpense(exp), 500) }
  const handleRelease = () => { clearTimeout(longPressTimer.current) }

  const cur = currency || 'RUB'

  const stats = useMemo(() => {
    const now = new Date()
    const m = now.getMonth(), y = now.getFullYear()
    const mExp = expenses.filter((e) => { const d = new Date(e.date); return d.getMonth() === m && d.getFullYear() === y })
    const pm = m === 0 ? 11 : m - 1, py = m === 0 ? y - 1 : y
    const pmExp = expenses.filter((e) => { const d = new Date(e.date); return d.getMonth() === pm && d.getFullYear() === py })
    const mTotal = mExp.reduce((s, e) => s + e.amount, 0)
    const pmTotal = pmExp.reduce((s, e) => s + e.amount, 0)
    const allTotal = expenses.reduce((s, e) => s + e.amount, 0)
    const fuelExp = expenses.filter((e) => e.category === 'fuel')
    const totalL = fuelExp.reduce((s, e) => s + (e.liters || 0), 0)
    const totalFuel = fuelExp.reduce((s, e) => s + e.amount, 0)
    const pct = pmTotal > 0 ? Math.round(((mTotal - pmTotal) / pmTotal) * 100) : 0
    return { mTotal, allTotal, totalL, avgL: totalL > 0 ? totalFuel / totalL : 0, pct, mCount: mExp.length, total: expenses.length }
  }, [expenses])

  const catData = useMemo(() => {
    const m = {}
    expenses.forEach((e) => { m[e.category] = (m[e.category] || 0) + e.amount })
    return Object.entries(m).map(([c, a]) => ({ cat: c, amount: a, ...CATEGORIES[c] })).sort((a, b) => b.amount - a.amount)
  }, [expenses])
  const maxCat = Math.max(...catData.map((c) => c.amount), 1)

  // Weekly chart data
  const weekChart = useMemo(() => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const now = new Date()
    const monday = new Date(now)
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
    monday.setHours(0, 0, 0, 0)

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dayExp = expenses.filter((e) => {
        const ed = new Date(e.date)
        return ed.toDateString() === d.toDateString()
      })
      return {
        name: days[i],
        total: dayExp.reduce((s, e) => s + e.amount, 0),
        current: d.toDateString() === now.toDateString(),
      }
    })
  }, [expenses])

  // Monthly chart data
  const monthChart = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const me = expenses.filter((e) => { const ed = new Date(e.date); return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear() })
      return { name: getMonthName(d.getMonth()), total: me.reduce((s, e) => s + e.amount, 0), current: i === 5 }
    })
  }, [expenses])

  // Yearly trend data (last 12 months as line chart)
  const yearChart = useMemo(() => {
    const now = new Date()
    let cumulative = 0
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
      const me = expenses.filter((e) => { const ed = new Date(e.date); return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear() })
      const monthTotal = me.reduce((s, e) => s + e.amount, 0)
      cumulative += monthTotal
      return { name: getMonthName(d.getMonth()), total: monthTotal, cumulative }
    })
  }, [expenses])

  const chartData = chartPeriod === 'week' ? weekChart : chartPeriod === 'year' ? yearChart : monthChart

  const recent = useMemo(() => [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15), [expenses])

  return (
    <div className="bg-white pb-4">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between shrink-0">
        <button onClick={onSwitchCar} className="text-left active:opacity-70 transition-opacity">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-muted tracking-wide">АВТОМОБИЛЬ</p>
            {cars && cars.length > 1 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#b0b0be" strokeWidth="1.5" strokeLinecap="round"><path d="M3 5l3 3 3-3" /></svg>
            )}
          </div>
          <h1 className="text-[22px] font-semibold text-dark tracking-tight mt-1">{car.brand} {car.model}</h1>
          <p className="text-sm text-subtle mt-0.5">
            {[car.year, car.mileage && `${fmt(car.mileage)} км`, car.engine].filter(Boolean).join(' · ')}
          </p>
        </button>
        <div className="flex items-center gap-2 mt-1">
          <button onClick={() => { setEditExpense(null); setShowAdd(true) }} className="w-9 h-9 bg-dark rounded-xl flex items-center justify-center text-gold">
            <IconPlus />
          </button>
          <button onClick={onOpenProfile} className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-subtle">
            <IconSettings />
          </button>
        </div>
      </div>

      {/* Stats */}
      <button onClick={onOpenStats} className="px-5 grid grid-cols-2 gap-2.5 mb-5 w-full text-left active:opacity-80 transition-opacity">
        <div className="bg-surface rounded-2xl p-3.5 border border-border">
          <p className="text-[10px] font-medium text-muted tracking-wider">ЭТОТ МЕСЯЦ</p>
          <p className="text-lg font-semibold text-dark mt-1">{fmtCurrency(stats.mTotal, cur)}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {stats.pct !== 0 && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${stats.pct > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                {stats.pct > 0 ? <IconUp /> : <IconDown />}{Math.abs(stats.pct)}%
              </span>
            )}
            <span className="text-xs text-muted">{stats.mCount} зап.</span>
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-3.5 border border-border">
          <p className="text-[10px] font-medium text-muted tracking-wider">ВСЕГО</p>
          <p className="text-lg font-semibold text-dark mt-1">{fmtCurrency(stats.allTotal, cur)}</p>
          <p className="text-xs text-muted mt-1">{stats.total} записей</p>
        </div>
      </button>

      {/* Chart with period switcher */}
      {expenses.length > 0 && (
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-medium text-muted tracking-wider">РАСХОДЫ</p>
            <div className="flex bg-surface rounded-lg border border-border p-0.5">
              {[
                { id: 'week', label: 'Нед' },
                { id: 'month', label: 'Мес' },
                { id: 'year', label: 'Год' },
              ].map((p) => (
                <button key={p.id} onClick={() => setChartPeriod(p.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chartPeriod === p.id ? 'bg-white text-dark shadow-sm' : 'text-muted'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-3.5">
            <ResponsiveContainer width="100%" height={150}>
              {chartPeriod === 'year' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8A45C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C8A45C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8c8c9a', fontSize: 10 }} interval={1} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip currency={cur} />} cursor={false} />
                  <Area type="monotone" dataKey="total" stroke="#C8A45C" strokeWidth={2} fill="url(#goldGrad)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData} barCategoryGap="20%">
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8c8c9a', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip currency={cur} />} cursor={false} />
                  <Bar dataKey="total" radius={[5, 5, 0, 0]}>
                    {chartData.map((e, i) => <Cell key={i} fill={e.current ? '#C8A45C' : '#e8e8ed'} />)}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Categories */}
      {catData.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-xs font-medium text-muted tracking-wider mb-2.5">ПО КАТЕГОРИЯМ</p>
          <div className="space-y-3">
            {catData.map((c) => (
              <div key={c.cat} className="flex items-center gap-3">
                <span style={{ fontSize: '18px' }} className="w-7 text-center">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-dark">{c.label}</span>
                    <span className="text-sm font-semibold text-subtle">{fmtCurrency(c.amount, cur)}</span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(c.amount / maxCat) * 100}%`, backgroundColor: c.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      {recent.length > 0 ? (
        <div className="px-5 mb-5">
          <p className="text-xs font-medium text-muted tracking-wider mb-2.5">ПОСЛЕДНИЕ ЗАПИСИ</p>
          {recent.map((exp) => {
            const cat = CATEGORIES[exp.category] || CATEGORIES.other
            return (
              <div key={exp.id}
                onTouchStart={() => handleLongPress(exp)} onTouchEnd={handleRelease} onTouchCancel={handleRelease}
                onMouseDown={() => handleLongPress(exp)} onMouseUp={handleRelease} onMouseLeave={handleRelease}
                className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0 active:bg-surface/50 transition-colors select-none">
                <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0" style={{ fontSize: '15px' }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-dark truncate">{exp.description}</p>
                  <p className="text-xs text-muted mt-0.5">{fmtDate(exp.date)}{exp.liters ? ` · ${exp.liters}л` : ''}{exp.mileage ? ` · ${fmt(exp.mileage)} км` : ''}</p>
                </div>
                <p className="text-[14px] font-semibold text-dark shrink-0">{fmtCurrency(exp.amount, cur)}</p>
              </div>
            )
          })}
          <p className="text-center text-xs text-muted mt-3">Удерживайте запись для редактирования</p>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mx-5 w-[calc(100%-40px)] text-center py-16 rounded-2xl border-2 border-dashed border-border active:bg-surface transition-colors mb-5">
          <div className="w-14 h-14 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A45C" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </div>
          <p className="text-base font-semibold text-dark mb-1">Добавить первый расход</p>
          <p className="text-sm text-subtle">Нажмите, чтобы записать</p>
        </button>
      )}

      {/* Action menu */}
      {actionExpense && (
        <div className="fixed inset-0 z-[60] bg-dark/40 fade-in flex items-end justify-center" onClick={() => setActionExpense(null)}>
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 pb-8">
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
              <p className="text-[15px] font-semibold text-dark mb-1">{actionExpense.description}</p>
              <p className="text-sm text-subtle mb-4">{fmtDate(actionExpense.date)} · {fmtCurrency(actionExpense.amount, cur)}</p>
              <button onClick={() => { setEditExpense(actionExpense); setShowAdd(true); setActionExpense(null) }}
                className="w-full flex items-center gap-3 py-3.5 border-b border-border text-left">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1a1a2e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l4 4-9.5 9.5H3v-3.5L12 2z" /></svg>
                <span className="text-[15px] font-medium text-dark">Редактировать</span>
              </button>
              <button onClick={() => { if (window.confirm('Удалить запись?')) { onDeleteExpense(actionExpense.id); setActionExpense(null) } }}
                className="w-full flex items-center gap-3 py-3.5 text-left">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round"><path d="M3 5h12M6 5V3.5a1 1 0 011-1h4a1 1 0 011 1V5M7 8v5M11 8v5" /><path d="M4.5 5l.6 9.5a1.5 1.5 0 001.5 1.5h4.8a1.5 1.5 0 001.5-1.5L13.5 5" /></svg>
                <span className="text-[15px] font-medium text-red-500">Удалить</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdd && <AddExpense editData={editExpense} onAdd={editExpense ? onEditExpense : onAddExpense} onClose={() => { setShowAdd(false); setEditExpense(null) }} />}
    </div>
  )
}
