import { Building2, Mail, Phone, School, UserCheck, UserX, X } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { ManagementUser } from '../types/management.types'

type ManagementDetailModalProps = {
	user: ManagementUser | null
	onClose: () => void
}

function ManagementDetailModal({ user, onClose }: ManagementDetailModalProps) {
	if (!user) {
		return null
	}

	const initial = user.fullName.charAt(0).toUpperCase()
	const isCompany = user.type === 'Empresa'
	const isActive = user.state === 'Activo'
	const ActionIcon = isActive ? UserX : UserCheck
	const actionLabel = isActive ? 'Inactivar usuario' : 'Reactivar usuario'
	const DataIcon = isCompany ? Building2 : School

	return (
		<div className="validation-modal-overlay" role="presentation" onClick={onClose}>
			<article className="validation-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
				<button type="button" className="validation-modal-close" aria-label="Cerrar" onClick={onClose}>
					<X size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
				</button>

				<header className="validation-modal-head">
					<span className={`validation-modal-avatar ${isCompany ? 'is-company' : 'is-grad'}`}>{initial}</span>
					<div>
						<h2>{user.fullName}</h2>
						<span className={`validation-type-pill ${isCompany ? 'is-company' : 'is-grad'}`}>{user.type}</span>
					</div>
				</header>

				<section className="validation-modal-contact">
					<div className="validation-modal-contact-card">
						<Mail size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
						<div>
							<small>Correo</small>
							<strong>{user.contact}</strong>
						</div>
					</div>

					<div className="validation-modal-contact-card">
						<Phone size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
							<div>
								<small>Telefono</small>
								<strong>{user.contactPhone}</strong>
						</div>
					</div>
				</section>

				<section className={`validation-modal-data ${isCompany ? 'is-company' : 'is-grad'}`}>
					<h3>
						<DataIcon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
						{user.detailTitle}
					</h3>

					<div className="validation-modal-fields">
						{user.detailItems.map((item) => (
							<div key={`${user.id}-${item.label}`}>
								<small>{item.label}</small>
								<strong>{item.value}</strong>
							</div>
						))}
					</div>
				</section>

				<footer className="validation-modal-actions is-single">
					<button type="button" className={`btn-user-action ${isActive ? 'is-active' : 'is-inactive'}`}>
						<ActionIcon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
						{actionLabel}
					</button>
				</footer>
			</article>
		</div>
	)
}

export default ManagementDetailModal
