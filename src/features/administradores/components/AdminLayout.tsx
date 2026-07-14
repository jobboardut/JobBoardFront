import type { ReactNode } from 'react'
import AdminSidebar from '@/components/layout/AdminSidebar'

type AdminLayoutProps = {
  children: ReactNode
  contentId: string
}

function AdminLayout({ children, contentId }: AdminLayoutProps) {
  return (
    <div className="app-shell admin-shell role-admin">
      <AdminSidebar />
      <main className="content admin-content" id={contentId}>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
