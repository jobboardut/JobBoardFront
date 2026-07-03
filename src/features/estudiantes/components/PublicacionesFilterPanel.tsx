import { RotateCcw } from 'lucide-react'

export const MODALIDADES_FILTRO = ['Presencial', 'Remota', 'Hibrida'] as const

interface PublicacionesFilterPanelProps {
  selectedModalidades: string[]
  onToggleModalidad: (modalidad: string) => void
  minSalary?: number
  salaryBounds?: { min: number; max: number }
  onMinSalaryChange?: (value: number) => void
  onClear: () => void
  hasActiveFilters?: boolean
}

const formatMoney = (value: number) => `$${value.toLocaleString('es-MX')}`

export const PublicacionesFilterPanel = ({
  selectedModalidades,
  onToggleModalidad,
  minSalary,
  salaryBounds,
  onMinSalaryChange,
  onClear,
  hasActiveFilters = false,
}: PublicacionesFilterPanelProps) => {
  const showSalary = typeof minSalary === 'number' && Boolean(salaryBounds) && Boolean(onMinSalaryChange)

  return (
    <aside className="rounded-2xl border border-[#e8d4ca] bg-white p-4 shadow-[0_2px_12px_rgba(23,34,55,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Modalidad</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <RotateCcw size={13} />
            Limpiar
          </button>
        )}
      </div>

      <div className="mt-3 space-y-3 text-slate-500">
        {MODALIDADES_FILTRO.map((modalidad) => (
          <label key={modalidad} className="flex cursor-pointer items-center gap-2 text-base">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#cbd5e1] text-[#009A4D]"
              checked={selectedModalidades.includes(modalidad)}
              onChange={() => onToggleModalidad(modalidad)}
            />
            {modalidad}
          </label>
        ))}
      </div>

      {showSalary && salaryBounds && onMinSalaryChange && (
        <>
          <h3 className="mt-5 text-lg font-semibold text-slate-800">Sueldo mínimo</h3>
          <div className="mt-3">
            <p className="text-center text-sm font-semibold text-slate-600">{formatMoney(minSalary)}</p>
            <input
              type="range"
              min={salaryBounds.min}
              max={salaryBounds.max}
              step={1000}
              value={minSalary}
              onChange={(event) => onMinSalaryChange(Number(event.target.value))}
              className="mt-2 w-full accent-[#009A4D]"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>{formatMoney(salaryBounds.min)}</span>
              <span>{formatMoney(salaryBounds.max)}</span>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
