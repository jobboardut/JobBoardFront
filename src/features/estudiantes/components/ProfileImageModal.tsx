import { useRef, useState } from 'react'
import { AlertCircle, Image, Loader2, Upload, X } from 'lucide-react'
import { FILE_LIMITS, validateFile } from '@/shared/security/inputRules'

interface ProfileImageModalProps {
  initialUrl?: string
  isSaving: boolean
  onClose: () => void
  onSave: (file: File) => Promise<void>
}

export const ProfileImageModal = ({
  initialUrl = '',
  isSaving,
  onClose,
  onSave,
}: ProfileImageModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState(initialUrl)
  const [error, setError] = useState('')

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) return

    const fileError = validateFile(selected, {
      allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
      label: 'La foto de perfil',
      maxBytes: FILE_LIMITS.imageBytes,
    })

    if (fileError) {
      setError(fileError)
      event.target.value = ''
      return
    }

    setError('')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSave = async () => {
    if (!file) {
      setError('Selecciona una imagen para continuar.')
      return
    }

    try {
      await onSave(file)
    } catch {
      // El contenedor conserva el modal abierto y muestra el mensaje global de la API.
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Cambiar foto de perfil</h2>
            <p className="mt-1 text-sm text-slate-500">Sube una imagen desde tu equipo.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="mx-auto grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-emerald-50 ring-4 ring-emerald-100">
            {preview ? (
              <img
                src={preview}
                alt="Vista previa"
                className="h-full w-full object-cover"
                onError={() => setError('No se pudo mostrar la imagen seleccionada.')}
              />
            ) : (
              <Image size={38} className="text-emerald-500" />
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleSelectFile}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
          >
            <Upload size={18} />
            {file ? file.name : 'Seleccionar imagen'}
          </button>

          {error && (
            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 shrink-0" size={17} />
              {error}
            </div>
          )}

          <p className="flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            <AlertCircle className="mt-0.5 shrink-0 text-emerald-500" size={16} />
            Formatos permitidos: PNG, JPG o WEBP. Tamaño maximo 2 MB.
          </p>
        </div>

        <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 rounded-xl border border-slate-300 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !file}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="animate-spin" size={17} />}
            {isSaving ? 'Guardando...' : 'Guardar imagen'}
          </button>
        </div>
      </div>
    </div>
  )
}
