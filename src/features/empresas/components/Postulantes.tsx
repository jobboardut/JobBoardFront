import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, FileText, LayoutGrid, List, UserCircle } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/StateFeedback'
import { usePostulantes, useVacantes } from '../hooks/useEmpresa'
import type { Postulante } from '../types/empresa.types'
import { getPostulanteStatusMeta } from '../utils/postulanteStatus'
import { KanbanPostulaciones } from './KanbanPostulaciones'

const StatusPill = ({ status }: { status?: string }) => {
  const meta = getPostulanteStatusMeta(status)

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${meta.pillClass}`}>
      <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  )
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
    <LoadingState title="Cargando postulantes" message="Estamos consultando el talento de tus vacantes." />
  )

  if (isError) return (
    <ErrorState title="Error al cargar postulantes" message="Intenta actualizar la pagina en unos segundos." />
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
        <EmptyState title="No hay vacantes publicadas" message="Publica una vacante para comenzar a recibir postulantes." />
      ) : postulantes.length === 0 ? (
        <EmptyState title="No hay postulantes registrados" message={`Aun no hay candidatos para ${vacanteActual?.titulo ?? 'esta vacante'}.`} />
      ) : vista === 'lista' ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid gap-3 p-3 md:hidden">
            {postulantes.map((postulante) => (
              <article key={postulante.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {postulante.fotoUrl ? (
                      <img
                        src={postulante.fotoUrl}
                        alt={postulante.nombre}
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <UserCircle size={36} className="shrink-0 text-gray-300" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{postulante.nombre}</p>
                      <p className="truncate text-xs text-slate-500">{postulante.email}</p>
                      <p className="truncate text-xs font-semibold text-emerald-600">
                        {postulante.carrera || postulante.tipoUsuario}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {postulante.cvUrl ? (
                      <a
                        href={postulante.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500"
                        aria-label="Ver CV"
                      >
                        <FileText size={18} />
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => goToDetallePostulante(postulante.id)}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500"
                      aria-label="Ver postulante"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-500">
                    {postulante.matricula ? `Matricula ${postulante.matricula}` : postulante.estatusAcademico ?? 'Sin matricula'}
                  </span>
                  <StatusPill status={postulante.estatus} />
                </div>
              </article>
            ))}
          </div>

          <table className="hidden w-full md:table">
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
                      {postulante.fotoUrl ? (
                        <img
                          src={postulante.fotoUrl}
                          alt={postulante.nombre}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-200"
                        />
                      ) : (
                        <UserCircle size={36} className="text-gray-300" />
                      )}
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{postulante.nombre}</p>
                        <p className="text-xs text-gray-400">{postulante.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {postulante.carrera || postulante.tipoUsuario}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={postulante.estatus} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => goToDetallePostulante(postulante.id)}
                        className="hover:text-emerald-500 text-gray-400 transition-colors"
                        title="Ver detalle"
                      >
                        <Eye size={18} />
                      </button>
                      {postulante.cvUrl ? (
                        <a
                          href={postulante.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-500 text-gray-400 transition-colors"
                          title="Ver CV"
                        >
                          <FileText size={18} />
                        </a>
                      ) : (
                        <FileText size={18} className="text-gray-200" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <KanbanPostulaciones
          data={postulantes.reduce((acc, item) => {
            const key = getPostulanteStatusMeta(item.estatus).key
            acc[key] = acc[key] ? [...acc[key], item] : [item]
            return acc
          }, {} as Record<string, Postulante[]>)}
        />
      )}
    </div>
  )
}
