import { CheckCircle2 } from 'lucide-react'
import { AppButton } from '@/shared/components/AppButton'

export type RegistroResumenItem = {
  label: string
  value?: string | null
}

export type RegistroResumenSection = {
  title: string
  items: RegistroResumenItem[]
}

type RegistroResumenDialogProps = {
  title: string
  description: string
  sections: RegistroResumenSection[]
  files?: RegistroResumenItem[]
  successMessage?: string | null
  errorMessage?: string | null
  isSubmitting: boolean
  onEdit: () => void
  onConfirm: () => void
}

const cleanValue = (value?: string | null) => {
  const trimmed = value?.trim()
  return trimmed || 'No capturado'
}

export const RegistroResumenDialog = ({
  description,
  errorMessage,
  files = [],
  isSubmitting,
  onConfirm,
  onEdit,
  sections,
  successMessage,
  title,
}: RegistroResumenDialogProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
    <section
      className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registro-resumen-title"
    >
      <div className="mb-6 flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={25} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Confirmacion</p>
          <h2 id="registro-resumen-title" className="mt-2 text-2xl font-black text-slate-950">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>

      {successMessage ? (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-black text-slate-900">{section.title}</h3>
            <dl className="mt-3 grid gap-3">
              {section.items.map((item) => (
                <div key={`${section.title}-${item.label}`}>
                  <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{item.label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-800">{cleanValue(item.value)}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        {files.length ? (
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 md:col-span-2">
            <h3 className="text-sm font-black text-emerald-900">Archivos que se enviaran</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {files.map((file) => (
                <div key={file.label}>
                  <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700">{file.label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-emerald-950">{cleanValue(file.value)}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <AppButton type="button" variant="secondary" onClick={onEdit} disabled={isSubmitting || Boolean(successMessage)} fullWidth>
          Editar datos
        </AppButton>
        <AppButton type="button" onClick={onConfirm} isLoading={isSubmitting} disabled={Boolean(successMessage)} fullWidth>
          Enviar registro
        </AppButton>
      </div>
    </section>
  </div>
)
