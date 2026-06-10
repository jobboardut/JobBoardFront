import api from '@/services/api'
import type {
  EmpresaPerfil,
  EmpresaPerfilUpdateRequest,
  Vacante,
  CreateVacanteRequest,
  UpdateEstatusRequest,
  Postulante,
  PostulanteApi,
  PostulanteEstatus,
} from '../types/empresa.types'

const asRecord = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}

const unwrapPostulantes = (response: unknown): PostulanteApi[] => {
  if (Array.isArray(response)) return response as PostulanteApi[]

  const record = asRecord(response)
  for (const key of ['value', 'Value', 'postulantes', 'items', 'data']) {
    const value = record[key]
    if (Array.isArray(value)) return value as PostulanteApi[]
  }

  return []
}

const mapPostulante = (postulante: PostulanteApi): Postulante => ({
  id: postulante.estudianteId,
  postulacionId: postulante.postulacionId,
  nombre: postulante.nombreCompleto,
  email: postulante.email,
  telefono: postulante.telefono,
  carrera: postulante.carrera,
  matricula: postulante.matricula,
  estatusAcademico: postulante.estatusAcademico,
  tipoUsuario: postulante.estatusAcademico || 'Estudiante',
  estatus: postulante.estatusPostulacion,
  descripcion: '',
  fotoUrl: postulante.fotoUrl,
  cvUrl: postulante.cvUrl,
  urlExpirationSeconds: postulante.urlExpirationSeconds,
})

const appendIfPresent = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return
  formData.append(key, String(value))
}

const buildPerfilFormData = (data: EmpresaPerfilUpdateRequest) => {
  const formData = new FormData()

  appendIfPresent(formData, 'Id', data.id)
  appendIfPresent(formData, 'UserId', data.userId)
  appendIfPresent(formData, 'Email', data.email)
  appendIfPresent(formData, 'EstatusValidacion', data.estatusValidacion)
  appendIfPresent(formData, 'NombreEmpresa', data.nombreEmpresa)
  appendIfPresent(formData, 'Rfc', data.rfc)
  appendIfPresent(formData, 'SectorId', data.sectorId)
  appendIfPresent(formData, 'Descripcion', data.descripcion)
  appendIfPresent(formData, 'SitioWeb', data.sitioWeb)
  appendIfPresent(formData, 'LogoUrl', data.logoUrl)
  appendIfPresent(formData, 'Direccion', data.direccion)
  appendIfPresent(formData, 'TelefonoEmpresa', data.telefonoEmpresa)
  appendIfPresent(formData, 'CorreoEmpresa', data.correoEmpresa)
  appendIfPresent(formData, 'RepNombre', data.repNombre)
  appendIfPresent(formData, 'RepApellidos', data.repApellidos)
  appendIfPresent(formData, 'RepPuesto', data.repPuesto)
  appendIfPresent(formData, 'RepTelefono', data.repTelefono)
  appendIfPresent(formData, 'RepCorreo', data.repCorreo)
  appendIfPresent(formData, 'SituacionFiscalUrl', data.situacionFiscalUrl)
  appendIfPresent(formData, 'DocValidacionUrl', data.docValidacionUrl)
  appendIfPresent(formData, 'RepDocCargoUrl', data.repDocCargoUrl)
  appendIfPresent(formData, 'RepFotoIneUrl', data.repFotoIneUrl)
  appendIfPresent(formData, 'TotalVacantes', data.totalVacantes)

  if (data.logoFile) {
    formData.append('Logo', data.logoFile)
  }

  return formData
}

const stripPerfilFile = (data: EmpresaPerfilUpdateRequest): Partial<EmpresaPerfil> => {
  const { logoFile, ...payload } = data
  void logoFile
  return payload
}

export const empresaService = {

  getPerfil: (userId: number): Promise<EmpresaPerfil> =>
    api.get(`/empresa/${userId}/perfil`) as Promise<EmpresaPerfil>,

  actualizarPerfil: (userId: number, data: EmpresaPerfilUpdateRequest): Promise<EmpresaPerfil> => {
    const payload = data.logoFile ? buildPerfilFormData(data) : stripPerfilFile(data)
    return api.put(`/empresa/${userId}/perfil`, payload) as Promise<EmpresaPerfil>
  },

  getVacantes: (empresaId: number): Promise<Vacante[]> =>
    api.get(`/empresa/${empresaId}/vacantes`) as Promise<Vacante[]>,

  getVacante: (empresaId: number, publicacionId: number): Promise<Vacante> =>
    api.get(`/empresa/${empresaId}/vacantes/${publicacionId}`) as Promise<Vacante>,

  crearVacante: (empresaId: number, data: CreateVacanteRequest): Promise<Vacante> =>
    api.post(`/empresa/${empresaId}/vacantes`, data) as Promise<Vacante>,

  actualizarEstatusVacante: (publicacionId: number, data: UpdateEstatusRequest): Promise<void> =>
    api.put(`/empresa/vacantes/${publicacionId}/estatus`, data) as Promise<void>,

  getPostulantes: async (empresaId: number, publicacionId: number): Promise<Postulante[]> => {
    const response = await api.get(
      `/empresa/${empresaId}/vacantes/${publicacionId}/postulantes`
    ) as unknown

    return unwrapPostulantes(response).map(mapPostulante)
  },

  actualizarEstatusPostulante: (
    empresaId: number,
    postulacionId: number,
    estatus: PostulanteEstatus
  ): Promise<void> =>
    api.put(`/empresa/${empresaId}/postulaciones/${postulacionId}/estatus`, { estatus }) as Promise<void>,

}
