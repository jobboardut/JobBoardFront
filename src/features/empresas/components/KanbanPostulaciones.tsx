import { UserRound } from 'lucide-react'
import type { Postulante } from '../types/empresa.types'

interface KanbanPostulacionesProps {
  data: Record<string, Postulante[]>
}

const columnTone = {
  pendiente: 'bg-orange-50 border-orange-100 text-orange-500',
  revision: 'bg-emerald-50 border-emerald-100 text-emerald-500',
  entrevista: 'bg-orange-50 border-orange-100 text-orange-500',
  rechazado: 'bg-red-50 border-red-100 text-red-500',
}

export const KanbanPostulaciones = ({ data }: KanbanPostulacionesProps) => {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Object.entries(data).map(([column, items]) => (
        <div key={column} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800 capitalize">{column}</span>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${columnTone[column as keyof typeof columnTone] || 'border-slate-100 text-slate-500'}`}>
              {items.length}
            </span>
          </div>
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
          </div>
        </div>
      ))}
    </div>
  )
}

export default KanbanPostulaciones
