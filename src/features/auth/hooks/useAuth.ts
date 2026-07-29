import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { normalizeValidationState } from '../services/session'
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

  if (normalized.includes('devuel')) {
    return {
      title: 'Registro devuelto',
      message: 'Administracion te pidio corregir tu registro. Inicia sesion para ver el motivo y reenviar tus documentos.',
      tone: 'warning',
    }
  }

  if (normalized.includes('inhabilit')) {
    return {
      title: 'Cuenta inhabilitada',
      message: 'Tu cuenta fue desactivada por administracion. Contacta a la coordinacion de la bolsa de trabajo.',
      tone: 'error',
    }
  }

  if (normalized.includes('rechaz')) {
    return {
      title: 'Cuenta rechazada',
      message: 'Tu registro fue rechazado. Inicia sesion para ver el motivo y reenviar tus documentos.',
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

  const state = normalizeValidationState(status)
  if (state === 'validado') return null

  if (state === 'pendiente') {
    return {
      title: 'Registro en revision',
      message: 'Administracion esta validando tus documentos. Te avisaremos cuando tu perfil sea aprobado.',
      tone: 'warning',
    }
  }

  if (state === 'devuelto') {
    return {
      title: 'Registro devuelto',
      message: 'Debes corregir tu registro. Revisa las observaciones y reenvia tus documentos.',
      tone: 'warning',
    }
  }

  if (state === 'inhabilitado') {
    return {
      title: 'Cuenta inhabilitada',
      message: 'Tu cuenta fue desactivada por administracion. Contacta a la coordinacion.',
      tone: 'error',
    }
  }

  return {
    title: 'Registro rechazado',
    message: 'Tu perfil no fue aprobado. Revisa el motivo y reenvia tus documentos.',
    tone: 'error',
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

      // Si el perfil no esta validado, PrivateRoute muestra la pantalla de
      // revision en lugar del dashboard.
      if (rol === 'Admin') navigate(ROUTES.ADMIN_DASHBOARD)
      if (rol === 'Empresa') navigate(ROUTES.EMPRESA_DASHBOARD)
      if (rol === 'Estudiante' || rol === 'Egresado') navigate(ROUTES.ESTUDIANTE_DASHBOARD)
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
