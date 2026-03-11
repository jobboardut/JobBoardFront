export const ROUTES = {
  LOGIN:          '/login',
  DASHBOARD:      '/dashboard',

  // Administrador
  ADMIN_VALIDACION:   '/administradores/validacion',
  ADMIN_GESTION:      '/administradores/gestion',
  ADMIN_PUBLICACIONES:'/administradores/publicaciones',
  ADMIN_SEGUIMIENTO:  '/administradores/seguimiento',

  // Empresa
  EMPRESA_DASHBOARD:    '/empresas/dashboard',
  EMPRESA_PUBLICACIONES:'/empresas/publicaciones',
  EMPRESA_POSTULANTES:  '/empresas/postulantes',

  // Estudiante
  ESTUDIANTE_PUBLICACIONES:'/estudiantes/publicaciones',
  ESTUDIANTE_PERFIL:       '/estudiantes/perfil',
  ESTUDIANTE_SEGUIMIENTO:  '/estudiantes/seguimiento',
} as const