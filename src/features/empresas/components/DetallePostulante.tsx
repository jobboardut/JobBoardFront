import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, FileText, GraduationCap, Mail, MapPin, Phone } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { useConfirmDialog } from '@/shared/components/appConfirmContext'
import { useAppToast } from '@/shared/components/appToastContext'
import { useActualizarEstatusPostulante, usePostulantes } from '../hooks/useEmpresa'
import type { PostulanteEstatus } from '../types/empresa.types'
import { POSTULANTE_STATUS_FLOW, getPostulanteStatusMeta } from '../utils/postulanteStatus'

export const DetallePostulante = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const postulanteId = Number(id)
  const vacanteId = Number(searchParams.get('vacanteId'))
  const toast = useAppToast()
  const { confirm } = useConfirmDialog()

  const {
    data: postulantes = [],
    isLoading,
    isError,
  } = usePostulantes(vacanteId)

  const { mutate: cambiarEstatus, isPending: isUpdating } = useActualizarEstatusPostulante(vacanteId)

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

  const estatusActual = postulante.estatus
  const currentStatus = getPostulanteStatusMeta(estatusActual)

  const aplicarEstatus = async (estatus: PostulanteEstatus) => {
    if (!postulante.postulacionId) {
      toast.warning('No se encontro la postulacion', 'Abre el postulante desde una vacante publicada.')
      return
    }

    const nextStatus = getPostulanteStatusMeta(estatus)
    const accepted = await confirm({
      title: `Marcar como ${nextStatus.label}`,
      message: `Este cambio actualizara el seguimiento para empresa, estudiante/egresado y administracion.`,
      confirmLabel: 'Actualizar estatus',
      cancelLabel: 'Cancelar',
      tone: nextStatus.key === 'rechazada' ? 'danger' : 'info',
    })

    if (!accepted) return

    cambiarEstatus(
      { postulacionId: postulante.postulacionId, estatus },
      {
        onSuccess: () => {
          toast.success('Estatus actualizado', `${postulante.nombre} ahora aparece como ${nextStatus.label}.`)
        },
        onError: (error: unknown) => {
          const message = (error as { message?: string })?.message ?? 'Intenta de nuevo en unos segundos.'
          toast.error('No se pudo actualizar', message)
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
          <div className="flex flex-wrap gap-2">
            {POSTULANTE_STATUS_FLOW.filter((status) => status.key !== 'pendiente').map((status) => {
              const Icon = status.Icon
              const isActive = status.key === currentStatus.key

              return (
                <button
                  type="button"
                  key={status.key}
                  onClick={() => void aplicarEstatus(status.apiValue)}
                  disabled={isUpdating || isActive}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : status.key === 'aceptada'
                        ? 'bg-white text-emerald-600'
                        : 'border border-white/40 text-white hover:bg-white/15'
                  }`}
                >
                  <Icon size={16} />
                  {status.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border px-5 py-4 ${currentStatus.pillClass}`}>
        <p className="text-sm font-black">Estado actual: {currentStatus.label}</p>
        <p className="mt-1 text-sm">{currentStatus.description}</p>
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

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Resumen</h2>
        <p className="text-sm text-gray-600">{postulante.descripcion || 'Sin descripcion adicional.'}</p>
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
    </div>
  )
}

export default DetallePostulante
