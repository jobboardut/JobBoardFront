import { useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'
import ValidationDetailModal from '../features/validation/components/ValidationDetailModal'
import ValidationRequestsTable from '../features/validation/components/ValidationRequestsTable'
import ValidationStats from '../features/validation/components/ValidationStats'
import ValidationToolbar from '../features/validation/components/ValidationToolbar'
import useValidationOverview from '../features/validation/hooks/useValidationOverview'
import type { ValidationRequest } from '../features/validation/types/validation.types'

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