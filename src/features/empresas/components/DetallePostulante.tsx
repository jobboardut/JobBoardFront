import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CalendarCheck, CheckCircle2, Mail, MapPin, Phone, XCircle } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { usePostulantes } from '../hooks/useEmpresa'

export const DetallePostulante = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const postulanteId = Number(id)
  const vacanteId = Number(searchParams.get('vacanteId'))
  const [estatusOverride, setEstatusOverride] = useState<{ postulanteId: number; estatus: string } | null>(null)

  const {
    data: postulantes = [],
    isLoading,
    isError,
  } = usePostulantes(vacanteId)

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

  const estatusActual = estatusOverride?.postulanteId === postulante.id
    ? estatusOverride.estatus
    : postulante.estatus

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
            <div>
              <h1 className="text-2xl font-semibold">{postulante.nombre}</h1>
              <p className="text-sm text-white/80">Estatus: {estatusActual}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEstatusOverride({ postulanteId: postulante.id, estatus: 'Entrevista' })}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-600"
            >
              <CalendarCheck size={16} />
              Entrevista
            </button>
            <button
              type="button"
              onClick={() => setEstatusOverride({ postulanteId: postulante.id, estatus: 'Aprobado' })}
              className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white"
            >
              <CheckCircle2 size={16} />
              Aprobar
            </button>
            <button
              type="button"
              onClick={() => setEstatusOverride({ postulanteId: postulante.id, estatus: 'Rechazado' })}
              className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white"
            >
              <XCircle size={16} />
              Rechazar
            </button>
          </div>
        </div>
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
    </div>
  )
}

export default DetallePostulante
