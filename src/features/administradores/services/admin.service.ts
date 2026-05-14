import api from '@/services/api'
import type {
  AdminPublicacionesResponse,
  AdminUsuariosResponse,
  EstadisticasUsuarios,
  VacanteReciente,
  ValidarUsuarioRequest,
} from '../types/admin.types'

export const adminService = {
  getEstadisticasUsuarios: (): Promise<EstadisticasUsuarios> =>
    api.get('/admin/estadisticas/usuarios') as Promise<EstadisticasUsuarios>,

  getVacantesRecientes: (): Promise<VacanteReciente[]> =>
    api.get('/admin/vacantes/recientes') as Promise<VacanteReciente[]>,

  getVacantesActivas: (): Promise<VacanteReciente[]> =>
    api.get('/admin/vacantes/activas') as Promise<VacanteReciente[]>,

  getUsuarios: (): Promise<AdminUsuariosResponse> =>
    api.get('/admin/usuarios') as Promise<AdminUsuariosResponse>,

  validarUsuario: (id: number | string, data: ValidarUsuarioRequest): Promise<void> =>
    api.post(`/admin/usuarios/${id}/validar`, data) as Promise<void>,

  getPublicaciones: (): Promise<AdminPublicacionesResponse> =>
    api.get('/admin/publicaciones') as Promise<AdminPublicacionesResponse>,

  getPostulacionesRecientes: (): Promise<unknown[]> =>
    api.get('/admin/postulaciones/recientes') as Promise<unknown[]>,

  getPostulantes: (): Promise<unknown[]> =>
    api.get('/admin/postulantes') as Promise<unknown[]>,

  getPostulantesPorEstatus: (estatus: string): Promise<unknown[]> =>
    api.get(`/admin/postulantes/estatus/${encodeURIComponent(estatus)}`) as Promise<unknown[]>,

}
