# JobBoardFront
Frontend del sistema de bolsa de trabajo de UTTECAM construido con React, TypeScript, Vite y Tailwind CSS.

## Propósito del proyecto

Este repositorio contiene la interfaz web para los flujos de estudiante, empresa y administrador. La app está organizada por funcionalidades para que cada módulo tenga sus componentes, hooks, tipos y servicios de API separados.

## Tecnologías principales

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router DOM
- Axios
- TanStack Query
- Zustand

## Estructura general

La estructura relevante del proyecto es esta:

```text
src/
	App.tsx
	main.tsx
	index.css
	config/
		env.ts
	router/
		index.tsx
		routes.ts
		PrivateRoute.tsx
	services/
		api.ts
		auth.service.ts
	features/
		dashboard/
			components/
			hooks/
			services/
			types/
		publicaciones/
			components/
			hooks/
			services/
			types/
		seguimiento/
			components/
			hooks/
			services/
			types/
		profile/
			components/
			hooks/
			modals/
			types/
		auth/
			components/
			hooks/
			services/
			types/
```

## Dónde están las rutas

Las rutas del frontend se manejan en dos niveles:

- [src/router/routes.ts](src/router/routes.ts): constantes de rutas reutilizables.
- [src/router/index.tsx](src/router/index.tsx): definición de las rutas activas con React Router.

Si necesitas agregar una nueva pantalla, primero define su path en `routes.ts` y después regístrala en `index.tsx`.

## Dónde están las APIs

La capa de API está separada en dos partes:

- [src/services/api.ts](src/services/api.ts): cliente HTTP compartido basado en Axios.
- Services por feature: cada módulo tiene su propio archivo en `features/*/services`.

Archivos actuales de integración:

- [src/services/auth.service.ts](src/services/auth.service.ts)
- [src/features/dashboard/services/dashboard.service.ts](src/features/dashboard/services/dashboard.service.ts)
- [src/features/publicaciones/services/publicaciones.service.ts](src/features/publicaciones/services/publicaciones.service.ts)
- [src/features/seguimiento/services/seguimiento.service.ts](src/features/seguimiento/services/seguimiento.service.ts)

## Cómo integrar una API nueva

1. Define o confirma el endpoint en el backend.
2. Agrega la URL base en el archivo de entorno si hace falta.
3. Crea o amplía el service del feature correspondiente.
4. Consume el service desde el hook del módulo.
5. Mantén los tipos en `types/` para evitar acoplar la UI al backend.

### Cliente HTTP compartido

El archivo [src/services/api.ts](src/services/api.ts) centraliza la configuración común:

- `baseURL` desde [src/config/env.ts](src/config/env.ts)
- `Content-Type: application/json`
- interceptor para agregar `Authorization: Bearer <token>` si existe token en `localStorage`
- manejo básico de `401` para limpiar la sesión y redirigir a `/login`

### Patrón recomendado para nuevos endpoints

```ts
import api from '@/services/api'

export const myFeatureService = {
	async getItems() {
		return api.get('/mi-endpoint')
	},
}
```

## Variables de entorno

La URL base del backend se lee desde:

- `VITE_API_URL`

Ejemplo:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

## Scripts disponibles

- `npm run dev` inicia Vite en desarrollo.
- `npm run build` compila TypeScript y genera el build de producción.
- `npm run lint` ejecuta ESLint.
- `npm run preview` previsualiza el build generado.

## Estado actual

- Las vistas de estudiante están montadas.
- Varias llamadas a API todavía están en modo mock con `USE_MOCK = true` dentro de los services.
- La integración real se habilita cambiando esos flags y apuntando los endpoints al backend definitivo.

## Recomendación para continuar

Si vas a integrar el backend, el orden más práctico es:

1. Definir `VITE_API_URL`.
2. Cambiar cada `USE_MOCK` a `false`.
3. Confirmar las respuestas del backend contra los tipos de `src/features/*/types`.
4. Revisar las pantallas que consumen esos hooks.
