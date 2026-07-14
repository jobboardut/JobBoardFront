import SearchFiltersToolbar from '../../../components/ui/SearchFiltersToolbar'
import type { SearchFiltersToolbarControlProps } from '../../../components/ui/SearchFiltersToolbar'

function PublicacionesToolbar(props: SearchFiltersToolbarControlProps) {
  return (
    <SearchFiltersToolbar
      {...props}
      containerClassName="publications-toolbar"
      ariaLabel="Buscador y filtros de publicaciones"
      inputId="publications-search"
      placeholder="Buscar por titulo o empresa..."
      availableFilters={[
        'Estado: Activo',
        'Estado: Pausado',
        'Estado: Finalizada',
        'Estado: Baneada',
        'Estado: Eliminada',
        'Modalidad: Presencial',
        'Modalidad: Remota',
        'Modalidad: Hibrida',
      ]}
    />
  )
}

export default PublicacionesToolbar
