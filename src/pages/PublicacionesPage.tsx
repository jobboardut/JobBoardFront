import { useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'
import PublicationDetailModal from '../features/publications/components/PublicationDetailModal'
import PublicationsGrid from '../features/publications/components/PublicationsGrid'
import PublicationsStats from '../features/publications/components/PublicationsStats'
import PublicationsToolbar from '../features/publications/components/PublicationsToolbar'
import usePublicationsOverview from '../features/publications/hooks/usePublicationsOverview'
import type { Publication } from '../features/publications/types/publications.types'

function PublicacionesPage() {
  const { metrics, publications } = usePublicationsOverview()
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)

  return (
    <div className="app-shell">
      <AdminSidebar activeItem="publications" />

      <main className="content" id="publicaciones">
        <header className="publications-header">
          <div>
            <h1>Publicaciones</h1>
            <p>Gestiona las vacantes publicadas por las empresas</p>
          </div>
        </header>

        <PublicationsStats metrics={metrics} />
        <PublicationsToolbar />
        <PublicationsGrid rows={publications} onSelect={setSelectedPublication} />
      </main>

      <PublicationDetailModal publication={selectedPublication} onClose={() => setSelectedPublication(null)} />
    </div>
  )
}

export default PublicacionesPage
