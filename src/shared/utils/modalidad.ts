/**
 * Normalizacion de la modalidad de trabajo.
 *
 * Historicamente se guardo "Hibrida" y el backend valida "Hibrido", asi que
 * conviven ambas formas en la base. Los filtros comparan por esta clave para
 * que una vacante antigua no desaparezca de los resultados.
 */
export const MODALIDADES = ['Presencial', 'Remota', 'Hibrido'] as const

export type Modalidad = (typeof MODALIDADES)[number]

/** Clave estable para comparar: sin acentos, en minusculas y sin genero. */
export const normalizeModalidad = (value?: string | null): string => {
  const base = (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()

  if (base.startsWith('hibrid')) return 'hibrido'
  if (base.startsWith('remot')) return 'remota'
  if (base.startsWith('presencial')) return 'presencial'

  return base
}

/** true cuando dos modalidades son la misma pese a escribirse distinto. */
export const isSameModalidad = (a?: string | null, b?: string | null): boolean =>
  normalizeModalidad(a) === normalizeModalidad(b)
