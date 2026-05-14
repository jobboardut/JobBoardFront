import { estudianteService } from './estudiante.service'
import type { JobDetailData } from '@/shared/types/job.types'
import type { Application } from '../types/seguimiento.types'

export const seguimientoService = {
  getApplications: (estudianteId: number): Promise<Application[]> =>
    estudianteService.getPostulaciones(estudianteId),

  getApplicationDetail: async (): Promise<JobDetailData> => {
    throw new Error('La coleccion Bruno no incluye endpoint de detalle de postulacion.')
  },
}
