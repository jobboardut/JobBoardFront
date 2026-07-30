import { memo } from 'react'
import { BriefcaseBusiness, CalendarDays, Eye, MapPin, Users, Wallet } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import { getLugaresInfo } from '@/shared/utils/lugares'
import type { Publication } from '../types/publicaciones.types'

type PublicationsGridProps = {
	rows: Publication[]
	onSelect: (publication: Publication) => void
}

function PublicacionesGrid({ rows, onSelect }: PublicationsGridProps) {
	return (
		<section className="publications-wrap" aria-label="Listado de publicaciones">
			<div className="publications-grid">
				{rows.map((publication) => (
					// Toda la card es clickeable para abrir el detalle.
					<button
						key={publication.id}
						type="button"
						className={`publication-card ${publication.status === 'Pausado' ? 'is-paused-card' : ''} ${publication.status === 'Eliminada' ? 'is-deleted-card' : ''}`}
						onClick={() => onSelect(publication)}
					>
						<header className="publication-card-head">
							<div className="publication-title-wrap">
								<span className="publication-avatar">{publication.badgeLetter}</span>
								<div>
									<h3>{publication.title}</h3>
									<p>{publication.company}</p>
								</div>
							</div>

							<span className="publication-more" aria-hidden="true">
								<Eye size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
							</span>
						</header>

						<div className="publication-meta-pills">
							<span
								className={`publication-status-pill ${
									publication.status === 'Activo'
										? 'is-active'
										: publication.status === 'Eliminada'
											? 'is-deleted'
											: 'is-paused'
								}`}
							>
								{publication.status}
							</span>
							<span>{publication.modality}</span>
							<span>{publication.workday}</span>
						</div>

						<ul className="publication-details">
							<li>
								<MapPin size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
								{publication.location}
							</li>
							<li>
								<Wallet size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
								{publication.salary}
							</li>
							<li>
								<CalendarDays size={16} strokeWidth={APP_ICON_STROKE_WIDTH} />
								{publication.date}
							</li>
						</ul>

						<footer className="publication-card-footer">
							<span className="publication-card-footer-item">
								<Users size={14} strokeWidth={APP_ICON_STROKE_WIDTH} />
								{publication.applicants} postulantes
							</span>
							{(() => {
								const lugares = getLugaresInfo(publication)
								if (!lugares) return null

								return (
									<span className={`publication-places ${lugares.isFull ? 'is-full' : ''}`}>
										<BriefcaseBusiness size={14} strokeWidth={APP_ICON_STROKE_WIDTH} />
										{lugares.label} contratados
										{lugares.isFull ? <strong> · CUPO LLENO</strong> : null}
									</span>
								)
							})()}
						</footer>
					</button>
				))}
			</div>

			<footer className="publications-footer">
				<span>Mostrando {rows.length} publicaciones</span>
			</footer>
		</section>
	)
}

// memo: el grid solo se re-renderiza cuando cambian las publicaciones filtradas.
export default memo(PublicacionesGrid)
