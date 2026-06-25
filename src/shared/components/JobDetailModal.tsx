import { BriefcaseBusiness, Building2, CalendarDays, Clock3, FileText, MapPin, WalletCards, X } from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
      <div
        className="job-detail-scroll max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-label="Detalles de la vacante"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ece8e1] bg-white/95 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-600">Vacante</p>
            <h2 className="text-lg font-bold text-slate-950">Detalles de la vacante</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar detalle"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <section className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-orange-50/60 p-5 ring-1 ring-emerald-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-emerald-100 bg-white text-[#009A4D] shadow-sm">
                  <BriefcaseBusiness size={30} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 md:text-3xl">
                    {job.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">
                      <Building2 size={15} />
                      {job.company}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">
                      <MapPin size={15} />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                <CalendarDays size={15} />
                {job.timeAgo || 'Sin fecha'}
              </div>
            </div>
          </section>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-[#f7f5f1] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                <WalletCards size={15} className="text-emerald-600" />
                Salario
              </div>
              <p className="mt-2 text-base font-bold text-[#009A4D]">{job.salary}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f5f1] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                <Clock3 size={15} className="text-orange-500" />
                Horario
              </div>
              <p className="mt-2 text-base font-bold text-slate-800">{job.schedule}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f5f1] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                <BriefcaseBusiness size={15} className="text-emerald-600" />
                Tipo
              </div>
              <p className="mt-2 text-base font-bold text-slate-800">{job.type}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f5f1] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                <FileText size={15} className="text-slate-500" />
                Experiencia
              </div>
              <p className="mt-2 text-base font-bold text-slate-800">{job.experience}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <section className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-950">Descripcion del empleo</h2>
              </div>
              <p className="mt-3 break-words text-base leading-7 text-slate-600">{job.description}</p>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
              <h3 className="text-base font-bold text-slate-900">Responsabilidades principales</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="break-words">{resp}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {showApplyButton && (
            <div className="sticky bottom-0 mt-5 flex justify-end border-t border-slate-100 bg-white/95 pt-4">
              <button
                type="button"
                className="rounded-xl bg-[#009A4D] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(0,154,77,0.18)] transition hover:bg-[#10B981]"
              >
                Postularme
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
