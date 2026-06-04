import api from '@/services/api'
import type { Vacante } from '../types/publicaciones.types'

export const publicacionesService = {
  // Lista de vacantes activas (filtro opcional por texto / modalidad).
  getVacantes: (q?: string, modalidad?: string): Promise<Vacante[]> => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (modalidad) params.set('modalidad', modalidad)
    const qs = params.toString()
    return api.get(`/estudiante/vacantes${qs ? `?${qs}` : ''}`) as Promise<Vacante[]>
  },

  getVacante: (publicacionId: number): Promise<Vacante> =>
    api.get(`/estudiante/vacantes/${publicacionId}`) as Promise<Vacante>,

  // Postularse a una vacante (req 007). Devuelve la postulación creada.
  postular: (userId: number, publicacionId: number): Promise<unknown> =>
    api.post(`/estudiante/${userId}/postulaciones`, { publicacionId }),
}
