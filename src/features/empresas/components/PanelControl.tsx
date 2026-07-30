import { Briefcase, LayoutDashboard, Plus, TrendingUp, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '@/shared/components/PageHero'
import { ROUTES } from '@/router/routes'
import { useVacantes } from '../hooks/useEmpresa'
import { StatCard } from './StatCard'
import { VacantesRecientes } from './VacantesRecientes'

export const PanelControl = () => {
  const navigate = useNavigate()
  const { data: vacantes = [], isLoading } = useVacantes()
  const safeVacantes = Array.isArray(vacantes) ? vacantes : []

  // El backend nombra el conteo "totalPostulantes"; "postulantes" queda por compatibilidad.
  const contarPostulantes = (v: { totalPostulantes?: number; postulantes?: number }) =>
    v.totalPostulantes ?? v.postulantes ?? 0

  const totalVacantes    = safeVacantes.length
  const totalActivas     = safeVacantes.filter(v => v.estatus === 'Activa').length
  const totalPostulantes = safeVacantes.reduce((acc, v) => acc + contarPostulantes(v), 0)

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
      <div className="mb-6">
        <PageHero
          tone="empresa"
          eyebrow="Resumen"
          title="Panel de control"
          description="Tu actividad mas reciente en vacantes y postulantes, todo en un vistazo."
          Icon={LayoutDashboard}
          actions={
            <>
              <button
                type="button"
                onClick={() => navigate(ROUTES.EMPRESA_CREAR_VACANTE)}
                className="hero-btn hero-btn--solid"
              >
                <Plus size={16} />
                Publicar vacante
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.EMPRESA_POSTULANTES)}
                className="hero-btn hero-btn--ghost"
              >
                <Users size={16} />
                Ver postulantes
              </button>
            </>
          }
        />
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
        vacantes={safeVacantes.slice(0, 5).map(v => ({
          id: String(v.id),
          titulo: v.titulo,
          descripcion: v.modalidad ?? '',
          estatus: v.estatus === 'Activa' ? 'activo'
                 : v.estatus === 'Finalizada' || v.estatus === 'Pausada' ? 'cerrada'
                 : 'pendiente' as 'activo' | 'pendiente' | 'cerrada',
          postulantes: contarPostulantes(v),
          fechaPublicacion: v.fechaPublicacion ?? '',
        }))}
        onView={(id) => navigate(ROUTES.EMPRESA_DETALLE_VACANTE.replace(':id', id))}
        onPostulantes={() => navigate(ROUTES.EMPRESA_POSTULANTES)}
      />
    </div>
  )
}