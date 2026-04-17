import SearchFiltersToolbar from '../../../components/ui/SearchFiltersToolbar'

function TrackingToolbar() {
  return (
    <SearchFiltersToolbar
      containerClassName="tracking-toolbar"
      ariaLabel="Buscador y filtros de seguimiento"
      inputId="tracking-search"
      placeholder="Buscar por egresado, vacante o empresa..."
      initialFilters={['Estado: En proceso', 'Periodo: Últimos 30 días', 'Vacantes activas']}
      availableFilters={[
        'Estado: Postulado',
        'Estado: En revisión',
        'Estado: En proceso',
        'Estado: Contratado',
        'Periodo: Últimos 7 días',
        'Periodo: Últimos 30 días',
        'Vacantes activas',
        'Con entrevistas programadas',
      ]}
    />
  )
}

export default TrackingToolbar
