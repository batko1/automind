// ── Car database ─────────────────────────────────────────────────
export const CAR_BRANDS = [
  { name: 'BMW', logo: '🇩🇪', models: ['M340i', '320d', '330i', '520d', '530i', '540i', 'X3', 'X5', 'X7', 'M3', 'M5'] },
  { name: 'Mercedes-Benz', logo: '🇩🇪', models: ['C200', 'C300', 'E200', 'E300', 'S500', 'GLC', 'GLE', 'AMG C63', 'AMG GT'] },
  { name: 'Audi', logo: '🇩🇪', models: ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'RS6', 'RS3', 'e-tron'] },
  { name: 'Toyota', logo: '🇯🇵', models: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser 300', 'Land Cruiser Prado', 'Supra'] },
  { name: 'Volkswagen', logo: '🇩🇪', models: ['Golf', 'Polo', 'Tiguan', 'Touareg', 'Passat', 'ID.4'] },
  { name: 'Kia', logo: '🇰🇷', models: ['K5', 'Ceed', 'Sportage', 'Sorento', 'Stinger', 'EV6'] },
  { name: 'Hyundai', logo: '🇰🇷', models: ['Solaris', 'Tucson', 'Santa Fe', 'Sonata', 'Elantra', 'Ioniq 5'] },
  { name: 'Porsche', logo: '🇩🇪', models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'] },
  { name: 'Lexus', logo: '🇯🇵', models: ['IS', 'ES', 'RX', 'NX', 'LX', 'LC'] },
  { name: 'Honda', logo: '🇯🇵', models: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot'] },
]

// ── Expense categories ───────────────────────────────────────────
export const CATEGORIES = {
  fuel: { label: 'Топливо', icon: '⛽', color: '#F97316' },
  service: { label: 'ТО / Ремонт', icon: '🔧', color: '#8B5CF6' },
  wash: { label: 'Мойка', icon: '🫧', color: '#06B6D4' },
  parking: { label: 'Парковка', icon: '🅿️', color: '#6366F1' },
  insurance: { label: 'Страховка', icon: '🛡️', color: '#10B981' },
  tires: { label: 'Шины', icon: '🛞', color: '#EAB308' },
  other: { label: 'Другое', icon: '📦', color: '#64748B' },
}

// ── Currencies ───────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'RUB', symbol: '₽', label: 'Рубль' },
  { code: 'USD', symbol: '$', label: 'Доллар' },
  { code: 'EUR', symbol: '€', label: 'Евро' },
  { code: 'GBP', symbol: '£', label: 'Фунт' },
  { code: 'AED', symbol: 'د.إ', label: 'Дирхам' },
  { code: 'VND', symbol: '₫', label: 'Донг' },
]

// ── Formatters ───────────────────────────────────────────────────
export const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n)

export const fmtCurrency = (n, currency = 'RUB') => {
  try {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency', currency, maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `${fmt(n)} ${currency}`
  }
}

export const fmtDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })

export const fmtDateFull = (dateStr) =>
  new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export const getMonthName = (i) =>
  ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][i]

export const defaultCar = {
  id: '', brand: '', model: '', year: '', mileage: '', engine: '',
  vin: '', fuelType: 'petrol', createdAt: '',
}
