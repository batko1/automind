'use client'
import { useState, useEffect, useCallback } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState('default')
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
    setSupported(isSupported)
    if (isSupported) {
      setPermission(Notification.permission)
      // Register service worker
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!supported) return false
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch {
      return false
    }
  }, [supported])

  const scheduleReminder = useCallback((title, body, delayMs) => {
    if (permission !== 'granted') return null

    const timerId = setTimeout(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: '/icon-192.png',
            tag: 'automind-reminder',
          })
        })
      } else {
        new Notification(title, { body, icon: '/icon-192.png' })
      }
    }, delayMs)

    return timerId
  }, [permission])

  const sendTestNotification = useCallback(() => {
    if (permission !== 'granted') return
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification('CarNote', {
          body: 'Уведомления работают! Мы напомним о ТО вовремя.',
          icon: '/icon-192.png',
          tag: 'automind-test',
        })
      })
    }
  }, [permission])

  return { permission, supported, requestPermission, scheduleReminder, sendTestNotification }
}
