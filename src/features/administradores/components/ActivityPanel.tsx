type ActivityPanelProps = {
	items: string[]
}

function ActivityPanel({ items }: ActivityPanelProps) {
	return (
		<aside className="panel side-panel">
			<div className="panel-header">
				<div>
					<p className="panel-kicker">Actividad</p>
					<h2>Resumen rápido</h2>
				</div>
			</div>

			<div className="activity-list">
				{items.map((item) => (
					<div key={item} className="activity-item">
						<span className="activity-dot" />
						<p>{item}</p>
					</div>
				))}
			</div>
		</aside>
	)
}

export default ActivityPanel
