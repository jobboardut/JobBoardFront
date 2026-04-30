import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, DollarSign, Eye, Pencil, Users, XCircle } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { useActualizarEstatusVacante, usePostulantes, useVacante } from '../hooks/useEmpresa'

const formatFecha = (fecha?: string) => {
  if (!fecha) return 'Sin fecha'

  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha

  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return 'Sin dato'

  return value.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  })
}

export const DetalleVacante = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const publicacionId = Number(id)

  const {
    data: vacante,
    isLoading: isLoadingVacante,
    isError: isVacanteError,
  } = useVacante(publicacionId)

  const {
    data: postulantes = [],
    isLoading: isLoadingPostulantes,
  } = usePostulantes(publicacionId)

  const {
    mutate: actualizarEstatus,
    isPending: isUpdatingStatus,
  } = useActualizarEstatusVacante()

  const handleCerrarVacante = () => {
    if (!vacante) return

    const confirmar = window.confirm(`Cerrar la vacante "${vacante.titulo}"?`)
    if (!confirmar) return

    actualizarEstatus({
      publicacionId,
      data: { estatus: 'Finalizada' },
    })
  }

  const goToDetallePostulante = (postulanteId: number) => {
    const path = ROUTES.EMPRESA_DETALLE_POSTULANTE.replace(':id', String(postulanteId))
    navigate(`${path}?vacanteId=${publicacionId}`)
  }

  if (!id || Number.isNaN(publicacionId)) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">No se encontro la vacante.</p>
      </div>
    )
  }

  if (isLoadingVacante) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Cargando vacante...</p>
    </div>
  )

  if (isVacanteError || !vacante) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm text-red-400">Error al cargar la vacante. Intenta de nuevo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(ROUTES.EMPRESA_PUBLICACIONES)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white hover:bg-white/25"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{vacante.titulo}</h1>
              <p className="text-sm text-white/80">
                {vacante.modalidad} - {vacante.estatus}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.EMPRESA_EDITAR_VACANTE.replace(':id', String(vacante.id)))}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-600"
            >
              <Pencil size={16} />
              Editar
            </button>
            <button
              type="button"
              onClick={handleCerrarVacante}
              disabled={isUpdatingStatus || vacante.estatus === 'Finalizada'}
              className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              <XCircle size={16} />
              {isUpdatingStatus ? 'Cerrando...' : 'Cerrar vacante'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-emerald-500">
            <Calendar size={16} />
            <p className="text-xs font-semibold uppercase">Publicada</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-800">{formatFecha(vacante.fechaPublicacion)}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-orange-500">
            <Users size={16} />
            <p className="text-xs font-semibold uppercase">Postulantes</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-800">{postulantes.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-emerald-500">
            <DollarSign size={16} />
            <p className="text-xs font-semibold uppercase">Sueldo aprox.</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-800">{formatCurrency(vacante.sueldoAprox)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Descripcion</h2>
          <p className="text-sm leading-6 text-gray-600">{vacante.descripcion || 'Sin descripcion registrada.'}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Requisitos</h2>
          <p className="text-sm leading-6 text-gray-600">{vacante.requisitos || 'Sin requisitos registrados.'}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Candidatos postulados</h2>
          <button
            type="button"
            onClick={() => navigate(ROUTES.EMPRESA_POSTULANTES)}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Ver todos
          </button>
        </div>

        {isLoadingPostulantes ? (
          <p className="text-sm text-gray-400">Cargando candidatos...</p>
        ) : postulantes.length === 0 ? (
          <p className="text-sm text-gray-400">Todavia no hay postulantes para esta vacante.</p>
        ) : (
          <div className="grid gap-3">
            {postulantes.slice(0, 5).map((candidato) => (
              <div key={candidato.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{candidato.nombre}</p>
                  <p className="text-xs text-gray-500">{candidato.tipoUsuario}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {candidato.estatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToDetallePostulante(candidato.id)}
                    className="text-gray-400 hover:text-emerald-500"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DetalleVacante
