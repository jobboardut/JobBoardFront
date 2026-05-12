import SearchFiltersToolbar from '../../../components/ui/SearchFiltersToolbar'

function ValidationToolbar() {
  return (
    <SearchFiltersToolbar
      containerClassName="validation-toolbar"
      ariaLabel="Búsqueda y filtros"
      inputId="validation-search"
      placeholder="Buscar"
      initialFilters={['Estado: Pendiente', 'Tipo: Alumno', 'Alta reciente']}
      availableFilters={[
        'Estado: Pendiente',
        'Estado: Revisado',
        'Tipo: Alumno',
        'Tipo: Egresado',
        'Tipo: Empresa',
        'Alta reciente',
        'Con documento adjunto',
        'Sin observaciones',
      ]}
    />
  )
}

export default ValidationToolbar