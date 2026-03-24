export type EstatusVacante = 'activo' | 'pendiente' | 'cerrada'
export type EstatusPostulante = 'pendiente' | 'revision' | 'entrevista'

export interface Vacante {
  id: string
  titulo: string
  descripcion: string
  estatus: EstatusVacante
  postulantes: number
  fechaPublicacion: string
}

export interface Postulante {
  id: string
  nombre: string
  descripcion: string
  estatus: EstatusPostulante
}