import { BriefcaseBusiness } from 'lucide-react'
import type { SearchPublicationItem } from '../types/publicaciones.types'

interface SearchPublicationCardProps {
  item: SearchPublicationItem
}

export const SearchPublicationCard = ({ item }: SearchPublicationCardProps) => {
  return (
    <article className="rounded-2xl border border-[#e6e0d7] border-b-2 border-b-[#009A4D] bg-white px-4 py-4 shadow-[0_2px_12px_rgba(23,34,55,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-b-[#EA580C] hover:shadow-[0_12px_24px_rgba(23,34,55,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-xl border border-[#ddd8cf] bg-[#f6f5f3] text-[#009A4D]">
            <BriefcaseBusiness size={28} strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{item.location}</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">{item.timeAgo}</p>
      </div>

      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-700">{item.description}</p>

      <div className="mt-3 flex justify-end gap-2">
        <span className="rounded-md bg-[rgba(234,88,12,0.12)] px-2.5 py-1 text-xs font-medium text-[#EA580C]">{item.typeTag}</span>
        <span className="rounded-md bg-[rgba(0,154,77,0.12)] px-2.5 py-1 text-xs font-medium text-[#009A4D]">{item.salaryTag}</span>
      </div>
    </article>
  )
}
