import { useState } from 'react'
import { X, XCircle } from 'lucide-react'
import { SECURITY_LIMITS, limitText } from '@/shared/security/inputRules'

interface ModalRechazoPostulacionProps {
  isOpen: boolean
  candidatoNombre: string
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (motivo: string) => void
}

// El backend exige motivo obligatorio al rechazar (400 si va vacio).
export const ModalRechazoPostulacion = ({
  isOpen,
  candidatoNombre,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ModalRechazoPostulacionProps) => {
  const [motivo, setMotivo] = useState('')

  if (!isOpen) return null

  const motivoLimpio = motivo.trim()

  const handleSubmit = () => {
    if (!motivoLimpio) return
    onSubmit(motivoLimpio)
    setMotivo('')
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
        aria-label={`Rechazar postulacion de ${candidatoNombre}`}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-500">
              <XCircle size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Rechazar postulacion</h2>
              <p className="text-xs text-slate-500">El motivo es obligatorio y queda registrado.</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={17} />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-700">
            Motivo del rechazo para {candidatoNombre}
          </span>
          <textarea
            value={motivo}
            onChange={(event) => setMotivo(limitText(event.target.value, SECURITY_LIMITS.longText))}
            rows={5}
            autoFocus
            placeholder="Ej: El perfil no cumple con la experiencia requerida para el puesto..."
            maxLength={SECURITY_LIMITS.longText}
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500/10"
          />
          <span className="mt-1 block text-xs text-slate-400">
            Maximo {SECURITY_LIMITS.longText} caracteres.
          </span>
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
            disabled={!motivoLimpio || isSubmitting}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar rechazo'}
          </button>
        </div>
      </article>
    </div>
  )
}

export default ModalRechazoPostulacion
