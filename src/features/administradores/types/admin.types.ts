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

// Mesa de Validación — documentos del usuario (req 014)
export interface ValidationDocument {
  tipo: string
  categoria: 'imagen' | 'pdf'
  url: string | null
}

export interface DocumentosValidacionResponse {
  userId: number
  rol: string
  estatusValidacion: string
  nombreCompleto: string
  email: string
  urlExpirationSeconds: number
  documentos: ValidationDocument[]
}

export type PublicacionEstatusAdmin = 'Pausada' | 'Finalizada' | 'Baneada' | 'Eliminada'

export interface ActualizarPublicacionEstatusRequest {
  estatus: PublicacionEstatusAdmin
}
