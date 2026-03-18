import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { PrivateRoute } from './PrivateRoute'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { LoginPage } from '@/pages/LoginPage'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route path={ROUTES.DASHBOARD} element={
          <PrivateRoute>
            <PageWrapper role="administrador">
              <h1>Dashboard Admin</h1>
            </PageWrapper>
          </PrivateRoute>
        } />

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  )
}