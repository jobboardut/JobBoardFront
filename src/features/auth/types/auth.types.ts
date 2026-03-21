// src/types/auth.types.ts
export type UserRole = 'administrador' | 'empresa' | 'estudiante'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}