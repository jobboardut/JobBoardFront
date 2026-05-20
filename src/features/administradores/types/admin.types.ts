export interface EstadisticasUsuarios {
  totalEstudiantes: number
  totalEmpresas: number
}

export type VacanteRecienteEstado = 'ACTIVO' | 'PAUSADO' | 'BORRADOR'

export interface VacanteReciente {
  id: number
  titulo: string
  modalidad: string
  nombreEmpresa: string
  estatus: string
  fechaPublicacion?: string
  totalPostulantes: number
}

export interface AdminUsuario {
  id: number
  email: string
  rol: 'Admin' | 'Empresa' | 'Estudiante' | string
  estatusValidacion: 'Pendiente' | 'Validado' | 'Rechazado' | string
  fechaRegistro: string
  nombreCompleto: string | null
}

export interface AdminUsuariosResponse {
  totalActivos: number
  totalInactivos: number
  usuarios: AdminUsuario[]
}

export interface AdminPublicacionesResponse {
  total: number
  activas: number
  pausadas: number
  totalPostulantes: number
  publicaciones: VacanteReciente[]
}

export type ValidarUsuarioAccion = 'aprobar' | 'rechazar'

export interface ValidarUsuarioRequest {
  accion: ValidarUsuarioAccion
}

export type PublicacionEstatusAdmin = 'Pausada' | 'Finalizada' | 'Baneada' | 'Eliminada'

export interface ActualizarPublicacionEstatusRequest {
  estatus: PublicacionEstatusAdmin
}
