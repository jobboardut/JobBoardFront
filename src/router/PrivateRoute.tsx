import { Navigate } from 'react-router-dom'
import CuentaEnRevision from '@/features/auth/components/CuentaEnRevision'
import { canUsePlatform, getRole, getToken, getValidationState } from '@/features/auth/services/session'
import type { UserRole } from '@/features/auth/types/auth.types'
import { ROUTES } from './routes'

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

const getRoleHome = (role: UserRole | null) => {
  if (role === 'Admin') return ROUTES.ADMIN_DASHBOARD
  if (role === 'Empresa') return ROUTES.EMPRESA_DASHBOARD
  if (role === 'Estudiante' || role === 'Egresado') return ROUTES.ESTUDIANTE_DASHBOARD
  return ROUTES.LOGIN
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const token = getToken()
  const role = getRole()

  if (!token) return <Navigate to={ROUTES.LOGIN} replace />

  // Un perfil sin validar no entra a la plataforma: ve el motivo y puede
  // reenviar sus documentos desde la pantalla de revision.
  if (!canUsePlatform(role, getValidationState())) {
    return <CuentaEnRevision />
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={getRoleHome(role)} replace />
  }

  return <>{children}</>
}
