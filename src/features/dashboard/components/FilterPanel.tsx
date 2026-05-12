export const FilterPanel = () => {
  return (
    <aside className="rounded-2xl border border-[#e8d4ca] bg-white p-4 shadow-[0_2px_12px_rgba(23,34,55,0.06)]">
      <h3 className="text-lg font-semibold text-slate-800">Tipo de trabajo</h3>
      <div className="mt-3 space-y-3 text-slate-500">
        <label className="flex items-center gap-2 text-base">
          <input type="checkbox" className="h-4 w-4 rounded border-[#cbd5e1] text-[#009A4D]" />
          Tiempo completo
        </label>
        <label className="flex items-center gap-2 text-base">
          <input type="checkbox" className="h-4 w-4 rounded border-[#cbd5e1] text-[#009A4D]" />
          Por contrato
        </label>
        <label className="flex items-center gap-2 text-base">
          <input type="checkbox" className="h-4 w-4 rounded border-[#cbd5e1] text-[#009A4D]" />
          Medio Tiempo
        </label>
        <label className="flex items-center gap-2 text-base">
          <input type="checkbox" className="h-4 w-4 rounded border-[#cbd5e1] text-[#009A4D]" />
          Remoto
        </label>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-800">Rango de salario</h3>
      <div className="mt-3">
        <p className="text-center text-sm text-slate-500">$50,000</p>
        <input
          type="range"
          min={5000}
          max={100000}
          defaultValue={50000}
          className="mt-2 w-full accent-[#009A4D]"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>$5,000</span>
          <span>$100,000</span>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-800">Tipo de industria</h3>
      <select className="mt-2 w-full rounded-xl border border-[#ece3dc] bg-white px-3 py-2 text-sm text-slate-500 outline-none">
        <option>Selecciona el tipo de industria</option>
        <option>Tecnologia</option>
        <option>Automotriz</option>
        <option>Marketing</option>
      </select>
    </aside>
  )
}
