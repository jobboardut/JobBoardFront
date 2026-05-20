import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, LayoutGrid, List, UserCircle } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { usePostulantes, useVacantes } from '../hooks/useEmpresa'
import type { Postulante } from '../types/empresa.types'
import { KanbanPostulaciones } from './KanbanPostulaciones'

const dotEstatus: Record<string, string> = {
  pendiente: 'bg-orange-400',
  revision: 'bg-gray-300',
  entrevista: 'bg-blue-500',
  rechazado: 'bg-red-400',
}

const textEstatus: Record<string, string> = {
  pendiente: 'text-orange-400',
  revision: 'text-gray-500',
  entrevista: 'text-blue-500',
  rechazado: 'text-red-400',
}

export const Postulantes = () => {
  const [vista, setVista] = useState<'lista' | 'kanban'>('lista')
  const [vacanteSeleccionadaManual, setVacanteSeleccionadaManual] = useState<number | null>(null)
  const navigate = useNavigate()

  const {
    data: vacantes = [],
    isLoading: isLoadingVacantes,
    isError: isVacantesError,
  } = useVacantes()

  const vacanteSeleccionada = useMemo(() => {
    if (vacantes.length === 0) {
      return null
    }

    const exists = vacanteSeleccionadaManual
      ? vacantes.some((vacante) => vacante.id === vacanteSeleccionadaManual)
      : false

    return exists ? vacanteSeleccionadaManual : vacantes[0].id
  }, [vacantes, vacanteSeleccionadaManual])

  const vacanteActual = useMemo(
    () => vacantes.find((vacante) => vacante.id === vacanteSeleccionada),
    [vacantes, vacanteSeleccionada]
  )

  const {
    data: postulantes = [],
    isLoading: isLoadingPostulantes,
    isError: isPostulantesError,
  } = usePostulantes(vacanteSeleccionada ?? 0)

  const isLoading = isLoadingVacantes || (!!vacanteSeleccionada && isLoadingPostulantes)
  const isError = isVacantesError || isPostulantesError

  const goToDetallePostulante = (postulanteId: number) => {
    const basePath = ROUTES.EMPRESA_DETALLE_POSTULANTE.replace(':id', String(postulanteId))
    const search = vacanteSeleccionada ? `?vacanteId=${vacanteSeleccionada}` : ''
    navigate(`${basePath}${search}`)
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Cargando postulantes...</p>
    </div>
  )

  if (isError) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-red-400 text-sm">Error al cargar los postulantes.</p>
    </div>
  )

  return (
    <div>
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-3 text-3xl font-semibold">Gestiona talento en un solo lugar</h1>
            <p className="mt-2 text-sm text-white/80">
              Revisa avances, filtra candidatos y toma decisiones rapidas para tus vacantes activas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {vacantes.length > 0 && (
              <select
                value={vacanteSeleccionada ?? ''}
                onChange={(event) => setVacanteSeleccionadaManual(Number(event.target.value))}
                className="rounded-full border border-white/40 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 outline-none"
              >
                {vacantes.map((vacante) => (
                  <option key={vacante.id} value={vacante.id}>
                    {vacante.titulo}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => setVista('lista')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                vista === 'lista' ? 'bg-white text-emerald-600' : 'border border-white/40 text-white'
              }`}
            >
              <List size={16} />
              Lista
            </button>
            <button
              type="button"
              onClick={() => setVista('kanban')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                vista === 'kanban' ? 'bg-white text-emerald-600' : 'border border-white/40 text-white'
              }`}
            >
              <LayoutGrid size={16} />
              Kanban
            </button>
          </div>
        </div>
      </div>

      {vacantes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <p className="text-gray-400 text-sm">No hay vacantes publicadas todavia.</p>
        </div>
      ) : postulantes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <p className="text-gray-400 text-sm">
            No hay postulantes registrados para {vacanteActual?.titulo ?? 'esta vacante'}.
          </p>
        </div>
      ) : vista === 'lista' ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Candidato</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Estatus</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {postulantes.map((postulante) => (
                <tr key={postulante.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserCircle size={36} className="text-gray-300" />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{postulante.nombre}</p>
                        <p className="text-xs text-gray-400">{postulante.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {postulante.tipoUsuario}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dotEstatus[postulante.estatus?.toLowerCase()] ?? 'bg-gray-300'}`} />
                      <span className={`text-sm font-semibold ${textEstatus[postulante.estatus?.toLowerCase()] ?? 'text-gray-400'}`}>
                        {postulante.estatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => goToDetallePostulante(postulante.id)}
                      className="hover:text-emerald-500 text-gray-400 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <KanbanPostulaciones
          data={postulantes.reduce((acc, item) => {
            const key = item.estatus?.toLowerCase() ?? 'pendiente'
            acc[key] = acc[key] ? [...acc[key], item] : [item]
            return acc
          }, {} as Record<string, Postulante[]>)}
        />
      )}
    </div>
  )
}
