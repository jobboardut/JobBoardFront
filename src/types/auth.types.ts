// src/types/auth.types.ts
export type UserRole = 'administrador' | 'empresa' | 'estudiante'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}