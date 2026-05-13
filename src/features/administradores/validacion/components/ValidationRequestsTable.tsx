import { Circle, Clock3, Eye, UserCircle2 } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../../config/iconConfig'
import type { ValidationRequest } from '../types/validation.types'

type ValidationRequestsTableProps = {
  rows: ValidationRequest[]
  onView: (row: ValidationRequest) => void
}

function ValidationRequestsTable({ rows, onView }: ValidationRequestsTableProps) {
  return (
    <section className="validation-table-wrap" aria-label="Solicitudes de validación">
      <table className="validation-table">
        <thead>
          <tr>
            <th>Solicitante</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th aria-label="Ver detalle" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="validation-person">
                  <span className="validation-avatar">
                    <UserCircle2 size={26} strokeWidth={APP_ICON_STROKE_WIDTH} />
                  </span>
                  <span>
                    <strong>{row.fullName}</strong>
                    <small>{row.profile}</small>
                  </span>
                </div>
              </td>
              <td>
                <span className={`validation-type-pill ${row.type === 'Empresa' ? 'is-company' : 'is-grad'}`}>
                  {row.type}
                </span>
              </td>
              <td>
                <div className="validation-date">
                  <Clock3 size={14} strokeWidth={APP_ICON_STROKE_WIDTH} />
                  <span>{row.submittedAgo}</span>
                </div>
              </td>
              <td>
                <span className="validation-state-pill">
                  <Circle size={8} fill="currentColor" strokeWidth={0} />
                  {row.state}
                </span>
              </td>
              <td>
                <button type="button" className="validation-view-action" onClick={() => onView(row)}>
                  <Eye size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
                  <span>Ver</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="validation-pagination">
        <span>Página 1</span>
        <div>
          <button type="button" aria-label="Página anterior">
            ‹
          </button>
          <button type="button" aria-label="Página siguiente">
            ›
          </button>
        </div>
      </footer>
    </section>
  )
}

export default ValidationRequestsTable