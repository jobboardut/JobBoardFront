import { useRef, useState } from 'react'
import { Eye, FileText, Loader2, Upload } from 'lucide-react'
import { getPresignedUrl } from '@/services/filesService'

interface CampoArchivoProps {
  label: string
  descripcion?: string
  currentUrl?: string | null
  accept: string
  isUploading?: boolean
  onSelect: (file: File) => void
}

export const CampoArchivo = ({
  label,
  descripcion,
  currentUrl,
  accept,
  isUploading = false,
  onSelect,
}: CampoArchivoProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpening, setIsOpening] = useState(false)
  const hasFile = Boolean(currentUrl)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) onSelect(file)
  }

  const handleView = async () => {
    if (!currentUrl) return

    const viewer = window.open('', '_blank')
    if (!viewer) return
    viewer.opener = null

    setIsOpening(true)
    try {
      viewer.location.href = await getPresignedUrl(currentUrl)
    } catch {
      viewer.close()
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${hasFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
          <FileText size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-700">{label}</p>
          <p className="truncate text-xs text-slate-400">
            {hasFile ? 'Archivo cargado' : descripcion ?? 'Sin archivo'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {hasFile && (
          <button
            type="button"
            onClick={handleView}
            disabled={isOpening}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-50"
            aria-label={`Ver ${label}`}
          >
            {isOpening ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
          </button>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {isUploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {hasFile ? 'Reemplazar' : 'Subir'}
        </button>
      </div>
    </div>
  )
}
