// Traduce cualquier error de la API a un mensaje claro para el usuario de prueba.
// Evita mostrar el texto crudo del backend y solo detecta el caso mas comun:
// el correo ya registrado.
type ApiErrorShape = {
  status?: number
  title?: string
  detail?: string
  message?: string
  detalle?: string
  errors?: Record<string, string[] | string>
}

export const getRegistroErrorMessage = (error: unknown, tipo: 'estudiante' | 'empresa'): string => {
  const apiError = (error ?? {}) as ApiErrorShape

  // En desarrollo mostramos el error completo del backend en consola para diagnosticar.
  // Para el usuario final seguimos mostrando un mensaje amable.
  if (import.meta.env.DEV) {
    console.error('[registro] respuesta del backend:', apiError)
    if (apiError.errors) {
      console.error('[registro] campos con error:', apiError.errors)
    }
  }

  const raw = `${apiError.detalle ?? ''} ${apiError.detail ?? ''} ${apiError.message ?? ''} ${apiError.title ?? ''}`.toLowerCase()

  const correoDuplicado =
    apiError.status === 409 || /(ya (existe|esta registrad)|registrad[oa]|duplicad|correo.*uso|email.*uso)/.test(raw)

  if (correoDuplicado) {
    return 'Este correo ya esta registrado. Inicia sesion o usa uno diferente.'
  }

  const sujeto = tipo === 'empresa' ? 'la empresa' : 'tu cuenta'
  return `No pudimos completar el registro de ${sujeto}. Revisa tus datos e intenta de nuevo.`
}
