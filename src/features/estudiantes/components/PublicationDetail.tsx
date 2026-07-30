import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  MapPin,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import { formatMoney } from '@/shared/utils/money'
import { getLugaresInfo } from '@/shared/utils/lugares'
import type { Vacante } from '../types/publicaciones.types'

interface PublicationDetailProps {
  vacante: Vacante | null
  onApply: (publicacionId: number) => void
  isApplying: boolean
  hasApplied: boolean
}

const formatSalary = (value: number | null): string => formatMoney(value, 'No especificado')

// Los campos largos se capturan una linea por item.
const listaDeTexto = (valor?: string | null): string[] =>
  (valor ?? '')
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean)

const formatDate = (iso: string): string => {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const ListaDetalle = ({ titulo, items, color }: { titulo: string; items: string[]; color: string }) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-4">
    <h3 className="text-lg font-bold text-slate-900">{titulo}</h3>
    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />
          <span className="break-words">{item}</span>
        </li>
      ))}
    </ul>
  </section>
)

const TONES = {
  emerald: { icon: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-700', bar: 'bg-emerald-500' },
  orange: { icon: 'bg-orange-50 text-orange-600', value: 'text-slate-800', bar: 'bg-orange-500' },
  slate: { icon: 'bg-slate-100 text-slate-500', value: 'text-slate-800', bar: 'bg-slate-400' },
  red: { icon: 'bg-red-50 text-red-500', value: 'text-red-600', bar: 'bg-red-400' },
} as const

type MetricTileProps = {
  icon: React.ReactNode
  tone: keyof typeof TONES
  label: string
  value: string
  badge?: string
  progress?: number
  highlight?: boolean
}

/** Dato compacto de la vacante. El texto se ajusta para no desbordar la tarjeta. */
const MetricTile = ({ icon, tone, label, value, badge, progress, highlight }: MetricTileProps) => {
  const palette = TONES[tone]

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
      <div className="flex items-center gap-2">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${palette.icon}`}>
          {icon}
        </span>
        <span className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 text-balance break-words text-[15px] font-bold leading-snug ${
          highlight ? palette.value : palette.value
        }`}
      >
        {value}
        {badge ? (
          <span className="ml-1.5 rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-black text-red-600">
            {badge}
          </span>
        ) : null}
      </p>

      {typeof progress === 'number' ? (
        <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <span
            className={`block h-full rounded-full transition-all duration-500 ${palette.bar}`}
            style={{ width: `${progress}%` }}
          />
        </span>
      ) : null}
    </div>
  )
}

export const PublicationDetail = ({ vacante, onApply, isApplying, hasApplied }: PublicationDetailProps) => {
  if (!vacante) {
    return (
      <article className="publication-scroll grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <BriefcaseBusiness size={26} strokeWidth={1.8} />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-700">Selecciona una vacante</p>
          <p className="mt-1 text-sm text-slate-400">Aqui veras la informacion completa antes de postular.</p>
        </div>
      </article>
    )
  }

  const requirements = listaDeTexto(vacante.requisitos)
  const responsabilidades = listaDeTexto(vacante.responsabilidades)
  const lugares = getLugaresInfo(vacante)

  return (
    <article className="publication-scroll h-full overflow-y-auto rounded-2xl border border-[#e7e1d9] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
      <div className="border-b border-[#ece8e1] bg-gradient-to-br from-white via-white to-emerald-50/45 p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-[#009A4D]">
            {vacante.empresaLogoUrl ? (
              <img
                src={vacante.empresaLogoUrl}
                alt={vacante.nombreEmpresa}
                className="h-full w-full object-cover"
              />
            ) : (
              <BriefcaseBusiness size={30} strokeWidth={1.7} />
            )}
          </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 lg:text-3xl">
              {vacante.titulo}
            </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">
                  <Building2 size={15} />
                {vacante.nombreEmpresa}
              </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">
                  <MapPin size={15} />
                  {vacante.ubicacion || vacante.modalidad}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">
                  <CalendarDays size={15} />
                  {formatDate(vacante.fechaPublicacion) || 'Sin fecha'}
                </span>
              </div>
            </div>
          </div>

          {hasApplied ? (
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              <CheckCircle2 size={17} />
              Ya postulado
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_240px] lg:p-6">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            <MetricTile
              icon={<WalletCards size={16} />}
              tone="emerald"
              label="Salario"
              value={formatSalary(vacante.sueldoAprox)}
              highlight
            />
            <MetricTile
              icon={<BriefcaseBusiness size={16} />}
              tone="orange"
              label="Modalidad"
              value={vacante.modalidad || 'No especificada'}
            />
            <MetricTile
              icon={<UsersRound size={16} />}
              tone="slate"
              label="Postulantes"
              value={String(vacante.totalPostulantes ?? 0)}
            />
            <MetricTile
              icon={<BriefcaseBusiness size={16} />}
              tone={lugares?.isFull ? 'red' : 'emerald'}
              label="Cupo"
              value={lugares ? `${lugares.label} contratados` : 'Sin definir'}
              badge={lugares?.isFull ? 'LLENO' : undefined}
              progress={lugares?.percent}
            />
          </div>

          <section className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-950">Descripcion del empleo</h2>
            </div>
            <p className="mt-3 whitespace-pre-line break-words text-base leading-7 text-slate-600">{vacante.descripcion}</p>
          </section>

          {requirements.length > 0 ? (
            <ListaDetalle titulo="Requisitos" items={requirements} color="bg-emerald-500" />
          ) : null}

          {responsabilidades.length > 0 ? (
            <ListaDetalle titulo="Responsabilidades" items={responsabilidades} color="bg-orange-500" />
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-700">Siguiente paso</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Revisa que la vacante coincida con tu perfil antes de enviar tu postulacion.
          </p>
          {hasApplied ? (
            <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">
              <CheckCircle2 size={18} />
              Ya estas postulado
            </div>
          ) : lugares?.isFull ? (
            <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-red-600 ring-1 ring-red-200">
              Vacante llena ({lugares.label})
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onApply(vacante.id)}
              disabled={isApplying}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#009A4D] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(0,154,77,0.18)] transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isApplying ? 'Enviando...' : 'Postularme'}
            </button>
          )}
        </aside>
      </div>
    </article>
  )
}
