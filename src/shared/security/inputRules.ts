export const SECURITY_LIMITS = {
  email: 120,
  passwordMax: 72,
  passwordMin: 8,
  name: 80,
  companyName: 120,
  phone: 18,
  address: 180,
  url: 200,
  shortText: 120,
  longText: 800,
  vacancyText: 1200,
  moneyMax: 1000000,
} as const

export const FILE_LIMITS = {
  imageBytes: 2 * 1024 * 1024,
  documentBytes: 5 * 1024 * 1024,
} as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+\-\s()]{7,18}$/
const URL_PATTERN = /^https?:\/\/[^\s]+\.[^\s]+$/i

export const limitText = (value: string, maxLength: number): string => value.slice(0, maxLength)

export const getLengthHelp = (maxLength: number, extra?: string): string =>
  `${extra ? `${extra} ` : ''}Maximo ${maxLength} caracteres.`

export const passwordRequirements = (password: string) => [
  { label: `Minimo ${SECURITY_LIMITS.passwordMin} caracteres`, met: password.length >= SECURITY_LIMITS.passwordMin },
  { label: 'Una letra mayuscula', met: /[A-Z]/.test(password) },
  { label: 'Una letra minuscula', met: /[a-z]/.test(password) },
  { label: 'Un numero', met: /\d/.test(password) },
  { label: `Maximo ${SECURITY_LIMITS.passwordMax} caracteres`, met: password.length <= SECURITY_LIMITS.passwordMax },
]

export const isStrongPassword = (password: string): boolean =>
  passwordRequirements(password).every((requirement) => requirement.met)

export const validateRequiredText = (value: string, label: string, maxLength: number): string | null => {
  const trimmed = value.trim()

  if (!trimmed) return `${label} es requerido.`
  if (trimmed.length > maxLength) return `${label} no debe superar ${maxLength} caracteres.`

  return null
}

export const validateOptionalText = (value: string, label: string, maxLength: number): string | null => {
  if (value.trim().length > maxLength) return `${label} no debe superar ${maxLength} caracteres.`

  return null
}

export const validateEmailField = (value: string, label = 'Correo'): string | null => {
  const trimmed = value.trim()

  if (!trimmed) return `${label} es requerido.`
  if (trimmed.length > SECURITY_LIMITS.email) return `${label} no debe superar ${SECURITY_LIMITS.email} caracteres.`
  if (!EMAIL_PATTERN.test(trimmed)) return `${label} debe tener un formato valido.`

  return null
}

export const validateOptionalEmailField = (value: string, label = 'Correo'): string | null => {
  const trimmed = value.trim()

  if (!trimmed) return null

  return validateEmailField(trimmed, label)
}

export const validatePasswordField = (value: string): string | null => {
  if (!value) return 'La contraseña es requerida.'
  if (!isStrongPassword(value)) {
    return 'La contraseña debe tener minimo 8 caracteres, mayuscula, minuscula, numero y maximo 72 caracteres.'
  }

  return null
}

export const validateLoginPasswordField = (value: string): string | null => {
  if (!value) return 'La contraseña es requerida.'
  if (value.length > SECURITY_LIMITS.passwordMax) {
    return `La contraseña no debe superar ${SECURITY_LIMITS.passwordMax} caracteres.`
  }

  return null
}

export const validateOptionalPhoneField = (value: string, label = 'Telefono'): string | null => {
  const trimmed = value.trim()

  if (!trimmed) return null
  if (!PHONE_PATTERN.test(trimmed)) return `${label} debe tener de 7 a 18 caracteres y solo numeros, espacios, +, - o parentesis.`

  return null
}

export const validateRequiredPhoneField = (value: string, label = 'Telefono'): string | null =>
  value.trim() ? validateOptionalPhoneField(value, label) : `${label} es requerido.`

export const validateOptionalUrlField = (value: string, label = 'URL'): string | null => {
  const trimmed = value.trim()

  if (!trimmed) return null
  if (trimmed.length > SECURITY_LIMITS.url) return `${label} no debe superar ${SECURITY_LIMITS.url} caracteres.`
  if (!URL_PATTERN.test(trimmed)) return `${label} debe iniciar con http:// o https:// y tener un dominio valido.`

  return null
}

export const validateFile = (
  file: File,
  options: {
    allowedTypes: string[]
    label: string
    maxBytes: number
  }
): string | null => {
  const matchesType = options.allowedTypes.some((type) =>
    type.endsWith('/*') ? file.type.startsWith(type.replace('/*', '/')) : file.type === type
  )

  if (!matchesType) return `${options.label} tiene un formato no permitido.`
  if (file.size > options.maxBytes) {
    const maxMb = Math.round(options.maxBytes / 1024 / 1024)
    return `${options.label} no debe superar ${maxMb} MB.`
  }

  return null
}
