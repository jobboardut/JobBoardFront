import { Bell, Search, X } from 'lucide-react'

interface SearchHeaderProps {
  isSearchOpen: boolean
  searchText: string
  searchInputRef: React.RefObject<HTMLInputElement | null>
  onOpenSearch: () => void
  onCloseSearch: () => void
  onSearchChange: (text: string) => void
}

export const SearchHeader = ({
  isSearchOpen,
  searchText,
  searchInputRef,
  onOpenSearch,
  onCloseSearch,
  onSearchChange,
}: SearchHeaderProps) => {
  return (
    <header className="relative flex items-center justify-end border-b border-[#e7e1d9] bg-[#f8f7f4] px-6 py-4">
      <div className={`publications-search-shell ${isSearchOpen ? 'open' : ''}`}>
        <Search size={20} className="shrink-0 text-slate-500" />
        <input
          ref={searchInputRef}
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          onFocus={onOpenSearch}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              onCloseSearch()
            }
          }}
          placeholder="Buscar publicaciones..."
          className="publications-search-input"
        />

        {!isSearchOpen && (
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Abrir buscador"
            className="absolute inset-0"
          />
        )}

        {isSearchOpen && (
          <button
            type="button"
            onClick={onCloseSearch}
            aria-label="Cerrar buscador"
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-[#ede8e1]"
          >
            <X size={16} strokeWidth={2.3} />
          </button>
        )}
      </div>

      <button
        type="button"
        aria-label="Notificaciones"
        className="relative z-20 ml-3 grid h-9 w-9 place-items-center rounded-xl border border-[#ddd8d0] bg-white text-slate-500 transition hover:bg-[#f4f1ec]"
      >
        <Bell size={19} />
      </button>
    </header>
  )
}
