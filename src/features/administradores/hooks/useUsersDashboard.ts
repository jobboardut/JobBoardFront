import { useMemo } from 'react'
import type { UserCard } from '../types/usersDashboard.types'
import { useEstadisticasUsuarios } from './useAdmin'

function useUsersDashboard() {
  const { data: stats, isLoading, isError, error, refetch } = useEstadisticasUsuarios()

  const userCards = useMemo<UserCard[]>(() => {
    const totalEstudiantes = stats?.totalEstudiantes ?? 0
    // Los egresados son un tipo de usuario aparte, no un subconjunto.
    const totalEgresados = stats?.totalEgresados ?? 0
    const totalEmpresas = stats?.totalEmpresas ?? 0
    const totalUsuarios = totalEstudiantes + totalEgresados + totalEmpresas

    return [
      {
        title: 'Usuarios totales',
        indicator: 'Sistema',
        count: totalUsuarios,
        description: 'Suma de estudiantes, egresados y empresas registradas.',
        tone: 'accent',
      },
      {
        title: 'Estudiantes',
        indicator: 'Registrados',
        count: totalEstudiantes,
        description: 'Alumnos inscritos con cuenta en la plataforma.',
        tone: 'info',
      },
      {
        title: 'Egresados',
        indicator: 'Registrados',
        count: totalEgresados,
        description: 'Titulados que siguen buscando oportunidades.',
        tone: 'warning',
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

  return { userCards, isLoading, isError, error, refetch }
}

export default useUsersDashboard
