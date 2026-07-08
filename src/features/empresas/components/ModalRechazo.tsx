import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import { useMotivosRechazo } from '../hooks/useEmpresa'
import type { EtapaMotivo } from '../types/empresa.types'

interface ModalRechazoProps {
  nombreCandidato: string
  /** Determina qué segmento del catálogo se ofrece. */
  etapa: EtapaMotivo
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: (motivoRechazoId: number, comentarioInterno?: string) => void
}

const MAX_COMENTARIO = 500

/**
 * Rechazar exige un motivo del catálogo cerrado. No hay campo de texto libre hacia el
 * candidato: eso sería un canal de mensajería (excluido del alcance) y expondría a la
 * UTTECAM a que una empresa escriba una justificación discriminatoria.
 *
 * El comentario es una nota INTERNA — sólo la ve la empresa y el administrador.
 */
export const ModalRechazo = ({
  nombreCandidato,
  etapa,
  isSubmitting,
  onCancel,
  onConfirm,
}: ModalRechazoProps) => {
  const { data: motivos = [], isLoading, isError } = useMotivosRechazo(etapa)
  const [motivoId, setMotivoId] = useState<number | ''>('')
  const [comentario, setComentario] = useState('')

  // Cerrar con Escape: el modal es bloqueante y no debe atrapar al usuario.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isSubmitting, onCancel])

  const puedeConfirmar = motivoId !== '' && !isSubmitting && !isLoading

  const handleConfirm = () => {
    if (motivoId === '') return
    onConfirm(Number(motivoId), comentario.trim() || undefined)
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-rechazo"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </span>
            <div>
              <h2 id="titulo-rechazo" className="text-lg font-semibold text-slate-900">
                Rechazar a {nombreCandidato}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Es una acción definitiva: la postulación no podrá reabrirse.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="motivo-rechazo" className="block text-sm font-semibold text-slate-700">
              Motivo del rechazo <span className="text-red-500">*</span>
            </label>

            {isError ? (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                No se pudo cargar el catálogo de motivos. Intenta de nuevo.
              </p>
            ) : (
              <select
                id="motivo-rechazo"
                value={motivoId}
                disabled={isLoading || isSubmitting}
                onChange={(event) => setMotivoId(event.target.value === '' ? '' : Number(event.target.value))}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 disabled:bg-slate-50"
              >
                <option value="">{isLoading ? 'Cargando motivos…' : 'Selecciona un motivo'}</option>
                {motivos.map((motivo) => (
                  <option key={motivo.id} value={motivo.id}>
                    {motivo.etiqueta}
                  </option>
                ))}
              </select>
            )}

            <p className="mt-2 text-xs text-slate-400">
              El candidato verá únicamente esta etiqueta. Ayuda a la UTTECAM a detectar en qué
              etapa y por qué se pierden sus alumnos.
            </p>
          </div>

          <div>
            <label htmlFor="comentario-interno" className="block text-sm font-semibold text-slate-700">
              Nota interna <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <textarea
              id="comentario-interno"
              rows={3}
              value={comentario}
              maxLength={MAX_COMENTARIO}
              disabled={isSubmitting}
              onChange={(event) => setComentario(event.target.value)}
              placeholder="Visible sólo para tu equipo y la administración."
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 disabled:bg-slate-50"
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {comentario.length}/{MAX_COMENTARIO}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!puedeConfirmar}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            Confirmar rechazo
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalRechazo
