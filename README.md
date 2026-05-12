# JobBoardFront

Frontend del sistema de bolsa de trabajo de UTTECAM construido con React, TypeScript, Vite, Tailwind CSS, React Router, Axios y TanStack Query.

## Estructura

La app queda organizada por modulos para que cada equipo pueda conectar APIs sin mezclar responsabilidades:

- `src/pages`: pantallas completas.
- `src/components`: layout y UI compartida.
- `src/features/<modulo>`: componentes, hooks, services y types por dominio.
- `src/router/routes.ts`: constantes de rutas.
- `src/router/index.tsx`: registro central de rutas.
- `src/services/api.ts`: cliente Axios compartido.
- `src/services/apiClient.ts` y `src/services/apiEndpoints.ts`: apoyo para modulos administrativos preparados para API.

## Modulos incluidos

- Auth y registro.
- Empresas.
- Estudiantes y egresados.
- Administradores.
- Dashboard, usuarios, validacion, gestion, publicaciones, seguimiento y configuracion.

## Variables de entorno

Crear `.env` o `.env.local` en la raiz:

```env
VITE_API_URL=http://localhost:3000/api
VITE_API_BASE_URL=http://localhost:3000
```

`VITE_API_URL` alimenta el cliente Axios principal en `src/services/api.ts`. `VITE_API_BASE_URL` se conserva para los services administrativos que ya fueron preparados con `apiClient`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Flujo recomendado para conectar APIs

1. Definir la ruta en `src/router/routes.ts` si se agrega una pantalla nueva.
2. Registrar la pantalla en `src/router/index.tsx`.
3. Crear o actualizar el service del feature en `src/features/<modulo>/services`.
4. Mantener los tipos en `src/features/<modulo>/types`.
5. Consumir el service desde un hook del modulo.
6. Evitar llamadas `fetch` o `axios` directas desde pages y componentes visuales.

## Documentacion complementaria

- `API_INTEGRATION_GUIDE.md`
- `FRONTEND_ARCHITECTURE.md`
