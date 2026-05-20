import { BriefcaseBusiness } from 'lucide-react'
import type { JobStatus } from '../../types/dashboard.types'

const statusPillClass: Record<JobStatus, string> = {
  'En revision': 'bg-[rgba(16,185,129,0.12)] text-[#059669]',
  'En progreso': 'bg-[rgba(16,185,129,0.12)] text-[#059669]',
  'Proceso finalizado': 'bg-[#009A4D] text-white',
}

interface ActivityCardProps {
  status: JobStatus
}

export const ActivityCard = ({ status }: ActivityCardProps) => {
  return (
    <article className="rounded-2xl border border-[#ece8e1] bg-white p-4 shadow-[0_2px_10px_rgba(26,37,59,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(26,37,59,0.10)]">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#009A4D] text-white">
          <BriefcaseBusiness size={22} strokeWidth={1.8} />
        </div>

        <div>
          <h4 className="text-xl leading-none font-semibold text-slate-900">Desarrollador Frontend</h4>
          <p className="mt-1 text-base text-slate-500">Google</p>
        </div>
      </div>

      <p className="mt-3 text-xl font-semibold text-[#059669]">$80k - $70k</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          <p>Remoto</p>
          <p>Semipresencial</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusPillClass[status]}`}>
          {status}
        </span>
      </div>
    </article>
  )
}
