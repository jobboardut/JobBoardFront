import { BookOpenText, Building2 } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'

type ConfigurationStatsProps = {
  programsCount: number
  sectorsCount: number
}

function ConfigurationStats({ programsCount, sectorsCount }: ConfigurationStatsProps) {
  return (
    <section className="configuration-stats" aria-label="Resumen de configuración">
      <article className="configuration-stat-card">
        <span className="configuration-stat-icon is-blue">
          <BookOpenText size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
        </span>
        <div>
          <strong>{programsCount}</strong>
          <p>Programas educativos</p>
        </div>
      </article>

      <article className="configuration-stat-card">
        <span className="configuration-stat-icon is-green">
          <Building2 size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
        </span>
        <div>
          <strong>{sectorsCount}</strong>
          <p>Sectores empresariales</p>
        </div>
      </article>
    </section>
  )
}

export default ConfigurationStats
