import { useMemo, useState } from 'react'
import { Settings2 } from 'lucide-react'
import AdminSidebar from '../components/layout/AdminSidebar'
import GestorListaConfiguracion from '../features/administradores/configuracion/components/GestorListaConfiguracion'
import EstadisticasConfiguracion from '../features/administradores/configuracion/components/EstadisticasConfiguracion'
import useConfigurationOverview from '../features/administradores/configuracion/hooks/useConfigurationOverview'
import type { ConfigurationItem, ConfigurationListKey } from '../features/administradores/configuracion/types/configuration.types'

function ConfiguracionPage() {
  // Estado local temporal: cuando conectes backend, este bloque se reemplaza por datos de API.
  const overview = useConfigurationOverview()
  const [programs, setPrograms] = useState<ConfigurationItem[]>(overview.programs)
  const [sectors, setSectors] = useState<ConfigurationItem[]>(overview.sectors)

  const totals = useMemo(
    () => ({
      programsCount: programs.length,
      sectorsCount: sectors.length,
    }),
    [programs.length, sectors.length],
  )

  // Alta de elementos: no hay edicion, solo creacion y eliminacion directa.
  const handleCreate = (listKey: ConfigurationListKey, value: string) => {
    const item = { id: `${listKey}-${Date.now()}`, name: value }

    if (listKey === 'programs') {
      setPrograms((current) => [...current, item])
      return
    }

    setSectors((current) => [...current, item])
  }

  // Baja de elementos: el backend despues solo tendra que exponer el delete del item.
  const handleDelete = (listKey: ConfigurationListKey, itemId: string) => {
    if (listKey === 'programs') {
      setPrograms((current) => current.filter((item) => item.id !== itemId))
      return
    }

    setSectors((current) => current.filter((item) => item.id !== itemId))
  }

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
          />

          <GestorListaConfiguracion
            title="Sectores empresariales"
            description="Se muestran al registrar empresas en el sistema."
            iconLabel="SE"
            items={sectors}
            listKey="sectors"
            onCreate={handleCreate}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  )
}

export default ConfiguracionPage
