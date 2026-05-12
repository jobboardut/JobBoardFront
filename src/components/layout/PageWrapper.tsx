import { Sidebar } from './Sidebar'
import type { UserRole } from '@/features/auth/types/auth.types'

interface PageWrapperProps {
  children: React.ReactNode
  role: UserRole
}

export const PageWrapper = ({ children, role }: PageWrapperProps) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar role={role} />
      <main className="relative flex-1">{children}</main>
    </div>
  )
}
