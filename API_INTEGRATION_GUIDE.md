# Guia rapida de integracion de APIs

Este proyecto ya usa un cliente HTTP compartido con Axios:

```text
src/services/api.ts
```

Ese archivo es el punto principal para base URL, token, errores 401 y respuestas normalizadas.

## Documentos principales

- `API_COVERAGE_REPORT.md`: que endpoints estan conectados, cuales faltan y que debe confirmar backend.
- `API_CONNECTION_TUTORIAL.md`: tutorial paso a paso para que cada companero conecte su feature siguiendo la misma estructura.
- `FRONTEND_ARCHITECTURE.md`: estructura general recomendada del frontend.
- `ADMIN_API_REPORT.md`: detalle historico de la conexion de administradores.

## Regla de cambio minimo

La UI no debe llamar endpoints directo. El flujo correcto es:

```text
component -> hook -> feature service -> src/services/api.ts -> backend
```

Normalmente solo se toca:

1. `src/features/<feature>/types`: contratos TypeScript.
2. `src/features/<feature>/services`: llamada HTTP y mapeo de respuesta.
3. `src/features/<feature>/hooks`: carga, loading, errores y acciones.

Los componentes solo deben recibir datos listos para pintar.

## Estructura por feature

```text
src/features/<feature>/
  components/
  hooks/
  services/
  types/
```

Cuando una API se comparte entre features, como carreras o sectores, debe ir en:

```text
src/services/
```

Ejemplo actual:

```text
src/services/catalog.service.ts
```

## Validacion antes de subir

```powershell
npm run build
git status --short --branch
```

La rama base del equipo debe ser `develop`.
