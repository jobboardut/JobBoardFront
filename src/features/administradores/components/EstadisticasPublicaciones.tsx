import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { PublicationMetric } from '../types/publicaciones.types'

type EstadisticasPublicacionesProps = {
	metrics: PublicationMetric[]
}

function EstadisticasPublicaciones({ metrics }: EstadisticasPublicacionesProps) {
	return (
		<section className="validation-stats publications-stats" aria-label="Resumen de publicaciones">
			{metrics.map((metric) => (
				<article key={metric.label} className="validation-stat-card">
					<span className={`validation-stat-icon tone-${metric.tone}`}>
						<metric.Icon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
					</span>
					<div>
						<p className="validation-stat-label">{metric.label}</p>
						<strong className="validation-stat-value">{metric.value}</strong>
					</div>
				</article>
			))}
		</section>
	)
}

export default EstadisticasPublicaciones
