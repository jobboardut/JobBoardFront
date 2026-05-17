# Reporte de cobertura de APIs

Fecha de revision: 2026-05-15

## Fuente revisada

- Frontend: `C:\Users\doseq\JobBoardFront`
- Coleccion API: `C:\Users\doseq\Downloads\ut_jb_API.zip`
- Base URL usada por el frontend: `https://utjl.runasp.net/api`
- Cliente HTTP activo: `src/services/api.ts`

El proyecto esta trabajando sobre la rama `develop` del repositorio compartido `https://github.com/jobboardut/JobBoardFront.git`.

## Resumen ejecutivo

La mayoria de las features principales ya tienen conexion real por medio de services:

- Auth: login, logout y registro.
- Empresas: perfil, vacantes y postulantes por vacante.
- Administradores: estadisticas, usuarios, validacion, publicaciones, postulaciones y catalogos.
- Estudiantes: perfil, postulaciones y postulaciones recientes.
- Catalogos compartidos: carreras y sectores.

Lo que sigue sin poder conectarse de forma correcta es la navegacion de publicaciones disponibles para estudiante y la accion de postularse, porque el ZIP no trae endpoints publicos o de estudiante para esas pantallas. No conviene usar endpoints de admin para eso, porque requieren permisos de admin y tienen otra intencion.

## Matriz de endpoints

| Feature | Endpoint | Estado frontend | Archivo principal |
| --- | --- | --- | --- |
| Auth | `POST /auth/login` | Conectado | `src/features/auth/services/auth.service.ts` |
| Auth | `POST /auth/logout` | Conectado | `src/features/auth/services/auth.service.ts` |
| Registro | `POST /registro/empresa` | Conectado | `src/features/auth/services/auth.service.ts` |
| Registro | `POST /registro/estudiante` | Conectado con contrato pendiente de confirmar | `src/features/auth/services/auth.service.ts` |
| Catalogos | `GET /catalogo/carreras` | Conectado, aunque no venia en el ZIP | `src/services/catalog.service.ts` |
| Catalogos | `GET /catalogo/sectores` | Conectado, aunque no venia en el ZIP | `src/services/catalog.service.ts` |
| Empresa | `GET /empresa/:userId/perfil` | Conectado | `src/features/empresas/services/empresa.service.ts` |
| Empresa | `PUT /empresa/:userId/perfil` | Conectado | `src/features/empresas/services/empresa.service.ts` |
| Empresa | `GET /empresa/:empresaId/vacantes` | Conectado | `src/features/empresas/services/empresa.service.ts` |
| Empresa | `POST /empresa/:empresaId/vacantes` | Conectado | `src/features/empresas/services/empresa.service.ts` |
| Empresa | `GET /empresa/:empresaId/vacantes/:publicacionId` | Conectado | `src/features/empresas/services/empresa.service.ts` |
| Empresa | `PUT /empresa/:empresaId/vacantes/:publicacionId/estatus` | Conectado | `src/features/empresas/services/empresa.service.ts` |
| Empresa | `GET /empresa/:empresaId/vacantes/:publicacionId/postulantes` | Conectado | `src/features/empresas/services/empresa.service.ts` |
| Estudiante | `GET /estudiante/:userId/perfil` | Conectado | `src/features/estudiantes/services/estudiante.service.ts` |
| Estudiante | `GET /estudiante/:estudianteId/postulaciones` | Conectado | `src/features/estudiantes/services/estudiante.service.ts` |
| Estudiante | `GET /estudiante/:estudianteId/postulaciones/recientes` | Conectado | `src/features/estudiantes/services/estudiante.service.ts` |
| Admin | `GET /admin/estadisticas/usuarios` | Conectado | `src/features/administradores/services/admin.service.ts` |
| Admin | `GET /admin/vacantes/recientes` | Conectado | `src/features/administradores/services/admin.service.ts` |
| Admin | `GET /admin/vacantes/activas` | Conectado | `src/features/administradores/services/admin.service.ts` |
| Admin | `GET /admin/usuarios` | Conectado | `src/features/administradores/services/admin.service.ts` |
| Admin | `POST /admin/usuarios/:id/validar` | Conectado | `src/features/administradores/services/admin.service.ts` |
| Admin | `GET /admin/publicaciones` | Conectado | `src/features/administradores/services/admin.service.ts` |
| Admin | `GET /admin/postulaciones/recientes` | Conectado | `src/features/administradores/services/admin.service.ts` |
| Admin | `GET /admin/postulantes` | Conectado | `src/features/administradores/services/admin.service.ts` |
| Admin | `GET /admin/postulantes/estatus/:estatus` | Conectado | `src/features/administradores/services/admin.service.ts` |

## APIs faltantes o incompletas

### Estudiantes: publicaciones disponibles

Pantallas afectadas:

- `src/features/estudiantes/hooks/usePublicaciones.ts`
- `src/features/estudiantes/services/publicaciones.service.ts`
- `src/features/estudiantes/components/PublicationDetail.tsx`
- `src/features/estudiantes/components/SearchPublicationCard.tsx`

Endpoints necesarios:

- `GET /publicaciones` o `GET /estudiante/:estudianteId/publicaciones`
- `GET /publicaciones/:publicacionId` o `GET /estudiante/:estudianteId/publicaciones/:publicacionId`
- Parametros recomendados: `search`, `programaEducativo`, `modalidad`, `jornada`, `ubicacion`, `page`, `limit`.

Motivo: el ZIP solo trae endpoints de admin para publicaciones y endpoints de empresa para sus propias vacantes. Ninguno sirve como catalogo de vacantes disponibles para estudiantes.

### Estudiantes: postularse a una vacante

Pantallas afectadas:

- `src/features/estudiantes/components/PublicationDetail.tsx`
- `src/features/estudiantes/services/publicaciones.service.ts`

Endpoint necesario:

- `POST /estudiante/:estudianteId/postulaciones`

Body recomendado:

```json
{
  "publicacionId": 1
}
```

Respuesta recomendada:

```json
{
  "id": 10,
  "publicacionId": 1,
  "estudianteId": 8,
  "estatus": "postulado",
  "fechaPostulacion": "2026-05-15T00:00:00.000Z"
}
```

### Estudiantes: actualizar perfil y documentos

Pantallas afectadas:

- `src/features/estudiantes/hooks/useProfile.ts`
- `src/features/estudiantes/hooks/useEditContact.ts`
- `src/features/estudiantes/components/EditContactModal.tsx`
- `src/features/estudiantes/components/CurriculumSection.tsx`

Endpoints recomendados:

- `PUT /estudiante/:userId/perfil`
- `POST /estudiante/:userId/cv`
- `POST /estudiante/:userId/foto`
- `POST /estudiante/:userId/documento-probatorio`

Motivo: el ZIP solo tiene lectura de perfil. La UI puede mostrar datos reales, pero no hay endpoint para guardar cambios del estudiante.

### Registro de estudiante

Endpoint conectado:

- `POST /registro/estudiante`

Nota: el archivo del ZIP incluye un body minimo/incompleto. Se conecto con los datos que ya captura el formulario:

- `email`
- `password`
- `nombre`
- `nombres`
- `apellidos`
- `direccion`
- `fechaNacimiento`
- `estadoCivil`
- `programaEducativo`

Backend debe confirmar si acepta esos campos o si requiere otros nombres.

### Registro de empresa

Endpoint conectado:

- `POST /registro/empresa`

Nota: el archivo del ZIP no define body, pero el frontend ya envia `FormData` con datos de empresa, password, sector y logo. Backend debe confirmar el contrato oficial.

## Comunicacion entre features

La comunicacion entre features debe hacerse por services y por datos del backend, no importando datos internos de otra feature.

Flujo actual recomendado:

1. Auth hace login y guarda `token`, `role` y datos del usuario.
2. `src/services/api.ts` agrega `Authorization: Bearer <token>` en cada request.
3. Cada feature consume su propio service:
   - Auth usa `auth.service.ts`.
   - Empresas usa `empresa.service.ts`.
   - Estudiantes usa `estudiante.service.ts` y, cuando exista API, `publicaciones.service.ts`.
   - Admin usa `admin.service.ts`.
4. Los catalogos compartidos viven en `src/services/catalog.service.ts` porque los usan Auth y Admin.

## Pruebas manuales realizadas

Se verifico contra la API real:

- Login admin correcto.
- Endpoints admin principales responden.
- Catalogos de carreras y sectores responden sin token.
- Perfil de estudiante funciona con un usuario existente.
- El ejemplo `GET /estudiante/7/perfil` respondio error 500, mientras otro usuario valido respondio bien. Esto parece dato de prueba roto o ejemplo desactualizado en la coleccion.

## Validacion frontend

Comando ejecutado:

```powershell
npm run build
```

Resultado:

- Build correcto.
- Vite muestra una advertencia de chunk mayor a 500 kB. No bloquea la integracion de APIs.
