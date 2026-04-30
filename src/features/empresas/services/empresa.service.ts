import api from '@/services/api'
import type {
  EmpresaPerfil,
  Vacante,
  CreateVacanteRequest,
  UpdateEstatusRequest,
  Postulante,
} from '../types/empresa.types'

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

  actualizarEstatusVacante: (empresaId: number, publicacionId: number, data: UpdateEstatusRequest): Promise<void> =>
    api.put(`/empresa/${empresaId}/vacantes/${publicacionId}/estatus`, data) as Promise<void>,

  getPostulantes: (empresaId: number, publicacionId: number): Promise<Postulante[]> =>
    api.get(`/empresa/${empresaId}/vacantes/${publicacionId}/postulantes`) as Promise<Postulante[]>,

}
