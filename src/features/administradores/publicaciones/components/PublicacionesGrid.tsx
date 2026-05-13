import { CalendarDays, Eye, MapPin, Users } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../../config/iconConfig'
import type { Publication } from '../types/publicaciones.types'

type PublicationsGridProps = {
  rows: Publication[]
  onSelect: (publication: Publication) => void
}

function PublicacionesGrid({ rows, onSelect }: PublicationsGridProps) {
  return (
    <section className="publications-wrap" aria-label="Listado de publicaciones">
      <div className="publications-grid">
        {rows.map((publication) => (
          // Toda la card es clickeable para abrir el detalle.
          <button
            key={publication.id}
            type="button"
            className={`publication-card ${publication.status === 'Pausado' ? 'is-paused-card' : ''}`}
            onClick={() => onSelect(publication)}
          >
            <header className="publication-card-head">
              <div className="publication-title-wrap">
                <span className="publication-avatar">{publication.badgeLetter}</span>
                <div>
                  <h3>{publication.title}</h3>
                  <p>{publication.company}</p>
                </div>
              </div>

              <span className="publication-more" aria-hidden="true">
                <Eye size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
              </span>
            </header>

            <div className="publication-meta-pills">
              <span className={`publication-status-pill ${publication.status === 'Activo' ? 'is-active' : 'is-paused'}`}>
                {publication.status}
              </span>
              <span>{publication.modality}</span>
              <span>{publication.workday}</span>
            </div>

            <ul className="publication-details">
              <li>
                <MapPin size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
                {publication.location}
              </li>
              <li>
                <span className="currency">$</span>
                {publication.salary}
              </li>
              <li>
                <CalendarDays size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
                {publication.date}
              </li>
            </ul>

            <footer className="publication-card-footer">
              <Users size={14} strokeWidth={APP_ICON_STROKE_WIDTH} />
              {publication.applicants} postulantes
            </footer>
          </button>
        ))}
      </div>

      <footer className="publications-footer">
        <span>Mostrando {rows.length} publicaciones</span>
        <div className="publications-pagination">
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

export default PublicacionesGrid
