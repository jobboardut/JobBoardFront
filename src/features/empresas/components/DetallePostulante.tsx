import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, FileText, GraduationCap, Mail, Phone } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { getAcademicLabel } from '@/shared/utils/academicStatus'
import { useConfirmDialog } from '@/shared/components/appConfirmContext'
import { useAppToast } from '@/shared/components/appToastContext'
import { useCambiarEstatusPostulante, usePostulantes } from '../hooks/useEmpresa'
import type { PostulanteEstatus } from '../types/empresa.types'
import { ETIQUETA_ACCION, TRANSICIONES_EMPRESA, getPostulanteStatusMeta } from '../utils/postulanteStatus'
import { ModalCitarEntrevista } from './ModalCitarEntrevista'
import { ModalRechazoPostulacion } from './ModalRechazoPostulacion'

export const DetallePostulante = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const postulanteId = Number(id)
  const vacanteId = Number(searchParams.get('vacanteId'))
  const toast = useAppToast()
  const { confirm } = useConfirmDialog()
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isInterviewOpen, setIsInterviewOpen] = useState(false)

  const {
    data: postulantes = [],
    isLoading,
    isError,
  } = usePostulantes(vacanteId)

  const { mutate: cambiarEstatus, isPending: isUpdating } = useCambiarEstatusPostulante(vacanteId)

  const postulante = postulantes.find((item) => item.id === postulanteId)

  // Marca "CV visto" automaticamente al abrir el perfil por primera vez.
  // El ref evita repetir la llamada si el componente se vuelve a renderizar.
  const autoVistoRef = useRef<number | null>(null)

  useEffect(() => {
    if (!postulante?.postulacionId) return

    const yaMarcado = autoVistoRef.current === postulante.postulacionId
    const esPostulado = getPostulanteStatusMeta(postulante.estatus).key === 'postulado'

    if (yaMarcado || !esPostulado) return

    autoVistoRef.current = postulante.postulacionId
    cambiarEstatus({ postulacionId: postulante.postulacionId, estatus: 'CvVisto' })
  }, [postulante?.postulacionId, postulante?.estatus, cambiarEstatus])

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

  const estatusActual = postulante.estatus
  const currentStatus = getPostulanteStatusMeta(estatusActual)
  // "CvVisto" se marca solo al abrir el perfil, por eso no se ofrece como boton.
  const transiciones = TRANSICIONES_EMPRESA[currentStatus.key].filter((estatus) => estatus !== 'CvVisto')

  const describirError = (error: unknown): string => {
    const apiError = error as { status?: number; message?: string; detalle?: string; detail?: string }
    const texto = apiError.detalle ?? apiError.detail ?? apiError.message ?? ''

    if (apiError.status === 409 || /cupo|transicion|prohibid/i.test(texto)) {
      return texto || 'La transicion no esta permitida o la vacante ya no tiene cupo.'
    }

    return texto || 'Intenta de nuevo en unos segundos.'
  }

  const ejecutarCambio = (
    estatus: PostulanteEstatus,
    extra?: { motivoRechazo?: string; fechaEntrevista?: string },
  ) => {
    if (!postulante.postulacionId) {
      toast.warning('No se encontro la postulacion', 'Abre el postulante desde una vacante publicada.')
      return
    }

    const nextStatus = getPostulanteStatusMeta(estatus)

    cambiarEstatus(
      {
        postulacionId: postulante.postulacionId,
        estatus,
        ...(extra?.motivoRechazo ? { motivoRechazo: extra.motivoRechazo } : {}),
        ...(extra?.fechaEntrevista ? { fechaEntrevista: extra.fechaEntrevista } : {}),
      },
      {
        onSuccess: () => {
          setIsRejectOpen(false)
          setIsInterviewOpen(false)
          toast.success('Estatus actualizado', `${postulante.nombre} ahora aparece como ${nextStatus.label}.`)
        },
        onError: (error: unknown) => {
          toast.error('No se pudo actualizar', describirError(error))
        },
      }
    )
  }

  const aplicarEstatus = async (estatus: PostulanteEstatus) => {
    // El rechazo exige motivo: se captura en su propio modal.
    if (estatus === 'Rechazado') {
      setIsRejectOpen(true)
      return
    }

    // La entrevista permite agendar fecha (opcional) en su propio modal.
    if (estatus === 'Entrevista') {
      setIsInterviewOpen(true)
      return
    }

    const nextStatus = getPostulanteStatusMeta(estatus)
    const accepted = await confirm({
      title: ETIQUETA_ACCION[estatus] ?? `Marcar como ${nextStatus.label}`,
      message:
        estatus === 'Contratado'
          ? 'Se validara el cupo de la vacante y el cambio se vera en todos los apartados.'
          : 'Este cambio actualizara el seguimiento para empresa, estudiante/egresado y administracion.',
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      tone: 'info',
    })

    if (!accepted) return
    ejecutarCambio(estatus)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl brand-banner brand-banner--empresa p-7 text-white shadow-lg">
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
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{postulante.nombre}</h1>
                <span className="rounded-full border border-white/40 bg-white/15 px-2.5 py-0.5 text-[11px] font-bold">
                  {getAcademicLabel(postulante.estatusAcademico)}
                </span>
              </div>
              <p className="text-sm text-white/80">Estatus: {currentStatus.label}</p>
              {postulante.carrera ? (
                <p className="text-sm text-white/70">{postulante.carrera}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {transiciones.length === 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">
                <currentStatus.Icon size={16} />
                Proceso finalizado: {currentStatus.label}
              </span>
            ) : (
              transiciones.map((estatus) => {
                const meta = getPostulanteStatusMeta(estatus)
                const Icon = meta.Icon
                const esRechazo = estatus === 'Rechazado'

                return (
                  <button
                    type="button"
                    key={estatus}
                    onClick={() => void aplicarEstatus(estatus)}
                    disabled={isUpdating}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                      esRechazo
                        ? 'border border-white/40 text-white hover:bg-red-500/40'
                        : 'bg-white text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon size={16} />
                    {ETIQUETA_ACCION[estatus] ?? meta.label}
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
        {currentStatus.key === 'cvvisto' ? (
          <p className="mt-2 text-xs font-semibold opacity-80">
            Se marco automaticamente al abrir el perfil del candidato.
          </p>
        ) : null}
      </div>

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
          <p className="mt-2 text-sm font-semibold text-gray-800">
            {postulante.telefono?.trim() || 'No registrado'}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-emerald-500">
            <GraduationCap size={16} />
            <p className="text-xs font-semibold uppercase">Carrera</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-800">{postulante.carrera || 'Sin dato'}</p>
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

      <ModalRechazoPostulacion
        isOpen={isRejectOpen}
        candidatoNombre={postulante.nombre}
        isSubmitting={isUpdating}
        onClose={() => setIsRejectOpen(false)}
        onSubmit={(motivo) => ejecutarCambio('Rechazado', { motivoRechazo: motivo })}
      />

      <ModalCitarEntrevista
        isOpen={isInterviewOpen}
        candidatoNombre={postulante.nombre}
        isSubmitting={isUpdating}
        onClose={() => setIsInterviewOpen(false)}
        onSubmit={(fechaEntrevista) => ejecutarCambio('Entrevista', { fechaEntrevista })}
      />
    </div>
  )
}

export default DetallePostulante
