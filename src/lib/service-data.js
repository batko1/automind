// ── Engine-specific service templates ────────────────────────────
export const ENGINE_TEMPLATES = {
  // BMW
  'B58': {
    name: 'BMW B58 3.0 Twin-Turbo',
    oil: { liters: 6.5, type: '0W-20 или 5W-30 LL-01', interval_km: 10000 },
    filters: ['Масляный фильтр', 'Воздушный фильтр', 'Салонный фильтр'],
    spark_plugs: { interval_km: 60000, count: 6 },
    coolant: { liters: 8.5, interval_km: 60000 },
    transmission: { type: 'ZF 8HP', interval_km: 60000 },
    brake_fluid: { interval_km: 40000 },
  },
  'B48': {
    name: 'BMW B48 2.0 Turbo',
    oil: { liters: 5.0, type: '0W-20 или 5W-30 LL-01', interval_km: 10000 },
    filters: ['Масляный фильтр', 'Воздушный фильтр', 'Салонный фильтр'],
    spark_plugs: { interval_km: 60000, count: 4 },
    coolant: { liters: 7.0, interval_km: 60000 },
    transmission: { type: 'ZF 8HP', interval_km: 60000 },
    brake_fluid: { interval_km: 40000 },
  },
  'N55': {
    name: 'BMW N55 3.0 Twin-Scroll Turbo',
    oil: { liters: 6.5, type: '5W-30 LL-01', interval_km: 10000 },
    filters: ['Масляный фильтр', 'Воздушный фильтр', 'Салонный фильтр'],
    spark_plugs: { interval_km: 60000, count: 6 },
    coolant: { liters: 8.5, interval_km: 60000 },
    transmission: { type: 'ZF 8HP', interval_km: 60000 },
    brake_fluid: { interval_km: 40000 },
  },
  'S58': {
    name: 'BMW S58 3.0 Twin-Turbo (M)',
    oil: { liters: 7.5, type: '0W-30 или 5W-30 M', interval_km: 8000 },
    filters: ['Масляный фильтр', 'Воздушный фильтр', 'Салонный фильтр'],
    spark_plugs: { interval_km: 45000, count: 6 },
    coolant: { liters: 9.0, interval_km: 50000 },
    transmission: { type: 'ZF 8HP', interval_km: 50000 },
    brake_fluid: { interval_km: 30000 },
  },
  // Mercedes
  'M256': {
    name: 'Mercedes M256 3.0 Turbo',
    oil: { liters: 8.5, type: '0W-20 MB 229.71', interval_km: 15000 },
    filters: ['Масляный фильтр', 'Воздушный фильтр', 'Салонный фильтр'],
    spark_plugs: { interval_km: 60000, count: 6 },
    coolant: { liters: 9.0, interval_km: 60000 },
    brake_fluid: { interval_km: 40000 },
  },
  'M264': {
    name: 'Mercedes M264 2.0 Turbo',
    oil: { liters: 5.5, type: '0W-20 MB 229.71', interval_km: 15000 },
    filters: ['Масляный фильтр', 'Воздушный фильтр', 'Салонный фильтр'],
    spark_plugs: { interval_km: 60000, count: 4 },
    coolant: { liters: 7.0, interval_km: 60000 },
    brake_fluid: { interval_km: 40000 },
  },
  // Generic petrol
  'generic_petrol': {
    name: 'Бензиновый двигатель',
    oil: { liters: 4.5, type: '5W-30 или 5W-40', interval_km: 10000 },
    filters: ['Масляный фильтр', 'Воздушный фильтр', 'Салонный фильтр'],
    spark_plugs: { interval_km: 60000, count: 4 },
    coolant: { liters: 7.0, interval_km: 60000 },
    brake_fluid: { interval_km: 40000 },
  },
  // Generic diesel
  'generic_diesel': {
    name: 'Дизельный двигатель',
    oil: { liters: 5.5, type: '5W-30 DPF', interval_km: 10000 },
    filters: ['Масляный фильтр', 'Воздушный фильтр', 'Салонный фильтр', 'Топливный фильтр'],
    spark_plugs: null,
    coolant: { liters: 8.0, interval_km: 60000 },
    brake_fluid: { interval_km: 40000 },
  },
}

// Match engine string to template
export function getEngineTemplate(engineStr, fuelType) {
  if (!engineStr) {
    return fuelType === 'diesel' ? ENGINE_TEMPLATES['generic_diesel'] : ENGINE_TEMPLATES['generic_petrol']
  }
  const upper = engineStr.toUpperCase()
  for (const [key, tmpl] of Object.entries(ENGINE_TEMPLATES)) {
    if (upper.includes(key.toUpperCase())) return tmpl
  }
  return fuelType === 'diesel' ? ENGINE_TEMPLATES['generic_diesel'] : ENGINE_TEMPLATES['generic_petrol']
}

// ── Standard TO checklist ────────────────────────────────────────
export const TO_CHECKLIST = {
  regular: {
    title: 'Регулярное ТО',
    interval: '10 000 — 15 000 км',
    items: [
      { id: 'oil', label: 'Замена моторного масла', icon: '🛢️', always: true },
      { id: 'oil_filter', label: 'Масляный фильтр', icon: '🔧', always: true },
      { id: 'air_filter', label: 'Воздушный фильтр', icon: '🌀', always: false },
      { id: 'cabin_filter', label: 'Салонный фильтр', icon: '🏠', always: false },
      { id: 'fuel_filter', label: 'Топливный фильтр (дизель)', icon: '⛽', diesel: true },
      { id: 'check_brakes', label: 'Проверка тормозов', icon: '🔴', always: true },
      { id: 'check_tires', label: 'Проверка шин', icon: '🛞', always: true },
      { id: 'check_lights', label: 'Проверка освещения', icon: '💡', always: true },
      { id: 'check_fluids', label: 'Проверка уровня жидкостей', icon: '💧', always: true },
    ],
  },
  major: {
    title: 'Большое ТО',
    interval: '60 000 км',
    items: [
      { id: 'spark_plugs', label: 'Замена свечей зажигания', icon: '⚡', petrol: true },
      { id: 'coolant', label: 'Замена антифриза', icon: '❄️', always: true },
      { id: 'brake_fluid', label: 'Замена тормозной жидкости', icon: '🔴', always: true },
      { id: 'transmission', label: 'Замена масла АКПП', icon: '⚙️', always: false },
      { id: 'drive_belt', label: 'Ремень привода / ГРМ', icon: '🔗', always: false },
      { id: 'power_steering', label: 'Жидкость ГУР', icon: '🎯', always: false },
    ],
  },
}
