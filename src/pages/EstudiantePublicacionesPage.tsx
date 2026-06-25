import { useEffect } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { JobListCard } from '@/features/estudiantes/components/JobListCard'
import { PublicacionesFilterPanel } from '@/features/estudiantes/components/PublicacionesFilterPanel'
import { PublicacionesSearchHeader } from '@/features/estudiantes/components/PublicacionesSearchHeader'
import { PublicationDetail } from '@/features/estudiantes/components/PublicationDetail'
import { SearchPublicationCard } from '@/features/estudiantes/components/SearchPublicationCard'
import { usePublicaciones } from '@/features/estudiantes/hooks/usePublicaciones'
import { useAppToast } from '@/shared/components/appToastContext'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/StateFeedback'

export const EstudiantePublicacionesPage = () => {
  const {
    viewMode,
    isSearchOpen,
    searchText,
    searchInputRef,
    listItems,
    appliedListItems,
    searchPublicationItems,
    selectedVacante,
    isLoading,
    isError,
    isApplying,
    appliedIds,
    feedback,
    openSearchMode,
    closeSearchMode,
    setSearchText,
    selectVacante,
    postular,
    clearFeedback,
  } = usePublicaciones()
  const toast = useAppToast()

  useEffect(() => {
    if (!feedback) return

    if (feedback.type === 'ok') {
      toast.success('Postulacion enviada', feedback.message)
    } else {
      toast.error('No se pudo postular', feedback.message)
    }

    clearFeedback()
  }, [clearFeedback, feedback, toast])

  const handleSelectFromSearch = (id: number) => {
    selectVacante(id)
    closeSearchMode()
  }

  return (
    <PageWrapper role="Estudiante">
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f8fafc] text-[#1d2538]">
        <PublicacionesSearchHeader
          isSearchOpen={isSearchOpen}
          searchText={searchText}
          searchInputRef={searchInputRef}
          onOpenSearch={openSearchMode}
          onCloseSearch={closeSearchMode}
          onSearchChange={setSearchText}
        />

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <LoadingState title="Cargando vacantes" message="Estamos consultando las oportunidades disponibles." />
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <ErrorState title="No se pudieron cargar las vacantes" message="Intenta actualizar la pagina en unos segundos." />
          </div>
        ) : viewMode === 'detail' ? (
          <section className="grid min-h-0 flex-1 gap-4 overflow-hidden px-4 py-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_390px]">
            <PublicationDetail
              vacante={selectedVacante}
              onApply={postular}
              isApplying={isApplying}
              hasApplied={selectedVacante ? appliedIds.includes(selectedVacante.id) : false}
            />

            <aside className="publication-scroll h-full overflow-y-auto rounded-2xl border border-slate-100 bg-white/80 p-4 pr-2 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="space-y-5">
                <section className="space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-600">
                        Disponibles
                      </p>
                      <h2 className="text-lg font-bold text-slate-900">Vacantes para postular</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                      {listItems.length}
                    </span>
                  </div>

                  {listItems.length === 0 ? (
                    <EmptyState title="No hay vacantes disponibles" message="Las vacantes donde ya postulaste se muestran mas abajo." compact />
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
                </section>

                {appliedListItems.length > 0 ? (
                  <section className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                          Seguimiento
                        </p>
                        <h2 className="text-lg font-bold text-slate-900">Ya postuladas</h2>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        {appliedListItems.length}
                      </span>
                    </div>

                    {appliedListItems.map((item) => (
                      <JobListCard
                        key={item.id}
                        item={item}
                        isActive={selectedVacante?.id === item.id}
                        onSelect={selectVacante}
                      />
                    ))}
                  </section>
                ) : null}
              </div>
            </aside>
          </section>
        ) : (
          <section className="grid min-h-0 flex-1 gap-4 overflow-hidden px-4 py-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="publication-scroll h-full overflow-y-auto pr-1">
              <div className="space-y-5">
                {searchPublicationItems.length === 0 ? (
                  <EmptyState title="Sin resultados" message="Prueba con otro nombre de vacante, empresa o modalidad." />
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
