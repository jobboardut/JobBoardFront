/**
 * Distincion entre alumno y egresado.
 *
 * El backend usa dos campos distintos: `rol` dice si la cuenta es Estudiante,
 * Empresa o Admin, mientras que `estatusAcademico` es el unico que distingue a
 * un egresado de un alumno. Leer solo `rol` hace que los egresados nunca se
 * contabilicen.
 */
export type AcademicKind = 'Alumno' | 'Egresado'

/** true cuando el texto corresponde a un egresado. */
export const isGraduate = (estatusAcademico?: string | null): boolean =>
  (estatusAcademico ?? '').trim().toLowerCase().startsWith('egresad')

/**
 * Clasifica a una persona a partir de su estatus academico.
 * Cuando el dato falta se asume alumno, que es el valor por defecto del alta.
 */
export const getAcademicKind = (estatusAcademico?: string | null): AcademicKind =>
  isGraduate(estatusAcademico) ? 'Egresado' : 'Alumno'

/** Etiqueta para mostrar en pantalla. */
export const getAcademicLabel = (estatusAcademico?: string | null): string =>
  isGraduate(estatusAcademico) ? 'Egresado' : 'Estudiante'
