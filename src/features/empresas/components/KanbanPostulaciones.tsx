import { UserRound } from 'lucide-react'
import type { Postulante, PostulanteEstatus } from '../types/empresa.types'
import { COLUMNAS_BUZON, POSTULANTE_STATUS } from '../utils/postulanteStatus'

interface KanbanPostulacionesProps {
  data: Partial<Record<PostulanteEstatus, Postulante[]>>
}

/**
 * Tablero de solo lectura. Deliberadamente SIN drag & drop: arrastrar invita a
 * transiciones ilegales (p. ej. Rechazada → Entrevista) y el rechazo exige capturar
 * un motivo. Las transiciones se ejecutan con botones explícitos en el detalle.
 */
/** Desenlaces que no dependen de la empresa: solo ocupan columna si hay algo que mostrar. */
const COLUMNAS_EVENTUALES: PostulanteEstatus[] = ['Retirada', 'Cerrada']

export const KanbanPostulaciones = ({ data }: KanbanPostulacionesProps) => {
  const columnas = [
    ...COLUMNAS_BUZON,
    ...COLUMNAS_EVENTUALES.filter((estatus) => (data[estatus] ?? []).length > 0),
  ]

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {columnas.map((estatus) => {
        const meta = POSTULANTE_STATUS[estatus]
        const items = data[estatus] ?? []
        const Icon = meta.Icon

        return (
          <div key={estatus} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 text-sm font-semibold ${meta.textClass}`}>
                <Icon size={16} />
                {meta.label}
              </span>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${meta.pillClass}`}>
                {items.length}
              </span>
            </div>
            <p className="mb-4 min-h-10 text-xs leading-5 text-slate-500">{meta.description}</p>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.postulacionId} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <UserRound size={16} className="text-emerald-500" />
                    <p className="text-sm font-semibold text-slate-800">{item.nombre}</p>
                  </div>
                  {item.motivoRechazo ? (
                    <p className="mt-1 text-xs text-red-500">{item.motivoRechazo}</p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-400">{item.carrera || item.tipoUsuario}</p>
                  )}
                </div>
              ))}
              {!items.length ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-400">
                  Sin postulantes en esta etapa.
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KanbanPostulaciones
