import { PageWrapper } from '@/components/layout/PageWrapper'
import { JobListCard } from '@/features/estudiantes/components/JobListCard'
import { PublicacionesFilterPanel } from '@/features/estudiantes/components/PublicacionesFilterPanel'
import { PublicacionesSearchHeader } from '@/features/estudiantes/components/PublicacionesSearchHeader'
import { PublicationDetail } from '@/features/estudiantes/components/PublicationDetail'
import { SearchPublicationCard } from '@/features/estudiantes/components/SearchPublicationCard'
import { usePublicaciones } from '@/features/estudiantes/hooks/usePublicaciones'

export const EstudiantePublicacionesPage = () => {
  const {
    viewMode,
    isSearchOpen,
    searchText,
    searchInputRef,
    listItems,
    searchPublicationItems,
    openSearchMode,
    closeSearchMode,
    setSearchText,
  } = usePublicaciones()

  return (
    <PageWrapper role="Estudiante">
      <div className="flex h-screen flex-col overflow-hidden bg-white text-[#1d2538]">
        <PublicacionesSearchHeader
          isSearchOpen={isSearchOpen}
          searchText={searchText}
          searchInputRef={searchInputRef}
          onOpenSearch={openSearchMode}
          onCloseSearch={closeSearchMode}
          onSearchChange={setSearchText}
        />

        {viewMode === 'detail' ? (
          <section className="grid min-h-0 flex-1 gap-4 px-6 py-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <PublicationDetail />

            <aside className="publication-scroll h-full overflow-y-auto pr-1">
              <div className="space-y-3">
                {listItems.map((item) => (
                  <JobListCard key={item.id} item={item} />
                ))}
              </div>
            </aside>
          </section>
        ) : (
          <section className="grid min-h-0 flex-1 gap-4 px-6 py-5 xl:grid-cols-[minmax(0,2fr)_minmax(260px,300px)]">
            <div className="publication-scroll h-full overflow-y-auto pr-1">
              <div className="space-y-5">
                {searchPublicationItems.map((item) => (
                  <SearchPublicationCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <PublicacionesFilterPanel />
          </section>
        )}
      </div>
    </PageWrapper>
  )
}
