'use client'

function IconHome({ active }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={active ? '#C8A45C' : '#b0b0be'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L11 3l8 6.5V18a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 013 18V9.5z" /><path d="M8.5 19.5V13h5v6.5" /></svg>
}
function IconChat({ active }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={active ? '#C8A45C' : '#b0b0be'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V6a2 2 0 012-2z" /><path d="M8 9h6M8 12h3" /></svg>
}
function IconBell({ active }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={active ? '#C8A45C' : '#b0b0be'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a5 5 0 0110 0c0 5 2 7 2 7H4s2-2 2-7z" /><path d="M9.5 19a2 2 0 003 0" /></svg>
}
function IconProfile({ active }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={active ? '#C8A45C' : '#b0b0be'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="8" r="4" /><path d="M4 19c0-3.3 3.1-6 7-6s7 2.7 7 6" /></svg>
}

const tabs = [
  { id: 'dashboard', label: 'Главная', Icon: IconHome },
  { id: 'chat', label: 'AI-чат', Icon: IconChat },
  { id: 'reminders', label: 'Сервис', Icon: IconBell },
  { id: 'profile', label: 'Профиль', Icon: IconProfile },
]

export default function TabBar({ active, onChange }) {
  return (
    <div className="shrink-0 bg-white border-t border-border">
      <div className="flex items-center justify-around px-2 pt-2 pb-[max(env(safe-area-inset-bottom,6px),6px)]">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id || (id === 'dashboard' && active === 'stats')
          return (
            <button key={id} onClick={() => onChange(id)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[56px]">
              <Icon active={isActive} />
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-gold-dark' : 'text-muted'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
