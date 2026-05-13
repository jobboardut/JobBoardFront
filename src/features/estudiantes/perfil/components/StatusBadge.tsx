import { GraduationCap } from 'lucide-react'

interface StatusBadgeProps {
  status: string
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <div className="rounded-2xl border border-[#e6e0d7] bg-white p-8 shadow-[0_4px_15px_rgba(29,37,56,0.05)]">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-[rgba(234,88,12,0.12)] text-[#EA580C]">
          <GraduationCap size={28} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm text-slate-500">Tu estado actual</p>
          <p className="text-2xl font-bold text-slate-900">{status}</p>
        </div>
      </div>
    </div>
  )
}
