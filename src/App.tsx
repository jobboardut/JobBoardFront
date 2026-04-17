import { useEffect, useState } from 'react'
import AdministradorDashboardPage from './pages/AdministradorDashboardPage'
import CentroGestionPage from './pages/CentroGestionPage'
import CentroValidacionPage from './pages/CentroValidacionPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import PublicacionesPage from './pages/PublicacionesPage'
import SeguimientoPostulacionesPage from './pages/SeguimientoPostulacionesPage'
import { resolveRouteFromHash, routeToHash, type AppRoute } from './router/appRoutes'

function getCurrentRoute(): AppRoute {
  return resolveRouteFromHash(window.location.hash)
}

function App() {
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getCurrentRoute())
    }

    if (!window.location.hash) {
      window.location.hash = routeToHash('dashboard')
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === 'validation') {
    return <CentroValidacionPage />
  }

  if (route === 'management') {
    return <CentroGestionPage />
  }

  if (route === 'settings') {
    return <ConfiguracionPage />
  }

  if (route === 'publications') {
    return <PublicacionesPage />
  }

  if (route === 'tracking') {
    return <SeguimientoPostulacionesPage />
  }

  return <AdministradorDashboardPage />
}

export default App
