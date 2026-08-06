import api, { UPLOAD_TIMEOUT } from '@/services/api'
import type {
  EmpresaPerfil,
  EmpresaPerfilUpdateRequest,
  EmpresaArchivos,
  Vacante,
  CreateVacanteRequest,
  UpdateEstatusRequest,
  Postulante,
  PostulanteApi,
  CambiarEstatusPostulacionRequest,
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

export const empresaService = {

  getPerfil: (userId: number): Promise<EmpresaPerfil> =>
    api.get(`/empresa/${userId}/perfil`) as Promise<EmpresaPerfil>,

  actualizarPerfil: (userId: number, data: EmpresaPerfilUpdateRequest): Promise<EmpresaPerfil> =>
    api.put(`/empresa/${userId}/perfil`, data) as Promise<EmpresaPerfil>,

  actualizarArchivos: (userId: number, archivos: EmpresaArchivos): Promise<EmpresaPerfil> => {
    const formData = new FormData()
    if (archivos.logo) formData.append('Logo', archivos.logo)
    if (archivos.situacionFiscal) formData.append('SitFiscal', archivos.situacionFiscal)
    if (archivos.docExistencia) formData.append('DocExistencia', archivos.docExistencia)
    if (archivos.repDocCargo) formData.append('RepDocCargo', archivos.repDocCargo)
    if (archivos.repFotoIne) formData.append('RepFotoIne', archivos.repFotoIne)

    // Hasta cinco documentos: sin margen extra, axios cancela el envio a los 10s.
    return api.patch(`/empresa/${userId}/archivos`, formData, {
      timeout: UPLOAD_TIMEOUT,
    }) as Promise<EmpresaPerfil>
  },

  getVacantes: (empresaId: number): Promise<Vacante[]> =>
    api.get(`/empresa/${empresaId}/vacantes`) as Promise<Vacante[]>,

  getVacante: (empresaId: number, publicacionId: number): Promise<Vacante> =>
    api.get(`/empresa/${empresaId}/vacantes/${publicacionId}`) as Promise<Vacante>,

  crearVacante: (empresaId: number, data: CreateVacanteRequest): Promise<Vacante> =>
    // El backend nombra "cupo" a los lugares de la vacante; se envian ambos por compatibilidad.
    api.post(`/empresa/${empresaId}/vacantes`, { ...data, cupo: data.lugares }) as Promise<Vacante>,

  actualizarEstatusVacante: (publicacionId: number, data: UpdateEstatusRequest): Promise<void> =>
    api.put(`/empresa/vacantes/${publicacionId}/estatus`, data) as Promise<void>,

  getPostulantes: async (empresaId: number, publicacionId: number): Promise<Postulante[]> => {
    const response = await api.get(
      `/empresa/${empresaId}/vacantes/${publicacionId}/postulantes`
    ) as unknown

    return unwrapPostulantes(response).map(mapPostulante)
  },

  // Endpoint unico para las cuatro acciones del ciclo:
  // CvVisto | Entrevista (fechaEntrevista opcional) | Contratado (valida cupo) | Rechazado (motivo obligatorio)
  cambiarEstatusPostulante: (
    empresaId: number,
    postulacionId: number,
    data: CambiarEstatusPostulacionRequest
  ): Promise<void> =>
    api.put(`/empresa/${empresaId}/postulaciones/${postulacionId}/estatus`, data) as Promise<void>,

}
