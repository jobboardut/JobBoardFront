# Tutorial para conectar APIs en el frontend

Este documento explica como debe trabajar el equipo para conectar APIs sin romper la estructura del proyecto.

## 1. Estructura estandar por feature

Cada feature debe seguir esta estructura:

```text
src/features/<feature>/
  components/
  hooks/
  services/
  types/
```

Responsabilidad de cada carpeta:

| Carpeta | Para que sirve | Que se debe poner ahi |
| --- | --- | --- |
| `components` | UI de la feature | Formularios, tablas, tarjetas, modales y vistas pequenas |
| `hooks` | Estado y flujo de pantalla | Cargar datos, filtros, acciones, loading, errores, mutaciones |
| `services` | Conexion con API | Llamadas HTTP, mapeo de respuestas, fallback defensivo |
| `types` | Contratos TypeScript | Interfaces de request, response y modelos internos |

Regla principal: un componente no debe hacer `fetch`, `axios` ni llamar endpoints directo. Primero se crea o actualiza un service.

## 2. Cliente HTTP compartido

Todas las llamadas deben usar:

```text
src/services/api.ts
```

Ese cliente ya hace tres cosas:

- Usa la base URL de `src/config/env.ts`.
- Agrega el token de `localStorage` como `Authorization: Bearer <token>`.
- Devuelve directamente `response.data`.

Ejemplo correcto:

```ts
import api from '@/services/api'

export const ejemploService = {
  getItems: () => api.get('/ruta/items'),
}
```

Evitar esto en componentes:

```ts
fetch('https://utjl.runasp.net/api/ruta/items')
```

## 3. Como conectar una API paso a paso

### Paso 1: ubicar la feature

Ejemplo: si vas a conectar postulaciones de estudiantes, trabaja en:

```text
src/features/estudiantes/
```

### Paso 2: definir tipos

Agregar o actualizar un archivo dentro de `types`.

Ejemplo:

```ts
export interface Postulacion {
  id: number
  titulo: string
  empresa: string
  estatus: string
  fechaPostulacion: string
}
```

### Paso 3: agregar el metodo en el service

Ejemplo:

```ts
import api from '@/services/api'
import type { Postulacion } from '../types/seguimiento.types'

export const seguimientoService = {
  getPostulaciones: (estudianteId: number): Promise<Postulacion[]> =>
    api.get(`/estudiante/${estudianteId}/postulaciones`) as Promise<Postulacion[]>,
}
```

### Paso 4: usar el service desde un hook

Ejemplo con estado simple:

```ts
import { useEffect, useState } from 'react'
import { seguimientoService } from '../services/seguimiento.service'
import type { Postulacion } from '../types/seguimiento.types'

export const useSeguimiento = (estudianteId: number) => {
  const [items, setItems] = useState<Postulacion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    seguimientoService.getPostulaciones(estudianteId)
      .then(setItems)
      .catch(() => setError('No se pudieron cargar las postulaciones.'))
      .finally(() => setIsLoading(false))
  }, [estudianteId])

  return { items, isLoading, error }
}
```

### Paso 5: consumir el hook en el componente

El componente solo debe pintar UI:

```tsx
const { items, isLoading, error } = useSeguimiento(estudianteId)
```

## 4. Como saber si una API falta

Una API falta cuando:

- La pantalla necesita datos que no estan en ningun endpoint del ZIP.
- El endpoint existe, pero es de otro rol. Por ejemplo, estudiante no debe usar `/admin/publicaciones`.
- El endpoint solo permite leer, pero la pantalla necesita guardar.
- El body del ZIP esta vacio o incompleto.

Cuando pase eso:

1. Mantener mock temporal solo en `services` o `hooks`.
2. Dejar comentario `TODO API` con el endpoint esperado.
3. Agregar el pendiente al reporte `API_COVERAGE_REPORT.md`.
4. No conectar la pantalla a un endpoint de otro rol solo para que "se vea conectado".

## 5. Ejemplos ya conectados

### Login

Archivo:

```text
src/features/auth/services/auth.service.ts
```

Metodo:

```ts
login: async (data: LoginRequest) => {
  const response = await api.post('/auth/login', data) as LoginResponse
  localStorage.setItem('token', response.token)
  return response
}
```

### Registro de estudiante

Archivo:

```text
src/features/auth/services/auth.service.ts
```

Metodo:

```ts
registroEstudiante: async (data: RegistroEstudianteRequest) => {
  return api.post('/registro/estudiante', {
    email: data.email,
    password: data.password,
    nombre: data.nombres,
    nombres: data.nombres,
    apellidos: data.apellidos,
    direccion: data.direccion,
    fechaNacimiento: data.fechaNacimiento,
    estadoCivil: data.estadoCivil,
    programaEducativo: data.programaEducativo,
  })
}
```

### Catalogos compartidos

Archivo:

```text
src/services/catalog.service.ts
```

Uso:

```ts
catalogService.getCarreras()
catalogService.getSectores()
```

Estos catalogos se pusieron fuera de una feature porque los usan varias partes del sistema.

## 6. Flujo recomendado por rol

### Auth

- Login y logout.
- Registro de estudiante y empresa.
- Formularios de registro consumen catalogos compartidos.

### Estudiantes

- Perfil se carga desde `GET /estudiante/:userId/perfil`.
- Seguimiento se carga desde `GET /estudiante/:estudianteId/postulaciones`.
- Dashboard usa perfil y postulaciones recientes.
- Publicaciones disponibles sigue pendiente porque falta API publica/de estudiante.

### Empresas

- Perfil de empresa se carga y actualiza desde `/empresa/:userId/perfil`.
- Vacantes se administran desde `/empresa/:empresaId/vacantes`.
- Postulantes se consultan desde `/empresa/:empresaId/vacantes/:publicacionId/postulantes`.

### Administradores

- Admin consume endpoints `/admin/*`.
- Admin tambien administra catalogos de carreras y sectores.
- Los endpoints de admin no deben usarse para pantallas de estudiante.

## 7. Como revisar el ZIP de API

Desde PowerShell:

```powershell
Expand-Archive -LiteralPath "C:\Users\doseq\Downloads\ut_jb_API.zip" -DestinationPath ".\ut_jb_API_extract" -Force
rg "method:|url:" .\ut_jb_API_extract -n
```

Eso permite ver rapidamente los endpoints disponibles.

## 8. Como validar antes de subir cambios

Ejecutar:

```powershell
npm run build
```

Luego revisar estado:

```powershell
git status --short --branch
```

Si estas trabajando en una rama de feature:

```powershell
git add src/features/<feature> src/services API_COVERAGE_REPORT.md
git commit -m "Conectar API de nombre de feature"
git push origin feature/nombre-de-la-feature
```

Despues se abre pull request hacia `develop`.

Solo la persona que este integrando todo en `develop` deberia hacer:

```powershell
git checkout develop
git pull origin develop
git merge feature/nombre-de-la-feature
npm run build
git push origin develop
```

## 9. Como deben trabajar tus companeros

1. Hacer pull de `develop`.
2. Crear rama desde `develop` para su feature.
3. Mantener la estructura `components/hooks/services/types`.
4. Conectar su endpoint solo dentro de `services`.
5. Si necesitan compartir datos con otra feature, crear un service compartido en `src/services`.
6. Correr `npm run build`.
7. Subir su rama y abrir pull request hacia `develop`.

Comandos:

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-feature
npm install
npm run build
```

Al terminar:

```powershell
git status
git add src/features/<feature> src/services API_COVERAGE_REPORT.md
git commit -m "Conectar API de nombre de feature"
git push origin feature/nombre-de-la-feature
```

## 10. Reglas para evitar confusion

- No trabajar directo en `main`.
- Usar `develop` como base comun.
- No mezclar cambios de dos features en una misma rama.
- No duplicar services con nombres parecidos.
- No mover componentes si no es necesario.
- No borrar mocks si aun falta endpoint real.
- No usar endpoints de admin en estudiante o empresa.
