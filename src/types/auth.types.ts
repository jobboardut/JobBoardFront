// Roles que puede tener un usuario
export type UserRole = 'administrador' | 'empresa' | 'estudiante'

// Estructura del usuario autenticado
export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

// Lo que el frontend manda al hacer login
export interface LoginRequest {
  email: string
  password: string
}

// Lo que el backend devuelve cuando el login es exitoso
export interface LoginResponse {
  token: string
  user: AuthUser
}