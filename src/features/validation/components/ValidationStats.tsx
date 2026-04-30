import { STATS_ICON_SIZE, STATS_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { ValidationMetric } from '../types/validation.types'

type ValidationStatsProps = {
  metrics: ValidationMetric[]
}

function ValidationStats({ metrics }: ValidationStatsProps) {
  return (
    <section className="validation-stats" aria-label="Resumen de validación">
      {metrics.map((metric) => (
        <article key={metric.label} className="validation-stat-card">
          <div className={`validation-stat-icon tone-${metric.tone}`}>
            <metric.Icon size={STATS_ICON_SIZE} strokeWidth={STATS_ICON_STROKE_WIDTH} />
          </div>
          <div>
            <p className="validation-stat-label">{metric.label}</p>
            <strong className="validation-stat-value">{metric.value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}

export default ValidationStats