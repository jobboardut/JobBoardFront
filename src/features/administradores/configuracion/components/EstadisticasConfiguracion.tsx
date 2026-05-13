import { BookOpenText, Building2 } from 'lucide-react'
import { STATS_ICON_SIZE, STATS_ICON_STROKE_WIDTH } from '../../../../config/iconConfig'

type EstadisticasConfiguracionProps = {
  programsCount: number
  sectorsCount: number
}

function EstadisticasConfiguracion({ programsCount, sectorsCount }: EstadisticasConfiguracionProps) {
  return (
    <section className="configuration-stats" aria-label="Resumen de configuración">
      <article className="configuration-stat-card">
        <span className="configuration-stat-icon is-blue">
          <BookOpenText size={STATS_ICON_SIZE} strokeWidth={STATS_ICON_STROKE_WIDTH} />
        </span>
        <div>
          <strong>{programsCount}</strong>
          <p>Programas educativos</p>
        </div>
      </article>

      <article className="configuration-stat-card">
        <span className="configuration-stat-icon is-green">
          <Building2 size={STATS_ICON_SIZE} strokeWidth={STATS_ICON_STROKE_WIDTH} />
        </span>
        <div>
          <strong>{sectorsCount}</strong>
          <p>Sectores empresariales</p>
        </div>
      </article>
    </section>
  )
}
 
export default EstadisticasConfiguracion
