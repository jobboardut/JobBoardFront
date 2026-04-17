import SearchFiltersToolbar from '../../../components/ui/SearchFiltersToolbar'

function ManagementToolbar() {
  return (
    <SearchFiltersToolbar
      containerClassName="management-toolbar"
      ariaLabel="Búsqueda y filtros de gestión"
      inputId="management-search"
      placeholder="Buscar usuarios..."
      initialFilters={['Estado: Activo', 'Tipo: Empresa', 'Registro: Últimos 7 días']}
      availableFilters={[
        'Estado: Activo',
        'Estado: Inactivo',
        'Tipo: Alumno',
        'Tipo: Egresado',
        'Tipo: Empresa',
        'Registro: Últimos 7 días',
        'Registro: Últimos 30 días',
        'Con actividad reciente',
      ]}
    />
  )
}

export default ManagementToolbar