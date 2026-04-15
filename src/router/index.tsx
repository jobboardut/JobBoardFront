import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { PrivateRoute } from './PrivateRoute'
import { LoginPage } from '@/pages/LoginPage'
import { SeleccionCuenta } from '@/features/auth/components/SeleccionCuenta'
import { RegistroEstudiante } from '@/features/auth/components/RegistroEstudiante'
import { RegistroEmpresa } from '@/features/auth/components/RegistroEmpresa'
import { RegistroCompletado } from '@/features/auth/components/RegistroCompletado'
import { EmpresaLayout } from '@/features/empresas/components/EmpresaLayout'
import { PanelControl } from '@/features/empresas/components/PanelControl'
import { MisPublicaciones } from '@/features/empresas/components/MisPublicaciones'
import { Postulantes } from '@/features/empresas/components/Postulantes'
import { PerfilEmpresa } from '@/features/empresas/components/PerfilEmpresa'


export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Rutas publicas */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SELECCION_CUENTA} element={<SeleccionCuenta />} />
        <Route path="/registro/estudiante" element={<RegistroEstudiante />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/registro/confirmacion" element={<RegistroCompletado />} />
        <Route path={ROUTES.EMPRESA_DASHBOARD} element={<PrivateRoute><EmpresaLayout> <PanelControl /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_PUBLICACIONES} element={<PrivateRoute><EmpresaLayout><MisPublicaciones /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_POSTULANTES} element={<PrivateRoute><EmpresaLayout><Postulantes /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_PERFIL} element={<PrivateRoute><EmpresaLayout><PerfilEmpresa /></EmpresaLayout></PrivateRoute>} />

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