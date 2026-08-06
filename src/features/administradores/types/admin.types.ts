export interface EstadisticasUsuarios {
  totalEstudiantes: number
  totalEmpresas: number
  /** Los egresados se cuentan aparte de los estudiantes. */
  totalEgresados?: number
  totalVinculaciones?: number
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
  sueldoAprox?: number | null
  ubicacion?: string | null
  competencias?: string | null
  responsabilidades?: string | null
  // Nombres reales del backend para los lugares de la vacante.
  cupo?: number | null
  cuposDisponibles?: number | null
  lugares?: number | null
  lugaresOcupados?: number | null
}

export interface AdminUsuario {
  id: number
  email: string
  rol: 'Admin' | 'Empresa' | 'Estudiante' | string
  estatusValidacion: 'Pendiente' | 'Validado' | 'Rechazado' | 'Inhabilitado' | string
  fechaRegistro: string
  nombreCompleto: string | null
  estatusAcademico?: string | null
  // Historial de devoluciones que ya regresa el backend.
  totalDevoluciones?: number
  ultimaObservacion?: string | null
  fechaUltimaObservacion?: string | null
  // Compatibilidad con versiones previas del backend.
  observaciones?: string | null
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

// Acciones del backend: aprobar | devolver (con observaciones, avisa por correo) | inhabilitar.
export type ValidarUsuarioAccion = 'aprobar' | 'devolver' | 'inhabilitar'

export interface ValidarUsuarioRequest {
  accion: ValidarUsuarioAccion
  // Motivo redactado por el admin. Obligatorio al devolver.
  observaciones?: string
}

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
