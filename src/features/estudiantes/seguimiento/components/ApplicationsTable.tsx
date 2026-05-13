import { Eye } from 'lucide-react'
import type { Application } from '../types'

interface ApplicationsTableProps {
  applications: Application[]
  onViewDetails?: (application: Application) => void
}

const timelineSteps = ['EN REVISIÓN', 'PENDIENTE', 'APRUEBA', 'ACEPTADO', 'CONTRATADO', 'RECHAZADO'] as const

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'EN REVISIÓN':
      return 'bg-[rgba(234,179,8,0.14)] text-[#CA8A04] border-[#EAB308]'
    case 'ACEPTADO':
      return 'bg-[rgba(0,154,77,0.12)] text-[#009A4D] border-[#009A4D]'
    case 'APRUEBA':
      return 'bg-[rgba(16,185,129,0.12)] text-[#10B981] border-[#10B981]'
    case 'CONTRATADO':
      return 'bg-[rgba(16,185,129,0.12)] text-[#10B981] border-[#10B981]'
    case 'PENDIENTE':
      return 'bg-[rgba(234,88,12,0.12)] text-[#EA580C] border-[#EA580C]'
    case 'RECHAZADO':
      return 'bg-red-100 text-red-700 border-red-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

const getStatusDotColor = (status: string) => {
  switch (status) {
    case 'EN REVISIÓN':
      return 'bg-[#EAB308]'
    case 'ACEPTADO':
      return 'bg-[#009A4D]'
    case 'APRUEBA':
      return 'bg-[#10B981]'
    case 'CONTRATADO':
      return 'bg-[#10B981]'
    case 'PENDIENTE':
      return 'bg-[#EA580C]'
    case 'RECHAZADO':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const getTimelinePointClass = (status: string, step: (typeof timelineSteps)[number], stepIndex: number) => {
  if (status === 'CONTRATADO') {
    return 'bg-[#10B981]'
  }

  if (status === 'RECHAZADO') {
    return 'bg-red-500'
  }

  if (status === 'PENDIENTE') {
    if (step === 'PENDIENTE') return 'bg-[#EA580C]'
    if (stepIndex === 0) return 'bg-[#EAB308]'
    return 'bg-slate-300'
  }

  const currentIndex = timelineSteps.indexOf(status as (typeof timelineSteps)[number])
  if (currentIndex === -1) return 'bg-slate-300'
  if (stepIndex < currentIndex) {
    if (stepIndex === 0) return 'bg-[#EAB308]'
    if (stepIndex === 1 && currentIndex > 1) return 'bg-[#EA580C]'
    if (stepIndex === 2 && currentIndex > 2) return 'bg-[#10B981]'
    return 'bg-[#009A4D]'
  }
  if (stepIndex === currentIndex) {
    if (status === 'APRUEBA') return 'bg-[#10B981]'
    if (status === 'EN REVISIÓN') return 'bg-[#EAB308]'
    return 'bg-[#009A4D]'
  }
  return 'bg-slate-300'
}

const getTimelineSegmentClass = (status: string, stepIndex: number) => {
  if (status === 'CONTRATADO') {
    return 'bg-[#10B981]'
  }

  if (status === 'RECHAZADO') {
    return 'bg-red-500'
  }

  if (status === 'PENDIENTE') {
    if (stepIndex === 0) return 'bg-[#EAB308]'
    if (stepIndex === 1) return 'bg-[#EA580C]'
    return 'bg-slate-300'
  }

  const currentIndex = timelineSteps.indexOf(status as (typeof timelineSteps)[number])
  if (currentIndex <= 0) return 'bg-slate-300'
  if (stepIndex < currentIndex - 1) {
    if (stepIndex === 0) return 'bg-[#EAB308]'
    if (stepIndex === 1 && currentIndex > 2) return 'bg-[#EA580C]'
    if (stepIndex === 2 && currentIndex > 3) return 'bg-[#10B981]'
    return 'bg-[#009A4D]'
  }
  if (stepIndex === currentIndex - 1) {
    if (status === 'EN REVISIÓN') return 'bg-[#EAB308]'
    if (status === 'PENDIENTE') return 'bg-[#EA580C]'
    if (status === 'APRUEBA') return 'bg-[#10B981]'
    return 'bg-[#009A4D]'
  }
  return 'bg-slate-300'
}

export const ApplicationsTable = ({ applications, onViewDetails }: ApplicationsTableProps) => {
  return (
    <div className="rounded-2xl border border-[#e6e0d7] bg-white shadow-[0_4px_15px_rgba(29,37,56,0.05)]">
      <div className="overflow-x-auto">
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
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(app)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-[#f0f0f0]"
                    aria-label="Ver detalles"
                  >
                    <Eye size={18} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
