import api from '@/services/api'
import type { LoginRequest, LoginResponse } from '../types/auth.types'
import type { ApiResponse } from '@/types/api.types'

// Cambia a false cuando el backend de C# esté listo
const USE_MOCK = true

export const authService = {

  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800))
      return {
        success: true,
        data: {
          token: 'mock-token-123',
          user: {
            id: '1',
            name: 'Daniel Gonzalez',
            email: data.email,
            role: 'administrador',
          },
        },
        message: 'Login exitoso',
        errors: [],
      }
    }
    return api.post('/auth/login', data)
  },

  logout: () => {
    localStorage.removeItem('token')
  },

}