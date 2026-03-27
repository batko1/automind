'use client'
import { useState } from 'react'
import Link from 'next/link'

const content = {
  ru: {
    badge: 'AI-АССИСТЕНТ ДЛЯ АВТОВЛАДЕЛЬЦЕВ',
    title: 'Управляйте расходами\nна автомобиль\nс умом',
    subtitle: 'CarNote запоминает каждый расход, анализирует траты и напоминает о ТО — чтобы вы не думали об этом',
    cta: 'Попробовать бесплатно',
    ctaSub: 'Без регистрации · Данные на устройстве',
    features: [
      {
        icon: '💬',
        title: 'AI-чат вместо таблиц',
        desc: 'Напишите «заправка 50л за 3200» или сфотографируйте чек — AI запишет всё сам',
      },
      {
        icon: '📊',
        title: 'Аналитика расходов',
        desc: 'Графики по неделям и месяцам, структура расходов, стоимость владения, прогнозы',
      },
      {
        icon: '🔔',
        title: 'Умные напоминания',
        desc: 'Замена масла, колодки, страховка, техосмотр — push-уведомление в нужный момент',
      },
      {
        icon: '📸',
        title: 'Сканер чеков и заметок',
        desc: 'Сфотографируйте старые заметки — AI распознает все расходы и внесёт в базу',
      },
      {
        icon: '🚗',
        title: 'Несколько авто',
        desc: 'Управляйте расходами на все машины в одном приложении',
      },
      {
        icon: '🧠',
        title: 'AI знает вашу машину',
        desc: 'Спросите «когда менять масло?» или «сколько потратил в этом месяце?» — ответ мгновенно',
      },
    ],
    howTitle: 'Как это работает',
    steps: [
      { num: '01', title: 'Добавьте машину', desc: 'Марка, модель, пробег — 30 секунд' },
      { num: '02', title: 'Записывайте расходы', desc: 'Текстом, голосом или фото чека' },
      { num: '03', title: 'Получайте аналитику', desc: 'Графики, тренды, стоимость владения' },
    ],
    faqTitle: 'Вопросы',
    faqs: [
      { q: 'Это бесплатно?', a: 'Да, базовая версия полностью бесплатна. Премиум-функции появятся позже.' },
      { q: 'Где хранятся данные?', a: 'На вашем устройстве. Мы не собираем персональные данные. Облачный бэкап появится скоро.' },
      { q: 'Какие машины поддерживаются?', a: 'Любые — от Lada до Porsche. AI адаптируется под вашу марку и модель.' },
      { q: 'Работает на iPhone и Android?', a: 'Да, это веб-приложение — работает в любом браузере. Добавьте на домашний экран для лучшего опыта.' },
    ],
    footerCta: 'Начать вести учёт расходов',
    footer: '© 2026 CarNote. Все права защищены.',
    lang: 'EN',
  },
  en: {
    badge: 'AI ASSISTANT FOR CAR OWNERS',
    title: 'Manage your\ncar expenses\nwith intelligence',
    subtitle: 'CarNote tracks every expense, analyzes spending and reminds about maintenance — so you don\'t have to think about it',
    cta: 'Try for free',
    ctaSub: 'No registration · Data on device',
    features: [
      {
        icon: '💬',
        title: 'AI chat, not spreadsheets',
        desc: 'Type "filled 50L for $80" or snap a receipt photo — AI records everything',
      },
      {
        icon: '📊',
        title: 'Expense analytics',
        desc: 'Weekly and monthly charts, cost breakdown, ownership cost, forecasts',
      },
      {
        icon: '🔔',
        title: 'Smart reminders',
        desc: 'Oil change, brakes, insurance, inspection — push notification at the right time',
      },
      {
        icon: '📸',
        title: 'Receipt & note scanner',
        desc: 'Photo your old notes — AI recognizes all expenses and adds them automatically',
      },
      {
        icon: '🚗',
        title: 'Multiple cars',
        desc: 'Manage expenses for all your vehicles in one app',
      },
      {
        icon: '🧠',
        title: 'AI knows your car',
        desc: 'Ask "when to change oil?" or "how much spent this month?" — instant answer',
      },
    ],
    howTitle: 'How it works',
    steps: [
      { num: '01', title: 'Add your car', desc: 'Brand, model, mileage — 30 seconds' },
      { num: '02', title: 'Record expenses', desc: 'Text, voice or receipt photo' },
      { num: '03', title: 'Get analytics', desc: 'Charts, trends, ownership cost' },
    ],
    faqTitle: 'FAQ',
    faqs: [
      { q: 'Is it free?', a: 'Yes, the basic version is completely free. Premium features coming soon.' },
      { q: 'Where is data stored?', a: 'On your device. We don\'t collect personal data. Cloud backup coming soon.' },
      { q: 'What cars are supported?', a: 'Any — from Honda to Porsche. AI adapts to your make and model.' },
      { q: 'Works on iPhone and Android?', a: 'Yes, it\'s a web app — works in any browser. Add to home screen for the best experience.' },
    ],
    footerCta: 'Start tracking expenses',
    footer: '© 2026 CarNote. All rights reserved.',
    lang: 'RU',
  },
}

export default function Landing() {
  const [lang, setLang] = useState('ru')
  const [openFaq, setOpenFaq] = useState(null)
  const t = content[lang]

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-[960px] mx-auto px-6 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-dark rounded-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gold rounded-full" />
          </div>
          <span className="text-[17px] font-semibold text-dark tracking-tight">CarNote</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-subtle">
            {t.lang}
          </button>
          <Link href="/app"
            className="px-4 py-2 rounded-xl bg-dark text-white text-sm font-medium">
            {t.cta.split(' ')[0]}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-[960px] mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold/20 px-4 py-1.5 rounded-full mb-6">
          <div className="w-2 h-2 bg-gold rounded-full" />
          <span className="text-xs font-semibold text-gold-dark tracking-wide">{t.badge}</span>
        </div>
        <h1 className="text-[36px] md:text-[52px] font-semibold text-dark leading-[1.1] tracking-tight whitespace-pre-line mb-5">
          {t.title}
        </h1>
        <p className="text-[16px] md:text-[18px] text-subtle leading-relaxed max-w-[520px] mx-auto mb-8">
          {t.subtitle}
        </p>
        <Link href="/app"
          className="inline-block px-8 py-4 rounded-2xl bg-dark text-white text-[17px] font-semibold tracking-wide">
          {t.cta} →
        </Link>
        <p className="text-xs text-muted mt-3">{t.ctaSub}</p>
      </section>

      {/* Features */}
      <section className="max-w-[960px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.features.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl bg-surface border border-border">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="text-[15px] font-semibold text-dark mt-3 mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-subtle leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[960px] mx-auto px-6 pb-16">
        <h2 className="text-[24px] font-semibold text-dark text-center mb-8 tracking-tight">{t.howTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-sm font-bold">{s.num}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-dark mb-1">{s.title}</h3>
              <p className="text-[13px] text-subtle">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[640px] mx-auto px-6 pb-16">
        <h2 className="text-[24px] font-semibold text-dark text-center mb-8 tracking-tight">{t.faqTitle}</h2>
        <div className="space-y-2">
          {t.faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-[15px] font-semibold text-dark pr-4">{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b0b0be" strokeWidth="1.5" strokeLinecap="round"
                  className={`shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 fade-in">
                  <p className="text-[14px] text-subtle leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-[960px] mx-auto px-6 pb-12">
        <div className="bg-dark rounded-3xl p-8 md:p-12 text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <div className="w-5 h-5 bg-gold rounded-full" />
          </div>
          <h2 className="text-[24px] md:text-[30px] font-semibold text-white leading-tight tracking-tight mb-3">
            CarNote
          </h2>
          <p className="text-white/60 text-[15px] mb-6 max-w-[360px] mx-auto">{t.subtitle}</p>
          <Link href="/app"
            className="inline-block px-8 py-4 rounded-2xl bg-gold text-dark text-[16px] font-semibold">
            {t.footerCta} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-[960px] mx-auto px-6 py-6 flex items-center justify-between border-t border-border">
        <p className="text-xs text-muted">{t.footer}</p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-dark rounded-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gold rounded-full" />
          </div>
          <span className="text-xs font-medium text-subtle">CarNote</span>
        </div>
      </footer>
    </div>
  )
}
