import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  ListChecks,
  MapPin,
  Send,
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

/** Dato clave de la vacante: icono a la izquierda, etiqueta y valor apilados. */
const StatTile = ({
  icon,
  label,
  value,
  accent = 'text-slate-900',
  iconClass = 'bg-slate-100 text-slate-500',
  progress,
  badge,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent?: string
  iconClass?: string
  progress?: number
  badge?: string
}) => (
  <div className="flex min-w-0 flex-1 basis-44 items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition duration-200 hover:border-slate-200 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconClass}`}>
      {icon}
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-0.5 text-[15px] font-bold leading-tight ${accent}`}>
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
            className={`block h-full rounded-full transition-all duration-500 ${
              progress >= 100 ? 'bg-red-400' : 'bg-emerald-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </span>
      ) : null}
    </div>
  </div>
)

const ListaDetalle = ({
  titulo,
  items,
  icon,
  dot,
}: {
  titulo: string
  items: string[]
  icon: React.ReactNode
  dot: string
}) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-5">
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-base font-bold text-slate-900">{titulo}</h3>
    </div>
    <ul className="mt-3 grid gap-2.5 text-sm leading-6 text-slate-600">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className={`mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  </section>
)

export const PublicationDetail = ({ vacante, onApply, isApplying, hasApplied }: PublicationDetailProps) => {
  if (!vacante) {
    return (
      <article className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
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
  const cupoLleno = Boolean(lugares?.isFull)

  return (
    <article className="publication-scroll h-full overflow-y-auto rounded-2xl border border-[#e7e1d9] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
      {/* Encabezado fijo: identidad de la vacante y la accion principal siempre visible. */}
      <header className="sticky top-0 z-10 border-b border-[#ece8e1] bg-white/95 px-5 py-4 backdrop-blur lg:px-7 lg:py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-[#009A4D]">
              {vacante.empresaLogoUrl ? (
                <img src={vacante.empresaLogoUrl} alt={vacante.nombreEmpresa} className="h-full w-full object-cover" />
              ) : (
                <BriefcaseBusiness size={26} strokeWidth={1.7} />
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-950 lg:text-2xl">
                {vacante.titulo}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <Building2 size={15} className="text-slate-400" />
                  {vacante.nombreEmpresa}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} className="text-slate-400" />
                  {vacante.ubicacion || vacante.modalidad}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} className="text-slate-400" />
                  {formatDate(vacante.fechaPublicacion) || 'Sin fecha'}
                </span>
              </div>
            </div>
          </div>

          {/* Accion principal: siempre a la vista, sin robar ancho al contenido. */}
          <div className="shrink-0">
            {hasApplied ? (
              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={17} />
                Ya postulado
              </span>
            ) : cupoLleno ? (
              <span className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">
                Cupo lleno ({lugares?.label})
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onApply(vacante.id)}
                disabled={isApplying}
                className="inline-flex items-center gap-2 rounded-xl bg-[#009A4D] px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(0,154,77,0.22)] transition hover:-translate-y-0.5 hover:bg-[#10B981] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                <Send size={16} />
                {isApplying ? 'Enviando...' : 'Postularme'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-5 px-5 py-5 lg:px-7 lg:py-6">
        {/* Datos clave: se reparten en toda la fila y se acomodan solos. */}
        <div className="flex flex-wrap gap-3">
          <StatTile
            icon={<WalletCards size={19} />}
            iconClass="bg-emerald-50 text-emerald-600"
            label="Salario"
            value={formatSalary(vacante.sueldoAprox)}
            accent="text-[#009A4D]"
          />
          <StatTile
            icon={<BriefcaseBusiness size={19} />}
            iconClass="bg-orange-50 text-orange-600"
            label="Modalidad"
            value={vacante.modalidad || 'No especificada'}
          />
          <StatTile
            icon={<UsersRound size={19} />}
            label="Postulantes"
            value={`${vacante.totalPostulantes ?? 0}`}
          />
          <StatTile
            icon={<ClipboardList size={19} />}
            iconClass={cupoLleno ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}
            label="Cupo"
            value={lugares ? `${lugares.label} contratados` : 'Sin definir'}
            accent={cupoLleno ? 'text-red-600' : 'text-slate-900'}
            badge={cupoLleno ? 'LLENO' : undefined}
            progress={lugares?.percent}
          />
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Descripcion del empleo</h2>
          </div>
          <p className="mt-3 whitespace-pre-line break-words text-[15px] leading-7 text-slate-600">
            {vacante.descripcion}
          </p>
        </section>

        {/* En pantallas anchas los dos bloques conviven; en angostas se apilan. */}
        <div className="grid gap-5 xl:grid-cols-2">
          {requirements.length > 0 ? (
            <ListaDetalle
              titulo="Requisitos"
              items={requirements}
              icon={<ListChecks size={18} className="text-emerald-600" />}
              dot="bg-emerald-500"
            />
          ) : null}

          {responsabilidades.length > 0 ? (
            <ListaDetalle
              titulo="Responsabilidades"
              items={responsabilidades}
              icon={<ClipboardList size={18} className="text-orange-500" />}
              dot="bg-orange-500"
            />
          ) : null}
        </div>
      </div>
    </article>
  )
}
