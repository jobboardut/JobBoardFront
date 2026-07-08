import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, FileText, GraduationCap, Lock, Mail, MapPin, Phone } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { useConfirmDialog } from '@/shared/components/appConfirmContext'
import { useAppToast } from '@/shared/components/appToastContext'
import { useCambiarEstatusPostulante, usePostulantes } from '../hooks/useEmpresa'
import type { EmpresaTransicion } from '../types/empresa.types'
import {
  ETIQUETA_ACCION,
  POSTULANTE_STATUS,
  etapaDeRechazo,
  getPostulanteStatusMeta,
} from '../utils/postulanteStatus'
import { ModalRechazo } from './ModalRechazo'

export const DetallePostulante = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const postulanteId = Number(id)
  const vacanteId = Number(searchParams.get('vacanteId'))
  const toast = useAppToast()
  const { confirm } = useConfirmDialog()
  const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false)

  const { data: postulantes = [], isLoading, isError } = usePostulantes(vacanteId)
  const { mutate: cambiarEstatus, isPending: isUpdating } = useCambiarEstatusPostulante(vacanteId)

  const postulante = postulantes.find((item) => item.id === postulanteId)

  if (!id || Number.isNaN(postulanteId) || !vacanteId || Number.isNaN(vacanteId)) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">Abre el postulante desde una vacante para ver el detalle.</p>
      </div>
    )
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Cargando postulante...</p>
    </div>
  )

  if (isError || !postulante) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm text-red-400">No se encontro el postulante.</p>
      </div>
    )
  }

  const currentStatus = getPostulanteStatusMeta(postulante.estatus)

  // La máquina de estados vive en el servidor: aquí sólo se pintan las transiciones
  // que ya vinieron autorizadas. Nunca se derivan en el cliente.
  const transiciones = postulante.transicionesPermitidas ?? []

  const notificarError = (error: unknown) => {
    const message = (error as { message?: string })?.message ?? 'Intenta de nuevo en unos segundos.'
    toast.error('No se pudo actualizar', message)
  }

  const notificarExito = (destino: EmpresaTransicion) => {
    toast.success('Estatus actualizado', `${postulante.nombre} ahora aparece como ${POSTULANTE_STATUS[destino].label}.`)
  }

  const avanzar = async (destino: EmpresaTransicion) => {
    // El rechazo tiene su propio flujo: exige motivo del catálogo.
    if (destino === 'Rechazada') {
      setMostrarModalRechazo(true)
      return
    }

    const meta = POSTULANTE_STATUS[destino]
    const accepted = await confirm({
      title: ETIQUETA_ACCION[destino],
      message: meta.terminal
        ? `Es una acción definitiva: la postulación de ${postulante.nombre} no podrá reabrirse.`
        : `Este cambio actualiza el seguimiento para empresa, estudiante y administración.`,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      tone: 'info',
    })

    if (!accepted) return

    cambiarEstatus(
      { postulacionId: postulante.postulacionId, estatus: destino },
      { onSuccess: () => notificarExito(destino), onError: notificarError }
    )
  }

  const confirmarRechazo = (motivoRechazoId: number, comentarioInterno?: string) => {
    cambiarEstatus(
      { postulacionId: postulante.postulacionId, estatus: 'Rechazada', motivoRechazoId, comentarioInterno },
      {
        onSuccess: () => {
          setMostrarModalRechazo(false)
          notificarExito('Rechazada')
        },
        onError: (error: unknown) => {
          setMostrarModalRechazo(false)
          notificarError(error)
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(ROUTES.EMPRESA_POSTULANTES)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white hover:bg-white/25"
            >
              <ArrowLeft size={18} />
            </button>
            {postulante.fotoUrl ? (
              <img
                src={postulante.fotoUrl}
                alt={postulante.nombre}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white/60"
              />
            ) : null}
            <div>
              <h1 className="text-2xl font-semibold">{postulante.nombre}</h1>
              <p className="text-sm text-white/80">Estatus: {currentStatus.label}</p>
              {postulante.carrera ? (
                <p className="text-sm text-white/70">{postulante.carrera}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {transiciones.length === 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
                <Lock size={16} />
                Proceso finalizado
              </span>
            ) : (
              transiciones.map((destino) => {
                const meta = POSTULANTE_STATUS[destino]
                const Icon = meta.Icon
                const esRechazo = destino === 'Rechazada'

                return (
                  <button
                    type="button"
                    key={destino}
                    onClick={() => void avanzar(destino)}
                    disabled={isUpdating}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
                      esRechazo
                        ? 'border border-white/40 text-white hover:bg-red-500/30'
                        : 'bg-white text-emerald-600 hover:bg-white/90'
                    }`}
                  >
                    <Icon size={16} />
                    {ETIQUETA_ACCION[destino]}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border px-5 py-4 ${currentStatus.pillClass}`}>
        <p className="text-sm font-black">Estado actual: {currentStatus.label}</p>
        <p className="mt-1 text-sm">{currentStatus.description}</p>

        {postulante.motivoRechazo ? (
          <p className="mt-2 text-sm">
            <span className="font-semibold">Motivo:</span> {postulante.motivoRechazo}
            {postulante.etapaRechazo ? (
              <span className="text-xs opacity-70">
                {' '}
                · rechazado en etapa {POSTULANTE_STATUS[
                  postulante.etapaRechazo as keyof typeof POSTULANTE_STATUS
                ]?.label ?? postulante.etapaRechazo}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>

      {postulante.comentarioInterno ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Nota interna</p>
          <p className="mt-1 text-sm text-slate-700">{postulante.comentarioInterno}</p>
          <p className="mt-2 text-xs text-slate-400">Visible sólo para tu equipo y la administración.</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-emerald-500">
            <Mail size={16} />
            <p className="text-xs font-semibold uppercase">Correo</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-800">{postulante.email}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-orange-500">
            <Phone size={16} />
            <p className="text-xs font-semibold uppercase">Telefono</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-800">{postulante.telefono ?? 'Sin telefono'}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-emerald-500">
            <MapPin size={16} />
            <p className="text-xs font-semibold uppercase">Ubicacion</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-800">{postulante.ubicacion ?? postulante.carrera ?? 'Sin dato'}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-emerald-500">
            <GraduationCap size={16} />
            <p className="text-xs font-semibold uppercase">Datos academicos</p>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            <span className="font-semibold">Matricula:</span> {postulante.matricula || 'Sin dato'}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Estatus:</span> {postulante.estatusAcademico || 'Estudiante'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-orange-500">
            <FileText size={16} />
            <p className="text-xs font-semibold uppercase">Curriculum</p>
          </div>
          {postulante.cvUrl ? (
            <a
              href={postulante.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
            >
              <FileText size={16} />
              Ver / descargar CV
            </a>
          ) : (
            <p className="mt-3 text-sm text-gray-400">El candidato no ha subido CV.</p>
          )}
        </div>
      </div>

      {mostrarModalRechazo ? (
        <ModalRechazo
          nombreCandidato={postulante.nombre}
          etapa={etapaDeRechazo(postulante.estatus)}
          isSubmitting={isUpdating}
          onCancel={() => setMostrarModalRechazo(false)}
          onConfirm={confirmarRechazo}
        />
      ) : null}
    </div>
  )
}

export default DetallePostulante
