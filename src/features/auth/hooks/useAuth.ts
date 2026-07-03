import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import type { LoginRequest } from '../types/auth.types'
import { ROUTES } from '@/router/routes'
import { useAppToast, type ToastTone } from '@/shared/components/appToastContext'

type LoginFeedback = {
  title: string
  message: string
  tone: ToastTone
}

const getErrorText = (error: unknown): string => {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object') {
    const record = error as Record<string, unknown>
    const candidates = [record.message, record.mensaje, record.error, record.title, record.detail]
    const found = candidates.find((value) => typeof value === 'string' && value.trim())
    if (typeof found === 'string') return found
  }
  return ''
}

export const getLoginErrorCopy = (error: unknown): LoginFeedback => {
  const text = getErrorText(error)
  const normalized = text.toLowerCase()

  if (normalized.includes('valid') || normalized.includes('pendiente') || normalized.includes('aprobar')) {
    return {
      title: 'Cuenta en validacion',
      message: 'Tu perfil todavia no ha sido validado por administracion. Intenta de nuevo cuando sea aprobado.',
      tone: 'warning',
    }
  }

  if (normalized.includes('rechaz')) {
    return {
      title: 'Cuenta rechazada',
      message: 'Tu registro fue rechazado. Contacta a administracion para revisar el motivo.',
      tone: 'error',
    }
  }

  if (
    normalized.includes('credencial') ||
    normalized.includes('password') ||
    normalized.includes('contrase') ||
    normalized.includes('correo') ||
    normalized.includes('email') ||
    normalized.includes('401') ||
    normalized.includes('400')
  ) {
    return {
      title: 'Datos incorrectos',
      message: 'Correo o contraseña incorrectos. Verifica tus datos e intenta nuevamente.',
      tone: 'error',
    }
  }

  return {
    title: 'No se pudo iniciar sesion',
    message: 'Revisa tus datos o intenta nuevamente en unos segundos.',
    tone: 'error',
  }
}

const getValidationFeedback = (status: string, role: string): LoginFeedback | null => {
  if (role === 'Admin') return null

  const normalized = status.toLowerCase()
  if (!normalized || normalized === 'validado' || normalized === 'validada' || normalized === 'activo') {
    return null
  }

  if (normalized.includes('pend')) {
    return {
      title: 'Cuenta en validacion',
      message: 'Tu acceso fue aceptado, pero el perfil aun aparece pendiente de validacion.',
      tone: 'warning',
    }
  }

  if (normalized.includes('rechaz')) {
    return {
      title: 'Cuenta rechazada',
      message: 'Tu perfil aparece rechazado. Revisa el estatus con administracion.',
      tone: 'error',
    }
  }

  return {
    title: 'Estatus de validacion',
    message: `Tu perfil aparece con estatus: ${status}.`,
    tone: 'info',
  }
}

export const useLogin = () => {
  const navigate = useNavigate()
  const toast = useAppToast()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: (response) => {
      const rol = response.usuario.rol
      const validationFeedback = getValidationFeedback(response.usuario.estatusValidacion ?? '', rol)

      if (validationFeedback) {
        toast.notify({ ...validationFeedback, duration: 9000 })
      } else {
        toast.success('Sesion iniciada', 'Bienvenido de nuevo a la plataforma.')
      }

      if (rol === 'Admin') navigate(ROUTES.ADMIN_DASHBOARD)
      if (rol === 'Empresa') navigate(ROUTES.EMPRESA_DASHBOARD)
      if (rol === 'Estudiante') navigate(ROUTES.ESTUDIANTE_DASHBOARD)
      if (rol === 'Egresado') navigate(ROUTES.ESTUDIANTE_DASHBOARD)
    },

    onError: (error: unknown) => {
      console.error('Error de login:', error)
      toast.notify({ ...getLoginErrorCopy(error), duration: 9000 })
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const toast = useAppToast()

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.info('Sesion cerrada', 'Vuelve cuando quieras continuar.')
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
