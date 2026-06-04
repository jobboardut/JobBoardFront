import { BriefcaseBusiness, Building2, CheckCircle2, MapPin } from 'lucide-react'
import type { Vacante } from '../types/publicaciones.types'

interface PublicationDetailProps {
  vacante: Vacante | null
  onApply: (publicacionId: number) => void
  isApplying: boolean
  hasApplied: boolean
}

const formatSalary = (value: number | null): string =>
  typeof value === 'number' && value > 0 ? `$ ${value.toLocaleString('es-MX')}` : 'No especificado'

const formatFecha = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export const PublicationDetail = ({ vacante, onApply, isApplying, hasApplied }: PublicationDetailProps) => {
  if (!vacante) {
    return (
      <article className="publication-scroll grid h-full place-items-center rounded-xl border border-[#e7e1d9] bg-white p-5 text-center shadow-[0_3px_15px_rgba(23,34,55,0.06)]">
        <p className="text-lg text-slate-400">Selecciona una vacante para ver el detalle.</p>
      </article>
    )
  }

  const responsabilidades = (vacante.requisitos ?? '')
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <article className="publication-scroll h-full overflow-y-auto rounded-xl border border-[#e7e1d9] bg-white p-5 shadow-[0_3px_15px_rgba(23,34,55,0.06)]">
      <div className="flex flex-col gap-4 border-b border-[#ece8e1] pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-18 w-18 place-items-center overflow-hidden rounded-xl border border-[#ded8cf] bg-[#f7f6f4] text-[#009A4D]">
            {vacante.empresaLogoUrl ? (
              <img src={vacante.empresaLogoUrl} alt={vacante.nombreEmpresa} className="h-full w-full object-cover" />
            ) : (
              <BriefcaseBusiness size={34} strokeWidth={1.7} />
            )}
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{vacante.titulo}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-2xl text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={18} />
                {vacante.nombreEmpresa}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={18} />
                {vacante.modalidad}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-400">{formatFecha(vacante.fechaPublicacion)}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl bg-[#f4f3f2] p-3">
          <p className="text-sm text-slate-400">Rango de Salario</p>
          <p className="mt-1 text-lg font-semibold text-[#009A4D]">{formatSalary(vacante.sueldoAprox)}</p>
        </div>
        <div className="rounded-xl bg-[#f4f3f2] p-3">
          <p className="text-sm text-slate-400">Modalidad</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">{vacante.modalidad}</p>
        </div>
        <div className="rounded-xl bg-[#f4f3f2] p-3">
          <p className="text-sm text-slate-400">Postulantes</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">{vacante.totalPostulantes}</p>
        </div>
      </div>

      <div className="mt-5 px-1 text-slate-600">
        <h2 className="text-3xl font-semibold text-slate-900">Descripción completa del empleo</h2>
        <p className="mt-2 whitespace-pre-line text-xl leading-relaxed">{vacante.descripcion}</p>

        {responsabilidades.length > 0 && (
          <>
            <h3 className="mt-4 text-2xl font-semibold text-slate-800">Requisitos / Responsabilidades</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-lg leading-relaxed">
              {responsabilidades.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        {hasApplied ? (
          <span className="inline-flex items-center gap-2 rounded-lg bg-[#e7f6ee] px-7 py-2.5 text-lg font-semibold text-[#009A4D]">
            <CheckCircle2 size={20} />
            Ya te postulaste
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onApply(vacante.id)}
            disabled={isApplying}
            className="rounded-lg bg-[#009A4D] px-7 py-2.5 text-lg font-semibold text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isApplying ? 'Enviando…' : 'Postularse'}
          </button>
        )}
      </div>
    </article>
  )
}
