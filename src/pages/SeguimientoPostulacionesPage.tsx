import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock3, Info, XCircle } from 'lucide-react'
import { APP_ICONS, APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../config/iconConfig'
import AdminLayout from '../features/administradores/components/AdminLayout'
import AdminPageHeader from '../features/administradores/components/AdminPageHeader'
import AdminPageState from '../features/administradores/components/AdminPageState'
import TrackingList from '../features/administradores/components/TrackingList'
import TrackingStats from '../features/administradores/components/TrackingStats'
import TrackingToolbar from '../features/administradores/components/TrackingToolbar'
import useTrackingOverview from '../features/administradores/hooks/useTrackingOverview'
import { matchesAdminFilterGroup, matchesAdminSearch } from '../features/administradores/utils/filtering'

const statusInfoItems = [
  {
    title: 'PENDIENTE',
    description: 'La postulacion fue registrada y aun no inicia la revision de la empresa.',
    tone: 'is-orange',
    Icon: Clock3,
  },
  {
    title: 'ENTREVISTA',
    description: 'El candidato avanzo a una etapa de contacto o entrevista con la empresa.',
    tone: 'is-green',
    Icon: CheckCircle2,
  },
  {
    title: 'APROBADO',
    description: 'La empresa aprobo al candidato para continuar con los pasos finales.',
    tone: 'is-green',
    Icon: CheckCircle2,
  },
  {
    title: 'CONTRATADO',
    description: 'La empresa marco que el candidato ya fue contratado para la vacante.',
    tone: 'is-green',
    Icon: CheckCircle2,
  },
  {
    title: 'RECHAZADO',
    description: 'La postulacion finalizo sin continuar a las siguientes etapas.',
    tone: 'is-red',
    Icon: XCircle,
  },
] as const

function SeguimientoPostulacionesPage() {
  const { metrics, rows, isLoading, isError, refetch } = useTrackingOverview()
  const [isStatusInfoOpen, setIsStatusInfoOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<string[]>([])

  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          matchesAdminSearch(searchValue, [
            row.candidateName,
            row.candidateCareer,
            row.vacancyTitle,
            row.companyName,
            row.status,
            row.email,
          ]) && matchesAdminFilterGroup(filters, 'Estado', row.status),
      ),
    [filters, rows, searchValue],
  )

  return (
    <AdminLayout contentId="tracking">
      <AdminPageHeader
        eyebrow="Procesos"
        title="Seguimiento de postulaciones"
        description="Monitorea el avance de candidatos y vacantes durante cada etapa del proceso."
        Icon={APP_ICONS.tracking}
        actions={
          <div className="tracking-status-help">
            <button
              type="button"
              className="admin-header-action tracking-info-button"
              onClick={() => setIsStatusInfoOpen((current) => !current)}
              aria-expanded={isStatusInfoOpen}
              aria-controls="tracking-status-info"
            >
              <Info size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
              Guia de estados
            </button>

            {isStatusInfoOpen ? (
              <section className="tracking-status-panel" id="tracking-status-info" role="dialog" aria-modal="false">
                {statusInfoItems.map((item) => (
                  <article key={item.title} className="tracking-status-info-card">
                    <span className={`tracking-status-info-icon ${item.tone}`}>
                      <item.Icon size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}

                <footer>
                  <AlertCircle size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
                  Guia de lectura para administradores.
                </footer>
              </section>
            ) : null}
          </div>
        }
      />

      {isLoading ? <AdminPageState type="loading" title="Cargando postulaciones" /> : null}
      {isError ? <AdminPageState type="error" onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError ? (
        <>
          <TrackingStats metrics={metrics} />
          <TrackingToolbar
            searchValue={searchValue}
            filters={filters}
            resultCount={filteredRows.length}
            onSearchChange={setSearchValue}
            onFiltersChange={setFilters}
          />
          <div className="admin-results-summary">
            <span>
              Mostrando <strong>{filteredRows.length}</strong> de {rows.length} postulaciones
            </span>
            {filters.length > 0 ? <span>{filters.length} filtros activos</span> : null}
          </div>
          {filteredRows.length > 0 ? (
            <TrackingList rows={filteredRows} />
          ) : (
            <AdminPageState
              type="empty"
              title="No encontramos postulaciones"
              message="Cambia la busqueda o limpia los filtros activos."
            />
          )}
        </>
      ) : null}
    </AdminLayout>
  )
}

export default SeguimientoPostulacionesPage
