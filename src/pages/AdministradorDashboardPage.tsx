import AdminSidebar from '../components/layout/AdminSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import ActivityPanel from '../features/administradores/dashboard/components/ActivityPanel'
import SummaryGrid from '../features/administradores/dashboard/components/SummaryGrid'
import VacanciesPanel from '../features/administradores/dashboard/components/VacanciesPanel'
import useDashboardOverview from '../features/administradores/dashboard/hooks/useDashboardOverview'
import UsersPanel from '../features/administradores/usuarios/components/UsersPanel'
import useUsersDashboard from '../features/administradores/usuarios/hooks/useUsersDashboard'

function AdministradorDashboardPage() {
  const { summaryCards, vacancyRows, recentActivity } = useDashboardOverview()
  const { userCards } = useUsersDashboard()

  return (
    <div className="app-shell">
      <AdminSidebar />

      <main className="content" id="dashboard">
        <DashboardHeader />
        <SummaryGrid cards={summaryCards} />

        <section className="dashboard-grid">
          <VacanciesPanel rows={vacancyRows} />
          <ActivityPanel items={recentActivity} />
        </section>

        <UsersPanel cards={userCards} />
      </main>
    </div>
  )
}

export default AdministradorDashboardPage