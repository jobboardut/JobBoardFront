import { useQuery } from '@tanstack/react-query'
import { estudianteService } from '../services/estudiante.service'

/**
 * ID de la CUENTA (userId), el que devuelve el login.
 * El backend lo exige para ESCRIBIR: postularse, retirar, subir archivos,
 * perfil y contacto.
 */
export const getUserId = (): number => Number(localStorage.getItem('userId'))

/**
 * PARCHE DE CONTRATO — quitar cuando el backend unifique los ids.
 *
 * El backend guarda las postulaciones bajo el ID de estudiante (el del
 * perfil), que NO es el userId de la sesion. Cuando difieren, leer con el
 * userId devuelve vacio y parece que las postulaciones "se perdieron".
 *
 *   Leer  (postulaciones, recientes, dashboard) -> estudianteId (perfil.id)
 *   Escribir (postular, retirar, archivos, perfil) -> userId (sesion)
 *
 * El estudianteId sale del perfil. Se usa la MISMA queryKey que useProfile,
 * asi React Query reutiliza la respuesta cacheada y no hay peticion extra.
 * Para usuarios donde ambos ids coinciden, esto devuelve el mismo valor y
 * todo sigue igual.
 */
export const useEstudianteId = (): number | null => {
  const userId = getUserId()

  const { data } = useQuery({
    queryKey: ['estudiante', 'perfil', userId],
    queryFn: () => estudianteService.getPerfil(userId),
    enabled: Number.isFinite(userId) && userId > 0,
    staleTime: 5 * 60 * 1000,
  })

  const estudianteId = data?.id ? Number(data.id) : NaN

  return Number.isFinite(estudianteId) && estudianteId > 0 ? estudianteId : null
}
