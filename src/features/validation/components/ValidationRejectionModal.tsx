import { useState } from 'react'
import { X } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'

type ValidationRejectionModalProps = {
  isOpen: boolean
  requestName: string
  onClose: () => void
}

function ValidationRejectionModal({ isOpen, requestName, onClose }: ValidationRejectionModalProps) {
  const [observations, setObservations] = useState('')

  if (!isOpen) {
    return null
  }

  const handleSubmit = () => {
    // Aqui se conectara el POST de observaciones de rechazo.
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
          <h2>Observaciones de rechazo</h2>
          <p>Redacta el motivo por el que se rechazó el perfil de {requestName}.</p>
        </header>

        <label className="validation-reject-field" htmlFor="validation-reject-observations">
          <span>Observaciones</span>
          <textarea
            id="validation-reject-observations"
            value={observations}
            onChange={(event) => setObservations(event.target.value)}
            placeholder="Escribe aquí el detalle del rechazo..."
            rows={7}
            autoFocus
          />
        </label>

        <footer className="validation-reject-actions">
          <button type="button" className="btn-reject-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-reject-primary" onClick={handleSubmit} disabled={!observations.trim()}>
            Enviar observaciones
          </button>
        </footer>
      </article>
    </div>
  )
}

export default ValidationRejectionModal