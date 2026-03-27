'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function AuthScreen({ onSkip }) {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Auto-close when user signs in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && onSkip) {
        onSkip()
      }
    })
    return () => subscription.unsubscribe()
  }, [onSkip])

  const handleSubmit = async () => {
    setError(''); setMessage(''); setLoading(true)
    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(email)
        if (error) throw error
        setMessage('Ссылка для сброса пароля отправлена на ' + email)
        setLoading(false)
        return
      }
      if (mode === 'register') {
        if (password.length < 6) { setError('Пароль минимум 6 символов'); setLoading(false); return }
        const { data, error } = await signUp(email, password, name)
        if (error) throw error
        if (data?.session) return
        setMessage('Проверьте почту для подтверждения')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
    } catch (err) {
      const msg = err.message || 'Произошла ошибка'
      if (msg.includes('Invalid login')) setError('Неверный email или пароль')
      else if (msg.includes('Email not confirmed')) setError('Email не подтверждён')
      else if (msg.includes('already registered')) setError('Email уже зарегистрирован')
      else if (msg.includes('valid email')) setError('Введите корректный email')
      else setError(msg)
    }
    setLoading(false)
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-white">
      <div className="flex-1 flex flex-col justify-center px-8 max-w-[400px] mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-5 h-5 bg-gold rounded-full" />
          </div>
          <h1 className="text-2xl font-semibold text-dark tracking-tight">CarNote</h1>
          <p className="text-sm text-subtle mt-1">
            {mode === 'login' ? 'Войдите в аккаунт' : mode === 'register' ? 'Создайте аккаунт' : 'Сброс пароля'}
          </p>
        </div>

        {mode !== 'reset' && (
          <>
            <button onClick={() => { setError(''); signInWithGoogle() }}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-border bg-white text-dark font-medium text-[15px] active:bg-surface transition-colors mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 2.58z" fill="#EA4335"/></svg>
              Продолжить с Google
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted">или</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          </>
        )}

        <div className="space-y-3">
          {mode === 'register' && (
            <input type="text" placeholder="Имя" value={name}
              onChange={(e) => setName(e.target.value)} className="w-full" />
          )}
          <input type="email" placeholder="Email" value={email} autoCapitalize="none"
            onChange={(e) => setEmail(e.target.value)} className="w-full" />
          {mode !== 'reset' && (
            <input type="password" placeholder="Пароль" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full" />
          )}
        </div>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        {message && <p className="text-sm text-emerald-600 mt-3">{message}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className={`w-full btn-primary mt-5 ${loading ? 'opacity-50' : ''}`}>
          {loading ? 'Подождите...' : mode === 'login' ? 'Войти' : mode === 'register' ? 'Зарегистрироваться' : 'Сбросить пароль'}
        </button>

        <div className="flex flex-col items-center gap-2 mt-5">
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('reset'); setError(''); setMessage('') }} className="text-sm text-subtle">Забыли пароль?</button>
              <button onClick={() => { setMode('register'); setError(''); setMessage('') }} className="text-sm text-gold-dark font-medium">Создать аккаунт</button>
            </>
          )}
          {mode === 'register' && (
            <button onClick={() => { setMode('login'); setError(''); setMessage('') }} className="text-sm text-gold-dark font-medium">Уже есть аккаунт? Войти</button>
          )}
          {mode === 'reset' && (
            <button onClick={() => { setMode('login'); setError(''); setMessage('') }} className="text-sm text-gold-dark font-medium">← Вернуться к входу</button>
          )}
        </div>

        {onSkip && (
          <button onClick={onSkip} className="text-xs text-muted mt-6 text-center">
            ← Вернуться к приложению
          </button>
        )}
      </div>
    </div>
  )
}
