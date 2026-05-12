import { BriefcaseBusiness, Building2, MapPin, X } from 'lucide-react'
import type { JobDetailData } from '@/shared/types/job.types'

interface JobDetailModalProps {
  job: JobDetailData | null
  isOpen: boolean
  onClose: () => void
  showApplyButton?: boolean
}

export const JobDetailModal = ({ job, isOpen, onClose, showApplyButton = true }: JobDetailModalProps) => {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="job-detail-scroll h-screen max-h-screen w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
        {/* Header con botón cerrar */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[#ece8e1] bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">Detalles de la Vacante</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="flex flex-col gap-4 border-b border-[#ece8e1] pb-4">
            <div className="flex items-start gap-4">
              <div className="grid h-18 w-18 place-items-center rounded-xl border border-[#ded8cf] bg-[#f7f6f4] text-[#009A4D] shrink-0">
                <BriefcaseBusiness size={34} strokeWidth={1.7} />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{job.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="inline-flex items-center gap-1.5 text-2xl text-slate-500">
                    <Building2 size={18} />
                    {job.company}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-2xl text-slate-500">
                    <MapPin size={18} />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400">{job.timeAgo}</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-[#f4f3f2] p-3">
              <p className="text-sm text-slate-400">Rango de Salario</p>
              <p className="mt-1 text-lg font-semibold text-[#009A4D]">{job.salary}</p>
            </div>
            <div className="rounded-xl bg-[#f4f3f2] p-3">
              <p className="text-sm text-slate-400">Turno y horario</p>
              <p className="mt-1 text-lg font-semibold text-slate-700">{job.schedule}</p>
            </div>
            <div className="rounded-xl bg-[#f4f3f2] p-3">
              <p className="text-sm text-slate-400">Tipo de Trabajo</p>
              <p className="mt-1 text-lg font-semibold text-slate-700">{job.type}</p>
            </div>
            <div className="rounded-xl bg-[#f4f3f2] p-3">
              <p className="text-sm text-slate-400">Experiencia</p>
              <p className="mt-1 text-lg font-semibold text-slate-700">{job.experience}</p>
            </div>
          </div>

          <div className="mt-5 text-slate-600">
            <h2 className="text-3xl font-semibold text-slate-900">Descripcion completa del empleo</h2>
            <p className="mt-2 text-xl leading-relaxed">{job.description}</p>

            <h3 className="mt-4 text-2xl font-semibold text-slate-800">Responsabilidades principales</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-lg leading-relaxed">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>

          {showApplyButton && (
            <div className="mt-6 flex justify-end pb-4">
              <button
                type="button"
                className="rounded-lg bg-[#009A4D] px-7 py-2.5 text-lg font-semibold text-white transition hover:bg-[#10B981]"
              >
                Postularse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
