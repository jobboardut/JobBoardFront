import { SECURITY_LIMITS } from './inputRules'

export type PasswordLevel = 'vacia' | 'debil' | 'regular' | 'segura'

export interface PasswordRequirement {
  id: string
  label: string
  /** Version breve para el mensaje de error; evita minusculizar "(A-Z)". */
  short: string
  met: boolean
}

export interface PasswordAnalysis {
  level: PasswordLevel
  /** Etiqueta lista para mostrar al usuario. */
  levelLabel: string
  /** 0 a 100, para la barra de progreso. */
  score: number
  requirements: PasswordRequirement[]
  /** Requisitos obligatorios que faltan, en texto. */
  missing: string[]
  /** true cuando cumple todo lo obligatorio. */
  isValid: boolean
}

const LEVEL_LABELS: Record<PasswordLevel, string> = {
  vacia: 'Sin contraseña',
  debil: 'Debil',
  regular: 'Regular',
  segura: 'Segura',
}

/**
 * Revisa una contraseña y explica que le falta.
 * Los cuatro primeros requisitos son obligatorios (los exige el backend);
 * los simbolos suman seguridad pero no bloquean el registro.
 */
export const analyzePassword = (value: string): PasswordAnalysis => {
  const requirements: PasswordRequirement[] = [
    {
      id: 'length',
      label: `Al menos ${SECURITY_LIMITS.passwordMin} caracteres`,
      short: `${SECURITY_LIMITS.passwordMin} caracteres como minimo`,
      met: value.length >= SECURITY_LIMITS.passwordMin,
    },
    {
      id: 'upper',
      label: 'Una letra mayuscula (A-Z)',
      short: 'una letra mayuscula',
      met: /[A-Z]/.test(value),
    },
    {
      id: 'lower',
      label: 'Una letra minuscula (a-z)',
      short: 'una letra minuscula',
      met: /[a-z]/.test(value),
    },
    {
      id: 'number',
      label: 'Un numero (0-9)',
      short: 'un numero',
      met: /\d/.test(value),
    },
  ]

  const bonus: PasswordRequirement[] = [
    {
      id: 'symbol',
      label: 'Un simbolo (!@#$...) — opcional',
      short: 'un simbolo',
      met: /[^A-Za-z0-9]/.test(value),
    },
    {
      id: 'long',
      label: '12 caracteres o mas — opcional',
      short: '12 caracteres o mas',
      met: value.length >= 12,
    },
  ]

  const requiredMet = requirements.filter((item) => item.met).length
  const bonusMet = bonus.filter((item) => item.met).length
  const isValid = requiredMet === requirements.length && value.length <= SECURITY_LIMITS.passwordMax

  let level: PasswordLevel = 'debil'
  if (!value) {
    level = 'vacia'
  } else if (!isValid) {
    level = 'debil'
  } else if (bonusMet === 0) {
    level = 'regular'
  } else {
    level = 'segura'
  }

  // La barra pondera lo obligatorio y deja un margen para los extras.
  const score = value
    ? Math.min(100, Math.round((requiredMet / requirements.length) * 75 + (bonusMet / bonus.length) * 25))
    : 0

  return {
    level,
    levelLabel: LEVEL_LABELS[level],
    score,
    requirements: [...requirements, ...bonus],
    missing: requirements.filter((item) => !item.met).map((item) => item.short),
    isValid,
  }
}

/**
 * Mensaje de error para el envio del formulario: dice exactamente que falta
 * en lugar de repetir la regla completa.
 */
export const describePasswordProblem = (value: string): string | null => {
  if (!value) return 'La contraseña es requerida.'

  if (value.length > SECURITY_LIMITS.passwordMax) {
    return `La contraseña no debe superar ${SECURITY_LIMITS.passwordMax} caracteres.`
  }

  const { missing } = analyzePassword(value)
  if (missing.length === 0) return null

  // "a y b" se lee mejor que "a, b" cuando solo faltan dos cosas.
  const detalle =
    missing.length === 1
      ? missing[0]
      : `${missing.slice(0, -1).join(', ')} y ${missing[missing.length - 1]}`

  return `A tu contraseña le falta ${detalle}.`
}

/** Valida que la confirmacion coincida. */
export const validatePasswordConfirmation = (
  password: string,
  confirmation: string
): string | null => {
  if (!confirmation) return 'Confirma tu contraseña.'
  if (password !== confirmation) return 'Las contraseñas no coinciden.'

  return null
}
