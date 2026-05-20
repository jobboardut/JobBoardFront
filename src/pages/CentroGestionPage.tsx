import { useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'
import ManagementDetailModal from '../features/administradores/components/ManagementDetailModal'
import ManagementStats from '../features/administradores/components/ManagementStats'
import ManagementToolbar from '../features/administradores/components/ManagementToolbar'
import ManagementUsersTable from '../features/administradores/components/ManagementUsersTable'
import useManagementOverview from '../features/administradores/hooks/useManagementOverview'
import type { ManagementUser } from '../features/administradores/types/management.types'

function CentroGestionPage() {
  const { metrics, users } = useManagementOverview()
  const [selectedUser, setSelectedUser] = useState<ManagementUser | null>(null)

  return (
    <div className="app-shell">
      <AdminSidebar activeItem="management" />

      <main className="content" id="gestion">
        <header className="management-header">
          <h1>Centro de Gestión</h1>
          <p>Gestiona los usuarios dentro del sistema y supervisa su estado de acceso.</p>
        </header>

        <ManagementStats metrics={metrics} />
        <ManagementToolbar />
        <ManagementUsersTable rows={users} onView={setSelectedUser} />
      </main>

      <ManagementDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  )
}

export default CentroGestionPage