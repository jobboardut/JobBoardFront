import api from './api'

// URL base pública del bucket MinIO.
// Las imágenes (jpg, png, svg, webp, gif) son accesibles directamente sin firma.
const MINIO_BASE = 'https://api-minio.ant-code.org/uttecamjb'

/**
 * Construye la URL pública directa para un archivo de imagen.
 * Úsalo cuando el bucket ya lo expone sin firma (fotos de perfil, logos).
 */
export const getImageUrl = (key: string): string =>
  `${MINIO_BASE}/${key.replace(/^\//, '')}`

/**
 * Extrae el objectKey puro desde cualquier variante de URL que el backend pueda devolver:
 *  - URL pública completa: "https://api-minio.../uttecamjb/estudiantes/54/foto.jpg"
 *  - Pre-signed URL:       "https://api-minio.../uttecamjb/estudiantes/54/cv.pdf?X-Amz-..."
 *  - Key directa:          "estudiantes/54/cv.pdf"
 */
export const extractKey = (urlOrKey: string): string => {
  const withoutQuery = urlOrKey.split('?')[0]
  const prefix = `${MINIO_BASE}/`
  return withoutQuery.startsWith(prefix)
    ? withoutQuery.slice(prefix.length)
    : withoutQuery
}

/**
 * Extrae únicamente el nombre del archivo (sin query-string ni path).
 * "https://.../.../estudiantes/54/abc123.pdf?X-Amz=..." → "abc123.pdf"
 */
export const extractFileName = (urlOrKey: string): string => {
  const key = extractKey(urlOrKey)
  const raw = key.split('/').pop() ?? ''
  return raw ? decodeURIComponent(raw) : 'archivo'
}

/**
 * Solicita al backend una Pre-signed URL temporal para un PDF privado.
 * Llama: GET /api/files/presigned-url?key={key}
 *
 * @param urlOrKey - objectKey ("estudiantes/54/cv.pdf") o URL completa/pre-firmada
 * @returns URL firmada válida por 1 hora
 */
export const getPresignedUrl = async (urlOrKey: string): Promise<string> => {
  const key = extractKey(urlOrKey)
  const data = await api.get(
    `/files/presigned-url?key=${encodeURIComponent(key)}`
  ) as { url: string; expiresInSeconds: number }
  return data.url
}
