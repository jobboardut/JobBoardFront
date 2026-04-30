import { Briefcase, TrendingUp, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { useVacantes } from '../hooks/useEmpresa'
import { StatCard } from './StatCard'
import { VacantesRecientes } from './VacantesRecientes'

export const PanelControl = () => {
  const navigate = useNavigate()
  const { data: vacantes = [], isLoading } = useVacantes()

  const totalVacantes    = vacantes.length
  const totalActivas     = vacantes.filter(v => v.estatus === 'Activa').length
  const totalPostulantes = vacantes.reduce((acc, v) => acc + (v.postulantes ?? 0), 0)

  const stats = [
    { label: 'Vacantes',    valor: totalVacantes,    icono: Briefcase,  tone: 'orange'  as const },
    { label: 'Activas',     valor: totalActivas,     icono: TrendingUp, tone: 'emerald' as const },
    { label: 'Postulantes', valor: totalPostulantes, icono: Users,      tone: 'orange'  as const },
  ]

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Cargando panel...</p>
    </div>
  )

  return (
    <div>
      <div className="mb-8 grid gap-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Panel de control</h1>
            <p className="mt-2 text-sm text-white/80">
              Tu actividad más reciente en vacantes y postulantes, todo en un vistazo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.EMPRESA_POSTULANTES)}
              className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white"
            >
              Ver postulantes
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.valor}
            icon={stat.icono}
            tone={stat.tone}
          />
        ))}
      </div>

      <VacantesRecientes
        vacantes={vacantes.slice(0, 5).map(v => ({
          id: String(v.id),
          titulo: v.titulo,
          descripcion: v.modalidad ?? '',
          estatus: v.estatus === 'Activa' ? 'activo'
                 : v.estatus === 'Finalizada' || v.estatus === 'Pausada' ? 'cerrada'
                 : 'pendiente' as 'activo' | 'pendiente' | 'cerrada',
          postulantes: v.postulantes ?? 0,
          fechaPublicacion: v.fechaPublicacion ?? '',
        }))}
        onView={(id) => navigate(ROUTES.EMPRESA_DETALLE_VACANTE.replace(':id', id))}
        onPostulantes={() => navigate(ROUTES.EMPRESA_POSTULANTES)}
      />
    </div>
  )
}