export const ROUTES = {
  LOGIN:            '/login',
  SELECCION_CUENTA: '/registro',
  DASHBOARD:        '/dashboard',

  // Administrador
  ADMIN_VALIDACION:     '/administradores/validacion',
  ADMIN_GESTION:        '/administradores/gestion',
  ADMIN_PUBLICACIONES:  '/administradores/publicaciones',
  ADMIN_SEGUIMIENTO:    '/administradores/seguimiento',

  // Empresa
  EMPRESA_DASHBOARD:     '/empresas/dashboard',
  EMPRESA_PUBLICACIONES: '/empresas/publicaciones',
  EMPRESA_POSTULANTES:   '/empresas/postulantes',
  EMPRESA_PERFIL: '/empresas/perfil',
  EMPRESA_COMPLETAR_PERFIL: '/empresas/perfil/completar',
  EMPRESA_EDITAR_PERFIL: '/empresas/perfil/editar',
  EMPRESA_CREAR_VACANTE: '/empresas/vacantes/nueva',
  EMPRESA_EDITAR_VACANTE: '/empresas/vacantes/editar/:id',
  EMPRESA_DETALLE_VACANTE: '/empresas/vacantes/:id',
  EMPRESA_DETALLE_POSTULANTE: '/empresas/postulantes/:id',

  // Estudiante
  ESTUDIANTE_PUBLICACIONES: '/estudiantes/publicaciones',
  ESTUDIANTE_PERFIL:        '/estudiantes/perfil',
  ESTUDIANTE_SEGUIMIENTO:   '/estudiantes/seguimiento',
} as const