import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import type { LoginRequest } from '../types/auth.types'
import { ROUTES } from '@/router/routes'

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: (response) => {
      const rol = response.usuario.rol

      if (rol === 'Admin') navigate(ROUTES.ADMIN_DASHBOARD)
      if (rol === 'Empresa') navigate(ROUTES.EMPRESA_DASHBOARD)
      if (rol === 'Estudiante') navigate(ROUTES.ESTUDIANTE_DASHBOARD)
      if (rol === 'Egresado') navigate(ROUTES.ESTUDIANTE_DASHBOARD)
    },

    onError: (error: Error) => {
      console.error('Error de login:', error.message)
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()

  const logout = () => {
    authService.logout()
    navigate(ROUTES.LOGIN)
  }

  return { logout }
}
