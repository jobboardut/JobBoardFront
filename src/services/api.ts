import axios from 'axios'
import { config } from '@/config/env'

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
  return requestConfig
})

// Interceptor de response:
// - Exito: devuelve solo response.data para simplificar los services.
// - Error 401: limpia token y redirige a login.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data)
  }
)

export default api