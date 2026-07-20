import { CircleCheck, Clock, Eye, Undo2, XCircle } from 'lucide-react'

const statuses = [
  {
    status: 'POSTULADO',
    color: 'bg-[#EA580C]',
    lightBg: 'bg-[rgba(234,88,12,0.12)]',
    icon: Clock,
    description: 'Tu postulacion fue recibida y esta esperando revision de la empresa.',
  },
  {
    status: 'CV VISTO',
    color: 'bg-[#0EA5E9]',
    lightBg: 'bg-[rgba(14,165,233,0.12)]',
    icon: Eye,
    description: 'La empresa ya reviso tu CV y tu perfil. Espera su decision.',
  },
  {
    status: 'ENTREVISTA',
    color: 'bg-[#EAB308]',
    lightBg: 'bg-[rgba(234,179,8,0.14)]',
    icon: Clock,
    description: 'La empresa quiere avanzar contigo. Revisa tus medios de contacto para coordinar la entrevista.',
  },
  {
    status: 'CONTRATADO',
    color: 'bg-[#10B981]',
    lightBg: 'bg-[rgba(16,185,129,0.12)]',
    icon: CircleCheck,
    description: 'Felicidades, fuiste seleccionado para la vacante y tu contratación está confirmada.',
  },
  {
    status: 'RECHAZADO',
    color: 'bg-red-500',
    lightBg: 'bg-red-50',
    icon: XCircle,
    description: 'La empresa cerro tu proceso para esta vacante. Puedes seguir postulando a otras oportunidades.',
  },
  {
    status: 'RETIRADO',
    color: 'bg-slate-400',
    lightBg: 'bg-slate-50',
    icon: Undo2,
    description: 'Tu decidiste retirar esta postulacion y ya no participas en el proceso.',
  },
]

export const StatusSummary = () => {
  return (
    <div className="space-y-2">
      {statuses.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.status}
            className="rounded-xl border border-[#e6e0d7] bg-white p-3 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-lg p-1.5 ${item.color} shrink-0`}>
                <Icon size={18} className="text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">{item.status}</p>
                <p className="text-xs text-slate-600 mt-1 leading-snug">{item.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
