import api from '@/services/api'
import type { JobItem } from '../types/dashboard.types'
import type { StudentProfile } from '../types/profile.types'
import type { Application, ApplicationStatus } from '../types/seguimiento.types'

type ApiRecord = Record<string, unknown>

interface RecentApplicationsResult {
  totalPostulaciones: number
  recientes: Application[]
}

const asRecord = (value: unknown): ApiRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as ApiRecord : {}

const pickValue = (records: ApiRecord[], keys: string[]) => {
  for (const record of records) {
    for (const key of keys) {
      const value = record[key]
      if (value !== undefined && value !== null && value !== '') return value
    }
  }

  return undefined
}

const pickString = (records: ApiRecord[], keys: string[], fallback = '') => {
  const value = pickValue(records, keys)
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  return fallback
}

const pickNumber = (records: ApiRecord[], keys: string[], fallback = 0) => {
  const value = pickValue(records, keys)
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) return parsed
  }

  return fallback
}

const unwrapList = (response: unknown, keys: string[] = ['value', 'Value', 'items', 'data']) => {
  if (Array.isArray(response)) return response

  const record = asRecord(response)
  for (const key of keys) {
    const value = record[key]
    if (Array.isArray(value)) return value
  }

  return []
}

const formatDate = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return 'Sin fecha'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const formatted = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const formatSalary = (value: unknown) => {
  if (typeof value === 'number') {
    return value > 0 ? `$${value.toLocaleString('es-MX')}` : 'Sueldo no especificado'
  }

  if (typeof value === 'string' && value.trim()) return value

  return 'Sueldo no especificado'
}

const splitTextList = (value: string) =>
  value
    .split(/\r?\n|;|,/)
    .map((item) => item.trim())
    .filter(Boolean)

const normalizeStatus = (value: string): ApplicationStatus => {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

  if (normalized.includes('REVISION')) return 'EN REVISIÓN'
  if (normalized.includes('ACEPT')) return 'ACEPTADO'
  if (normalized.includes('APRUE')) return 'APRUEBA'
  if (normalized.includes('CONTRAT')) return 'CONTRATADO'
  if (normalized.includes('RECHAZ')) return 'RECHAZADO'

  return 'PENDIENTE'
}

const mapStudentProfile = (payload: unknown): StudentProfile => {
  const profile = asRecord(payload)
  const fullName = pickString([profile], ['nombreCompleto'])
  const [firstNameFromFull = '', ...restNameParts] = fullName.split(' ')

  return {
    id: pickString([profile], ['id', 'estudianteId', 'userId']),
    firstName: pickString([profile], ['nombres', 'firstName', 'nombre'], firstNameFromFull),
    lastName: pickString([profile], ['apellidos', 'lastName'], restNameParts.join(' ')),
    email: pickString([profile], ['email', 'correo']),
    phone: pickString([profile], ['telefono', 'phone']),
    career: pickString([profile], ['programaEducativo', 'carrera', 'career'], 'Programa no especificado'),
    institutionalEmail: pickString([profile], ['correoInstitucional', 'institutionalEmail', 'email']),
    birthDate: pickString([profile], ['fechaNacimiento', 'birthDate']),
    profileImage: pickString([profile], ['fotoUrl', 'profileImage', 'fotoPerfilUrl']),
    civilStatus: pickString([profile], ['estadoCivil', 'civilStatus'], 'No especificado'),
    address: pickString([profile], ['direccion', 'address'], 'No especificado'),
    academicStatus: pickString([profile], ['estatusAcademico', 'academicStatus'], 'Estudiante'),
    validationStatus: pickString([profile], ['estatusValidacion', 'validationStatus']),
    cvUrl: pickString([profile], ['cvUrl', 'curriculumUrl']),
    documentUrl: pickString([profile], ['docProbatorioUrl', 'documentUrl']),
  }
}

const getNestedRecord = (record: ApiRecord, keys: string[]) => asRecord(pickValue([record], keys))

const mapApplication = (payload: unknown, index: number): Application => {
  const application = asRecord(payload)
  const vacancy = getNestedRecord(application, ['vacante', 'publicacion', 'vacancy', 'job'])
  const company = getNestedRecord(application, ['empresa', 'company'])
  const records = [application, vacancy, company]
  const requirements = pickString(records, ['responsabilidades', 'responsibilities', 'requisitos'])
  const description = pickString(records, ['descripcion', 'description'])

  return {
    id: pickString(records, ['id', 'postulacionId', 'publicacionId', 'vacanteId'], String(index + 1)),
    jobTitle: pickString(records, ['titulo', 'tituloVacante', 'jobTitle', 'title'], 'Vacante sin titulo'),
    company: pickString(records, ['nombreEmpresa', 'empresaNombre', 'companyName', 'company', 'nombre'], 'Empresa no especificada'),
    postulationDate: formatDate(pickValue(records, ['fechaPostulacion', 'fechaAplicacion', 'fecha', 'createdAt', 'fechaPublicacion'])),
    status: normalizeStatus(pickString(records, ['estatusPostulacion', 'estatus', 'status'], 'PENDIENTE')),
    modality: pickString(records, ['modalidad', 'type', 'tipo'], 'No especificado'),
    salary: formatSalary(pickValue(records, ['sueldoAprox', 'salario', 'salary', 'salaryTag'])),
    location: pickString(records, ['ubicacion', 'location', 'direccion'], 'No especificado'),
    schedule: pickString(records, ['horario', 'schedule'], 'No especificado'),
    experience: pickString(records, ['experiencia', 'experience'], 'No especificado'),
    description,
    responsibilities: requirements ? splitTextList(requirements) : [],
  }
}

export const mapApplicationToJobItem = (application: Application): JobItem => ({
  id: application.id,
  title: application.jobTitle,
  company: application.company,
  salary: application.salary ?? 'Sueldo no especificado',
  location: application.location ?? 'No especificado',
  type: application.modality ?? 'No especificado',
  availability: application.modality ?? 'No especificado',
  date: application.postulationDate,
})

export const estudianteService = {
  getPerfil: async (userId: number): Promise<StudentProfile> => {
    const response = await api.get(`/estudiante/${userId}/perfil`) as unknown

    return mapStudentProfile(response)
  },

  getPostulaciones: async (estudianteId: number): Promise<Application[]> => {
    const response = await api.get(`/estudiante/${estudianteId}/postulaciones`) as unknown
    const items = unwrapList(response, ['value', 'Value', 'postulaciones', 'items', 'data'])

    return items.map(mapApplication)
  },

  getPostulacionesRecientes: async (estudianteId: number): Promise<RecentApplicationsResult> => {
    const response = await api.get(`/estudiante/${estudianteId}/postulaciones/recientes`) as unknown
    const record = asRecord(response)
    const recientes = unwrapList(response, ['recientes', 'value', 'Value', 'postulaciones']).map(mapApplication)
    const total = pickNumber([record], ['totalPostulaciones', 'total', 'count', 'Count'], recientes.length)

    return {
      totalPostulaciones: total,
      recientes,
    }
  },
}
