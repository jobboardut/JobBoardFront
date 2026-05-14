import { FileText, Eye } from 'lucide-react'

interface CurriculumSectionProps {
  fileName: string
  uploadDate: string
  url?: string
  onPreview?: () => void
}

export const CurriculumSection = ({ fileName, uploadDate, url, onPreview }: CurriculumSectionProps) => {
  const canPreview = Boolean(url)

  return (
    <div className="rounded-2xl border border-[#e8d4ca] bg-white p-8 shadow-[0_4px_15px_rgba(29,37,56,0.05)]">
      <h2 className="text-3xl font-bold text-slate-900">Mi Curriculum</h2>

      <div className="mt-8 space-y-6">
        {/* Archivo CV */}
        <div className="flex items-center justify-between rounded-xl border border-[#e6e0d7] bg-linear-to-r from-[#f8f7f4] to-white p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-[#009A4D] text-white">
              <FileText size={28} strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{fileName}</p>
              <p className="text-sm text-slate-500">{uploadDate}</p>
            </div>
          </div>
        </div>

        {/* Vista previa del CV */}
        <div className="flex gap-4">
          {/* Miniatura del CV */}
          <div className="shrink-0">
            <div className="h-40 w-32 rounded-lg border-2 border-[#e6e0d7] bg-linear-to-b from-[#f5f5f5] to-[#e8e8e8] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              {/* Simulación de documento */}
              <div className="h-full w-full rounded bg-white p-2 text-center">
                <div className="mb-2 h-3 bg-[#d0d0d0]" />
                <div className="mb-2 h-2 w-3/4 bg-[#e8e8e8]" />
                <div className="mb-2 h-2 w-full bg-[#e8e8e8]" />
                <div className="h-2 w-4/5 bg-[#e8e8e8]" />
              </div>
            </div>
          </div>

          {/* Info y botón de vista previa */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <p className="text-sm text-slate-600">
                Documento PDF con tus datos académicos, experiencia profesional y habilidades técnicas
              </p>
            </div>
            <button
              type="button"
              onClick={onPreview}
              disabled={!canPreview}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#009A4D] bg-white py-2 px-4 font-medium text-[#009A4D] transition hover:bg-[#10B981] hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-white"
              aria-label="Visualizar CV"
            >
              <Eye size={18} strokeWidth={2} />
              Visualizar CV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
