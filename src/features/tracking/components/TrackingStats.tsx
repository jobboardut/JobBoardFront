import { STATS_ICON_SIZE, STATS_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { TrackingMetric } from '../types/tracking.types'

type TrackingStatsProps = {
  metrics: TrackingMetric[]
}

function TrackingStats({ metrics }: TrackingStatsProps) {
  return (
    <section className="tracking-stats" aria-label="Resumen de seguimiento">
      {metrics.map((metric) => (
        <article key={metric.label} className="tracking-stat-card">
          <span className={`tracking-stat-icon tone-${metric.tone}`}>
            <metric.Icon size={STATS_ICON_SIZE} strokeWidth={STATS_ICON_STROKE_WIDTH} />
          </span>
          <div>
            <strong>{metric.value}</strong>
            <p>{metric.label}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

export default TrackingStats
