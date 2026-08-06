import axios from 'axios'
import { config } from '@/config/env'

/**
 * Margen para peticiones que suben archivos (multipart).
 * El timeout global de 10s no alcanza para varios documentos y axios cancela
 * el envio a media subida, sin error claro para el usuario.
 */
export const UPLOAD_TIMEOUT = 60000

// Cliente HTTP compartido para toda la app.
// - Usa baseURL desde variables de entorno.
// - Inyecta token automaticamente en cada request.
// - Normaliza respuestas para devolver response.data.
const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request:
// Agrega Authorization: Bearer <token> si existe token en localStorage.
api.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`
  }
  if (requestConfig.data instanceof FormData) {
    delete requestConfig.headers['Content-Type']
  }
  return requestConfig
})

// Interceptor de response:
// - Exito: devuelve solo response.data para simplificar los services.
// - Error 401: limpia token y redirige a login.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const requestUrl = String(error.config?.url ?? '')
    const isLoginRequest = requestUrl.includes('/auth/login')

    if (status === 401 && !isLoginRequest) {
      // Limpieza completa: token, rol y estatus de validacion.
      for (const key of ['token', 'userId', 'rol', 'estatusValidacion', 'ultimaObservacion']) {
        localStorage.removeItem(key)
      }
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data)
  }
)

export default api
