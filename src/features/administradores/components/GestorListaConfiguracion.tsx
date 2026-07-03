import { Check, Pencil, Plus, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { ConfigurationItem, ConfigurationListKey } from '../types/configuration.types'

type GestorListaConfiguracionProps = {
	title: string
	description: string
	iconLabel: string
	items: ConfigurationItem[]
	onCreate: (listKey: ConfigurationListKey, value: string) => Promise<unknown>
	onUpdate: (listKey: ConfigurationListKey, itemId: string, value: string) => Promise<unknown>
	listKey: ConfigurationListKey
	isBusy?: boolean
}

function GestorListaConfiguracion({
	title,
	description,
	iconLabel,
	items,
	onCreate,
	onUpdate,
	listKey,
	isBusy = false,
}: GestorListaConfiguracionProps) {
	const [value, setValue] = useState('')
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editingValue, setEditingValue] = useState('')

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const trimmedValue = value.trim()

		if (!trimmedValue) {
			return
		}

		try {
			await onCreate(listKey, trimmedValue)
			setValue('')
		} catch {
			// El toast global ya comunica el error al usuario.
		}
	}

	const startEditing = (item: ConfigurationItem) => {
		setEditingId(item.id)
		setEditingValue(item.name)
	}

	const cancelEditing = () => {
		setEditingId(null)
		setEditingValue('')
	}

	const handleUpdate = async (itemId: string) => {
		const trimmedValue = editingValue.trim()

		if (!trimmedValue) {
			return
		}

		try {
			await onUpdate(listKey, itemId, trimmedValue)
			cancelEditing()
		} catch {
			// El toast global ya comunica el error al usuario.
		}
	}

	return (
		<article className="configuration-panel">
			<header className="configuration-panel-head">
				<div>
					<span className="configuration-panel-badge">{iconLabel}</span>
					<h2>{title}</h2>
					<p>{description}</p>
				</div>
			</header>

			<form className="configuration-form" onSubmit={handleSubmit}>
				<input
					type="text"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					placeholder={`Agregar nuevo ${title.toLowerCase()}`}
					disabled={isBusy}
				/>
				<button type="submit" className="configuration-create-btn" disabled={isBusy}>
					<Plus size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
					Crear
				</button>
			</form>

			<ul className="configuration-list">
				{items.length > 0 ? (
					items.map((item) => (
						<li key={item.id} className="configuration-list-item">
							{editingId === item.id ? (
								<>
									<input
										type="text"
										className="configuration-edit-input"
										value={editingValue}
										onChange={(event) => setEditingValue(event.target.value)}
										disabled={isBusy}
										autoFocus
										onKeyDown={(event) => {
											if (event.key === 'Enter') {
												event.preventDefault()
												void handleUpdate(item.id)
											}
											if (event.key === 'Escape') {
												cancelEditing()
											}
										}}
									/>
									<div className="configuration-item-actions">
										<button
											type="button"
											className="configuration-save-btn"
											aria-label={`Guardar ${item.name}`}
											disabled={isBusy}
											onClick={() => void handleUpdate(item.id)}
										>
											<Check size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
										</button>
										<button
											type="button"
											className="configuration-cancel-btn"
											aria-label="Cancelar edicion"
											disabled={isBusy}
											onClick={cancelEditing}
										>
											<X size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
										</button>
									</div>
								</>
							) : (
								<>
									<span>{item.name}</span>
									<div className="configuration-item-actions">
										<button
											type="button"
											className="configuration-edit-btn"
											aria-label={`Editar ${item.name}`}
											disabled={isBusy}
											onClick={() => startEditing(item)}
										>
											<Pencil size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
										</button>
									</div>
								</>
							)}
						</li>
					))
				) : (
					<li className="configuration-list-empty">Aun no hay elementos en esta lista.</li>
				)}
			</ul>
		</article>
	)
}

export default GestorListaConfiguracion
