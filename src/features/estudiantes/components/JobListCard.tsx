import { memo } from 'react'
import { BriefcaseBusiness, Building2, CheckCircle2, Clock3, UsersRound, WalletCards } from 'lucide-react'
import type { JobCardItem } from '../types/publicaciones.types'

interface JobListCardProps {
  item: JobCardItem
  isActive?: boolean
  onSelect?: (id: number) => void
}

// memo: la lista puede tener muchas tarjetas y solo re-renderiza la que cambia.
export const JobListCard = memo(({ item, isActive = false, onSelect }: JobListCardProps) => {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(item.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect?.(item.id)
        }
      }}
      className={`group cursor-pointer rounded-2xl border bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_34px_rgba(15,23,42,0.10)] ${
        isActive
          ? 'border-emerald-300 ring-2 ring-emerald-500/15'
          : item.isApplied
            ? 'border-slate-200 bg-slate-50/70'
            : 'border-[#e6e0d7]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
          {item.logoUrl ? (
            <img src={item.logoUrl} alt={item.company} className="h-full w-full object-cover" />
          ) : (
            <BriefcaseBusiness size={22} strokeWidth={1.8} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-base font-bold leading-snug text-slate-900">{item.title}</h4>
            {item.isApplied ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 size={13} />
                Postulado
              </span>
            ) : null}
          </div>

          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <Building2 size={15} />
            {item.company}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-2">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#f4f3f2] px-2.5 py-2">
          <WalletCards size={14} className="text-emerald-600" />
          {item.salary}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#f4f3f2] px-2.5 py-2">
          <BriefcaseBusiness size={14} className="text-orange-500" />
          {item.modality}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={14} />
          {item.dateLabel || 'Fecha no disponible'}
        </span>
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <UsersRound size={14} />
            {item.applicantCount} postulantes
          </span>
          {item.placesLabel ? (
            <span
              className={`inline-flex items-center gap-1.5 font-semibold ${
                item.placesFull ? 'text-red-500' : 'text-emerald-600'
              }`}
            >
              <BriefcaseBusiness size={14} />
              {item.placesLabel} lugares
              {item.placesFull ? ' · LLENA' : ''}
            </span>
          ) : null}
        </span>
      </div>
    </article>
  )
})

JobListCard.displayName = 'JobListCard'
