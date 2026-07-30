import { Eye, Undo2 } from 'lucide-react'
import { EmptyState } from '@/shared/components/StateFeedback'
import type { Application } from '../types/seguimiento.types'

interface ApplicationsTableProps {
  applications: Application[]
  onViewDetails?: (application: Application) => void
  onRetirar?: (application: Application) => void
  isRetirando?: boolean
}

// Etapas del camino feliz; RECHAZADO y RETIRADO son salidas terminales.
const timelineSteps = ['POSTULADO', 'CV VISTO', 'ENTREVISTA', 'CONTRATADO'] as const

const TERMINALES = ['CONTRATADO', 'RECHAZADO', 'RETIRADO']

const STEP_COLORS: Record<string, string> = {
  POSTULADO: 'bg-[#EA580C]',
  'CV VISTO': 'bg-[#0EA5E9]',
  ENTREVISTA: 'bg-[#EAB308]',
  CONTRATADO: 'bg-[#10B981]',
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'POSTULADO':
      return 'bg-[rgba(234,88,12,0.12)] text-[#EA580C] border-[#EA580C]'
    case 'CV VISTO':
      return 'bg-[rgba(14,165,233,0.12)] text-[#0284C7] border-[#0EA5E9]'
    case 'ENTREVISTA':
      return 'bg-[rgba(234,179,8,0.14)] text-[#CA8A04] border-[#EAB308]'
    case 'CONTRATADO':
      return 'bg-[rgba(16,185,129,0.12)] text-[#10B981] border-[#10B981]'
    case 'RECHAZADO':
      return 'bg-red-100 text-red-700 border-red-300'
    case 'RETIRADO':
      return 'bg-slate-100 text-slate-600 border-slate-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

const getStatusDotColor = (status: string) => {
  if (status === 'RECHAZADO') return 'bg-red-500'
  if (status === 'RETIRADO') return 'bg-slate-400'
  return STEP_COLORS[status] ?? 'bg-gray-500'
}

const getTimelinePointClass = (status: string, step: (typeof timelineSteps)[number], stepIndex: number) => {
  if (status === 'RECHAZADO' || status === 'RETIRADO') {
    return stepIndex === 0 ? getStatusDotColor(status) : 'bg-slate-300'
  }

  const currentIndex = timelineSteps.indexOf(status as (typeof timelineSteps)[number])
  if (currentIndex === -1 || stepIndex > currentIndex) return 'bg-slate-300'

  return STEP_COLORS[step] ?? 'bg-slate-300'
}

const getTimelineSegmentClass = (status: string, stepIndex: number) => {
  if (status === 'RECHAZADO' || status === 'RETIRADO') return 'bg-slate-300'

  const currentIndex = timelineSteps.indexOf(status as (typeof timelineSteps)[number])
  if (currentIndex <= 0 || stepIndex >= currentIndex) return 'bg-slate-300'

  return STEP_COLORS[timelineSteps[stepIndex]] ?? 'bg-slate-300'
}

const puedeRetirarse = (status: string) => !TERMINALES.includes(status)

const formatInterviewDate = (value?: string | null): string | null => {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** Nota contextual: motivo del rechazo o fecha de la entrevista agendada. */
const NotaEstatus = ({ app }: { app: Application }) => {
  if (app.status === 'RECHAZADO' && app.rejectionReason) {
    return (
      <p className="mt-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
        <span className="font-bold">Motivo: </span>
        {app.rejectionReason}
      </p>
    )
  }

  const interviewDate = app.status === 'ENTREVISTA' ? formatInterviewDate(app.interviewDate) : null
  if (interviewDate) {
    return (
      <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
        <span className="font-bold">Entrevista: </span>
        {interviewDate}
      </p>
    )
  }

  return null
}

export const ApplicationsTable = ({ applications, onViewDetails, onRetirar, isRetirando = false }: ApplicationsTableProps) => {
  if (!applications.length) {
    return <EmptyState title="No hay postulaciones para mostrar" message="Tus aplicaciones apareceran aqui cuando postules a una vacante." />
  }

  return (
    <div className="rounded-2xl border border-[#e6e0d7] bg-white shadow-[0_4px_15px_rgba(29,37,56,0.05)]">
      <div className="grid gap-3 p-3 md:hidden">
        {applications.map((app) => (
          <article key={app.id} className="rounded-2xl border border-[#e6e0d7] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{app.jobTitle}</h3>
                <p className="mt-1 text-xs text-slate-500">{app.company}</p>
              </div>
              <button
                type="button"
                onClick={() => onViewDetails?.(app)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500"
                aria-label="Ver detalles"
              >
                <Eye size={18} strokeWidth={2} />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getStatusDotColor(app.status)}`} />
              <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(app.status)}`}>
                {app.status}
              </span>
            </div>
            <NotaEstatus app={app} />
            <p className="mt-3 text-xs font-semibold text-slate-500">Postulacion: {app.postulationDate}</p>
            {puedeRetirarse(app.status) && onRetirar ? (
              <button
                type="button"
                onClick={() => onRetirar(app)}
                disabled={isRetirando}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-red-500 disabled:opacity-50"
              >
                <Undo2 size={13} />
                Retirar postulacion
              </button>
            ) : null}
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e6e0d7] bg-[#fbfaf9]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">VACANTES</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                FECHA DE POSTULACIÓN
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ESTADO</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
                <tr
                  key={app.id}
                  className={`border-b border-[#e6e0d7] transition hover:bg-[#f8f7f4] ${
                    idx === applications.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-slate-900">{app.jobTitle}</p>
                      <p className="text-sm text-slate-500">{app.company}</p>
                      <div className="mt-2 flex max-w-68 items-center">
                        {timelineSteps.map((step, stepIndex) => (
                          <div key={step} className="flex items-center">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ring-2 ring-white ${getTimelinePointClass(
                                app.status,
                                step,
                                stepIndex
                              )}`}
                            />
                            {stepIndex < timelineSteps.length - 1 && (
                              <span className={`h-0.5 w-7 ${getTimelineSegmentClass(app.status, stepIndex)}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">{app.postulationDate}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusDotColor(app.status)}`} />
                      <span
                        className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="max-w-xs">
                      <NotaEstatus app={app} />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {puedeRetirarse(app.status) && onRetirar ? (
                        <button
                          type="button"
                          onClick={() => onRetirar(app)}
                          disabled={isRetirando}
                          title="Retirar postulacion"
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          aria-label="Retirar postulacion"
                        >
                          <Undo2 size={17} strokeWidth={2} />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onViewDetails?.(app)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-[#f0f0f0]"
                        aria-label="Ver detalles"
                      >
                        <Eye size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
