import { useState } from 'react'
import { CalendarCheck, X } from 'lucide-react'

interface ModalCitarEntrevistaProps {
  isOpen: boolean
  candidatoNombre: string
  isSubmitting?: boolean
  onClose: () => void
  /** fechaEntrevista en ISO; vacio si la empresa decide agendarla despues. */
  onSubmit: (fechaEntrevista?: string) => void
}

/** Devuelve el valor minimo para datetime-local: ahora, en hora local. */
const ahoraLocal = (): string => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 16)
}

export const ModalCitarEntrevista = ({
  isOpen,
  candidatoNombre,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ModalCitarEntrevistaProps) => {
  const [fecha, setFecha] = useState('')

  if (!isOpen) return null

  const minimo = ahoraLocal()
  const fechaInvalida = Boolean(fecha) && fecha < minimo

  const handleSubmit = () => {
    if (fechaInvalida) return
    // El backend exige fecha futura; si no se elige, se envia sin fecha.
    onSubmit(fecha ? new Date(fecha).toISOString() : undefined)
    setFecha('')
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-label={`Citar a entrevista a ${candidatoNombre}`}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <CalendarCheck size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Citar a entrevista</h2>
              <p className="text-xs text-slate-500">El candidato vera la fecha en su seguimiento.</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"
          >
            <X size={17} />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-700">
            Fecha y hora para {candidatoNombre}
          </span>
          <input
            type="datetime-local"
            value={fecha}
            min={minimo}
            onChange={(event) => setFecha(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-amber-300 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
          />
          {fechaInvalida ? (
            <span className="mt-1 block text-xs font-semibold text-red-500">
              La fecha debe ser posterior a este momento.
            </span>
          ) : (
            <span className="mt-1 block text-xs text-slate-400">
              Opcional: puedes dejarlo vacio y acordar la fecha por correo.
            </span>
          )}
        </label>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || fechaInvalida}
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </article>
    </div>
  )
}

export default ModalCitarEntrevista
