import { useState } from 'react'
import { Building2, CheckCircle2, GraduationCap, Mail, Phone, XCircle, X } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../../config/iconConfig'
import type { ValidationRequest } from '../../types/validation.types'
import ValidationRejectionModal from './ValidationRejectionModal'

type ValidationDetailModalProps = {
  request: ValidationRequest | null
  onClose: () => void
}

function ValidationDetailModal({ request, onClose }: ValidationDetailModalProps) {
  const [isPhotoZoomOpen, setIsPhotoZoomOpen] = useState(false)
  const [isAvatarZoomOpen, setIsAvatarZoomOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  if (!request) {
    return null
  }

  const handleClose = () => {
    // Cierre centralizado para evitar overlays abiertos al cerrar el modal padre.
    setIsPhotoZoomOpen(false)
    setIsAvatarZoomOpen(false)
    setIsRejectModalOpen(false)
    onClose()
  }

  const initial = request.fullName.charAt(0).toUpperCase()
  const isCompany = request.type === 'Empresa'
  const hasAvatarPhoto = !isCompany && Boolean(request.avatarPhoto)
  const hasProofPhoto = !isCompany && Boolean(request.evidencePhoto)
  const DetailIcon = isCompany ? Building2 : GraduationCap

  return (
    <div className="validation-modal-overlay" role="presentation" onClick={handleClose}>
      <article
        className={`validation-modal ${hasProofPhoto ? 'has-proof-photo' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="validation-modal-close" aria-label="Cerrar" onClick={handleClose}>
          <X size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
        </button>

        <header className="validation-modal-head">
          {hasAvatarPhoto ? (
            <button
              type="button"
              className={`validation-modal-avatar-button ${isCompany ? 'is-company' : 'is-grad'}`}
              onClick={() => setIsAvatarZoomOpen(true)}
              aria-label={`Abrir foto de perfil de ${request.fullName}`}
            >
              <img src={request.avatarPhoto} alt={`Foto de perfil de ${request.fullName}`} />
            </button>
          ) : (
            <span className={`validation-modal-avatar ${isCompany ? 'is-company' : 'is-grad'}`}>{initial}</span>
          )}
          <div>
            <h2>{request.fullName}</h2>
            <span className={`validation-type-pill ${isCompany ? 'is-company' : 'is-grad'}`}>{request.type}</span>
          </div>
        </header>

        <section className="validation-modal-contact">
          <div className="validation-modal-contact-card">
            <Mail size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            <div>
              <small>Correo</small>
              <strong>{request.contactEmail}</strong>
            </div>
          </div>

          <div className="validation-modal-contact-card">
            <Phone size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            <div>
              <small>Teléfono</small>
              <strong>{request.contactPhone}</strong>
            </div>
          </div>
        </section>

        <section className={`validation-modal-data ${isCompany ? 'is-company' : 'is-grad'}`}>
          <h3>
            <DetailIcon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            {request.detailTitle}
          </h3>
          <div className="validation-modal-fields">
            {request.detailItems.map((item) => (
              <div key={`${request.id}-${item.label}`}>
                <small>{item.label}</small>
                {item.isLink ? <a href="#cv">{item.value}</a> : <strong>{item.value}</strong>}
              </div>
            ))}
          </div>
        </section>

        {hasProofPhoto ? (
          <section className="validation-modal-proof">
            <header>
              <h3>Documento probatorio</h3>
              <span>Fotografia cargada por el usuario</span>
            </header>
            <button
              type="button"
              className="validation-modal-proof-trigger"
              onClick={() => setIsPhotoZoomOpen(true)}
              aria-label={`Abrir documento probatorio de ${request.fullName}`}
            >
              <figure>
                <img src={request.evidencePhoto} alt={`Documento probatorio de ${request.fullName}`} loading="lazy" />
              </figure>
            </button>
          </section>
        ) : null}

        <footer className="validation-modal-actions">
          <button type="button" className="btn-approve">
            <CheckCircle2 size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            Aprobar Solicitud
          </button>
          <button type="button" className="btn-reject" onClick={() => setIsRejectModalOpen(true)}>
            <XCircle size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            Rechazar
          </button>
        </footer>
      </article>

      {hasProofPhoto && isPhotoZoomOpen ? (
        <div
          className="validation-photo-zoom-overlay"
          role="presentation"
          onClick={(event) => {
            event.stopPropagation()
            setIsPhotoZoomOpen(false)
          }}
        >
          <figure className="validation-photo-zoom" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="validation-photo-zoom-close"
              aria-label="Cerrar vista ampliada"
              onClick={(event) => {
                event.stopPropagation()
                setIsPhotoZoomOpen(false)
              }}
            >
              <X size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            </button>
            <img src={request.evidencePhoto} alt={`Vista ampliada del documento probatorio de ${request.fullName}`} />
          </figure>
        </div>
      ) : null}

      <ValidationRejectionModal
        isOpen={isRejectModalOpen}
        requestName={request.fullName}
        onClose={() => setIsRejectModalOpen(false)}
      />

      {hasAvatarPhoto && isAvatarZoomOpen ? (
        <div
          className="validation-photo-zoom-overlay"
          role="presentation"
          onClick={(event) => {
            event.stopPropagation()
            setIsAvatarZoomOpen(false)
          }}
        >
          <button
            type="button"
            className="validation-photo-zoom-close is-avatar-close"
            aria-label="Cerrar foto de perfil ampliada"
            onClick={(event) => {
              event.stopPropagation()
              setIsAvatarZoomOpen(false)
            }}
          >
            <X size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
          </button>
          <figure className="validation-photo-zoom is-avatar" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <img src={request.avatarPhoto} alt={`Vista ampliada de la foto de perfil de ${request.fullName}`} />
          </figure>
        </div>
      ) : null}
    </div>
  )
}

export default ValidationDetailModal