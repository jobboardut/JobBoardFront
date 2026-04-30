import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  tone: 'emerald' | 'orange'
  helper?: string
}

const toneStyles = {
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-500',
    ring: 'ring-emerald-100',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-500',
    ring: 'ring-orange-100',
  },
}

export const StatCard = ({ label, value, icon: Icon, tone, helper }: StatCardProps) => {
  const styles = toneStyles[tone]

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
          {helper && <p className="text-xs text-slate-400">{helper}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.bg} ${styles.ring} ring-1`}>
          <Icon size={22} className={styles.icon} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
