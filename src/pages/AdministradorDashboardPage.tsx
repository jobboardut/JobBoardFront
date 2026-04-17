import AdminSidebar from '../components/layout/AdminSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import ActivityPanel from '../features/dashboard/components/ActivityPanel'
import SummaryGrid from '../features/dashboard/components/SummaryGrid'
import VacanciesPanel from '../features/dashboard/components/VacanciesPanel'
import useDashboardOverview from '../features/dashboard/hooks/useDashboardOverview'
import UsersPanel from '../features/users/components/UsersPanel'
import useUsersDashboard from '../features/users/hooks/useUsersDashboard'

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