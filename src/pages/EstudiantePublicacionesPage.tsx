import { useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
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
    selectedVacante,
    selectVacante,
    isLoading,
    isError,
    openSearchMode,
    closeSearchMode,
    setSearchText,
    postular,
    isApplying,
    appliedIds,
    feedback,
    clearFeedback,
  } = usePublicaciones()

  // El mensaje de postulación se autocierra a los 4s.
  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(clearFeedback, 4000)
    return () => window.clearTimeout(timer)
  }, [feedback, clearFeedback])

  const handleSelectFromSearch = (id: number) => {
    selectVacante(id)
    closeSearchMode()
  }

  return (
    <PageWrapper role="Estudiante">
      <div className="relative flex h-screen flex-col overflow-hidden bg-white text-[#1d2538]">
        <PublicacionesSearchHeader
          isSearchOpen={isSearchOpen}
          searchText={searchText}
          searchInputRef={searchInputRef}
          onOpenSearch={openSearchMode}
          onCloseSearch={closeSearchMode}
          onSearchChange={setSearchText}
        />

        {/* Aviso de postulación */}
        {feedback && (
          <div
            className={`absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ${
              feedback.type === 'ok' ? 'bg-[#e7f6ee] text-[#009A4D]' : 'bg-red-50 text-red-600'
            }`}
            role="status"
          >
            {feedback.type === 'ok' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {feedback.message}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-400">Cargando vacantes…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-red-400">No se pudieron cargar las vacantes.</p>
          </div>
        ) : viewMode === 'detail' ? (
          <section className="grid min-h-0 flex-1 gap-4 px-6 py-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <PublicationDetail
              vacante={selectedVacante}
              onApply={postular}
              isApplying={isApplying}
              hasApplied={selectedVacante ? appliedIds.includes(selectedVacante.id) : false}
            />

            <aside className="publication-scroll h-full overflow-y-auto pr-1">
              <div className="space-y-3">
                {listItems.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-slate-400">No hay vacantes disponibles.</p>
                ) : (
                  listItems.map((item) => (
                    <JobListCard
                      key={item.id}
                      item={item}
                      isActive={selectedVacante?.id === item.id}
                      onSelect={selectVacante}
                    />
                  ))
                )}
              </div>
            </aside>
          </section>
        ) : (
          <section className="grid min-h-0 flex-1 gap-4 px-6 py-5 xl:grid-cols-[minmax(0,2fr)_minmax(260px,300px)]">
            <div className="publication-scroll h-full overflow-y-auto pr-1">
              <div className="space-y-5">
                {searchPublicationItems.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-slate-400">Sin resultados para tu búsqueda.</p>
                ) : (
                  searchPublicationItems.map((item) => (
                    <SearchPublicationCard key={item.id} item={item} onSelect={handleSelectFromSearch} />
                  ))
                )}
              </div>
            </div>

            <PublicacionesFilterPanel />
          </section>
        )}
      </div>
    </PageWrapper>
  )
}
