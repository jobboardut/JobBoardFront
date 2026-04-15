import { CircleCheck, Clock, XCircle } from 'lucide-react'

const statuses = [
  {
    status: 'EN REVISIÓN',
    color: 'bg-[#EAB308]',
    lightBg: 'bg-[rgba(234,179,8,0.14)]',
    icon: Clock,
    description: 'Tu CV se encuentra en revisión por parte de la empresa, revisa más tarde para conocer su respuesta',
  },
  {
    status: 'ACEPTADO',
    color: 'bg-[#009A4D]',
    lightBg: 'bg-[#009A4D]',
    icon: CircleCheck,
   
    description: 'Tu perfil cumple con los requisitados solicitados en la vacante, revisa tu correo, la empresa se comunica contigo',
  },
  {
    status: 'APRUEBA',
    color: 'bg-[#10B981]',
    lightBg: 'bg-[rgba(16,185,129,0.12)]',
    icon: CircleCheck,
    description: 'Has aprobado el proceso de evaluación inicial. Mantente atento a los siguientes pasos.',
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
    description: 'Tu perfil no cumple con los requisitos solicitados, no la desanimes, intenta con otra vacante',
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
