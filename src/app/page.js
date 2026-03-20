'use client'
import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import Onboarding from '@/components/Onboarding'
import Dashboard from '@/components/Dashboard'
import CarProfile from '@/components/CarProfile'
import Chat from '@/components/Chat'
import Reminders from '@/components/Reminders'
import TabBar from '@/components/TabBar'
import CarSwitcher from '@/components/CarSwitcher'
import Stats from '@/components/Stats'
import Tutorial from '@/components/Tutorial'
import { useNotifications } from '@/hooks/useNotifications'

export default function Home() {
  const [cars, setCars, carsLoaded] = useLocalStorage('automind_cars', [])
  const [activeCarId, setActiveCarId, idLoaded] = useLocalStorage('automind_active_car', null)
  const [expenses, setExpenses, expLoaded] = useLocalStorage('automind_expenses', [])
  const [reminders, setReminders, remLoaded] = useLocalStorage('automind_reminders', [])
  const [tutorialDone, setTutorialDone, tutLoaded] = useLocalStorage('automind_tutorial_done', false)
  const [tab, setTab] = useState('dashboard')
  const [showCarSwitcher, setShowCarSwitcher] = useState(false)
  const { permission: notifPermission, supported: notifSupported, requestPermission: requestNotifPermission, sendTestNotification: sendTestNotif } = useNotifications()

  if (!carsLoaded || !idLoaded || !expLoaded || !remLoaded || !tutLoaded) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center animate-pulse">
          <div className="w-3 h-3 bg-gold rounded-full" />
        </div>
      </div>
    )
  }

  // Migration: old single-car format → multi-car
  if (cars.length === 0) {
    try {
      const oldCar = localStorage.getItem('automind_car')
      if (oldCar) {
        const parsed = JSON.parse(oldCar)
        if (parsed && parsed.brand) {
          const id = parsed.id || Date.now().toString(36)
          const migrated = { ...parsed, id }
          setCars([migrated])
          setActiveCarId(id)
          // Migrate expenses — add carId
          const oldExp = JSON.parse(localStorage.getItem('automind_expenses') || '[]')
          setExpenses(oldExp.map((e) => ({ ...e, carId: id })))
          const oldRem = JSON.parse(localStorage.getItem('automind_reminders') || '[]')
          setReminders(oldRem.map((r) => ({ ...r, carId: id })))
          // Clean old keys
          localStorage.removeItem('automind_car')
          return null // will re-render with migrated data
        }
      }
    } catch {}
  }

  // Tutorial for first-time users
  if (!tutorialDone && cars.length === 0) {
    return <Tutorial onComplete={() => setTutorialDone(true)} />
  }

  // No cars → Onboarding
  if (cars.length === 0) {
    return (
      <Onboarding
        onComplete={(newCar) => {
          setCars([newCar])
          setActiveCarId(newCar.id)
        }}
      />
    )
  }

  const activeCar = cars.find((c) => c.id === activeCarId) || cars[0]
  const carExpenses = expenses.filter((e) => e.carId === activeCar.id)
  const carReminders = reminders.filter((r) => r.carId === activeCar.id)
  const currency = activeCar.currency || 'RUB'

  const handleAddExpense = (expense) => {
    const exp = { ...expense, carId: activeCar.id }
    setExpenses((prev) => [...prev, exp])
    if (exp.mileage && (!activeCar.mileage || exp.mileage > Number(activeCar.mileage))) {
      setCars((prev) => prev.map((c) => c.id === activeCar.id ? { ...c, mileage: String(exp.mileage) } : c))
    }
  }

  const handleDeleteExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  const handleEditExpense = (updated) => {
    setExpenses((prev) => prev.map((e) => e.id === updated.id ? { ...updated, carId: activeCar.id } : e))
    if (updated.mileage && (!activeCar.mileage || updated.mileage > Number(activeCar.mileage))) {
      setCars((prev) => prev.map((c) => c.id === activeCar.id ? { ...c, mileage: String(updated.mileage) } : c))
    }
  }

  const handleUpdateCar = (updated) => {
    setCars((prev) => prev.map((c) => c.id === updated.id ? updated : c))
  }

  const handleDeleteCar = (carId) => {
    setCars((prev) => prev.filter((c) => c.id !== carId))
    setExpenses((prev) => prev.filter((e) => e.carId !== carId))
    setReminders((prev) => prev.filter((r) => r.carId !== carId))
    const remaining = cars.filter((c) => c.id !== carId)
    if (remaining.length > 0) {
      setActiveCarId(remaining[0].id)
    } else {
      setActiveCarId(null)
    }
    setTab('dashboard')
  }

  const handleAddCar = (newCar) => {
    setCars((prev) => [...prev, newCar])
    setActiveCarId(newCar.id)
    setShowCarSwitcher(false)
    setTab('dashboard')
  }

  const handleCompleteReminder = (id) => {
    setReminders((prev) => prev.map((r) =>
      r.id === id ? { ...r, lastDate: new Date().toISOString(), lastMileage: activeCar.mileage ? Number(activeCar.mileage) : r.lastMileage } : r
    ))
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {tab === 'dashboard' && (
          <Dashboard car={activeCar} cars={cars} expenses={carExpenses} currency={currency}
            onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense} onOpenProfile={() => setTab('profile')}
            onOpenStats={() => setTab('stats')}
            onSwitchCar={() => setShowCarSwitcher(true)} />
        )}
        {tab === 'stats' && (
          <Stats car={activeCar} expenses={carExpenses} currency={currency} />
        )}
        {tab === 'chat' && (
          <Chat car={activeCar} expenses={carExpenses} currency={currency} onAddExpense={handleAddExpense} />
        )}
        {tab === 'reminders' && (
          <Reminders car={activeCar} reminders={carReminders}
            onAdd={(r) => setReminders((prev) => [...prev, { ...r, carId: activeCar.id }])}
            onComplete={handleCompleteReminder}
            onDelete={(id) => setReminders((prev) => prev.filter((r) => r.id !== id))}
            notifSupported={notifSupported} notifPermission={notifPermission}
            requestNotifPermission={requestNotifPermission} sendTestNotif={sendTestNotif} />
        )}
        {tab === 'profile' && (
          <CarProfile car={activeCar} expenses={carExpenses} currency={currency}
            onUpdateCar={handleUpdateCar}
            onDeleteCar={() => {
              if (window.confirm(`Удалить ${activeCar.brand} ${activeCar.model} и все данные?`)) {
                handleDeleteCar(activeCar.id)
              }
            }} />
        )}
      </div>
      <TabBar active={tab} onChange={setTab} />

      {showCarSwitcher && (
        <CarSwitcher
          cars={cars}
          activeCarId={activeCar.id}
          onSelect={(id) => { setActiveCarId(id); setShowCarSwitcher(false); setTab('dashboard') }}
          onAddCar={handleAddCar}
          onClose={() => setShowCarSwitcher(false)}
        />
      )}
    </div>
  )
}
