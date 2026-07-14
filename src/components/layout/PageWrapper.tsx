import type { ReactNode } from 'react'
import { Sidebar, type SidebarAccount } from './Sidebar'
import type { UserRole } from '@/features/auth/types/auth.types'

interface PageWrapperProps {
  children: ReactNode
  role: UserRole
  account?: SidebarAccount
}

export const PageWrapper = ({ children, role, account }: PageWrapperProps) => {
  return (
    // La clase role-* define el acento visual de cada apartado (colores y animaciones).
    <div className={`app-shell feature-shell role-${role.toLowerCase()}`}>
      <Sidebar role={role} account={account} />
      <main className="content feature-content">{children}</main>
    </div>
  )
}
