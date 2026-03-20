import './globals.css'

export const metadata = {
  title: 'AutoMind — интеллектуальный ассистент для вашего авто',
  description: 'Контроль расходов, аналитика, напоминания о ТО',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AutoMind',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <div id="app-root" className="w-full h-full max-w-[430px] mx-auto relative">
          {children}
        </div>
      </body>
    </html>
  )
}
