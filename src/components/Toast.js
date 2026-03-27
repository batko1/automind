'use client'
import { useState, useEffect } from 'react'

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 2200)
    const t2 = setTimeout(onDone, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[80] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="bg-dark text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 max-w-[340px]">
        <span className="text-lg">✅</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
