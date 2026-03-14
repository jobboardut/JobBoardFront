import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { PrivateRoute } from './PrivateRoute'
import { LoginPage } from '@/pages/LoginPage'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Ruta publica */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Placeholder rutas privadas — se completan en cada feature */}
        <Route path={ROUTES.DASHBOARD} element={
          <PrivateRoute>
            <div className="p-8">Dashboard — en construcción</div>
          </PrivateRoute>
        } />

        <Route path="*" element={<div className="p-8">404 — Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  )
}