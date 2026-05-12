import { Search, X } from 'lucide-react'

interface ApplicationSearchBarProps {
  searchText: string
  searchInputRef: React.RefObject<HTMLInputElement | null>
  onSearchChange: (text: string) => void
}

export const ApplicationSearchBar = ({
  searchText,
  searchInputRef,
  onSearchChange,
}: ApplicationSearchBarProps) => {
  const handleClear = () => {
    onSearchChange('')
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#e6e0d7] bg-white px-4 py-2.5">
      <Search size={18} className="shrink-0 text-slate-400" />
      <input
        ref={searchInputRef}
        type="text"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar en postulaciones..."
        className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 outline-none"
      />
      {searchText && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="grid h-6 w-6 place-items-center rounded text-slate-400 transition hover:bg-[#f0ebe5] hover:text-slate-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
