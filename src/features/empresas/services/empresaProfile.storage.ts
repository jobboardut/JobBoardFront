export type EmpresaProfile = {
  nombre: string
  giro: string
  direccion: string
  descripcion: string
  responsabilidades: string
  requerimientos: string
  beneficios: string
  sitioWeb: string
  correo: string
  instagram: string
  industria: string
  fundacion: string
  modalidad: string
  tamano: string
  logoUrl?: string
}

const EMPRESA_PROFILE_KEY = 'empresa-profile'
const EMPRESA_PROFILE_DRAFT_KEY = 'empresa-profile-draft'
const EMPRESA_PROFILE_COMPLETE_KEY = 'empresa-profile-complete'

export const defaultEmpresaProfile: EmpresaProfile = {
  nombre: 'Codedrilos',
  giro: 'Soluciones Tecnologicas',
  direccion: 'San Mateo Sur 233, Lonetlan, 75484 Tecamachalco, Pue.',
  descripcion:
    'Somos una empresa de desarrollo de software especializada en crear soluciones tecnologicas innovadoras para empresas de distintos sectores. Disenamos, desarrollamos e implementamos aplicaciones web y moviles que optimizan procesos, mejoran la experiencia del usuario y apoyan el crecimiento de nuestros clientes mediante tecnologia moderna y escalable.',
  responsabilidades:
    'Disenar y desarrollar soluciones a la medida.\nGarantizar calidad, seguridad y escalabilidad.\nMantener y mejorar sistemas existentes.\nAplicar buenas practicas y metodologias agiles.',
  requerimientos:
    'Conocimientos solidos en desarrollo web.\nExperiencia con herramientas de control de versiones.\nTrabajo en equipo y comunicacion efectiva.',
  beneficios:
    'Horario flexible y modalidad hibrida.\nCapacitacion continua.\nCrecimiento profesional y plan de carrera.',
  sitioWeb: 'www.codedrilos.com',
  correo: 'codedrilos@gmail.com',
  instagram: 'codedrilos.site',
  industria: 'Desarrollo de Software',
  fundacion: '2025',
  modalidad: 'Hibrida y remota',
  tamano: '5-10 colaboradores',
  logoUrl: '',
}

const hasWindow = () => typeof window !== 'undefined'

const readStorage = (key: string) => {
  if (!hasWindow()) return null

  const rawValue = window.localStorage.getItem(key)
  if (!rawValue) return null

  try {
    return JSON.parse(rawValue) as Partial<EmpresaProfile>
  } catch {
    return null
  }
}

const writeStorage = (key: string, value: unknown) => {
  if (!hasWindow()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const getEmpresaProfile = (): EmpresaProfile => {
  const storedProfile = readStorage(EMPRESA_PROFILE_KEY)
  const storedDraft = readStorage(EMPRESA_PROFILE_DRAFT_KEY)

  return {
    ...defaultEmpresaProfile,
    ...(storedDraft ?? {}),
    ...(storedProfile ?? {}),
  }
}

export const getEmpresaProfileDraft = (): EmpresaProfile => {
  return getEmpresaProfile()
}

export const saveEmpresaProfileDraft = (profile: Partial<EmpresaProfile>) => {
  writeStorage(EMPRESA_PROFILE_DRAFT_KEY, profile)
}

export const saveEmpresaProfile = (profile: EmpresaProfile) => {
  writeStorage(EMPRESA_PROFILE_KEY, profile)
  writeStorage(EMPRESA_PROFILE_COMPLETE_KEY, true)
}

export const markEmpresaProfileIncomplete = () => {
  if (!hasWindow()) return
  window.localStorage.setItem(EMPRESA_PROFILE_COMPLETE_KEY, 'false')
}

export const isEmpresaProfileComplete = () => {
  if (!hasWindow()) return true
  return window.localStorage.getItem(EMPRESA_PROFILE_COMPLETE_KEY) === 'true'
}
