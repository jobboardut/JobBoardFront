import api from '@/services/api'
import type { Application } from '../types'
import type { JobDetailData } from '@/shared/types/job.types'

// Cambiar a false cuando el backend de seguimiento este listo.
const USE_MOCK = true

export const seguimientoService = {
  // API para useSeguimiento: tabla/lista de postulaciones del estudiante.
  async getApplications(): Promise<Application[]> {
    if (USE_MOCK) {
      return []
    }

    // TODO API (getApplications -> useSeguimiento.applicationsData):
    // Endpoint esperado para todas las postulaciones del usuario autenticado.
    return api.get('/seguimiento/applications')
  },

  // API para useSeguimiento: detalle de una postulacion para el modal.
  async getApplicationDetail(applicationId: string): Promise<JobDetailData> {
    if (USE_MOCK) {
      throw new Error('Modo mock activo: getApplicationDetail usa fallback local en el hook.')
    }

    // TODO API (getApplicationDetail -> useSeguimiento.openJobModal):
    // Endpoint esperado para abrir el modal con detalle completo de la vacante.
    return api.get(`/seguimiento/applications/${applicationId}`)
  },
}
