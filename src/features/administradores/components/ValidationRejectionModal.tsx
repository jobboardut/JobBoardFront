import { useState } from 'react'
import { X } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'

type ValidationRejectionModalProps = {
  isOpen: boolean
  requestName: string
  onClose: () => void
  onSubmit?: (observaciones: string) => Promise<void>
  isSubmitting?: boolean
}

function ValidationRejectionModal({
  isOpen,
  requestName,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ValidationRejectionModalProps) {
	const [observations, setObservations] = useState('')

	if (!isOpen) {
		return null
	}

  const handleSubmit = async () => {
    const motivo = observations.trim()
    if (!motivo) return

    // El motivo viaja al padre; antes se capturaba y se descartaba.
    await onSubmit?.(motivo)
    setObservations('')
    onClose()
  }

	return (
		<div className="validation-reject-overlay" role="presentation" onClick={onClose}>
			<article className="validation-reject-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
				<button type="button" className="validation-modal-close" aria-label="Cerrar" onClick={onClose}>
					<X size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
				</button>

				<header className="validation-reject-head">
					<h2>Devolver para correccion</h2>
					<p>
						Explica que debe corregir {requestName}. El usuario recibira estas observaciones por
						correo y podra reenviar sus documentos.
					</p>
				</header>

				<label className="validation-reject-field" htmlFor="validation-reject-observations">
					<span>Observaciones</span>
					<textarea
						id="validation-reject-observations"
						value={observations}
						onChange={(event) => setObservations(event.target.value)}
						placeholder="Ej: La foto del INE esta borrosa, vuelve a subirla..."
						rows={7}
						autoFocus
					/>
				</label>

				<footer className="validation-reject-actions">
					<button type="button" className="btn-reject-secondary" onClick={onClose}>
						Cancelar
					</button>
          <button
            type="button"
            className="btn-reject-primary"
            onClick={handleSubmit}
            disabled={!observations.trim() || isSubmitting}
          >
            Devolver con observaciones
          </button>
				</footer>
			</article>
		</div>
	)
}

export default ValidationRejectionModal
