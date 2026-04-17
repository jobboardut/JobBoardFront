import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../config/iconConfig'

type SearchFiltersToolbarProps = {
  containerClassName: string
  ariaLabel: string
  inputId: string
  placeholder: string
  initialFilters: string[]
  availableFilters: string[]
}

function SearchFiltersToolbar({
  containerClassName,
  ariaLabel,
  inputId,
  placeholder,
  initialFilters,
  availableFilters,
}: SearchFiltersToolbarProps) {
  // Estado local temporal hasta conectar filtros reales con API/query params.
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)

  const handleToggleFilter = (filterName: string) => {
    // Toggle simple para mostrar la UX de filtros activos.
    setAppliedFilters((current) =>
      current.includes(filterName) ? current.filter((item) => item !== filterName) : [...current, filterName],
    )
  }

  return (
    <div className="search-filters-shell">
      <section className={containerClassName} aria-label={ariaLabel}>
        <label className="validation-search" htmlFor={inputId}>
          <Search size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
          <input id={inputId} type="text" placeholder={placeholder} />
        </label>

        <button
          type="button"
          className={`validation-filter-btn ${showFiltersPanel ? 'is-open' : ''}`}
          onClick={() => setShowFiltersPanel((current) => !current)}
          aria-expanded={showFiltersPanel}
          aria-controls={`${inputId}-filters`}
        >
          <Filter size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
          Filtros
          {appliedFilters.length > 0 ? <span className="filters-count">{appliedFilters.length}</span> : null}
        </button>
      </section>

      {showFiltersPanel ? (
        <aside className="filters-preview-card" id={`${inputId}-filters`} role="status" aria-live="polite">
          <header className="filters-preview-head">
            <h3>
              <SlidersHorizontal size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
              Filtros aplicados
            </h3>
            <button
              type="button"
              className="filters-preview-close"
              aria-label="Cerrar filtros"
              onClick={() => setShowFiltersPanel(false)}
            >
              <X size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            </button>
          </header>

          {appliedFilters.length > 0 ? (
            <div className="filters-preview-chips" aria-label="Listado de filtros activos">
              {appliedFilters.map((filterName) => (
                <span key={filterName} className="filters-preview-chip">
                  {filterName}
                </span>
              ))}
            </div>
          ) : (
            <p className="filters-preview-empty">No hay filtros activos.</p>
          )}

          <section className="filters-available-wrap" aria-label="Filtros disponibles">
            <h4>Filtros disponibles</h4>
            <div className="filters-available-chips">
              {availableFilters.map((filterName) => {
                const isSelected = appliedFilters.includes(filterName)

                return (
                  <button
                    key={filterName}
                    type="button"
                    className={`filters-available-chip ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleToggleFilter(filterName)}
                    aria-pressed={isSelected}
                  >
                    {filterName}
                  </button>
                )
              })}
            </div>
          </section>

          <footer className="filters-preview-actions">
            <button
              type="button"
              className="filters-preview-clear"
              onClick={() => setAppliedFilters([])}
              disabled={appliedFilters.length === 0}
            >
              Limpiar filtros
            </button>
          </footer>
        </aside>
      ) : null}
    </div>
  )
}

export default SearchFiltersToolbar