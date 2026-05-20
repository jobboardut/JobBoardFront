import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
import { CompletarPerfilEmpresa } from '@/features/empresas/components/CompletarPerfilEmpresa'
import { EditarPerfilEmpresa } from '@/features/empresas/components/EditarPerfilEmpresa'
import FormularioVacante from '@/features/empresas/components/FormularioVacante'
import { DetalleVacante } from '@/features/empresas/components/DetalleVacante'
import { DetallePostulante } from '@/features/empresas/components/DetallePostulante'
import AdministradorDashboardPage from '@/pages/AdministradorDashboardPage'
import CentroGestionPage from '@/pages/CentroGestionPage'
import CentroValidacionPage from '@/pages/CentroValidacionPage'
import ConfiguracionPage from '@/pages/ConfiguracionPage'
import PublicacionesPage from '@/pages/PublicacionesPage'
import SeguimientoPostulacionesPage from '@/pages/SeguimientoPostulacionesPage'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<PrivateRoute><Navigate to={ROUTES.ADMIN_DASHBOARD} replace /></PrivateRoute>} />

        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SELECCION_CUENTA} element={<SeleccionCuenta />} />
        <Route path="/registro/estudiante" element={<RegistroEstudiante />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/registro/confirmacion" element={<RegistroCompletado />} />

        <Route path={ROUTES.EMPRESA_DASHBOARD} element={<PrivateRoute><EmpresaLayout><PanelControl /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_PUBLICACIONES} element={<PrivateRoute><EmpresaLayout><MisPublicaciones /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_POSTULANTES} element={<PrivateRoute><EmpresaLayout><Postulantes /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_PERFIL} element={<PrivateRoute><EmpresaLayout><PerfilEmpresa /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_COMPLETAR_PERFIL} element={<PrivateRoute><CompletarPerfilEmpresa /></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_EDITAR_PERFIL} element={<PrivateRoute><EmpresaLayout><EditarPerfilEmpresa /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_CREAR_VACANTE} element={<PrivateRoute><EmpresaLayout><FormularioVacante modo="crear" /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_EDITAR_VACANTE} element={<PrivateRoute><EmpresaLayout><FormularioVacante modo="editar" /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_DETALLE_VACANTE} element={<PrivateRoute><EmpresaLayout><DetalleVacante /></EmpresaLayout></PrivateRoute>} />
        <Route path={ROUTES.EMPRESA_DETALLE_POSTULANTE} element={<PrivateRoute><EmpresaLayout><DetallePostulante /></EmpresaLayout></PrivateRoute>} />

        <Route path={ROUTES.ADMIN_DASHBOARD} element={<PrivateRoute><AdministradorDashboardPage /></PrivateRoute>} />
        <Route path={ROUTES.ADMIN_VALIDACION} element={<PrivateRoute><CentroValidacionPage /></PrivateRoute>} />
        <Route path={ROUTES.ADMIN_GESTION} element={<PrivateRoute><CentroGestionPage /></PrivateRoute>} />
        <Route path={ROUTES.ADMIN_PUBLICACIONES} element={<PrivateRoute><PublicacionesPage /></PrivateRoute>} />
        <Route path={ROUTES.ADMIN_SEGUIMIENTO} element={<PrivateRoute><SeguimientoPostulacionesPage /></PrivateRoute>} />
        <Route path={ROUTES.ADMIN_CONFIGURACION} element={<PrivateRoute><ConfiguracionPage /></PrivateRoute>} />

        <Route path="*" element={<div className="p-8">404</div>} />
      </Routes>
    </BrowserRouter>
  )
}
