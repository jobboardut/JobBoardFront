import type { Metric } from '../types/dashboard.types'

interface MetricsGridProps {
  metrics: Metric[]
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <article
            key={metric.label}
            className="flex items-center gap-4 rounded-2xl border border-[#e6e0d7] bg-white p-5 shadow-[0_5px_18px_rgba(29,37,56,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(29,37,56,0.12)]"
          >
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#009A4D] text-white">
              <Icon size={24} strokeWidth={1.9} />
            </div>
            <div>
              <p className="text-base text-slate-500">{metric.label}</p>
              <p className="text-4xl leading-none font-bold">{metric.value}</p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
