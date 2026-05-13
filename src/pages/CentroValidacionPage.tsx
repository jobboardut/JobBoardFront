import { useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'
import ValidationDetailModal from '../features/administradores/components/ValidationDetailModal'
import ValidationRequestsTable from '../features/administradores/components/ValidationRequestsTable'
import ValidationStats from '../features/administradores/components/ValidationStats'
import ValidationToolbar from '../features/administradores/components/ValidationToolbar'
import useValidationOverview from '../features/administradores/hooks/useValidationOverview'
import type { ValidationRequest } from '../features/administradores/types/validation.types'

function CentroValidacionPage() {
  const { metrics, requests } = useValidationOverview()
  const [selectedRequest, setSelectedRequest] = useState<ValidationRequest | null>(null)

  return (
    <div className="app-shell">
      <AdminSidebar activeItem="validation" />

      <main className="content" id="validacion">
        <header className="validation-header">
          <h1>Centro de Validación</h1>
          <p>Gestiona las solicitudes de registro pendientes de aprobación</p>
        </header>

        <ValidationStats metrics={metrics} />
        <ValidationToolbar />
        <ValidationRequestsTable rows={requests} onView={setSelectedRequest} />
      </main>

      <ValidationDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
    </div>
  )
}

export default CentroValidacionPage