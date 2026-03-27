'use client'
import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// Convert camelCase to snake_case for DB
const toSnake = (obj) => {
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    const sk = k.replace(/([A-Z])/g, '_$1').toLowerCase()
    result[sk] = v
  }
  return result
}

// Convert snake_case to camelCase for frontend
const toCamel = (obj) => {
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    const ck = k.replace(/_([a-z])/g, (_, l) => l.toUpperCase())
    result[ck] = v
  }
  return result
}

export function useCloudSync(userId) {
  const [syncing, setSyncing] = useState(false)

  // ── Cars ────────────────────────────────────────────────────
  const fetchCars = useCallback(async () => {
    if (!userId) return []
    const { data, error } = await supabase.from('cars').select('*').eq('user_id', userId).order('created_at')
    if (error) { console.error('fetchCars:', error); return [] }
    return data.map(toCamel)
  }, [userId])

  const upsertCar = useCallback(async (car) => {
    if (!userId) return
    const row = { ...toSnake(car), user_id: userId, updated_at: new Date().toISOString() }
    delete row.custom_intervals
    if (car.customIntervals) row.custom_intervals = car.customIntervals
    const { error } = await supabase.from('cars').upsert(row, { onConflict: 'id' })
    if (error) console.error('upsertCar:', error)
  }, [userId])

  const deleteCar = useCallback(async (carId) => {
    if (!userId) return
    await supabase.from('expenses').delete().eq('car_id', carId)
    await supabase.from('service_records').delete().eq('car_id', carId)
    await supabase.from('reminders').delete().eq('car_id', carId)
    await supabase.from('cars').delete().eq('id', carId)
  }, [userId])

  // ── Expenses ────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    if (!userId) return []
    const { data, error } = await supabase.from('expenses').select('*').eq('user_id', userId).order('date', { ascending: false })
    if (error) { console.error('fetchExpenses:', error); return [] }
    return data.map((e) => ({ ...toCamel(e), carId: e.car_id }))
  }, [userId])

  const upsertExpense = useCallback(async (expense) => {
    if (!userId) return
    const row = { id: expense.id, car_id: expense.carId, user_id: userId, category: expense.category, amount: expense.amount, description: expense.description, liters: expense.liters, mileage: expense.mileage, notes: expense.notes, date: expense.date }
    const { error } = await supabase.from('expenses').upsert(row, { onConflict: 'id' })
    if (error) console.error('upsertExpense:', error)
  }, [userId])

  const deleteExpense = useCallback(async (id) => {
    if (!userId) return
    await supabase.from('expenses').delete().eq('id', id)
  }, [userId])

  // ── Service Records ─────────────────────────────────────────
  const fetchServiceRecords = useCallback(async () => {
    if (!userId) return []
    const { data, error } = await supabase.from('service_records').select('*').eq('user_id', userId).order('date', { ascending: false })
    if (error) { console.error('fetchServiceRecords:', error); return [] }
    return data.map((r) => ({ ...toCamel(r), carId: r.car_id }))
  }, [userId])

  const upsertServiceRecord = useCallback(async (record) => {
    if (!userId) return
    const row = { id: record.id, car_id: record.carId, user_id: userId, type: record.type, description: record.description, icon: record.icon, date: record.date, mileage: record.mileage, cost: record.cost, notes: record.notes }
    const { error } = await supabase.from('service_records').upsert(row, { onConflict: 'id' })
    if (error) console.error('upsertServiceRecord:', error)
  }, [userId])

  const deleteServiceRecord = useCallback(async (id) => {
    if (!userId) return
    await supabase.from('service_records').delete().eq('id', id)
  }, [userId])

  // ── Reminders ───────────────────────────────────────────────
  const fetchReminders = useCallback(async () => {
    if (!userId) return []
    const { data, error } = await supabase.from('reminders').select('*').eq('user_id', userId)
    if (error) { console.error('fetchReminders:', error); return [] }
    return data.map((r) => ({ ...toCamel(r), carId: r.car_id }))
  }, [userId])

  const upsertReminder = useCallback(async (reminder) => {
    if (!userId) return
    const row = { id: reminder.id, car_id: reminder.carId, user_id: userId, type: reminder.type, label: reminder.label, icon: reminder.icon, last_date: reminder.lastDate, last_mileage: reminder.lastMileage, interval_km: reminder.intervalKm, interval_days: reminder.intervalDays, push_date: reminder.pushDate, push_sent: reminder.pushSent || false }
    const { error } = await supabase.from('reminders').upsert(row, { onConflict: 'id' })
    if (error) console.error('upsertReminder:', error)
  }, [userId])

  const deleteReminder = useCallback(async (id) => {
    if (!userId) return
    await supabase.from('reminders').delete().eq('id', id)
  }, [userId])

  // ── Full sync (download from cloud) ─────────────────────────
  const pullAll = useCallback(async () => {
    setSyncing(true)
    try {
      const [cars, expenses, serviceRecords, reminders] = await Promise.all([
        fetchCars(), fetchExpenses(), fetchServiceRecords(), fetchReminders(),
      ])
      return { cars, expenses, serviceRecords, reminders }
    } finally {
      setSyncing(false)
    }
  }, [fetchCars, fetchExpenses, fetchServiceRecords, fetchReminders])

  // ── Migrate localStorage to cloud ───────────────────────────
  const migrateFromLocal = useCallback(async (cars, expenses, serviceRecords, reminders) => {
    setSyncing(true)
    try {
      for (const car of cars) await upsertCar(car)
      for (const exp of expenses) await upsertExpense(exp)
      for (const rec of serviceRecords) await upsertServiceRecord(rec)
      for (const rem of reminders) await upsertReminder(rem)
    } finally {
      setSyncing(false)
    }
  }, [upsertCar, upsertExpense, upsertServiceRecord, upsertReminder])

  return {
    syncing, pullAll, migrateFromLocal,
    fetchCars, upsertCar, deleteCar,
    fetchExpenses, upsertExpense, deleteExpense,
    fetchServiceRecords, upsertServiceRecord, deleteServiceRecord,
    fetchReminders, upsertReminder, deleteReminder,
  }
}
