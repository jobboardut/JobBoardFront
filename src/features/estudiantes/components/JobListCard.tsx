import type { JobCardItem } from '../types/publicaciones.types'

interface JobListCardProps {
  item: JobCardItem
  isActive?: boolean
  onSelect?: (id: number) => void
}

export const JobListCard = ({ item, isActive = false, onSelect }: JobListCardProps) => {
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
      className={`cursor-pointer rounded-xl border border-[#e6e0d7] border-b-2 bg-white p-4 shadow-[0_2px_12px_rgba(23,34,55,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-b-[#EA580C] hover:shadow-[0_10px_24px_rgba(23,34,55,0.12)] ${
        isActive ? 'border-b-[#EA580C] ring-2 ring-[#009A4D]/40' : 'border-b-[#009A4D]'
      }`}
    >
      <p className="text-right text-xs text-slate-400">Hace 3 Dias</p>
      <h4 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h4>
      <p className="text-base text-slate-500">{item.company}</p>
      <p className="text-base text-slate-500">{item.location}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-md bg-[#f4f3f2] px-2 py-1 text-xs font-medium text-slate-500">
          {item.salary}
        </span>
        <span className="rounded-md bg-[#f4f3f2] px-2 py-1 text-xs font-medium text-slate-500">
          {item.modality}
        </span>
      </div>
    </article>
  )
}
