# Guia de integracion de APIs

Este proyecto deja preparada la UI y la capa de servicios para que, cuando el backend este listo, el cambio minimo sea reemplazar la fuente de datos dentro de cada service de feature.

## Puntos que ya quedaron preparados

- `src/services/apiClient.ts`: cliente HTTP base con `API_BASE_URL` y helper `requestJson`.
- `src/services/apiEndpoints.ts`: rutas base centralizadas por modulo.
- `src/features/*/services`: cada feature expone su endpoint y su contrato de datos.

## Regla de cambio minimo

Cuando llegue la API real, no deberias tocar:

- `src/pages`
- `src/components/layout`
- `src/features/*/components`

Normalmente solo se reemplaza:

1. El `return` mock dentro del service.
2. La llamada a `requestJson` usando el endpoint correspondiente.
3. Si hace falta, el mapeo de DTO a tipos internos del feature.

## Convencion de trabajo

- Mantener los endpoints en `src/services/apiEndpoints.ts`.
- Mantener la logica HTTP en `src/services/apiClient.ts`.
- Dejar la UI consumiendo hooks y services, nunca `fetch` directo desde las vistas.

## Modulos preparados

- Dashboard
- Usuarios
- Validacion
- Gestion
- Publicaciones
- Seguimiento de postulaciones
- Configuracion de listas maestras

## Nota

Los datos actuales son mock local. Estan organizados para que luego solo cambies la capa de service y no el resto de la aplicacion.
