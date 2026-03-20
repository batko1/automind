'use client'
import { useState } from 'react'

const slides = [
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="16" fill="#1a1a2e" />
        <circle cx="32" cy="28" r="12" fill="#C8A45C" />
        <circle cx="28" cy="25" r="2" fill="#1a1a2e" />
        <circle cx="36" cy="25" r="2" fill="#1a1a2e" />
        <path d="M28 33c1.5 2.5 6.5 2.5 8 0" stroke="#1a1a2e" stroke-width="1.8" fill="none" stroke-linecap="round" />
      </svg>
    ),
    title: 'Добро пожаловать\nв AutoMind',
    subtitle: 'Ваш персональный AI-ассистент для управления расходами на автомобиль',
    accent: false,
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="16" fill="#FBF7EE" stroke="#C8A45C" stroke-width="1" />
        <path d="M20 40V24l8 6 8-10 8 12v8z" fill="#C8A45C" opacity="0.2" stroke="#C8A45C" stroke-width="1.5" stroke-linejoin="round" />
        <circle cx="22" cy="22" r="3" fill="#C8A45C" opacity="0.5" />
      </svg>
    ),
    title: 'Записывайте\nрасходы легко',
    subtitle: 'Текстом в AI-чат, через форму или просто сфотографируйте чек — мы распознаем всё автоматически',
    accent: false,
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="16" fill="#FBF7EE" stroke="#C8A45C" stroke-width="1" />
        <path d="M22 30a10 10 0 0120 0c0 8 4 12 4 12H18s4-4 4-12z" stroke="#C8A45C" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M28 44a4 4 0 008 0" stroke="#C8A45C" stroke-width="1.8" fill="none" stroke-linecap="round" />
        <circle cx="42" cy="22" r="6" fill="#C8A45C" />
        <text x="42" y="25" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">!</text>
      </svg>
    ),
    title: 'Не забудете\nпро ТО',
    subtitle: 'Умные напоминания о замене масла, колодках, страховке — с push-уведомлениями в нужный момент',
    accent: false,
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="16" fill="#1a1a2e" />
        <path d="M18 18h28a3 3 0 013 3v16a3 3 0 01-3 3H25l-8 5V21a3 3 0 013-3z" fill="#C8A45C" opacity="0.3" />
        <path d="M25 28h14M25 33h8" stroke="#C8A45C" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    ),
    title: 'AI, который знает\nвашу машину',
    subtitle: 'Спросите «сколько потратил в этом месяце?» или «когда менять масло?» — AI ответит мгновенно',
    accent: true,
  },
]

export default function Tutorial({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const slide = slides[current]
  const isLast = current === slides.length - 1

  return (
    <div className="fixed inset-0 bg-white z-[70] flex flex-col fade-in">
      {/* Skip */}
      <div className="px-5 pt-4 flex justify-end shrink-0">
        {!isLast && (
          <button onClick={onComplete} className="text-sm text-muted font-medium py-1 px-2">
            Пропустить
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
        <div className="mb-8 slide-up" key={current}>
          {slide.icon}
        </div>
        <h2
          className="text-[26px] font-semibold text-dark tracking-tight leading-[1.2] mb-4 whitespace-pre-line slide-up"
          key={`t-${current}`}
          style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
        >
          {slide.title}
        </h2>
        <p
          className="text-[15px] text-subtle leading-relaxed max-w-[300px] slide-up"
          key={`s-${current}`}
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          {slide.subtitle}
        </p>
      </div>

      {/* Bottom */}
      <div className="px-5 pb-8 shrink-0">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-gold' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <button onClick={onComplete} className="w-full btn-primary">
            Начать
          </button>
        ) : (
          <button onClick={() => setCurrent(current + 1)} className="w-full btn-primary">
            Далее
          </button>
        )}
      </div>
    </div>
  )
}
