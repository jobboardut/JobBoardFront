import { memo } from 'react'
import { BriefcaseBusiness, Building2, CheckCircle2, Clock3, WalletCards } from 'lucide-react'
import type { SearchPublicationItem } from '../types/publicaciones.types'

interface SearchPublicationCardProps {
  item: SearchPublicationItem
  onSelect?: (id: number) => void
}

// memo: la busqueda re-renderiza solo las tarjetas que cambian.
export const SearchPublicationCard = memo(({ item, onSelect }: SearchPublicationCardProps) => {
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
      className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_34px_rgba(15,23,42,0.10)] ${
        item.isApplied ? 'border-slate-200 bg-slate-50/70' : 'border-[#e6e0d7]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
            {item.logoUrl ? (
              <img src={item.logoUrl} alt={item.company} className="h-full w-full object-cover" />
            ) : (
              <BriefcaseBusiness size={26} strokeWidth={1.8} />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold leading-tight text-slate-900">{item.title}</h3>
              {item.isApplied ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={14} />
                  Ya postulado
                </span>
              ) : null}
            </div>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <Building2 size={15} />
              {item.company}
            </p>
          </div>
        </div>
        <p className="hidden shrink-0 items-center gap-1.5 text-sm text-slate-400 sm:inline-flex">
          <Clock3 size={15} />
          {item.timeAgo || 'Sin fecha'}
        </p>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">{item.description}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(234,88,12,0.12)] px-3 py-1.5 text-xs font-bold text-[#EA580C]">
          <BriefcaseBusiness size={14} />
          {item.typeTag}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(0,154,77,0.12)] px-3 py-1.5 text-xs font-bold text-[#009A4D]">
          <WalletCards size={14} />
          {item.salaryTag}
        </span>
      </div>
    </article>
  )
})

SearchPublicationCard.displayName = 'SearchPublicationCard'
