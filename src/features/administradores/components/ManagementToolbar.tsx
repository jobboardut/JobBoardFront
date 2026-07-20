import SearchFiltersToolbar from '../../../components/ui/SearchFiltersToolbar'
import type { SearchFiltersToolbarControlProps } from '../../../components/ui/SearchFiltersToolbar'

function ManagementToolbar(props: SearchFiltersToolbarControlProps) {
  return (
    <SearchFiltersToolbar
      {...props}
      containerClassName="management-toolbar"
      ariaLabel="Busqueda y filtros de gestion"
      inputId="management-search"
      placeholder="Buscar usuarios..."
      availableFilters={[
        'Estado: Activo',
        'Estado: Inactivo',
        'Estado: Devuelto',
        'Estado: Rechazado',
        'Estado: Inhabilitado',
        'Tipo: Alumno',
        'Tipo: Egresado',
        'Tipo: Empresa',
      ]}
    />
  )
}

export default ManagementToolbar
