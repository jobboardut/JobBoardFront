import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { PrivateRoute } from './PrivateRoute'
import { LoginPage } from '@/pages/LoginPage'
import { SeleccionCuenta } from '@/components/SeleccionCuenta'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Rutas publicas */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SELECCION_CUENTA} element={<SeleccionCuenta />} />

        {/* Rutas privadas */}
        <Route path={ROUTES.DASHBOARD} element={
          <PrivateRoute>
            <div className="p-8">Dashboard — en construcción</div>
          </PrivateRoute>
        } />

        <Route path="*" element={<div className="p-8">404</div>} />
      </Routes>
    </BrowserRouter>
  )
}