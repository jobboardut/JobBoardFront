// Estado de sesion centralizado (token, rol y estatus de validacion).
// El estatus se guarda al iniciar sesion para que las rutas privadas puedan
// bloquear el acceso de perfiles devueltos, rechazados o pendientes.

import type { UserRole } from '../types/auth.types'

const KEYS = {
  token: 'token',
  userId: 'userId',
  rol: 'rol',
  estatus: 'estatusValidacion',
  observacion: 'ultimaObservacion',
} as const

export type ValidationState = 'validado' | 'pendiente' | 'devuelto' | 'rechazado' | 'inhabilitado'

/** Normaliza cualquier texto de estatus del backend a un estado conocido. */
export const normalizeValidationState = (value?: string | null): ValidationState => {
  const normalized = (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

  if (!normalized || normalized.startsWith('valid') || normalized === 'activo') return 'validado'
  if (normalized.startsWith('devuel')) return 'devuelto'
  if (normalized.startsWith('rechaz')) return 'rechazado'
  if (normalized.startsWith('inhabilit')) return 'inhabilitado'
  if (normalized.startsWith('pend')) return 'pendiente'

  // Un estatus desconocido no debe bloquear el acceso.
  return 'validado'
}

export const saveSession = (params: {
  token: string
  userId: number | string
  rol: string
  estatusValidacion?: string | null
  ultimaObservacion?: string | null
}) => {
  localStorage.setItem(KEYS.token, params.token)
  localStorage.setItem(KEYS.userId, String(params.userId))
  localStorage.setItem(KEYS.rol, params.rol)
  localStorage.setItem(KEYS.estatus, params.estatusValidacion ?? '')

  if (params.ultimaObservacion) {
    localStorage.setItem(KEYS.observacion, params.ultimaObservacion)
  } else {
    localStorage.removeItem(KEYS.observacion)
  }
}

export const clearSession = () => {
  for (const key of Object.values(KEYS)) {
    localStorage.removeItem(key)
  }
}

export const getToken = (): string | null => localStorage.getItem(KEYS.token)

export const getUserId = (): number => Number(localStorage.getItem(KEYS.userId))

export const getRole = (): UserRole | null => localStorage.getItem(KEYS.rol) as UserRole | null

export const getValidationState = (): ValidationState =>
  normalizeValidationState(localStorage.getItem(KEYS.estatus))

export const getLastObservation = (): string | null => localStorage.getItem(KEYS.observacion)

/** Guarda el estatus mas reciente que devuelva cualquier endpoint del perfil. */
export const updateValidationState = (estatus?: string | null, observacion?: string | null) => {
  if (typeof estatus === 'string') {
    localStorage.setItem(KEYS.estatus, estatus)
  }

  if (typeof observacion === 'string' && observacion.trim()) {
    localStorage.setItem(KEYS.observacion, observacion)
  }
}

/** Los perfiles sin validar no pueden usar la plataforma (excepto Admin). */
export const canUsePlatform = (role: UserRole | null, state: ValidationState): boolean =>
  role === 'Admin' || state === 'validado'
