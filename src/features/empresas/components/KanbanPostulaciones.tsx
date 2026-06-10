import { UserRound } from 'lucide-react'
import type { Postulante } from '../types/empresa.types'
import { POSTULANTE_STATUS_FLOW } from '../utils/postulanteStatus'

interface KanbanPostulacionesProps {
  data: Record<string, Postulante[]>
}

export const KanbanPostulaciones = ({ data }: KanbanPostulacionesProps) => {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {POSTULANTE_STATUS_FLOW.map((status) => {
        const items = data[status.key] ?? []
        const Icon = status.Icon

        return (
        <div key={status.key} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className={`inline-flex items-center gap-2 text-sm font-semibold ${status.textClass}`}>
              <Icon size={16} />
              {status.label}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${status.pillClass}`}>
              {items.length}
            </span>
          </div>
          <p className="mb-4 min-h-10 text-xs leading-5 text-slate-500">{status.description}</p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <UserRound size={16} className="text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-800">{item.nombre}</p>
                </div>
                <p className="text-xs text-slate-400 mt-1">{item.descripcion || 'Sin descripcion adicional.'}</p>
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
