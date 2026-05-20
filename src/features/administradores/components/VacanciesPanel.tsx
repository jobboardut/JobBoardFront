import type { VacancyRow } from '../types/dashboard.types'

type VacanciesPanelProps = {
	rows: VacancyRow[]
}

function VacanciesPanel({ rows }: VacanciesPanelProps) {
	return (
		<article className="panel panel-wide">
			<div className="panel-header">
				<div>
					<p className="panel-kicker">Vacantes recientes</p>
					<h2>Vacantes</h2>
				</div>
			</div>

			<div className="table-wrap">
				<table className="data-table">
					<thead>
						<tr>
							<th>Vacantes</th>
							<th>Estatus</th>
							<th>Postulantes</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((vacancy) => (
							<tr key={vacancy.title}>
								<td>
									<strong>{vacancy.title}</strong>
									<span>{vacancy.description}</span>
								</td>
								<td>
									<span className={`status-pill status-${vacancy.status.toLowerCase()}`}>{vacancy.status}</span>
								</td>
								<td>{vacancy.applicants}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</article>
	)
}

export default VacanciesPanel
