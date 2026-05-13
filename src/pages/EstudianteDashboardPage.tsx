import { PageWrapper } from '@/components/layout/PageWrapper'
import { JobDetailModal } from '@/shared/components/JobDetailModal'
import {
  ActivitySection,
  DashboardSearchCard,
  FilterPanel,
  MetricsGrid,
  SearchHeader,
} from '@/features/estudiantes/dashboard/components'
import { useDashboard } from '@/features/estudiantes/dashboard/hooks'

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
    openSearchMode,
    closeSearchMode,
    setSearchText,
    openJobModal,
    closeJobModal,
  } = useDashboard()

  return (
    <PageWrapper role="Estudiante">
      <div className="flex h-screen flex-col overflow-hidden bg-white text-[#1d2538]">
        <SearchHeader
          isSearchOpen={isSearchOpen}
          searchText={searchText}
          searchInputRef={searchInputRef}
          onOpenSearch={openSearchMode}
          onCloseSearch={closeSearchMode}
          onSearchChange={setSearchText}
        />

        {viewMode === 'detail' ? (
          <section className="overflow-y-auto">
            <div className="bg-white px-6 py-6">
              <MetricsGrid metrics={metrics} />
              <ActivitySection columns={activityColumns} />
            </div>
          </section>
        ) : (
          <section className="grid min-h-0 flex-1 gap-4 px-6 py-5 xl:grid-cols-[minmax(0,2fr)_minmax(260px,300px)]">
            <div className="publication-scroll h-full overflow-y-auto pr-1">
              <div className="space-y-5">
                {searchPublicationItems.map((item) => (
                  <DashboardSearchCard 
                    key={item.id} 
                    item={item}
                    onJobClick={openJobModal}
                  />
                ))}
              </div>
            </div>

            <FilterPanel />
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
