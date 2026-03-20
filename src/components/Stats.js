'use client'
import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts'
import { CATEGORIES, fmt, fmtCurrency, getMonthName } from '@/lib/constants'

const PIE_COLORS = ['#C8A45C', '#1a1a2e', '#8c8c9a', '#e8e8ed', '#F97316', '#8B5CF6', '#06B6D4']

export default function Stats({ car, expenses, currency }) {
  const cur = currency || 'RUB'
  const now = new Date()

  const overview = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0)
    const days = car.createdAt
      ? Math.max(1, Math.ceil((Date.now() - new Date(car.createdAt).getTime()) / 86400000))
      : Math.max(1, expenses.length)
    const months = Math.max(1, Math.ceil(days / 30))
    const fuelExp = expenses.filter((e) => e.category === 'fuel')
    const totalL = fuelExp.reduce((s, e) => s + (e.liters || 0), 0)
    const totalFuel = fuelExp.reduce((s, e) => s + e.amount, 0)

    // Monthly averages
    const byMonth = {}
    expenses.forEach((e) => {
      const d = new Date(e.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      byMonth[key] = (byMonth[key] || 0) + e.amount
    })
    const monthlyValues = Object.values(byMonth)
    const avgMonth = monthlyValues.length > 0 ? monthlyValues.reduce((a, b) => a + b, 0) / monthlyValues.length : 0
    const maxMonth = Math.max(...monthlyValues, 0)
    const minMonth = monthlyValues.length > 0 ? Math.min(...monthlyValues) : 0

    // Most expensive single expense
    const topExpense = expenses.length > 0 ? expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]) : null

    // This month vs last month
    const thisM = expenses.filter((e) => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
    const lastM = expenses.filter((e) => { const d = new Date(e.date); const pm = now.getMonth() === 0 ? 11 : now.getMonth() - 1; const py = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(); return d.getMonth() === pm && d.getFullYear() === py })

    return {
      total, days, months, avgMonth: Math.round(avgMonth), avgDay: Math.round(total / days),
      maxMonth, minMonth, totalL, totalFuel,
      avgPerLiter: totalL > 0 ? totalFuel / totalL : 0,
      topExpense, count: expenses.length,
      thisMonthTotal: thisM.reduce((s, e) => s + e.amount, 0),
      lastMonthTotal: lastM.reduce((s, e) => s + e.amount, 0),
    }
  }, [expenses, car])

  // Category breakdown for pie chart
  const catPie = useMemo(() => {
    const m = {}
    expenses.forEach((e) => { m[e.category] = (m[e.category] || 0) + e.amount })
    return Object.entries(m)
      .map(([c, a]) => ({ name: CATEGORIES[c]?.label || c, value: a, icon: CATEGORIES[c]?.icon || '📦' }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  // Monthly trend for sparkline
  const trend = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const me = expenses.filter((e) => { const ed = new Date(e.date); return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear() })
      return { name: getMonthName(d.getMonth()), total: me.reduce((s, e) => s + e.amount, 0) }
    })
  }, [expenses])

  // Top 5 largest expenses
  const topExpenses = useMemo(() =>
    [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5),
    [expenses]
  )

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-20">
        <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#b0b0be" strokeWidth="1.4" strokeLinecap="round"><path d="M4 20V8l6 5 5-8 9 10v5z" /></svg>
        </div>
        <p className="text-lg font-semibold text-dark mb-2">Нет данных</p>
        <p className="text-sm text-subtle text-center">Добавьте расходы, чтобы увидеть статистику</p>
      </div>
    )
  }

  return (
    <div className="bg-white pb-4">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-xs font-medium text-muted tracking-wider">СТАТИСТИКА</p>
        <h1 className="text-[22px] font-semibold text-dark tracking-tight mt-1">{car.brand} {car.model}</h1>
      </div>

      {/* Ownership cost card */}
      <div className="px-5 mb-5">
        <div className="bg-dark rounded-2xl p-5 text-white">
          <p className="text-[11px] font-medium text-white/50 tracking-wider mb-1">СТОИМОСТЬ ВЛАДЕНИЯ</p>
          <p className="text-3xl font-bold tracking-tight">{fmtCurrency(overview.total, cur)}</p>
          <p className="text-sm text-white/50 mt-1">за {overview.days} дн. · {overview.count} записей</p>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] text-white/40 font-medium">В МЕСЯЦ</p>
              <p className="text-[15px] font-semibold mt-0.5">{fmtCurrency(overview.avgMonth, cur)}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-medium">В ДЕНЬ</p>
              <p className="text-[15px] font-semibold mt-0.5">{fmtCurrency(overview.avgDay, cur)}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-medium">В ГОД (прогноз)</p>
              <p className="text-[15px] font-semibold mt-0.5">{fmtCurrency(overview.avgMonth * 12, cur)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trend sparkline */}
      <div className="px-5 mb-5">
        <p className="text-xs font-medium text-muted tracking-wider mb-2.5">ДИНАМИКА РАСХОДОВ</p>
        <div className="bg-surface rounded-2xl border border-border p-3.5">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-sm text-subtle">Этот месяц</p>
              <p className="text-lg font-semibold text-dark">{fmtCurrency(overview.thisMonthTotal, cur)}</p>
            </div>
            {overview.lastMonthTotal > 0 && (
              <div className="text-right">
                <p className="text-sm text-subtle">Прошлый</p>
                <p className="text-lg font-semibold text-subtle">{fmtCurrency(overview.lastMonthTotal, cur)}</p>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="statGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8A45C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C8A45C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8c8c9a', fontSize: 10 }} />
              <Area type="monotone" dataKey="total" stroke="#C8A45C" strokeWidth={2} fill="url(#statGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart + category list */}
      {catPie.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-xs font-medium text-muted tracking-wider mb-2.5">СТРУКТУРА РАСХОДОВ</p>
          <div className="bg-surface rounded-2xl border border-border p-4">
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={catPie} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} strokeWidth={0}>
                      {catPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {catPie.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-xs text-dark font-medium">{c.icon} {c.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-subtle">{Math.round(c.value / overview.total * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fuel stats */}
      {overview.totalL > 0 && (
        <div className="px-5 mb-5">
          <p className="text-xs font-medium text-muted tracking-wider mb-2.5">ТОПЛИВО</p>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-surface rounded-2xl border border-border p-3.5 text-center">
              <p className="text-lg font-semibold text-dark">{fmt(overview.totalL)}</p>
              <p className="text-[10px] text-muted font-medium mt-0.5">ЛИТРОВ</p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-3.5 text-center">
              <p className="text-lg font-semibold text-dark">{overview.avgPerLiter.toFixed(1)}</p>
              <p className="text-[10px] text-muted font-medium mt-0.5">₽ / ЛИТР</p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-3.5 text-center">
              <p className="text-lg font-semibold text-dark">{fmtCurrency(overview.totalFuel, cur)}</p>
              <p className="text-[10px] text-muted font-medium mt-0.5">ВСЕГО</p>
            </div>
          </div>
        </div>
      )}

      {/* Records */}
      <div className="px-5 mb-5">
        <p className="text-xs font-medium text-muted tracking-wider mb-2.5">РЕКОРДЫ</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-3 px-4 bg-surface rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <span className="text-lg">📈</span>
              <span className="text-sm font-medium text-dark">Самый дорогой месяц</span>
            </div>
            <span className="text-sm font-semibold text-dark">{fmtCurrency(overview.maxMonth, cur)}</span>
          </div>
          <div className="flex items-center justify-between py-3 px-4 bg-surface rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <span className="text-lg">📉</span>
              <span className="text-sm font-medium text-dark">Самый дешёвый месяц</span>
            </div>
            <span className="text-sm font-semibold text-dark">{fmtCurrency(overview.minMonth, cur)}</span>
          </div>
          {overview.topExpense && (
            <div className="flex items-center justify-between py-3 px-4 bg-surface rounded-2xl border border-border">
              <div className="flex items-center gap-3">
                <span className="text-lg">💰</span>
                <span className="text-sm font-medium text-dark">Самый дорогой расход</span>
              </div>
              <span className="text-sm font-semibold text-dark">{fmtCurrency(overview.topExpense.amount, cur)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Top 5 expenses */}
      {topExpenses.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-xs font-medium text-muted tracking-wider mb-2.5">ТОП-5 РАСХОДОВ</p>
          {topExpenses.map((exp, i) => {
            const cat = CATEGORIES[exp.category] || CATEGORIES.other
            return (
              <div key={exp.id} className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
                <span className="text-sm font-bold text-gold w-5 text-center">{i + 1}</span>
                <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-dark truncate">{exp.description}</p>
                  <p className="text-xs text-muted">{new Date(exp.date).toLocaleDateString('ru-RU')}</p>
                </div>
                <p className="text-[13px] font-semibold text-dark">{fmtCurrency(exp.amount, cur)}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
