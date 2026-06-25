import { useMemo } from 'react'
import { APP_ICONS } from '../config/iconConfig'
import AdminLayout from '../features/administradores/components/AdminLayout'
import AdminPageHeader from '../features/administradores/components/AdminPageHeader'
import AdminPageState from '../features/administradores/components/AdminPageState'
import GestorListaConfiguracion from '../features/administradores/components/GestorListaConfiguracion'
import EstadisticasConfiguracion from '../features/administradores/components/EstadisticasConfiguracion'
import useConfigurationOverview from '../features/administradores/hooks/useConfigurationOverview'
import { useConfirmDialog } from '../shared/components/appConfirmContext'
import { useAppToast } from '../shared/components/appToastContext'
import type { ConfigurationListKey } from '../features/administradores/types/configuration.types'

function ConfiguracionPage() {
  const { programs, sectors, isLoading, isError, refetch, createItem, updateItem, deleteItem, isSaving } = useConfigurationOverview()
  const toast = useAppToast()
  const { confirm } = useConfirmDialog()

  const totals = useMemo(
    () => ({
      programsCount: programs.length,
      sectorsCount: sectors.length,
    }),
    [programs.length, sectors.length],
  )

  const handleCreate = async (listKey: ConfigurationListKey, value: string) => {
    try {
      await createItem({ listKey, value })
      toast.success('Elemento creado', 'La lista de registro se actualizo correctamente.')
    } catch {
      toast.error('No se pudo crear', 'Revisa el dato e intenta nuevamente.')
      throw new Error('No se pudo crear el elemento')
    }
  }

  const handleUpdate = async (listKey: ConfigurationListKey, itemId: string, value: string) => {
    try {
      await updateItem({ listKey, itemId, value })
      toast.success('Elemento actualizado', 'La lista de registro se actualizo correctamente.')
    } catch {
      toast.error('No se pudo actualizar', 'Revisa el dato e intenta nuevamente.')
      throw new Error('No se pudo actualizar el elemento')
    }
  }

  const handleDelete = async (listKey: ConfigurationListKey, itemId: string) => {
    const accepted = await confirm({
      title: 'Eliminar elemento',
      message: 'Dejara de aparecer como opcion disponible en los registros nuevos.',
      confirmLabel: 'Eliminar',
      tone: 'danger',
    })

    if (!accepted) {
      return
    }

    try {
      await deleteItem({ listKey, itemId })
      toast.success('Elemento eliminado', 'La lista de registro se actualizo correctamente.')
    } catch {
      toast.error('No se pudo eliminar', 'Intenta eliminar el elemento nuevamente.')
      throw new Error('No se pudo eliminar el elemento')
    }
  }

  return (
    <AdminLayout contentId="configuracion">
      <AdminPageHeader
        eyebrow="Sistema"
        title="Listas de registro"
        description="Administra los programas educativos y sectores empresariales disponibles durante el registro."
        Icon={APP_ICONS.settings}
      />

      {isLoading ? <AdminPageState type="loading" title="Cargando configuracion" /> : null}
      {isError ? <AdminPageState type="error" onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError ? (
        <>
          <EstadisticasConfiguracion programsCount={totals.programsCount} sectorsCount={totals.sectorsCount} />

          <section className="configuration-grid">
            <GestorListaConfiguracion
              title="Programas educativos"
              description="Se muestran en el registro de alumnos y egresados."
              iconLabel="PE"
              items={programs}
              listKey="programs"
              onCreate={handleCreate}
              onUpdate={handleUpdate}
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
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              isBusy={isSaving}
            />
          </section>
        </>
      ) : null}
    </AdminLayout>
  )
}

export default ConfiguracionPage
