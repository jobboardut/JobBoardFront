import AdminSidebar from '../components/layout/AdminSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import ActivityPanel from '../features/administradores/components/ActivityPanel'
import SummaryGrid from '../features/administradores/components/SummaryGrid'
import VacanciesPanel from '../features/administradores/components/VacanciesPanel'
import useDashboardOverview from '../features/administradores/hooks/useDashboardOverview'
import UsersPanel from '../features/administradores/components/UsersPanel'
import useUsersDashboard from '../features/administradores/hooks/useUsersDashboard'

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