import './globals.css'

export const metadata = {
  title: 'CarNote — AI-ассистент для автовладельцев',
  description: 'Учёт расходов на автомобиль с AI. Записывайте расходы текстом, сканируйте чеки, получайте аналитику и напоминания о ТО.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CarNote',
  },
  openGraph: {
    title: 'CarNote — AI-ассистент для автовладельцев',
    description: 'Учёт расходов на автомобиль с AI. Записывайте расходы текстом, сканируйте чеки, получайте аналитику.',
    type: 'website',
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
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('automind_theme');
            if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          } catch(e) {}
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
