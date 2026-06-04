import api from '@/services/api'
import type {
  EmpresaPerfil,
  Vacante,
  CreateVacanteRequest,
  UpdateEstatusRequest,
  Postulante,
  PostulanteApi,
} from '../types/empresa.types'

// El backend (PostulanteEmpresaDto) usa otros nombres de campo; normalizamos aquí.
const mapPostulante = (p: PostulanteApi): Postulante => ({
  id: p.estudianteId,
  postulacionId: p.postulacionId,
  nombre: p.nombreCompleto,
  email: p.email,
  telefono: p.telefono,
  carrera: p.carrera,
  matricula: p.matricula,
  estatusAcademico: p.estatusAcademico,
  tipoUsuario: p.estatusAcademico || 'Estudiante',
  estatus: p.estatusPostulacion,
  descripcion: '',
  fotoUrl: p.fotoUrl,
  cvUrl: p.cvUrl,
  urlExpirationSeconds: p.urlExpirationSeconds,
})

export const empresaService = {

  getPerfil: (userId: number): Promise<EmpresaPerfil> =>
    api.get(`/empresa/${userId}/perfil`) as Promise<EmpresaPerfil>,

  actualizarPerfil: (userId: number, data: Partial<EmpresaPerfil>): Promise<EmpresaPerfil> =>
    api.put(`/empresa/${userId}/perfil`, data) as Promise<EmpresaPerfil>,

  getVacantes: (empresaId: number): Promise<Vacante[]> =>
    api.get(`/empresa/${empresaId}/vacantes`) as Promise<Vacante[]>,

  getVacante: (empresaId: number, publicacionId: number): Promise<Vacante> =>
    api.get(`/empresa/${empresaId}/vacantes/${publicacionId}`) as Promise<Vacante>,

  crearVacante: (empresaId: number, data: CreateVacanteRequest): Promise<Vacante> =>
    api.post(`/empresa/${empresaId}/vacantes`, data) as Promise<Vacante>,

  actualizarEstatusVacante: (publicacionId: number, data: UpdateEstatusRequest): Promise<void> =>
    api.put(`/empresa/vacantes/${publicacionId}/estatus`, data) as Promise<void>,

  getPostulantes: async (empresaId: number, publicacionId: number): Promise<Postulante[]> => {
    const data = (await api.get(
      `/empresa/${empresaId}/vacantes/${publicacionId}/postulantes`
    )) as unknown as PostulanteApi[]
    return data.map(mapPostulante)
  },

  // Cambia el estatus de una postulación: Enviada | Revision | Entrevista | Aceptada | Rechazada
  actualizarEstatusPostulante: (
    empresaId: number,
    postulacionId: number,
    estatus: string
  ): Promise<void> =>
    api.put(`/empresa/${empresaId}/postulaciones/${postulacionId}/estatus`, { estatus }) as Promise<void>,

}
