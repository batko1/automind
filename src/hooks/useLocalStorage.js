'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) setValue(JSON.parse(item))
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e)
    }
    setLoaded(true)
  }, [key])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e)
    }
  }, [key, value, loaded])

  return [value, setValue, loaded]
}
