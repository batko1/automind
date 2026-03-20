'use client'
import { useState, useRef, useEffect } from 'react'
import { CATEGORIES, fmtCurrency, generateId } from '@/lib/constants'

function IconSend() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15V3M4 7l5-5 5 5" /></svg>
}
function IconPhoto() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="16" height="14" rx="2" /><circle cx="7" cy="8" r="1.5" /><path d="M2 13l4-4 3 3 4-5 5 6" /></svg>
}
function IconTrash() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M3 4h10M5.5 4V3a1 1 0 011-1h3a1 1 0 011 1v1M6 7v4M8 7v4M10 7v4" /><path d="M4 4l.7 8.5a1.5 1.5 0 001.5 1.5h3.6a1.5 1.5 0 001.5-1.5L12 4" /></svg>
}
function IconLoader() {
  return (
    <div className="flex gap-1 items-center py-1">
      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

const WELCOME_MSG = (car) => ({
  role: 'ai',
  text: `Привет! Я AI-ассистент для ${car.brand} ${car.model}.\n\nЗаписывайте расходы текстом:\n• «залил 50 литров за 3200»\n• «мойка вчера 800»\n• «парковка 200»\n\nИли отправьте фото заметки/чека — я распознаю всё автоматически.`,
  ts: Date.now(),
})

export default function Chat({ car, expenses, currency, onAddExpense }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const endRef = useRef(null)
  const fileRef = useRef(null)
  const storageKey = `automind_chat_${car.id || 'default'}`

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
          return
        }
      }
    } catch {}
    setMessages([WELCOME_MSG(car)])
  }, [car.id])

  // Save chat history to localStorage (without images to save space)
  useEffect(() => {
    if (messages.length === 0) return
    try {
      const toSave = messages.map(({ role, text, ts }) => ({ role, text, ts }))
      localStorage.setItem(storageKey, JSON.stringify(toSave))
    } catch {}
  }, [messages, storageKey])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const getExpensesSummary = () => {
    if (expenses.length === 0) return 'Нет записей.'
    const total = expenses.reduce((s, e) => s + e.amount, 0)
    const now = new Date()
    const thisMonth = expenses.filter((e) => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const monthTotal = thisMonth.reduce((s, e) => s + e.amount, 0)
    const byCat = {}
    expenses.forEach((e) => {
      const cat = CATEGORIES[e.category]?.label || e.category
      byCat[cat] = (byCat[cat] || 0) + e.amount
    })
    const catSummary = Object.entries(byCat).map(([k, v]) => `${k}: ${v}`).join(', ')
    return `Всего: ${total}, этот месяц: ${monthTotal}, записей: ${expenses.length}. По категориям: ${catSummary}`
  }

  // Build conversation history for AI context (last 10 messages)
  const getConversationHistory = () => {
    const recent = messages.slice(-10)
    return recent
      .filter((m) => m.text && m.role)
      .map((m) => `${m.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${m.text}`)
      .join('\n')
  }

  const sendToAI = async (text, imageData = null) => {
    setLoading(true)
    try {
      const history = getConversationHistory()
      const messageWithContext = history
        ? `Предыдущий диалог:\n${history}\n\nНовое сообщение пользователя: ${text || 'Распознай расходы с изображения'}`
        : text || 'Распознай расходы с изображения'

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageWithContext,
          image: imageData,
          car,
          expensesSummary: getExpensesSummary(),
        }),
      })
      const data = await res.json()

      if (data.action === 'add_expense' && data.expenses?.length > 0) {
        let replyParts = []
        data.expenses.forEach((exp) => {
          const cat = CATEGORIES[exp.category] || CATEGORIES.other
          const expense = {
            id: generateId(),
            category: exp.category || 'other',
            amount: Number(exp.amount) || 0,
            description: exp.description || cat.label,
            liters: exp.liters ? Number(exp.liters) : null,
            mileage: null,
            date: exp.date ? new Date(exp.date).toISOString() : new Date().toISOString(),
          }
          if (expense.amount > 0) {
            onAddExpense(expense)
            replyParts.push(`✅ ${cat.icon} ${expense.description} — ${fmtCurrency(expense.amount, currency)}${expense.liters ? ` (${expense.liters}л)` : ''}`)
          }
        })
        return replyParts.length > 0
          ? replyParts.join('\n')
          : 'Не удалось распознать сумму. Уточните, пожалуйста.'
      }

      return data.text || 'Не удалось обработать запрос.'
    } catch (err) {
      console.error('Chat error:', err)
      return 'Ошибка соединения. Проверьте интернет.'
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if ((!input.trim() && !previewImage) || loading) return
    const text = input.trim()
    setInput('')

    const userMsg = { role: 'user', text: text || '📸 Фото для распознавания', image: previewImage, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])

    const imageData = previewImage
    setPreviewImage(null)

    const reply = await sendToAI(text, imageData)
    setMessages((prev) => [...prev, { role: 'ai', text: reply, ts: Date.now() }])
  }

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreviewImage(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleClearHistory = () => {
    if (window.confirm('Очистить историю чата?')) {
      setMessages([WELCOME_MSG(car)])
      localStorage.removeItem(storageKey)
    }
  }

  // Group messages by date
  const formatDate = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) return 'Сегодня'
    if (d.toDateString() === yesterday.toDateString()) return 'Вчера'
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }

  let lastDate = ''

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-border shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-dark rounded-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gold rounded-full" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-dark">AutoMind AI</p>
            <p className="text-xs text-muted">{car.brand} {car.model}</p>
          </div>
        </div>
        {messages.length > 1 && (
          <button onClick={handleClearHistory} className="p-2 text-muted">
            <IconTrash />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((m, i) => {
          const dateLabel = formatDate(m.ts)
          const showDate = dateLabel !== lastDate
          if (showDate) lastDate = dateLabel

          return (
            <div key={i}>
              {showDate && dateLabel && (
                <p className="text-center text-xs text-muted py-2">{dateLabel}</p>
              )}
              <div className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-dark text-white rounded-2xl rounded-br-md'
                    : 'bg-surface border border-border text-dark rounded-2xl rounded-bl-md'
                }`}>
                  {m.image && (
                    <img src={m.image} alt="" className="w-full max-h-48 object-cover rounded-t-2xl" />
                  )}
                  <p className="px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            </div>
          )
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <IconLoader />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Image preview */}
      {previewImage && (
        <div className="px-4 pb-2 shrink-0">
          <div className="relative inline-block">
            <img src={previewImage} alt="" className="h-20 rounded-xl border border-border" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-dark text-white rounded-full flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-3 pt-2 border-t border-border shrink-0">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-subtle shrink-0"
          >
            <IconPhoto />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />
          <input
            type="text"
            placeholder="Расход или вопрос..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 !py-3 !rounded-2xl"
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !previewImage) || loading}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              (input.trim() || previewImage) && !loading ? 'bg-dark text-gold' : 'bg-surface text-muted'
            }`}
          >
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  )
}
