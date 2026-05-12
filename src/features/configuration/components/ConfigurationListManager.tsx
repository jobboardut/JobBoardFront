import { Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { ConfigurationItem, ConfigurationListKey } from '../types/configuration.types'

type ConfigurationListManagerProps = {
  title: string
  description: string
  iconLabel: string
  items: ConfigurationItem[]
  onCreate: (listKey: ConfigurationListKey, value: string) => void
  onDelete: (listKey: ConfigurationListKey, itemId: string) => void
  listKey: ConfigurationListKey
}

function ConfigurationListManager({
  title,
  description,
  iconLabel,
  items,
  onCreate,
  onDelete,
  listKey,
}: ConfigurationListManagerProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return
    }

    onCreate(listKey, trimmedValue)
    setValue('')
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
        />
        <button type="submit" className="configuration-create-btn">
          <Plus size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
          Crear
        </button>
      </form>

      <ul className="configuration-list">
        {items.map((item) => (
          <li key={item.id} className="configuration-list-item">
            <span>{item.name}</span>
            <button
              type="button"
              className="configuration-delete-btn"
              aria-label={`Eliminar ${item.name}`}
              onClick={() => onDelete(listKey, item.id)}
            >
              <Trash2 size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default ConfigurationListManager
