import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type HeroTone = 'estudiante' | 'empresa'

interface PageHeroProps {
  /** Define la paleta: verde institucional (estudiante) o naranja (empresa). */
  tone?: HeroTone
  eyebrow?: string
  title: string
  description?: string
  Icon?: LucideIcon
  actions?: ReactNode
  /** Bloque opcional a la derecha (metricas rapidas, badges, etc.). */
  aside?: ReactNode
}

/**
 * Encabezado de seccion compartido por estudiante y empresa.
 * Mantiene la misma familia visual del panel de administracion:
 * degradado profundo, halo suave y tipografia jerarquizada.
 */
export const PageHero = ({
  tone = 'estudiante',
  eyebrow,
  title,
  description,
  Icon,
  actions,
  aside,
}: PageHeroProps) => {
  return (
    <header className={`page-hero page-hero--${tone}`}>
      <div className="page-hero__glow" aria-hidden="true" />

      <div className="page-hero__content">
        <div className="page-hero__main">
          {Icon ? (
            <span className="page-hero__icon" aria-hidden="true">
              <Icon size={22} strokeWidth={1.9} />
            </span>
          ) : null}

          <div className="min-w-0">
            {eyebrow ? <p className="page-hero__eyebrow">{eyebrow}</p> : null}
            <h1 className="page-hero__title">{title}</h1>
            {description ? <p className="page-hero__description">{description}</p> : null}
          </div>
        </div>

        {actions ? <div className="page-hero__actions">{actions}</div> : null}
      </div>

      {aside ? <div className="page-hero__aside">{aside}</div> : null}
    </header>
  )
}

export default PageHero
