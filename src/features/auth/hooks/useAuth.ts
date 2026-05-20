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
      // Redirige según el rol que devuelve el backend
      const rol = response.usuario.rol

      if (rol === 'Admin')      navigate(ROUTES.DASHBOARD)
      if (rol === 'Empresa')    navigate(ROUTES.EMPRESA_DASHBOARD)
      if (rol === 'Estudiante') navigate(ROUTES.ESTUDIANTE_PUBLICACIONES)
      if (rol === 'Egresado')   navigate(ROUTES.ESTUDIANTE_PUBLICACIONES)
    },

    onError: (error: Error) => {
      console.error('Error de login:', error.message)
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout()
    },
    onSettled: () => {
      navigate(ROUTES.LOGIN)
    },
    onError: (error: Error) => {
      console.error('Error de logout:', error.message)
    },
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  return { logout, isLoggingOut: logoutMutation.isPending }
}
