import { useMemo, useState } from 'react'
import { APP_ICONS } from '../config/iconConfig'
import AdminLayout from '../features/administradores/components/AdminLayout'
import AdminPageHeader from '../features/administradores/components/AdminPageHeader'
import AdminPageState from '../features/administradores/components/AdminPageState'
import ValidationDetailModal from '../features/administradores/components/ValidationDetailModal'
import ValidationRequestsTable from '../features/administradores/components/ValidationRequestsTable'
import ValidationStats from '../features/administradores/components/ValidationStats'
import ValidationToolbar from '../features/administradores/components/ValidationToolbar'
import useValidationOverview from '../features/administradores/hooks/useValidationOverview'
import { matchesAdminFilterGroup, matchesAdminSearch } from '../features/administradores/utils/filtering'
import { useAppToast } from '../shared/components/appToastContext'
import type { ValidationRequest } from '../features/administradores/types/validation.types'

function CentroValidacionPage() {
  const { metrics, requests, isLoading, isError, refetch, validateUser, isValidating } = useValidationOverview()
  const toast = useAppToast()
  const [selectedRequest, setSelectedRequest] = useState<ValidationRequest | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<string[]>([])

  const filteredRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          matchesAdminSearch(searchValue, [
            request.fullName,
            request.profile,
            request.type,
            request.contactEmail,
            request.contactPhone,
          ]) &&
          matchesAdminFilterGroup(filters, 'Estado', request.state) &&
          matchesAdminFilterGroup(filters, 'Tipo', request.type),
      ),
    [filters, requests, searchValue],
  )

  const handleValidate = async (
    request: ValidationRequest,
    accion: 'aprobar' | 'rechazar',
    observaciones?: string,
  ) => {
    try {
      await validateUser({ id: request.id, accion, observaciones })
      toast.success(
        accion === 'aprobar' ? 'Usuario aprobado' : 'Usuario rechazado',
        accion === 'rechazar'
          ? `${request.fullName} paso a rechazados con el motivo registrado.`
          : `${request.fullName} fue actualizado correctamente.`,
      )
      setSelectedRequest(null)
    } catch {
      toast.error('No se pudo validar', 'Intenta procesar la solicitud nuevamente.')
    }
  }

  return (
    <>
      <AdminLayout contentId="validacion">
        <AdminPageHeader
          eyebrow="Solicitudes"
          title="Centro de validacion"
          description="Revisa la evidencia y resuelve las solicitudes pendientes de aprobacion."
          Icon={APP_ICONS.validation}
        />

        {isLoading ? <AdminPageState type="loading" title="Cargando solicitudes" /> : null}
        {isError ? <AdminPageState type="error" onRetry={() => void refetch()} /> : null}

        {!isLoading && !isError ? (
          <>
            <ValidationStats metrics={metrics} />
            <ValidationToolbar
              searchValue={searchValue}
              filters={filters}
              resultCount={filteredRequests.length}
              onSearchChange={setSearchValue}
              onFiltersChange={setFilters}
            />
            <div className="admin-results-summary">
              <span>
                Mostrando <strong>{filteredRequests.length}</strong> de {requests.length} solicitudes
              </span>
              {filters.length > 0 ? <span>{filters.length} filtros activos</span> : null}
            </div>
            {filteredRequests.length > 0 ? (
              <ValidationRequestsTable rows={filteredRequests} onView={setSelectedRequest} />
            ) : (
              <AdminPageState
                type="empty"
                title="No hay solicitudes que coincidan"
                message="Cambia la busqueda o limpia los filtros para revisar otros registros."
              />
            )}
          </>
        ) : null}
      </AdminLayout>

      <ValidationDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onValidate={handleValidate}
        isValidating={isValidating}
      />
    </>
  )
}

export default CentroValidacionPage
