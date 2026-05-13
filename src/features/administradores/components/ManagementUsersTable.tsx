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
					{rows.map((row) => (
						<tr key={row.id}>
							<td>
								<div className="management-user-cell">
									<span className="management-avatar">{row.avatarLetter}</span>
									<span>
										<strong>{row.fullName}</strong>
										<small>{row.description}</small>
									</span>
								</div>
							</td>
							<td>
								<span className={`management-type-pill ${row.type === 'Empresa' ? 'is-company' : 'is-grad'}`}>
									{row.type}
								</span>
							</td>
							<td>{row.contact}</td>
							<td>{row.registerDate}</td>
							<td>
								<span className={`management-state-pill ${row.state === 'Activo' ? 'is-active' : 'is-inactive'}`}>
									<Circle size={8} fill="currentColor" strokeWidth={0} />
									{row.state}
								</span>
							</td>
							<td>
								<button type="button" className="management-view-action" aria-label="Ver detalle" onClick={() => onView(row)}>
									<Eye size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
									<span>Ver</span>
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<footer className="management-pagination">
				<span>Página 1</span>
				<div>
					<button type="button" aria-label="Página anterior">
						‹
					</button>
					<button type="button" aria-label="Página siguiente">
						›
					</button>
				</div>
			</footer>
		</section>
	)
}

export default ManagementUsersTable
