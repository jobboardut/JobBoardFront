import { useState } from 'react'
import { AlertCircle, CheckCircle2, Clock3, Info, XCircle } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../config/iconConfig'
import AdminSidebar from '../components/layout/AdminSidebar'
import TrackingList from '../features/administradores/seguimiento/components/TrackingList'
import TrackingStats from '../features/administradores/seguimiento/components/TrackingStats'
import TrackingToolbar from '../features/administradores/seguimiento/components/TrackingToolbar'
import useTrackingOverview from '../features/administradores/seguimiento/hooks/useTrackingOverview'

const statusInfoItems = [
  {
    title: 'EN REVISION',
    description: 'Tu CV se encuentra en revision por parte de la empresa, revisa mas tarde para conocer su respuesta.',
    tone: 'is-orange',
    Icon: Clock3,
  },
  {
    title: 'ACEPTADO',
    description: 'Tu perfil cumple con los requisitos solicitados en la vacante, revisa tu correo, la empresa se comunica contigo.',
    tone: 'is-green',
    Icon: CheckCircle2,
  },
  {
    title: 'APRUEBA',
    description: 'Has aprobado el proceso de evaluacion inicial. Mantente atento a los siguientes pasos.',
    tone: 'is-green',
    Icon: CheckCircle2,
  },
  {
    title: 'CONTRATADO',
    description: 'Felicidades, fuiste seleccionado para la vacante y tu contratacion esta confirmada.',
    tone: 'is-green',
    Icon: CheckCircle2,
  },
  {
    title: 'RECHAZADO',
    description: 'Tu perfil no cumple con los requisitos solicitados, no te desanimes, intenta con otra vacante.',
    tone: 'is-red',
    Icon: XCircle,
  },
] as const

function SeguimientoPostulacionesPage() {
  const { metrics, rows } = useTrackingOverview()
  const [isStatusInfoOpen, setIsStatusInfoOpen] = useState(false)

  return (
    <div className="app-shell">
      <AdminSidebar activeItem="tracking" />

      <main className="content" id="tracking">
        <header className="tracking-header">
          <div>
            <h1>Seguimiento de Postulaciones</h1>
            <p>Monitorea el estado de las postulaciones de egresados</p>
          </div>

          <div className="tracking-status-help">
            <button
              type="button"
              className="tracking-info-button"
              onClick={() => setIsStatusInfoOpen((current) => !current)}
              aria-expanded={isStatusInfoOpen}
              aria-controls="tracking-status-info"
            >
              <Info size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
              Informacion de estados
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
                  Esta guia ayuda a interpretar cada fase del proceso.
                </footer>
              </section>
            ) : null}
          </div>
        </header>

        <TrackingStats metrics={metrics} />
        <TrackingToolbar />
        <TrackingList rows={rows} />
      </main>
    </div>
  )
}

export default SeguimientoPostulacionesPage
