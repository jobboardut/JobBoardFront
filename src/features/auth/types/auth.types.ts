export type UserRole = 'Admin' | 'Empresa' | 'Estudiante' | 'Egresado'

export interface AuthUser {
  id: number
  email: string
  rol: UserRole
  estatusValidacion: string
  nombreCompleto: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiracion: string
  usuario: AuthUser
}

export interface RegistroEmpresaRequest {
  email: string
  password: string
  nombreEmpresa: string
  telefonoEmpresa: string
  direccion: string
  correoEmpresa: string
  sectorId: string
  sitioWeb: string
  descripcion: string
  repNombre: string
  repApellidos: string
  repPuesto: string
  repTelefono: string
  repCorreo: string
  logo?: File | null
  situacionFiscal?: File | null
  docExistencia?: File | null
  repDocCargo?: File | null
  repFotoIne?: File | null
}
