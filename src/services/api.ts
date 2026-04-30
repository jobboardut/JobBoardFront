import axios from 'axios'
import { config } from '@/config/env'

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
