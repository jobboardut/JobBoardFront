# Reporte de conexion de APIs de Administradores

## Resumen

Se conecto la feature de administradores usando el cliente Axios compartido `src/services/api.ts`, que ya era el patron usado por empresas. No fue necesario cambiar la logica global del proyecto ni introducir otro cliente HTTP.

## Endpoints conectados

- `GET /admin/estadisticas/usuarios`
- `GET /admin/vacantes/recientes`
- `GET /admin/vacantes/activas`
- `GET /admin/usuarios`
- `POST /admin/usuarios/:id/validar`
- `GET /admin/publicaciones`
- `GET /admin/postulaciones/recientes`
- `GET /admin/postulantes`
- `GET /admin/postulantes/estatus/:estatus`
- `GET /catalogo/carreras`
- `GET /catalogo/carreras/:id`
- `POST /catalogo/carreras`
- `PUT /catalogo/carreras/:id`
- `DELETE /catalogo/carreras/:id`
- `GET /catalogo/sectores`
- `GET /catalogo/sectores/:id`
- `POST /catalogo/sectores`
- `PUT /catalogo/sectores/:id`
- `DELETE /catalogo/sectores/:id`

## Cambios realizados

- Se amplio `adminService` para centralizar todos los endpoints Admin reales.
- Se reemplazaron mocks en:
  - Dashboard de administrador.
  - Centro de validacion.
  - Centro de gestion.
  - Publicaciones.
  - Seguimiento de postulaciones.
- Se agregaron adaptadores en los services para transformar la respuesta del backend al modelo que ya consumen los componentes.
- Se estandarizo el dashboard Admin: ahora `dashboardService.ts` arma su `DashboardOverview` desde endpoints Admin reales, en vez de depender de `/dashboard/overview`.
- Se conectaron las acciones de aprobar/rechazar usuario con `POST /admin/usuarios/:id/validar`.
- Se agregaron hooks con React Query para las vistas que antes devolvian datos sincronicos mockeados.
- Se conecto el modulo de configuracion a catalogos reales de carreras y sectores.
- Se eliminaron los datos estaticos de configuracion y el estado local temporal.
- Se agregaron mutaciones para crear y eliminar carreras/sectores con invalidacion de React Query.

## Notas de logica

- Empresas ya usaba Axios mediante `src/services/api.ts`; por eso se siguio ese mismo patron.
- El backend de Admin no entrega la misma estructura que la UI necesita. Para evitar cambiar componentes, la normalizacion se hizo dentro de cada service.
- El endpoint de publicaciones no trae campos como salario, jornada, ubicacion, experiencia o responsabilidades. Se rellenan con textos neutrales como "No especificado" para mantener estable la UI.
- El endpoint de usuarios no distingue egresado vs alumno; por ahora los usuarios `Estudiante` se muestran como alumnos en validacion y como egresados/estudiantes segun el contador de gestion.
- `GET /admin/postulantes` y `GET /admin/postulaciones/recientes` respondieron sin datos en la prueba manual. Se dejaron conectados con adaptadores defensivos para cuando el backend devuelva registros.
- La coleccion Bruno marca `EliminarCarrera` como `GET /catalogo/carreras/:id`, pero para mantener consistencia con sectores y con CRUD REST se implemento como `DELETE /catalogo/carreras/:id`. Conviene confirmar con backend si fue un typo de la coleccion.
- La UI actual de configuracion solo contempla crear y eliminar. Los metodos de obtener por id y actualizar quedaron disponibles en `configurationService`, pero no se agrego edicion visual porque cambiaria el flujo actual del modulo.

## Validacion

- `npm run build` ejecutado correctamente.
- La build genera una advertencia de Vite por chunk mayor a 500 kB; no esta relacionada con esta integracion.
