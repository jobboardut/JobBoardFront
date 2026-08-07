import { useRef } from 'react'
import { GripVertical, Plus, X } from 'lucide-react'

interface BulletListInputProps {
  /** Texto con un elemento por linea; es el formato que espera el backend. */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Limite por elemento, no del total. */
  maxLength?: number
  addLabel?: string
  disabled?: boolean
}

const toItems = (value: string): string[] => value.split('\n')

/**
 * Editor de lista por viñetas.
 * Cada elemento es su propio campo, de modo que la empresa no tiene que
 * acordarse de separar por saltos de linea. Hacia afuera sigue siendo un
 * unico texto con un elemento por linea.
 */
export const BulletListInput = ({
  value,
  onChange,
  placeholder = 'Escribe un elemento...',
  maxLength = 200,
  addLabel = 'Agregar elemento',
  disabled = false,
}: BulletListInputProps) => {
  const items = value ? toItems(value) : ['']
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const commit = (next: string[]) => {
    // Se conservan las lineas vacias mientras se edita; se limpian al enviar.
    onChange(next.join('\n'))
  }

  const updateItem = (index: number, text: string) => {
    const next = [...items]
    next[index] = text.slice(0, maxLength)
    commit(next)
  }

  const addItem = (index?: number) => {
    const next = [...items]
    const position = index === undefined ? next.length : index + 1
    next.splice(position, 0, '')
    commit(next)

    // Enfoca el campo recien creado tras el re-render.
    window.setTimeout(() => inputsRef.current[position]?.focus(), 0)
  }

  const removeItem = (index: number) => {
    if (items.length === 1) {
      commit([''])
      return
    }

    const next = items.filter((_, position) => position !== index)
    commit(next)
    window.setTimeout(() => inputsRef.current[Math.max(0, index - 1)]?.focus(), 0)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addItem(index)
      return
    }

    // Retroceso en un campo vacio elimina la viñeta, como en un editor de notas.
    if (event.key === 'Backspace' && items[index] === '' && items.length > 1) {
      event.preventDefault()
      removeItem(index)
    }
  }

  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/10"
        >
          <GripVertical size={15} className="shrink-0 text-slate-300" aria-hidden="true" />
          <span className="shrink-0 text-emerald-500" aria-hidden="true">
            •
          </span>

          <input
            ref={(element) => {
              inputsRef.current[index] = element
            }}
            value={item}
            onChange={(event) => updateItem(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            placeholder={index === 0 ? placeholder : 'Otro mas...'}
            maxLength={maxLength}
            disabled={disabled}
            aria-label={`Elemento ${index + 1}`}
            className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={() => removeItem(index)}
            disabled={disabled}
            aria-label={`Quitar elemento ${index + 1}`}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
          >
            <X size={15} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => addItem()}
        disabled={disabled}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-40"
      >
        <Plus size={14} />
        {addLabel}
      </button>

      <p className="text-xs text-slate-400">
        Enter agrega otra viñeta. Maximo {maxLength} caracteres por elemento.
      </p>
    </div>
  )
}

export default BulletListInput
