import { Clock, CircleCheck, AlertCircle, Eye, Undo2, XCircle } from 'lucide-react'

interface SeguimientoFilterPanelProps {
  selectedStatus?: string
  onStatusChange: (status: string | undefined) => void
}

const statuses = [
  {
    status: 'POSTULADO',
    color: 'text-[#EA580C]',
    bgColor: 'bg-[rgba(234,88,12,0.12)]',
    icon: AlertCircle,
  },
  {
    status: 'CV VISTO',
    color: 'text-[#0284C7]',
    bgColor: 'bg-[rgba(14,165,233,0.12)]',
    icon: Eye,
  },
  {
    status: 'ENTREVISTA',
    color: 'text-[#CA8A04]',
    bgColor: 'bg-[rgba(234,179,8,0.14)]',
    icon: Clock,
  },
  {
    status: 'CONTRATADO',
    color: 'text-[#10B981]',
    bgColor: 'bg-[rgba(16,185,129,0.12)]',
    icon: CircleCheck,
  },
  {
    status: 'RECHAZADO',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: XCircle,
  },
  {
    status: 'RETIRADO',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    icon: Undo2,
  },
]

export const SeguimientoFilterPanel = ({ selectedStatus, onStatusChange }: SeguimientoFilterPanelProps) => {
  return (
    <aside className="flex min-h-0 w-full flex-col gap-5 overflow-y-auto rounded-2xl border border-[#e6e0d7] bg-white p-5 xl:w-auto xl:min-w-70">
      <div>
        <h3 className="mb-4 font-semibold text-slate-900">Estado</h3>
        <div className="space-y-2">
          <button
            onClick={() => onStatusChange(undefined)}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition ${
              selectedStatus === undefined
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Ver todas
          </button>

          {statuses.map((item) => {
            const Icon = item.icon
            const isSelected = selectedStatus === item.status
            return (
              <button
                key={item.status}
                onClick={() => onStatusChange(isSelected ? undefined : item.status)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm transition ${
                  isSelected
                    ? `${item.bgColor} font-medium ${item.color}`
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                {item.status}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
