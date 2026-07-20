export interface EmpresaPerfil {
  id: number
  userId: number
  email: string
  estatusValidacion: string
  nombreEmpresa: string
  rfc: string | null
  sectorId: number
  descripcion: string
  sitioWeb: string
  logoUrl: string | null
  direccion: string
  telefonoEmpresa: string
  correoEmpresa: string
  repNombre: string
  repApellidos: string
  repPuesto: string
  repTelefono: string
  repCorreo: string
  situacionFiscalUrl: string | null
  docValidacionUrl: string | null
  repDocCargoUrl: string | null
  repFotoIneUrl: string | null
  totalVacantes: number
}

export interface Vacante {
  id: number
  titulo: string
  descripcion: string
  requisitos: string
  sueldoAprox: number
  modalidad: string
  estatus: string
  fechaPublicacion: string
  ubicacion?: string | null
  competencias?: string | null
  responsabilidades?: string | null
  postulantes?: number
  totalPostulantes?: number
  lugares?: number
  lugaresOcupados?: number
  // Nombres reales que devuelve el backend para los lugares.
  cupo?: number | null
  cuposDisponibles?: number | null
}

export interface VacanteUI {
  id: string
  titulo: string
  descripcion: string
  estatus: 'activo' | 'pendiente' | 'cerrada'
  postulantes: number
  fechaPublicacion: string
}

export interface CreateVacanteRequest {
  titulo: string
  descripcion: string
  requisitos: string
  sueldoAprox: number
  modalidad: string
  lugares: number
  ubicacion: string
  competencias: string
  responsabilidades: string
}

export interface UpdateEstatusRequest {
  estatus: 'Pausada' | 'Finalizada' | 'Baneada' | 'Eliminada'
}

export type EmpresaPerfilUpdateRequest = Partial<EmpresaPerfil>

export interface EmpresaArchivos {
  logo?: File | null
  situacionFiscal?: File | null
  docExistencia?: File | null
  repDocCargo?: File | null
  repFotoIne?: File | null
}

// Ciclo estandar acordado con backend:
// Postulado -> CvVisto -> Entrevista -> Contratado
// Rechazado (con motivo) desde CvVisto o Entrevista. Retirado lo hace el estudiante.
export type PostulanteEstatus =
  | 'Postulado'
  | 'CvVisto'
  | 'Entrevista'
  | 'Contratado'
  | 'Rechazado'
  | 'Retirado'

// Body de PUT /empresa/{userId}/postulaciones/{postulacionId}/estatus
export interface CambiarEstatusPostulacionRequest {
  estatus: PostulanteEstatus
  /** Solo al citar a entrevista. Fecha futura, opcional. */
  fechaEntrevista?: string
  /** Obligatorio al rechazar. */
  motivoRechazo?: string
}

export interface Postulante {
  id: number
  postulacionId: number
  nombre: string
  email: string
  telefono?: string
  ubicacion?: string
  carrera?: string
  matricula?: string
  estatusAcademico?: string
  tipoUsuario: string
  estatus: string
  descripcion: string
  fotoUrl?: string | null
  cvUrl?: string | null
  urlExpirationSeconds?: number
}

export interface PostulanteApi {
  postulacionId: number
  estudianteId: number
  nombreCompleto: string
  email: string
  matricula: string
  telefono: string
  carrera: string
  estatusAcademico: string
  fotoUrl: string | null
  cvUrl: string | null
  urlExpirationSeconds: number
  fechaPostulacion: string
  estatusPostulacion: string
}
