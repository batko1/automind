import AuthWrapper from '@/components/AuthWrapper'

export default function AppLayout({ children }) {
  return (
    <AuthWrapper>
      <div className="max-w-[430px] mx-auto relative" style={{ height: '100%' }}>
        {children}
      </div>
    </AuthWrapper>
  )
}
