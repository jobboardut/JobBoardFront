import { CalendarDays, CircleOff, MapPin, Trash2, Users, X } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { Publication } from '../types/publications.types'

type PublicationDetailModalProps = {
  publication: Publication | null
  onClose: () => void
}

function PublicationDetailModal({ publication, onClose }: PublicationDetailModalProps) {
  if (!publication) {
    return null
  }

  const initial = publication.company.charAt(0).toUpperCase()

  return (
    <div className="publication-modal-overlay" role="presentation" onClick={onClose}>
      <article className="publication-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="publication-modal-close" aria-label="Cerrar" onClick={onClose}>
          <X size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
        </button>

        <header className="publication-modal-head">
          <span className="publication-modal-avatar">{initial}</span>
          <div>
            <h2>Detalles de la Vacante</h2>
            <div className="publication-modal-title-line">
              <strong>{publication.title}</strong>
              <span>{publication.company}</span>
            </div>
            <p className="publication-modal-location">
              <MapPin size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
              {publication.location}
            </p>
          </div>
        </header>

        <p className="publication-modal-posted">Hace 3 días</p>

        <section className="publication-modal-metrics">
          <article>
            <small>Rango de Salario</small>
            <strong>{publication.salary}</strong>
          </article>
          <article>
            <small>Turno y horario</small>
            <strong>Lunes a Viernes</strong>
          </article>
          <article>
            <small>Tipo de Trabajo</small>
            <strong>{publication.modality}</strong>
          </article>
          <article>
            <small>Experiencia</small>
            <strong>{publication.experience}</strong>
          </article>
        </section>

        <section className="publication-modal-description">
          <h3>Descripcion completa del empleo</h3>
          <p>{publication.description}</p>
        </section>

        <section className="publication-modal-description">
          <h3>Responsabilidades principales</h3>
          <ul>
            {publication.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <footer className="publication-modal-actions">
          <button type="button" className="btn-suspend-publication">
            <CircleOff size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            Suspender publicacion
          </button>
          <button type="button" className="btn-delete-publication">
            <Trash2 size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            Eliminar
          </button>
        </footer>
      </article>
    </div>
  )
}

export default PublicationDetailModal
