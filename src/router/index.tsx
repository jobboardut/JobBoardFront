import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RouteLoadingFallback, RouteTransition } from '@/shared/components/RouteTransition'
import { PrivateRoute } from './PrivateRoute'
import { ROUTES } from './routes'

const LandingPage = lazy(() => import('@/pages/LandingPage').then((module) => ({ default: module.LandingPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const RecuperarPassword = lazy(() => import('@/features/auth/components/RecuperarPassword').then((module) => ({ default: module.RecuperarPassword })))
const RestablecerPassword = lazy(() => import('@/features/auth/components/RestablecerPassword').then((module) => ({ default: module.RestablecerPassword })))
const SeleccionCuenta = lazy(() => import('@/features/auth/components/SeleccionCuenta').then((module) => ({ default: module.SeleccionCuenta })))
const RegistroEstudiante = lazy(() => import('@/features/auth/components/RegistroEstudiante').then((module) => ({ default: module.RegistroEstudiante })))
const RegistroEmpresa = lazy(() => import('@/features/auth/components/RegistroEmpresa').then((module) => ({ default: module.RegistroEmpresa })))
const RegistroCompletado = lazy(() => import('@/features/auth/components/RegistroCompletado').then((module) => ({ default: module.RegistroCompletado })))

const EmpresaLayout = lazy(() => import('@/features/empresas/components/EmpresaLayout').then((module) => ({ default: module.EmpresaLayout })))
const PanelControl = lazy(() => import('@/features/empresas/components/PanelControl').then((module) => ({ default: module.PanelControl })))
const MisPublicaciones = lazy(() => import('@/features/empresas/components/MisPublicaciones').then((module) => ({ default: module.MisPublicaciones })))
const Postulantes = lazy(() => import('@/features/empresas/components/Postulantes').then((module) => ({ default: module.Postulantes })))
const PerfilEmpresa = lazy(() => import('@/features/empresas/components/PerfilEmpresa').then((module) => ({ default: module.PerfilEmpresa })))
const CompletarPerfilEmpresa = lazy(() => import('@/features/empresas/components/CompletarPerfilEmpresa').then((module) => ({ default: module.CompletarPerfilEmpresa })))
const EditarPerfilEmpresa = lazy(() => import('@/features/empresas/components/EditarPerfilEmpresa').then((module) => ({ default: module.EditarPerfilEmpresa })))
const FormularioVacante = lazy(() => import('@/features/empresas/components/FormularioVacante'))
const DetalleVacante = lazy(() => import('@/features/empresas/components/DetalleVacante').then((module) => ({ default: module.DetalleVacante })))
const DetallePostulante = lazy(() => import('@/features/empresas/components/DetallePostulante').then((module) => ({ default: module.DetallePostulante })))

const AdministradorDashboardPage = lazy(() => import('@/pages/AdministradorDashboardPage'))
const CentroGestionPage = lazy(() => import('@/pages/CentroGestionPage'))
const CentroValidacionPage = lazy(() => import('@/pages/CentroValidacionPage'))
const ConfiguracionPage = lazy(() => import('@/pages/ConfiguracionPage'))
const PublicacionesPage = lazy(() => import('@/pages/PublicacionesPage'))
const SeguimientoPostulacionesPage = lazy(() => import('@/pages/SeguimientoPostulacionesPage'))

const EstudianteDashboardPage = lazy(() => import('@/pages/EstudianteDashboardPage').then((module) => ({ default: module.EstudianteDashboardPage })))
const EstudiantePublicacionesPage = lazy(() => import('@/pages/EstudiantePublicacionesPage').then((module) => ({ default: module.EstudiantePublicacionesPage })))
const EstudiantePerfilPage = lazy(() => import('@/pages/EstudiantePerfilPage').then((module) => ({ default: module.EstudiantePerfilPage })))
const EstudianteSeguimientoPage = lazy(() => import('@/pages/EstudianteSeguimientoPage').then((module) => ({ default: module.EstudianteSeguimientoPage })))

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <RouteTransition />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path={ROUTES.DASHBOARD} element={<PrivateRoute><Navigate to={ROUTES.ADMIN_DASHBOARD} replace /></PrivateRoute>} />

          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.RECUPERAR_PASSWORD} element={<RecuperarPassword />} />
          <Route path={ROUTES.RESTABLECER_PASSWORD} element={<RestablecerPassword />} />
          <Route path={ROUTES.SELECCION_CUENTA} element={<SeleccionCuenta />} />
          <Route path="/registro/estudiante" element={<RegistroEstudiante />} />
          <Route path="/registro/empresa" element={<RegistroEmpresa />} />
          <Route path="/registro/confirmacion" element={<RegistroCompletado />} />

          <Route path={ROUTES.EMPRESA_DASHBOARD} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><PanelControl /></EmpresaLayout></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_PUBLICACIONES} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><MisPublicaciones /></EmpresaLayout></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_POSTULANTES} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><Postulantes /></EmpresaLayout></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_PERFIL} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><PerfilEmpresa /></EmpresaLayout></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_COMPLETAR_PERFIL} element={<PrivateRoute allowedRoles={['Empresa']}><CompletarPerfilEmpresa /></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_EDITAR_PERFIL} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><EditarPerfilEmpresa /></EmpresaLayout></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_CREAR_VACANTE} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><FormularioVacante modo="crear" /></EmpresaLayout></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_EDITAR_VACANTE} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><FormularioVacante modo="editar" /></EmpresaLayout></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_DETALLE_VACANTE} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><DetalleVacante /></EmpresaLayout></PrivateRoute>} />
          <Route path={ROUTES.EMPRESA_DETALLE_POSTULANTE} element={<PrivateRoute allowedRoles={['Empresa']}><EmpresaLayout><DetallePostulante /></EmpresaLayout></PrivateRoute>} />

          <Route path={ROUTES.ADMIN_DASHBOARD} element={<PrivateRoute allowedRoles={['Admin']}><AdministradorDashboardPage /></PrivateRoute>} />
          <Route path={ROUTES.ADMIN_VALIDACION} element={<PrivateRoute allowedRoles={['Admin']}><CentroValidacionPage /></PrivateRoute>} />
          <Route path={ROUTES.ADMIN_GESTION} element={<PrivateRoute allowedRoles={['Admin']}><CentroGestionPage /></PrivateRoute>} />
          <Route path={ROUTES.ADMIN_PUBLICACIONES} element={<PrivateRoute allowedRoles={['Admin']}><PublicacionesPage /></PrivateRoute>} />
          <Route path={ROUTES.ADMIN_SEGUIMIENTO} element={<PrivateRoute allowedRoles={['Admin']}><SeguimientoPostulacionesPage /></PrivateRoute>} />
          <Route path={ROUTES.ADMIN_CONFIGURACION} element={<PrivateRoute allowedRoles={['Admin']}><ConfiguracionPage /></PrivateRoute>} />

          <Route path={ROUTES.ESTUDIANTE_DASHBOARD} element={<PrivateRoute allowedRoles={['Estudiante', 'Egresado']}><EstudianteDashboardPage /></PrivateRoute>} />
          <Route path={ROUTES.ESTUDIANTE_PUBLICACIONES} element={<PrivateRoute allowedRoles={['Estudiante', 'Egresado']}><EstudiantePublicacionesPage /></PrivateRoute>} />
          <Route path={ROUTES.ESTUDIANTE_PERFIL} element={<PrivateRoute allowedRoles={['Estudiante', 'Egresado']}><EstudiantePerfilPage /></PrivateRoute>} />
          <Route path={ROUTES.ESTUDIANTE_SEGUIMIENTO} element={<PrivateRoute allowedRoles={['Estudiante', 'Egresado']}><EstudianteSeguimientoPage /></PrivateRoute>} />

          <Route path="*" element={<div className="p-8">404</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
