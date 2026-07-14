// Formato unico de dinero para toda la app (pesos mexicanos).
// Evita que cada feature invente su propio formato o muestre "No especificado"
// cuando el backend si mando un sueldo.

const MONEY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const SUELDO_NO_ESPECIFICADO = 'Sueldo no especificado'

/** Acepta number, string numerico o null/undefined y devuelve "$15,000 MXN" o el texto de vacio. */
export const formatMoney = (value: unknown, emptyLabel = SUELDO_NO_ESPECIFICADO): string => {
  const amount = typeof value === 'string' ? Number(value) : value

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return emptyLabel
  }

  return `${MONEY_FORMATTER.format(amount)} MXN`
}
