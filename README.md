# JobBoardFront

Frontend administrativo para gestionar dashboard, validacion, gestion, publicaciones, seguimiento de postulaciones y configuracion.

Este proyecto ya esta preparado para conectar APIs reales con el menor impacto posible en la UI.

## Stack

- React 19
- TypeScript
- Vite
- Lucide React (iconografia)

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Configuracion de entorno

Crear un archivo `.env` (o `.env.local`) en la raiz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Si `VITE_API_BASE_URL` no existe, el proyecto usa rutas relativas. Eso permite trabajar con mocks sin backend.

## Arquitectura general

La aplicacion esta separada por capas para desacoplar UI y backend:

- `src/pages`: pantallas completas por modulo.
- `src/components`: layout y UI reutilizable.
- `src/features/<modulo>`: logica por dominio (`components`, `hooks`, `services`, `types`).
- `src/router`: resolucion de rutas de la app.
- `src/services`: cliente HTTP base y endpoints globales.

## Rutas de navegacion

Archivo principal:

- `src/router/appRoutes.ts`

Define:

- Tipo de rutas internas (`AppRoute`).
- Mapeo hash -> ruta interna.
- Mapeo ruta interna -> hash.

Ejemplo actual: `#dashboard`, `#validacion`, `#gestion`, `#publicaciones`, `#tracking`, `#configuracion`.

## Integracion de API (punto clave)

### 1) Endpoints centralizados

Archivo:

- `src/services/apiEndpoints.ts`

Aqui se declaran los paths por modulo.

### 2) Cliente HTTP base

Archivo:

- `src/services/apiClient.ts`

Responsabilidades:

- Construir URL final usando `VITE_API_BASE_URL`.
- Ejecutar requests JSON.
- Manejo base de errores HTTP.

### 3) Servicios por feature

Carpeta:

- `src/features/*/services`

Cada modulo consume `apiEndpoints` + `requestJson` y entrega datos listos para la UI.

## Flujo recomendado para conectar backend

1. Agregar o ajustar endpoint en `src/services/apiEndpoints.ts`.
2. Implementar request en el service del feature (`src/features/<modulo>/services`).
3. Mapear DTO del backend al tipo interno del feature (`src/features/<modulo>/types`).
4. Mantener `pages` y `components` sin `fetch` directo.

## Ejemplo de integracion en un service

```ts
import { requestJson } from '../../../services/apiClient'
import { apiEndpoints } from '../../../services/apiEndpoints'
import type { DashboardOverviewResponse } from '../types/dashboard.types'

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  return requestJson<DashboardOverviewResponse>(apiEndpoints.dashboardOverview)
}
```

## Regla de mantenimiento

No hacer llamadas HTTP desde:

- `src/pages`
- `src/components`

Las llamadas deben vivir en:

- `src/features/*/services`
- o en `src/services` si es infraestructura compartida.

## Modulos preparados para API

- Dashboard
- Usuarios
- Validacion
- Gestion
- Publicaciones
- Seguimiento de postulaciones
- Configuracion

## Checklist rapido para quien integra APIs

1. Configurar `VITE_API_BASE_URL`.
2. Confirmar/actualizar paths en `apiEndpoints.ts`.
3. Reemplazar mocks por `requestJson` en services de cada feature.
4. Ajustar mapeos de tipos (DTO -> tipo UI).
5. Probar vistas por modulo.
6. Ejecutar `npm run lint` y `npm run build`.

## Documentacion complementaria

- `API_INTEGRATION_GUIDE.md`
- `FRONTEND_ARCHITECTURE.md`
