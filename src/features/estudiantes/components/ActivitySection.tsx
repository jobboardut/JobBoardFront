import { ActivityCard } from './ActivityCard'
import type { ActivityColumn } from '../types/dashboard.types'

interface ActivitySectionProps {
  columns: ActivityColumn[]
}

export const ActivitySection = ({ columns }: ActivitySectionProps) => {
  return (
    <section className="mt-8">
      <h2 className="text-3xl font-semibold tracking-tight">Actividad Reciente</h2>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {columns.map((column) => (
          <article
            key={column.title}
            className="rounded-2xl border border-[#e6e0d7] bg-white p-5 shadow-[0_4px_15px_rgba(29,37,56,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(29,37,56,0.10)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">{column.title}</h3>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(16,185,129,0.12)] text-sm font-bold text-[#059669]">
                {column.count}
              </span>
            </div>

            <div className="my-4 h-px bg-[#e7e1d9]" />

            <div className="space-y-5">
              {column.items.length ? (
                column.items.map((item) => (
                  <ActivityCard key={item.id} item={item} status={column.status} />
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-[#e6e0d7] px-4 py-6 text-sm text-slate-400">
                  No hay postulaciones en este estado.
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
