import { memo } from 'react'
import { Circle, Eye } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { ManagementUser } from '../types/management.types'

type ManagementUsersTableProps = {
	rows: ManagementUser[]
	onView: (user: ManagementUser) => void
}

function ManagementUsersTable({ rows, onView }: ManagementUsersTableProps) {
	return (
		<section className="management-table-wrap" aria-label="Usuarios del centro de gestión">
			<table className="management-table">
				<thead>
					<tr>
						<th>Usuario</th>
						<th>Tipo</th>
						<th>Contacto</th>
						<th>Registro</th>
						<th>Estado</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => {
						const isMuted = row.state === 'Rechazado' || row.state === 'Inhabilitado'
						const statePillClass =
							row.state === 'Activo'
								? 'is-active'
								: row.state === 'Devuelto'
									? 'is-returned'
									: isMuted
										? 'is-rejected'
										: 'is-inactive'

						return (
						<tr key={row.id} className={isMuted ? 'is-rejected-row' : ''}>
							<td data-label="Usuario">
								<div className="management-user-cell">
									<span className="management-avatar">{row.avatarLetter}</span>
									<span>
										<strong>{row.fullName}</strong>
										<small>{row.rejectionReason ?? row.description}</small>
									</span>
								</div>
							</td>
							<td data-label="Tipo">
								<span className={`management-type-pill ${row.type === 'Empresa' ? 'is-company' : row.type === 'Alumno' ? 'is-student' : 'is-grad'}`}>
									{row.type}
								</span>
							</td>
							<td data-label="Contacto">{row.contact}</td>
							<td data-label="Registro">{row.registerDate}</td>
							<td data-label="Estado">
								<span className={`management-state-pill ${statePillClass}`}>
									<Circle size={8} fill="currentColor" strokeWidth={0} />
									{row.state}
								</span>
							</td>
							<td data-label="Acciones">
								<button type="button" className="management-view-action" aria-label="Ver detalle" onClick={() => onView(row)}>
									<Eye size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
									<span>Ver</span>
								</button>
							</td>
						</tr>
						)
					})}
				</tbody>
			</table>

			<footer className="management-pagination">
				<span>Mostrando {rows.length} usuarios</span>
			</footer>
		</section>
	)
}

// memo: evita repintar toda la tabla mientras se escribe en el buscador.
export default memo(ManagementUsersTable)
