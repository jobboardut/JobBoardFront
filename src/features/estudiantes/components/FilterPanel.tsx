import { formatMoney } from '@/shared/utils/money'

interface FilterPanelProps {
  modalidades: readonly string[]
  selectedModalidades: string[]
  onToggleModalidad: (modalidad: string) => void
  minSalary: number
  salaryBounds: { min: number; max: number }
  onMinSalaryChange: (value: number) => void
  onClear: () => void
  hasActiveFilters: boolean
}

export const FilterPanel = ({
  modalidades,
  selectedModalidades,
  onToggleModalidad,
  minSalary,
  salaryBounds,
  onMinSalaryChange,
  onClear,
  hasActiveFilters,
}: FilterPanelProps) => {
  return (
    <aside className="rounded-2xl border border-[#e8d4ca] bg-white p-4 shadow-[0_2px_12px_rgba(23,34,55,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Modalidad</h3>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-[#009A4D] hover:underline"
          >
            Limpiar
          </button>
        ) : null}
      </div>

      <div className="mt-3 space-y-3 text-slate-500">
        {modalidades.map((modalidad) => (
          <label key={modalidad} className="flex cursor-pointer items-center gap-2 text-base">
            <input
              type="checkbox"
              checked={selectedModalidades.includes(modalidad)}
              onChange={() => onToggleModalidad(modalidad)}
              className="h-4 w-4 rounded border-[#cbd5e1] text-[#009A4D] accent-[#009A4D]"
            />
            {modalidad}
          </label>
        ))}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-800">Sueldo minimo</h3>
      <div className="mt-3">
        <p className="text-center text-sm font-semibold text-slate-700">{formatMoney(minSalary)}</p>
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
    </aside>
  )
}
