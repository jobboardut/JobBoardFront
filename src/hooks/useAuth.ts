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
      // Guarda el token cuando el login es exitoso
      localStorage.setItem('token', response.data.token)
      // Redirige según el rol
      const role = response.data.user.role
      if (role === 'administrador') navigate(ROUTES.DASHBOARD)
      if (role === 'empresa')       navigate(ROUTES.EMPRESA_DASHBOARD)
      if (role === 'estudiante')    navigate(ROUTES.ESTUDIANTE_PUBLICACIONES)
    },

    onError: (error: Error) => {
  console.error('Error de login:', error?.message)
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