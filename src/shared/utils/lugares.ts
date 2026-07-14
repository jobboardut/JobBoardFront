// Contador de lugares de una vacante, con el mismo formato en todas las vistas.
// Ejemplo: 3/10. Si la vacante no define lugares, no se muestra nada.

export type LugaresInfo = {
  ocupados: number
  total: number
  /** Texto listo para pintar: "3/10". */
  label: string
  /** true cuando ya no quedan lugares disponibles. */
  isFull: boolean
  /** Porcentaje 0-100 para barras de progreso. */
  percent: number
}

export const getLugaresInfo = (vacante: {
  lugares?: number | null
  lugaresOcupados?: number | null
}): LugaresInfo | null => {
  const total = vacante.lugares

  if (typeof total !== 'number' || total <= 0) {
    return null
  }

  const ocupados = Math.min(Math.max(vacante.lugaresOcupados ?? 0, 0), total)

  return {
    ocupados,
    total,
    label: `${ocupados}/${total}`,
    isFull: ocupados >= total,
    percent: Math.round((ocupados / total) * 100),
  }
}
