import { PageWrapper } from '@/components/layout/PageWrapper'
import { JobDetailModal } from '@/shared/components/JobDetailModal'
import { PublicacionesFilterPanel, PublicacionesSearchHeader } from '@/features/estudiantes/publicaciones/components'
import { 
  ApplicationsTable, 
  StatusSummary, 
  SearchApplicationCard, 
  ApplicationSearchBar,
  useSeguimiento 
} from '@/features/estudiantes/seguimiento'

export const EstudianteSeguimientoPage = () => {
  const {
    viewMode,
    applications,
    isSearchOpen,
    searchText,
    searchInputRef,
    selectedJobModal,
    isJobModalOpen,
    applicationSearchText,
    applicationSearchInputRef,
    openSearchMode,
    closeSearchMode,
    setSearchText,
    setApplicationSearchText,
    openJobModal,
    closeJobModal,
  } = useSeguimiento()

  return (
    <PageWrapper role="Estudiante">
      <div className="flex h-screen flex-col overflow-hidden bg-white text-[#1d2538]">
        {/* Header con navbar - busca publicaciones */}
        <PublicacionesSearchHeader
          isSearchOpen={isSearchOpen}
          searchText={searchText}
          searchInputRef={searchInputRef}
          onOpenSearch={openSearchMode}
          onCloseSearch={closeSearchMode}
          onSearchChange={setSearchText}
        />

        {/* Content */}
        {viewMode === 'detail' ? (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="grid gap-8 lg:grid-cols-4">
                {/* Tabla de postulaciones - 3 columnas */}
                <div className="lg:col-span-3">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Tus Postulaciones</h2>
                  </div>
                  <ApplicationSearchBar
                    searchText={applicationSearchText}
                    searchInputRef={applicationSearchInputRef}
                    onSearchChange={setApplicationSearchText}
                  />
                  <ApplicationsTable
                    applications={applications}
                    onViewDetails={openJobModal}
                  />
                </div>

                {/* Resumen de estados - 1 columna */}
                <div className="lg:col-span-1">
                  <StatusSummary />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <section className="grid min-h-0 flex-1 gap-4 px-6 py-5 xl:grid-cols-[minmax(0,2fr)_minmax(260px,300px)]">
            <div className="overflow-y-auto pr-1">
              <div className="space-y-5">
                {applications.map((app) => (
                  <SearchApplicationCard 
                    key={app.id} 
                    application={app}
                    onApplicationClick={openJobModal}
                  />
                ))}
              </div>
            </div>

            <PublicacionesFilterPanel />
          </section>
        )}

        <JobDetailModal 
          job={selectedJobModal}
          isOpen={isJobModalOpen}
          onClose={closeJobModal}
          showApplyButton={false}
        />
      </div>
    </PageWrapper>
  )
}
