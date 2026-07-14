// Comprime imagenes en el navegador antes de subirlas, para que el registro
// no dependa de subir archivos pesados a un servidor lento.
// - Solo procesa PNG/JPG. Cualquier otro archivo (ej. PDF) se devuelve intacto.
// - Redimensiona a un maximo y reexporta con menor calidad.
// - Si no logra reducir el peso, conserva el archivo original.

type CompressOptions = {
  maxDimension?: number
  quality?: number
}

const DEFAULT_MAX_DIMENSION = 1600
const DEFAULT_QUALITY = 0.8

const readAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No se pudo procesar la imagen'))
    image.src = src
  })

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))

const fitDimensions = (width: number, height: number, max: number) => {
  if (width <= max && height <= max) return { width, height }
  const ratio = Math.min(max / width, max / height)
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) }
}

export const compressImage = async (file: File, options: CompressOptions = {}): Promise<File> => {
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    return file
  }

  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION
  const quality = options.quality ?? DEFAULT_QUALITY

  try {
    const dataUrl = await readAsDataURL(file)
    const image = await loadImage(dataUrl)

    const { width, height } = fitDimensions(image.width, image.height, maxDimension)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(image, 0, 0, width, height)

    // Mantiene PNG para conservar transparencia (logos); el resto sale como JPG.
    const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const blob = await canvasToBlob(canvas, outputType, quality)

    if (!blob || blob.size >= file.size) {
      return file
    }

    return new File([blob], file.name, { type: outputType, lastModified: Date.now() })
  } catch {
    // Ante cualquier problema, se sube el archivo original.
    return file
  }
}
