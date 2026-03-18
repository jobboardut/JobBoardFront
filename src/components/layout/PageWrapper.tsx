import { Sidebar } from './Sidebar'
import type { UserRole } from '@/types/auth.types'

interface PageWrapperProps {
  children: React.ReactNode
  role: UserRole
}

export const PageWrapper = ({ children, role }: PageWrapperProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar izquierdo */}
      <Sidebar role={role} />

      {/* Contenido de la página */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  )
}