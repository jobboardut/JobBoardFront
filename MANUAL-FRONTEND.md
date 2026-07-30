# Manual del Frontend — Bolsa de Trabajo UTTECAM

Documento de referencia de lo que está construido en el frontend: funcionalidades,
componentes por apartado, el ciclo de postulaciones, el sistema visual y el estado
de la conexión con el backend.

> Stack: React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query + Axios + React Router.

---

## 1. Apartados (roles) y su identidad visual

Cada rol comparte la misma estructura (sidebar + contenido) pero se distingue por un
**acento de color**. La clase `role-*` en el contenedor define el acento (ver
`src/styles/animations.css`).

| Apartado | Acento | Notas |
|---|---|---|
| **Estudiante** | Esmeralda `#009A4D` | Identidad base |
| **Egresado** | Teal `#0d9488` | Mismas vistas que estudiante, acento propio para diferenciarlo |
| **Empresa** | Naranja `#EA580C` | Barra superior y botón "Publicar vacante" en naranja |
| **Admin** | Slate + Esmeralda | Sidebar claro; headers con banner degradado institucional |

### Encabezados de seccion — `src/shared/components/PageHero.tsx`
Componente compartido por estudiante y empresa con el mismo acabado del panel de
administracion: degradado profundo + halo suave (`src/styles/page-hero.css`).
Sustituye al degradado plano de tres colores que se usaba antes.
Para encabezados con estructura propia existe la clase `.brand-banner--empresa`.

### Animaciones (estilo reactbits) — `src/styles/animations.css`
- Entrada en cascada (fade-up escalonado) de cada pantalla y de las rejillas de tarjetas.
- Elevación al hover en tarjetas; feedback táctil (scale) en botones.
- Modales con aparición scale-in; overlays con fade-in.
- `@media (prefers-reduced-motion)` desactiva todo automáticamente.

### Rendimiento
`React.memo` aplicado a las listas/tarjetas pesadas: `JobListCard`,
`DashboardSearchCard`, `SearchPublicationCard`, `CandidatoCard`, `PublicacionesGrid`,
`ManagementUsersTable`, `TrackingList`, `ValidationRequestsTable`.

---

## 2. Ciclo de vida del postulante (estándar único)

Usado igual en las 3 vistas (empresa, admin, estudiante). Definido en
`src/features/empresas/utils/postulanteStatus.ts`.

```
POSTULADO → CV VISTO → ENTREVISTA → CONTRATADO
                │            │
                └─ RECHAZADO ┴─ RECHAZADO   (motivo obligatorio)

RETIRADO  (lo decide el estudiante)
```

| Estatus | apiValue | Quién lo mueve | Terminal |
|---|---|---|---|
| Postulado | `Postulado` | Sistema | No |
| CV visto | `CvVisto` | Empresa | No |
| Entrevista | `Entrevista` | Empresa (fecha opcional) | No |
| Contratado | `Contratado` | Empresa (valida cupo) | Sí |
| Rechazado | `Rechazado` | Empresa (motivo obligatorio) | Sí |
| Retirado | `Retirado` | Estudiante | Sí |

Transiciones válidas: `TRANSICIONES_EMPRESA` en el mismo archivo.

---

## 3. Inventario de componentes por apartado

### Auth / Registro — `src/features/auth`
- `RegistroEstudiante.tsx` — registro de alumno/egresado con autoguardado, calendario
  fluido (`DateField`), compresión de imágenes, validación de archivos.
- `RegistroEmpresa.tsx` — registro de empresa; el correo de la empresa es la cuenta de
  acceso; documentos por campo (foto INE solo imagen, resto PDF/imagen).
- `registroErrors.ts` — traduce errores del backend a mensajes claros.

### Estudiante / Egresado — `src/features/estudiantes`
- `FilterPanel.tsx` — filtros funcionales del dashboard (modalidad + sueldo mínimo).
- `JobListCard.tsx`, `SearchPublicationCard.tsx`, `DashboardSearchCard.tsx` — tarjetas de vacantes.
- `PublicationDetail.tsx` — detalle con ubicación, sueldo, contador de lugares (X/Y),
  requisitos/responsabilidades/competencias separados; bloquea postulación si está llena.
- `ApplicationsTable.tsx`, `StatusSummary.tsx`, `SeguimientoFilterPanel.tsx` — seguimiento
  de postulaciones con el ciclo nuevo y acción de "retirar".
- Hooks: `useDashboard`, `usePublicaciones`, `useSeguimiento`, `useProfile`.

### Empresa — `src/features/empresas`
- `MisPublicaciones.tsx` — lista de vacantes con sueldo, postulantes y contador de lugares.
- `FormularioVacante.tsx` — creación de vacante con ubicación, competencias y responsabilidades.
- `DetalleVacante.tsx` — detalle con contador de lugares y barra de avance.
- `Postulantes.tsx` — vista rediseñada: contexto de la vacante + resumen por etapa + `CandidatoCard`.
- `KanbanPostulaciones.tsx` — tablero por etapas del ciclo.
- `DetallePostulante.tsx` — mueve el estatus del candidato; usa `ModalRechazoPostulacion`.
- `ModalRechazoPostulacion.tsx` — captura el motivo obligatorio del rechazo.
- `PerfilEmpresa.tsx` — el logo se actualiza haciendo clic en el avatar.
- Hooks: `useEmpresa` (perfil, vacantes, postulantes, cambiar estatus).

### Admin — `src/features/administradores`
- `AdminLayout.tsx` + `AdminPageHeader.tsx` — banner con degradado institucional.
- Centro de Validación: `ValidationRequestsTable`, `ValidationDetailModal`,
  `ValidationRejectionModal` (aprobar / devolver con observaciones).
- Centro de Gestión: `ManagementUsersTable` (estados Activo/Inactivo/Devuelto/Rechazado/
  Inhabilitado; los dos últimos van al fondo en tono gris), `ManagementDetailModal`.
- Publicaciones: `PublicacionesGrid`, `DetallePublicacionModal` (sueldo real, contador de lugares).
- Seguimiento: `TrackingList`, `TrackingStats` (sin estatus "Pendiente").
- Configuración: `GestorListaConfiguracion` (crear/editar carreras y sectores; sin eliminar).

### Compartido — `src/shared`
- `DateField.tsx` — calendario fluido reutilizable.
- `utils/money.ts` — formato único de pesos (`$15,000 MXN`).
- `utils/lugares.ts` — contador de cupos (lee `cupo`/`cuposDisponibles` del backend).
- `utils/imageCompression.ts` — compresión de imágenes antes de subir.
- `hooks/useFormDraft.ts` — autoguardado de formularios (TTL 1 h, por tipo de cuenta).

---

## 4. Estado de conexión con el backend

Basado en el contrato del reporte del backend (`flujo-postulaciones`).

### ✅ Conectado
- Ciclo de postulante (`PUT /empresa/{userId}/postulaciones/{postulacionId}/estatus`)
  con las 4 acciones: CvVisto, Entrevista (fecha opcional), Contratado, Rechazado (motivo).
- Retiro de postulación del estudiante (`.../postulaciones/{id}/retirar`).
- Validación de usuarios (`aprobar` / `devolver` con observaciones / `inhabilitar`).
- Usuarios devuelven `ultimaObservacion`, `totalDevoluciones`, `fechaUltimaObservacion`.
- Vacantes con `ubicacion`, `competencias`, `responsabilidades`, `cupo`, `cuposDisponibles`.
- Sueldo real en la vista admin de publicaciones.

### ⏳ Pendiente del backend
- Catálogo de motivos de rechazo (`GET /empresa/motivos-rechazo`) — hoy el motivo es texto libre.
- Autocierre de vacante al llenar el cupo (hoy solo se niegan nuevas postulaciones; la
  empresa puede cerrarla manualmente).
- Definir si carreras/sectores se **deshabilitan** (no se eliminan).
- Futuro: encuesta de seguimiento post-contratación y estadísticas de motivos de rechazo.

---

## 5. Cómo correr

```bash
npm install
npm run dev      # desarrollo
npm run build    # build de producción
npm run lint     # eslint
```

Base API: `https://utjl.runasp.net/api` (configurable en `src/config/env`).
