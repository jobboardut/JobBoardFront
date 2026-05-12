import { ArrowRight, CalendarDays } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { TrackingRow } from '../types/tracking.types'

type TrackingListProps = {
  rows: TrackingRow[]
}

function getStatusClass(status: TrackingRow['status']): string {
  if (status === 'Entrevista') {
    return 'is-orange'
  }

  if (status === 'Pendiente') {
    return 'is-gray'
  }

  if (status === 'Rechazado') {
    return 'is-red'
  }

  if (status === 'Aceptado') {
    return 'is-green'
  }

  return 'is-blue'
}

function getFlowConfig(status: TrackingRow['status']): { activeSteps: number; tone: string } {
  if (status === 'Pendiente') {
    return { activeSteps: 1, tone: 'is-yellow' }
  }

  if (status === 'En revisión') {
    return { activeSteps: 3, tone: 'is-orange' }
  }

  if (status === 'Entrevista') {
    return { activeSteps: 4, tone: 'is-blue' }
  }

  if (status === 'Aceptado') {
    return { activeSteps: 6, tone: 'is-green' }
  }

  return { activeSteps: 6, tone: 'is-red' }
}

function TrackingList({ rows }: TrackingListProps) {
  return (
    <section className="tracking-list-wrap" aria-label="Listado de seguimiento">
      <div className="tracking-list">
        {rows.map((row) => (
          <article key={row.id} className="tracking-row-card">
            {(() => {
              const flow = getFlowConfig(row.status)

              return (
                <div className="tracking-flow-map" aria-label={`Progreso del proceso para ${row.candidateName}`}>
                  {Array.from({ length: 6 }).map((_, index) => {
                    const isActive = index < flow.activeSteps
                    const isLast = index === 5

                    return (
                      <div key={`${row.id}-flow-${index}`} className="tracking-flow-step">
                        <span className={`tracking-flow-dot ${flow.tone} ${isActive ? 'is-active' : ''}`} />
                        {!isLast ? <span className={`tracking-flow-line ${flow.tone} ${index + 1 < flow.activeSteps ? 'is-active' : ''}`} /> : null}
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            <div className="tracking-row-main">
              <section className="tracking-person-col">
                <header>
                  <span className="tracking-avatar person">{row.candidateLetter}</span>
                  <div>
                    <strong>{row.candidateName}</strong>
                    <p>{row.candidateCareer}</p>
                  </div>
                </header>
              </section>

              <span className="tracking-arrow">
                <ArrowRight size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
              </span>

              <section className="tracking-vacancy-col">
                <header>
                  <span className="tracking-avatar vacancy">{row.vacancyLetter}</span>
                  <div>
                    <strong>{row.vacancyTitle}</strong>
                    <p>{row.companyName}</p>
                  </div>
                </header>
              </section>

              <span className={`tracking-status-pill ${getStatusClass(row.status)}`}>{row.status}</span>
            </div>

            <footer className="tracking-row-footer">
              <p>
                <CalendarDays size={14} strokeWidth={APP_ICON_STROKE_WIDTH} />
                {row.date}
              </p>
            </footer>
          </article>
        ))}
      </div>

      <footer className="tracking-pagination">
        <span>Mostrando 4 postulaciones</span>
        <div>
          <button type="button" aria-label="Anterior">
            {'<'}
          </button>
          <button type="button" className="is-current" aria-current="page">
            1
          </button>
          <button type="button" aria-label="Siguiente">
            {'>'}
          </button>
        </div>
      </footer>
    </section>
  )
}

export default TrackingList
