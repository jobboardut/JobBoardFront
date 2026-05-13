import SearchFiltersToolbar from '../../../components/ui/SearchFiltersToolbar'

function PublicacionesToolbar() {
  return (
    <SearchFiltersToolbar
      containerClassName="publications-toolbar"
      ariaLabel="Buscador y filtros de publicaciones"
      inputId="publications-search"
      placeholder="Buscar por título o empresa..."
      initialFilters={['Estado: Pausado', 'Modalidad: Híbrido', 'Postulación abierta']}
      availableFilters={[
        'Estado: Activo',
        'Estado: Pausado',
        'Modalidad: Presencial',
        'Modalidad: Remoto',
        'Modalidad: Híbrido',
        'Postulación abierta',
        'Jornada: Tiempo completo',
        'Jornada: Medio tiempo',
      ]}
    />
  )
}

export default PublicacionesToolbar
