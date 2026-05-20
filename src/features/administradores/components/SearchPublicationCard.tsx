import { BriefcaseBusiness, MapPin } from 'lucide-react'
import type { JobItem } from '../types/dashboard.types'

interface SearchPublicationCardProps {
	item: JobItem
}

export const SearchPublicationCard = ({ item }: SearchPublicationCardProps) => {
	return (
		<article className="group cursor-pointer rounded-xl border border-[#ede8e0] border-b-4 border-b-[#009A4D] bg-white p-5 shadow-[0_2px_12px_rgba(23,34,55,0.06)] transition-all duration-200 hover:border-b-[#059669] hover:shadow-[0_8px_20px_rgba(23,34,55,0.15)]">
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
					<p className="mt-1 text-sm text-slate-500">{item.company}</p>

					<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
						<span className="inline-flex items-center gap-1.5">
							<MapPin size={16} />
							{item.location}
						</span>
						<span className="inline-flex items-center gap-1.5">
							<BriefcaseBusiness size={16} />
							{item.type}
						</span>
					</div>
				</div>
			</div>

			<p className="mt-3 text-lg font-semibold text-[#059669]">{item.salary}</p>

			<div className="mt-3 inline-block rounded-full bg-[#f4f3f2] px-3 py-1 text-xs font-medium text-slate-600">
				{item.availability}
			</div>
		</article>
	)
}
