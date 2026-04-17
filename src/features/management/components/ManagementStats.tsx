import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { ManagementMetric } from '../types/management.types'

type ManagementStatsProps = {
  metrics: ManagementMetric[]
}

function ManagementStats({ metrics }: ManagementStatsProps) {
  return (
    <section className="management-stats" aria-label="Resumen de gestión">
      {metrics.map((metric) => (
        <article key={metric.label} className={`management-stat-card tone-${metric.tone}`}>
          <span className="management-stat-icon">
            <metric.Icon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
          </span>

          <div>
            <p className="management-stat-label">{metric.label}</p>
            <strong className="management-stat-value">{metric.value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}

export default ManagementStats