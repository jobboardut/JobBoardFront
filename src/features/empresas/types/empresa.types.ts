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
}

export interface UpdateEstatusRequest {
  estatus: 'Pausada' | 'Finalizada' | 'Baneada'
}

export interface Postulante {
  id: number
  nombre: string
  email: string
  telefono?: string
  ubicacion?: string
  carrera?: string
  tipoUsuario: string
  estatus: string
  descripcion: string
}
