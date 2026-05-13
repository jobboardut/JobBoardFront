import type { SummaryCard } from '../types/dashboard.types'
import { STATS_ICON_SIZE, STATS_ICON_STROKE_WIDTH } from '../../../../config/iconConfig'

type SummaryGridProps = {
  cards: SummaryCard[]
}

function SummaryGrid({ cards }: SummaryGridProps) {
  return (
    <section className="summary-grid" aria-label="Resumen general">
      {cards.map((card) => (
        <article key={card.label} className={`summary-card summary-${card.accent}`}>
          <div className="summary-icon">
            <card.Icon size={STATS_ICON_SIZE} strokeWidth={STATS_ICON_STROKE_WIDTH} />
          </div>
          <div>
            <p className="summary-label">{card.label}</p>
            <strong className="summary-value">{card.value}</strong>
            <p className="summary-subtitle">{card.subtitle}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

export default SummaryGrid