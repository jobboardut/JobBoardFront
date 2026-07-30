import { memo, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Eye, FileText, GraduationCap, Hash, LayoutGrid, List, Mail, UserCircle, UsersRound } from 'lucide-react'
import { PageHero } from '@/shared/components/PageHero'
import { ROUTES } from '@/router/routes'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/StateFeedback'
import { getLugaresInfo } from '@/shared/utils/lugares'
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

// Tarjeta clara de candidato: quien es, que estudia y en que etapa va.
// memo: en listas largas solo se repinta la tarjeta que cambia.
const CandidatoCard = memo(({
  postulante,
  onVer,
}: {
  postulante: Postulante
  onVer: (id: number) => void
}) => (
  <article className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:flex-row sm:items-center">
    <div className="flex min-w-0 flex-1 items-center gap-4">
      {postulante.fotoUrl ? (
        <img
          src={postulante.fotoUrl}
          alt={postulante.nombre}
          className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
        />
      ) : (
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">
          <UserCircle size={32} />
        </span>
      )}

      <div className="min-w-0">
        <p className="truncate text-base font-bold text-slate-900">{postulante.nombre}</p>

        <div className="mt-1 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
          <span className="inline-flex items-center gap-1.5 truncate">
            <GraduationCap size={13} className="shrink-0 text-emerald-500" />
            {postulante.carrera || postulante.tipoUsuario || 'Sin carrera'}
          </span>
          <span className="inline-flex items-center gap-1.5 truncate">
            <Hash size={13} className="shrink-0 text-slate-400" />
            {postulante.matricula || 'Sin matricula'}
          </span>
          <span className="inline-flex items-center gap-1.5 truncate sm:col-span-2">
            <Mail size={13} className="shrink-0 text-slate-400" />
            {postulante.email}
          </span>
        </div>
      </div>
    </div>

    <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
      <StatusPill status={postulante.estatus} />

      <div className="flex items-center gap-2">
        {postulante.cvUrl ? (
          <a
            href={postulante.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver CV"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600"
          >
            <FileText size={17} />
          </a>
        ) : (
          <span
            title="Sin CV"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-100 text-slate-300"
          >
            <FileText size={17} />
          </span>
        )}
        <button
          type="button"
          onClick={() => onVer(postulante.id)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
        >
          <Eye size={15} />
          Ver perfil
        </button>
      </div>
    </div>
  </article>
))

CandidatoCard.displayName = 'CandidatoCard'

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

  const lugares = vacanteActual ? getLugaresInfo(vacanteActual) : null

  // Conteo por etapa del proceso, para leer el avance de un vistazo.
  const resumenEstatus = useMemo(() => {
    const etapas = ['Postulado', 'CvVisto', 'Entrevista', 'Contratado', 'Rechazado']

    return etapas.map((etapa) => ({
      label: getPostulanteStatusMeta(etapa).label,
      count: postulantes.filter(
        (postulante) => getPostulanteStatusMeta(postulante.estatus).key === getPostulanteStatusMeta(etapa).key,
      ).length,
    }))
  }, [postulantes])

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
      <div className="mb-6">
        <PageHero
          tone="empresa"
          eyebrow="Talento"
          title="Gestiona tus candidatos"
          description="Revisa avances, filtra candidatos y toma decisiones rapidas para tus vacantes activas."
          Icon={UsersRound}
          actions={
            <>
              {vacantes.length > 0 && (
                <select
                  value={vacanteSeleccionada ?? ''}
                  onChange={(event) => setVacanteSeleccionadaManual(Number(event.target.value))}
                  aria-label="Vacante a revisar"
                  className="hero-btn hero-btn--ghost max-w-[15rem] cursor-pointer truncate pr-3 text-white [&>option]:text-slate-800"
                >
                  {vacantes.map((vacante) => (
                    <option key={vacante.id} value={vacante.id}>
                      {vacante.titulo}
                    </option>
                  ))}
                </select>
              )}
              <div className="inline-flex rounded-xl bg-white/12 p-1 ring-1 ring-white/25 backdrop-blur">
                <button
                  type="button"
                  onClick={() => setVista('lista')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    vista === 'lista' ? 'bg-white text-orange-700 shadow-sm' : 'text-white/85 hover:text-white'
                  }`}
                >
                  <List size={15} />
                  Lista
                </button>
                <button
                  type="button"
                  onClick={() => setVista('kanban')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    vista === 'kanban' ? 'bg-white text-orange-700 shadow-sm' : 'text-white/85 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={15} />
                  Kanban
                </button>
              </div>
            </>
          }
        />
      </div>

      {vacantes.length === 0 ? (
        <EmptyState title="No hay vacantes publicadas" message="Publica una vacante para comenzar a recibir postulantes." />
      ) : (
        <>
          {/* Contexto de la vacante seleccionada: lugares y avance por etapa. */}
          <div className="mb-6 grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Vacante seleccionada</p>
              <h2 className="mt-1 truncate text-lg font-bold text-slate-900">
                {vacanteActual?.titulo ?? 'Sin vacante'}
              </h2>

              {lugares ? (
                <div className="mt-3 max-w-sm">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <BriefcaseBusiness size={14} className={lugares.isFull ? 'text-red-500' : 'text-emerald-500'} />
                      Lugares cubiertos
                    </span>
                    <span className={lugares.isFull ? 'text-red-600' : 'text-emerald-600'}>
                      {lugares.label}
                      {lugares.isFull ? ' · LLENA' : ''}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${lugares.isFull ? 'bg-red-400' : 'bg-emerald-500'}`}
                      style={{ width: `${lugares.percent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-400">Esta vacante no tiene lugares definidos.</p>
              )}
            </div>

            {/* Resumen por etapa: de un vistazo se ve en que va cada candidato. */}
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {resumenEstatus.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center min-w-[74px]"
                >
                  <p className="text-lg font-bold text-slate-900">{item.count}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {postulantes.length === 0 ? (
            <EmptyState
              title="Aun no hay candidatos"
              message={`Nadie se ha postulado a "${vacanteActual?.titulo ?? 'esta vacante'}" todavia.`}
            />
          ) : vista === 'lista' ? (
            <div className="grid gap-3">
              {postulantes.map((postulante) => (
                <CandidatoCard
                  key={postulante.id}
                  postulante={postulante}
                  onVer={goToDetallePostulante}
                />
              ))}
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
        </>
      )}
    </div>
  )
}
