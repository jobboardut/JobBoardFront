# Estructura de trabajo del front

Este proyecto esta planteado como un front desacoplado del backend. La idea es construir primero las interfaces, la navegacion y la logica de presentacion, dejando los puntos de integracion con API aislados para conectarlos despues con el modulo backend que se defina.

## Capas del proyecto

### `src/pages`

Pantallas completas por ruta. Aqui van las vistas de nivel superior y solo orquestan componentes, hooks y estados de pagina.

### `src/router`

Definicion de rutas, layouts de navegacion y protecciones de acceso si mas adelante se necesitan.

### `src/features`

Modulo principal de desarrollo. Cada dominio funcional vive aislado aqui.

Estructura recomendada por feature:

- `components`: componentes especificos del dominio.
- `hooks`: hooks de estado y comportamiento.
- `services`: capa de acceso a datos.
- `types`: contratos TypeScript del dominio.

### `src/components/ui`

Componentes reutilizables y visuales puros. Aqui deben vivir botones, inputs, modales y cualquier pieza atomica que no dependa de una entidad concreta.

### `src/components/layout`

Estructuras de pagina reutilizables como header, sidebar, shell, contenedores y layouts generales.

### `src/services`

Capa base de integracion externa. Si luego se usa una API, este es el lugar para centralizar cliente HTTP, interceptores, manejo de tokens y helpers de peticiones.

Archivos ya preparados para ese cambio:

- `src/services/apiClient.ts`: base HTTP con `API_BASE_URL` y `requestJson`.
- `src/services/apiEndpoints.ts`: rutas base centralizadas por modulo.

### `src/config`

Constantes, variables de entorno, rutas base, claves y configuracion comun.

### `src/types`

Tipos compartidos entre features.

### `src/utils`

Helpers puros sin dependencia de UI ni de dominio.

## Regla de desacoplamiento

La UI no debe hablar directo con el backend. La pantalla consume hooks o servicios de feature, y esos servicios son el unico punto que despues se conecta con la API real.

Flujo sugerido:

1. `page` -> arma la vista.
2. `feature hook` -> maneja estado, validacion y acciones.
3. `feature service` -> devuelve datos simulados por ahora o un contrato preparado.
4. `src/services` -> mas adelante concentra la integracion HTTP real.

## Donde se conecta la API despues

Cuando el backend este listo, el cambio minimo deberia quedar en estos puntos:

- `src/services`: cliente HTTP, base URL, autenticacion y errores comunes.
- `src/services/apiEndpoints.ts`: rutas por modulo.
- `src/features/*/services`: endpoints especificos por modulo.
- `src/features/*/hooks`: adaptacion del flujo de datos a la UI.

La UI deberia quedarse intacta. Solo cambia la capa de service o, si hace falta, el mapeo del DTO a los tipos internos del feature.

## Convencion de trabajo recomendada

- Cada modulo funcional nuevo se crea dentro de `src/features/<modulo>`.
- Cada pantalla nueva se registra en `src/pages` y se conecta en `src/router`.
- Cada componente reutilizable va primero a `src/components/ui`.
- Cualquier llamada futura a API debe pasar por un service, nunca directo desde la vista.

## Estructura preparada para crecer

Con la carpeta actual, el proyecto ya esta listo para trabajar de forma escalable sin mezclar responsabilidades. El objetivo es que el front avance independiente del backend, y que la integracion final solo requiera reemplazar los servicios internos por la API real.
