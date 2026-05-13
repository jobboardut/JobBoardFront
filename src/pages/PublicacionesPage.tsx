import { useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'
import DetallePublicacionModal from '../features/administradores/publicaciones/components/DetallePublicacionModal'
import PublicacionesGrid from '../features/administradores/publicaciones/components/PublicacionesGrid'
import EstadisticasPublicaciones from '../features/administradores/publicaciones/components/EstadisticasPublicaciones'
import PublicacionesToolbar from '../features/administradores/publicaciones/components/PublicacionesToolbar'
import usePublicationsOverview from '../features/administradores/publicaciones/hooks/usePublicationsOverview'
import type { Publication } from '../features/administradores/publicaciones/types/publicaciones.types'

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

        <EstadisticasPublicaciones metrics={metrics} />
        <PublicacionesToolbar />
        <PublicacionesGrid rows={publications} onSelect={setSelectedPublication} />
      </main>

      <DetallePublicacionModal publication={selectedPublication} onClose={() => setSelectedPublication(null)} />
    </div>
  )
}

export default PublicacionesPage
