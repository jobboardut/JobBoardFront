import { useMemo } from 'react'
import { Settings2 } from 'lucide-react'
import AdminSidebar from '../components/layout/AdminSidebar'
import GestorListaConfiguracion from '../features/administradores/components/GestorListaConfiguracion'
import EstadisticasConfiguracion from '../features/administradores/components/EstadisticasConfiguracion'
import useConfigurationOverview from '../features/administradores/hooks/useConfigurationOverview'
import type { ConfigurationListKey } from '../features/administradores/types/configuration.types'

function ConfiguracionPage() {
  const { programs, sectors, createItem, deleteItem, isSaving } = useConfigurationOverview()

  const totals = useMemo(
    () => ({
      programsCount: programs.length,
      sectorsCount: sectors.length,
    }),
    [programs.length, sectors.length],
  )

  const handleCreate = (listKey: ConfigurationListKey, value: string) => createItem({ listKey, value })

  const handleDelete = (listKey: ConfigurationListKey, itemId: string) => deleteItem({ listKey, itemId })

  return (
    <div className="app-shell">
      <AdminSidebar activeItem="settings" />

      <main className="content" id="configuracion">
        <header className="configuration-header">
          <div>
            <p className="configuration-eyebrow">
              <Settings2 size={16} strokeWidth={1.9} />
              Configuración
            </p>
            <h1>Listas de registro</h1>
            <p>
              Administra los programas educativos disponibles para el registro y los sectores empresariales que se
              muestran a las empresas. Solo puedes crear nuevos elementos o eliminarlos.
            </p>
          </div>
        </header>

        <EstadisticasConfiguracion programsCount={totals.programsCount} sectorsCount={totals.sectorsCount} />

        <section className="configuration-grid">
          <GestorListaConfiguracion
            title="Programas educativos"
            description="Se muestran en el registro de alumnos y egresados."
            iconLabel="PE"
            items={programs}
            listKey="programs"
            onCreate={handleCreate}
            onDelete={handleDelete}
            isBusy={isSaving}
          />

          <GestorListaConfiguracion
            title="Sectores empresariales"
            description="Se muestran al registrar empresas en el sistema."
            iconLabel="SE"
            items={sectors}
            listKey="sectors"
            onCreate={handleCreate}
            onDelete={handleDelete}
            isBusy={isSaving}
          />
        </section>
      </main>
    </div>
  )
}

export default ConfiguracionPage
