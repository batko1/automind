'use client'
import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useAuth } from '@/hooks/useAuth'
import { useCloudSync } from '@/hooks/useCloudSync'
import AuthScreen from '@/components/AuthScreen'
import Onboarding from '@/components/Onboarding'
import Dashboard from '@/components/Dashboard'
import CarProfile from '@/components/CarProfile'
import Chat from '@/components/Chat'
import ServiceBook from '@/components/ServiceBook'
import TabBar from '@/components/TabBar'
import CarSwitcher from '@/components/CarSwitcher'
import Stats from '@/components/Stats'
import Tutorial from '@/components/Tutorial'
import Toast from '@/components/Toast'
import { CATEGORIES } from '@/lib/constants'
import { useNotifications } from '@/hooks/useNotifications'

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth()

  // ── Local storage ──────────────────────────────────────────
  const [cars, setCars, carsLoaded] = useLocalStorage('automind_cars', [])
  const [activeCarId, setActiveCarId, idLoaded] = useLocalStorage('automind_active_car', null)
  const [expenses, setExpenses, expLoaded] = useLocalStorage('automind_expenses', [])
  const [reminders, setReminders, remLoaded] = useLocalStorage('automind_reminders', [])
  const [serviceRecords, setServiceRecords, srvLoaded] = useLocalStorage('automind_service_records', [])
  const [tutorialDone, setTutorialDone, tutLoaded] = useLocalStorage('automind_tutorial_done', false)

  // ── UI state ───────────────────────────────────────────────
  const [tab, setTab] = useState('dashboard')
  const [showCarSwitcher, setShowCarSwitcher] = useState(false)
  const [toast, setToast] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  const { permission: notifPermission, supported: notifSupported, requestPermission: requestNotifPermission, sendTestNotification: sendTestNotif } = useNotifications()

  // ── Cloud sync ─────────────────────────────────────────────
  const cloud = useCloudSync(user?.id)
  const lastSyncedUserId = useRef(null)

  // Sync when user changes (login/logout)
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      lastSyncedUserId.current = null
      return
    }
    // Only sync once per user session
    if (lastSyncedUserId.current === user.id) return
    lastSyncedUserId.current = user.id

    const pull = async () => {
      try {
        const data = await cloud.pullAll()
        if (data.cars.length > 0) {
          setCars(data.cars)
          // Keep current car if it exists in cloud, otherwise pick first
          const currentExists = activeCarId && data.cars.some(c => c.id === activeCarId)
          if (!currentExists) setActiveCarId(data.cars[0].id)
          setExpenses(data.expenses)
          setReminders(data.reminders)
          setServiceRecords(data.serviceRecords)
        } else if (cars.length > 0) {
          await cloud.migrateFromLocal(cars, expenses, serviceRecords, reminders)
          setToast('Данные синхронизированы')
        }
      } catch (err) {
        console.error('Sync error:', err)
      }
    }
    pull()
  }, [user, authLoading])

  // ── Loading gate ───────────────────────────────────────────
  const storageReady = carsLoaded && idLoaded && expLoaded && remLoaded && srvLoaded && tutLoaded
  if (!storageReady || authLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center animate-pulse">
          <div className="w-3 h-3 bg-gold rounded-full" />
        </div>
      </div>
    )
  }

  // ── Auth screen ────────────────────────────────────────────
  if (showAuth) {
    return <AuthScreen onSkip={() => setShowAuth(false)} />
  }

  // ── Tutorial (first time ever) ─────────────────────────────
  if (!tutorialDone && cars.length === 0 && !user) {
    return <Tutorial onComplete={() => setTutorialDone(true)} />
  }

  // ── Onboarding (no cars) ───────────────────────────────────
  if (cars.length === 0) {
    return (
      <Onboarding
        onComplete={(newCar) => {
          setCars([newCar])
          setActiveCarId(newCar.id)
          if (user) cloud.upsertCar(newCar)
        }}
        onSignIn={() => setShowAuth(true)}
      />
    )
  }

  // ── Main app ───────────────────────────────────────────────
  const activeCar = cars.find((c) => c.id === activeCarId) || cars[0]
  const carExpenses = expenses.filter((e) => e.carId === activeCar.id)
  const carReminders = reminders.filter((r) => r.carId === activeCar.id)
  const carServiceRecords = serviceRecords.filter((r) => r.carId === activeCar.id)
  const currency = activeCar.currency || 'RUB'

  const requireAuth = () => {
    if (user) return true
    setShowAuth(true)
    return false
  }

  const handleAddExpense = (expense) => {
    const exp = { ...expense, carId: activeCar.id }
    setExpenses((prev) => [...prev, exp])
    if (user) cloud.upsertExpense(exp)
    if (exp.mileage && (!activeCar.mileage || exp.mileage > Number(activeCar.mileage))) {
      const updated = { ...activeCar, mileage: String(exp.mileage) }
      setCars((prev) => prev.map((c) => c.id === activeCar.id ? updated : c))
      if (user) cloud.upsertCar(updated)
    }
    setToast(`${CATEGORIES[exp.category]?.icon || '📦'} ${exp.description || 'Расход'} записан`)
  }

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    if (user) cloud.deleteExpense(id)
  }

  const handleEditExpense = (updated) => {
    setExpenses((prev) => prev.map((e) => e.id === updated.id ? { ...updated, carId: activeCar.id } : e))
    if (user) cloud.upsertExpense({ ...updated, carId: activeCar.id })
    if (updated.mileage && (!activeCar.mileage || updated.mileage > Number(activeCar.mileage))) {
      const updatedCar = { ...activeCar, mileage: String(updated.mileage) }
      setCars((prev) => prev.map((c) => c.id === activeCar.id ? updatedCar : c))
      if (user) cloud.upsertCar(updatedCar)
    }
  }

  const handleUpdateCar = (updated) => {
    setCars((prev) => prev.map((c) => c.id === updated.id ? updated : c))
    if (user) cloud.upsertCar(updated)
  }

  const handleDeleteCar = (carId) => {
    setCars((prev) => prev.filter((c) => c.id !== carId))
    setExpenses((prev) => prev.filter((e) => e.carId !== carId))
    setReminders((prev) => prev.filter((r) => r.carId !== carId))
    setServiceRecords((prev) => prev.filter((r) => r.carId !== carId))
    if (user) cloud.deleteCar(carId)
    const remaining = cars.filter((c) => c.id !== carId)
    setActiveCarId(remaining.length > 0 ? remaining[0].id : null)
    setTab('dashboard')
  }

  const handleAddCar = (newCar) => {
    setCars((prev) => [...prev, newCar])
    setActiveCarId(newCar.id)
    setShowCarSwitcher(false)
    setTab('dashboard')
    if (user) cloud.upsertCar(newCar)
  }

  const handleCompleteReminder = (id) => {
    setReminders((prev) => prev.map((r) => {
      if (r.id !== id) return r
      const updated = { ...r, lastDate: new Date().toISOString(), lastMileage: activeCar.mileage ? Number(activeCar.mileage) : r.lastMileage }
      if (user) cloud.upsertReminder(updated)
      return updated
    }))
  }

  const handleSignOut = () => {
    signOut()
    setCars([])
    setActiveCarId(null)
    setExpenses([])
    setReminders([])
    setServiceRecords([])
    lastSyncedUserId.current = null
    setTab('dashboard')
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {tab === 'dashboard' && (
          <Dashboard car={activeCar} cars={cars} expenses={carExpenses} currency={currency}
            onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense} onOpenProfile={() => setTab('profile')}
            onOpenStats={() => setTab('stats')}
            onSwitchCar={() => setShowCarSwitcher(true)}
            onRequireAuth={requireAuth} />
        )}
        {tab === 'stats' && (
          <Stats car={activeCar} expenses={carExpenses} currency={currency} />
        )}
        {tab === 'chat' && (
          <Chat car={activeCar} expenses={carExpenses} serviceRecords={carServiceRecords} reminders={carReminders} currency={currency} onAddExpense={handleAddExpense} onRequireAuth={requireAuth} />
        )}
        {tab === 'reminders' && (
          <ServiceBook car={activeCar}
            onUpdateCar={handleUpdateCar}
            serviceRecords={carServiceRecords}
            reminders={carReminders}
            onRequireAuth={requireAuth}
            onAddRecord={(r) => {
              const rec = { ...r, carId: activeCar.id }
              setServiceRecords((prev) => [...prev, rec])
              if (user) cloud.upsertServiceRecord(rec)
            }}
            onDeleteRecord={(id) => {
              setServiceRecords((prev) => prev.filter((r) => r.id !== id))
              if (user) cloud.deleteServiceRecord(id)
            }}
            onAddReminder={(r) => {
              const rem = { ...r, carId: activeCar.id }
              setReminders((prev) => [...prev, rem])
              if (user) cloud.upsertReminder(rem)
            }}
            onCompleteReminder={handleCompleteReminder}
            onDeleteReminder={(id) => {
              setReminders((prev) => prev.filter((r) => r.id !== id))
              if (user) cloud.deleteReminder(id)
            }}
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
            }}
            user={user}
            onSignIn={() => setShowAuth(true)}
            onSignOut={handleSignOut}
            syncing={cloud.syncing} />
        )}
      </div>
      <TabBar active={tab} onChange={setTab} />

      {showCarSwitcher && (
        <CarSwitcher cars={cars} activeCarId={activeCar.id}
          onSelect={(id) => { setActiveCarId(id); setShowCarSwitcher(false); setTab('dashboard') }}
          onAddCar={handleAddCar}
          onClose={() => setShowCarSwitcher(false)} />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
