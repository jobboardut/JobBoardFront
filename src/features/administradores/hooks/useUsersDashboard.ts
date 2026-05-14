import { useMemo } from 'react'
import type { UserCard } from '../types/usersDashboard.types'
import { useEstadisticasUsuarios } from './useAdmin'

function useUsersDashboard() {
  const { data: stats, isLoading, isError, error } = useEstadisticasUsuarios()

  const userCards = useMemo<UserCard[]>(() => {
    const totalEstudiantes = stats?.totalEstudiantes ?? 0
    const totalEmpresas = stats?.totalEmpresas ?? 0
    const totalUsuarios = totalEstudiantes + totalEmpresas

    return [
      {
        title: 'Usuarios totales',
        indicator: 'Sistema',
        count: totalUsuarios,
        description: 'Suma de estudiantes y empresas registradas.',
        tone: 'accent',
      },
      {
        title: 'Estudiantes',
        indicator: 'Registrados',
        count: totalEstudiantes,
        description: 'Estudiantes con cuenta en la plataforma.',
        tone: 'info',
      },
      {
        title: 'Empresas',
        indicator: 'Registradas',
        count: totalEmpresas,
        description: 'Empresas dadas de alta en la plataforma.',
        tone: 'success',
      },
    ]
  }, [stats])

  return { userCards, isLoading, isError, error }
}

export default useUsersDashboard