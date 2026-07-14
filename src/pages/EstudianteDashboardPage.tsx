import { PageWrapper } from '@/components/layout/PageWrapper'
import { JobDetailModal } from '@/shared/components/JobDetailModal'
import { ActivitySection } from '@/features/estudiantes/components/ActivitySection'
import { DashboardSearchCard } from '@/features/estudiantes/components/DashboardSearchCard'
import { FilterPanel } from '@/features/estudiantes/components/FilterPanel'
import { MetricsGrid } from '@/features/estudiantes/components/MetricsGrid'
import { SearchHeader } from '@/features/estudiantes/components/SearchHeader'
import { useDashboard } from '@/features/estudiantes/hooks/useDashboard'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/StateFeedback'

export const EstudianteDashboardPage = () => {
  const {
    viewMode,
    isSearchOpen,
    searchText,
    searchInputRef,
    metrics,
    activityColumns,
    searchPublicationItems,
    selectedJobModal,
    isJobModalOpen,
    isLoading,
    isError,
    openSearchMode,
    closeSearchMode,
    setSearchText,
    openJobModal,
    closeJobModal,
    modalidades,
    selectedModalidades,
    toggleModalidad,
    minSalary,
    setMinSalary,
    salaryBounds,
    clearFilters,
    hasActiveFilters,
  } = useDashboard()

  return (
    <PageWrapper role="Estudiante">
      <div className="flex min-h-full flex-col bg-white text-[#1d2538]">
        <SearchHeader
          isSearchOpen={isSearchOpen}
          searchText={searchText}
          searchInputRef={searchInputRef}
          onOpenSearch={openSearchMode}
          onCloseSearch={closeSearchMode}
          onSearchChange={setSearchText}
        />

        {viewMode === 'detail' ? (
          <section className="min-h-0 flex-1 overflow-y-auto">
            <div className="bg-white px-6 py-6">
              {isLoading ? (
                <LoadingState title="Cargando panel" message="Estamos consultando tus indicadores." />
              ) : isError ? (
                <ErrorState title="Error al cargar el panel" message="Intenta actualizar la vista en unos segundos." />
              ) : (
                <>
                  <MetricsGrid metrics={metrics} />
                  <ActivitySection columns={activityColumns} />
                </>
              )}
            </div>
          </section>
        ) : (
          <section className="grid min-h-0 flex-1 gap-4 px-6 py-5 xl:grid-cols-[minmax(0,2fr)_minmax(260px,300px)]">
            <div className="publication-scroll h-full overflow-y-auto pr-1">
              <div className="space-y-5">
                {searchPublicationItems.length ? (
                  searchPublicationItems.map((item) => (
                    <DashboardSearchCard 
                      key={item.id} 
                      item={item}
                      onJobClick={openJobModal}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No hay publicaciones para mostrar"
                    message={hasActiveFilters ? 'Ningun resultado coincide con los filtros. Prueba limpiarlos.' : 'Ajusta la busqueda o revisa mas tarde.'}
                    compact
                  />
                )}
              </div>
            </div>

            <FilterPanel
              modalidades={modalidades}
              selectedModalidades={selectedModalidades}
              onToggleModalidad={toggleModalidad}
              minSalary={minSalary}
              salaryBounds={salaryBounds}
              onMinSalaryChange={setMinSalary}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </section>
        )}

        <JobDetailModal 
          job={selectedJobModal}
          isOpen={isJobModalOpen}
          onClose={closeJobModal}
        />
      </div>
    </PageWrapper>
  )
}
