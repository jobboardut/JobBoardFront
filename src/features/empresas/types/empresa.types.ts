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
  postulantes?: number
  totalPostulantes?: number
  lugares?: number
  lugaresOcupados?: number
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

/**
 * Estados del embudo, espejo de EstatusPostulacion en el backend.
 *
 * Ojo: NO existe 'Pendiente' (colisionaba con EstatusValidacion.Pendiente, que es la
 * cuarentena del usuario, un proceso distinto) ni 'Contratado' (una postulación
 * Aceptada YA cuenta como vinculación en las métricas). Ambos valores existían antes
 * en el front y el backend los rechazaba con 400.
 */
export type PostulanteEstatus =
  | 'Enviada'
  | 'EnRevision'
  | 'Entrevista'
  | 'Aceptada'
  | 'Rechazada'
  | 'Retirada'
  | 'Cerrada'

/** Subconjunto que la empresa puede ejecutar. Retirada es del estudiante; Cerrada, del sistema. */
export type EmpresaTransicion = Extract<
  PostulanteEstatus,
  'EnRevision' | 'Entrevista' | 'Aceptada' | 'Rechazada'
>

export type EtapaMotivo = 'Screening' | 'Entrevista' | 'Ambas'

/** Entrada del catálogo cerrado. No hay texto libre hacia el estudiante. */
export interface MotivoRechazo {
  id: number
  etiqueta: string
  etapaAplicable: EtapaMotivo
}

/** Cuerpo del único endpoint de transición. */
export interface CambiarEstatusPostulacionRequest {
  estatus: EmpresaTransicion
  /** Obligatorio si estatus === 'Rechazada'. */
  motivoRechazoId?: number
  /** Nota privada del reclutador. Nunca se muestra al estudiante. */
  comentarioInterno?: string
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
  /** Etapa donde se rechazó. Null si no fue rechazada. */
  etapaRechazo?: string | null
  motivoRechazo?: string | null
  comentarioInterno?: string | null
  fechaUltimoCambio?: string | null
  /** Transiciones legales calculadas por el servidor. La UI renderiza exactamente estas. */
  transicionesPermitidas: EmpresaTransicion[]
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
  fechaUltimoCambio: string | null
  etapaRechazo: string | null
  motivoRechazo: string | null
  comentarioInterno: string | null
  transicionesPermitidas: EmpresaTransicion[]
}
