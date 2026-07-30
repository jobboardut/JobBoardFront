import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, CheckCircle2, Link2, Loader2, Save, Upload, X } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import {
  FILE_LIMITS,
  limitText,
  SECURITY_LIMITS,
  validateFile,
  validateOptionalEmailField,
  validateOptionalPhoneField,
  validateOptionalText,
  validateOptionalUrlField,
  validateRequiredText,
} from '@/shared/security/inputRules'
import { useActualizarArchivosEmpresa, useEmpresaPerfil, useActualizarPerfil } from '../hooks/useEmpresa'
import type { EmpresaPerfil } from '../types/empresa.types'
import { DocumentosEmpresa } from './DocumentosEmpresa'

type ToastState = {
  type: 'success' | 'error'
  title: string
  message: string
}

const EMPRESA_PROFILE_LIMITS = {
  logoUrl: SECURITY_LIMITS.url,
  nombreEmpresa: SECURITY_LIMITS.companyName,
  direccion: SECURITY_LIMITS.address,
  telefonoEmpresa: SECURITY_LIMITS.phone,
  correoEmpresa: SECURITY_LIMITS.email,
  sitioWeb: SECURITY_LIMITS.url,
  descripcion: SECURITY_LIMITS.longText,
  repNombre: SECURITY_LIMITS.name,
  repApellidos: SECURITY_LIMITS.name,
  repPuesto: SECURITY_LIMITS.shortText,
  repTelefono: SECURITY_LIMITS.phone,
  repCorreo: SECURITY_LIMITS.email,
} as const

const getEmpresaProfileLimit = (name: string): number =>
  EMPRESA_PROFILE_LIMITS[name as keyof typeof EMPRESA_PROFILE_LIMITS] ?? SECURITY_LIMITS.shortText

const PerfilToast = ({ toast, onClose }: { toast: ToastState; onClose: () => void }) => {
  const Icon = toast.type === 'success' ? CheckCircle2 : AlertCircle
  const tone = toast.type === 'success'
    ? 'border-emerald-100 bg-white text-emerald-600 shadow-emerald-900/10'
    : 'border-orange-100 bg-white text-orange-600 shadow-orange-900/10'

  return (
    <div className={`fixed right-6 top-24 z-50 flex w-[min(92vw,360px)] items-start gap-3 rounded-2xl border p-4 shadow-2xl ${tone}`}>
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-current/10">
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{toast.title}</p>
        <p className="mt-1 text-sm leading-5 text-slate-500">{toast.message}</p>
      </div>
      <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
        <X size={16} />
      </button>
    </div>
  )
}

const PerfilLoading = ({ label }: { label: string }) => (
  <div className="flex min-h-[360px] items-center justify-center">
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-emerald-100 bg-white px-8 py-7 shadow-sm">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-200 opacity-40" />
        <Loader2 className="relative animate-spin text-emerald-500" size={28} />
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
    </div>
  </div>
)

export const EditarPerfilEmpresa = () => {
  const navigate = useNavigate()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const { data: perfil, isLoading } = useEmpresaPerfil()
  const { mutate: actualizarPerfil, isPending } = useActualizarPerfil()
  const { mutateAsync: actualizarArchivos, isPending: isUploadingLogo } = useActualizarArchivosEmpresa()

  const profileKey = perfil?.id ?? perfil?.userId ?? 0
  const [draftState, setDraftState] = useState<{
    key: number
    values: Partial<EmpresaPerfil>
  }>({ key: profileKey, values: {} })
  const [toast, setToast] = useState<ToastState | null>(null)

  const draftValues = draftState.key === profileKey ? draftState.values : {}
  const form = perfil ? { ...perfil, ...draftValues } : null
  const logoDisplayUrl = form?.logoUrl ?? ''

  const updateForm = (values: Partial<EmpresaPerfil>) => {
    setDraftState(prev => ({
      key: profileKey,
      values: {
        ...(prev.key === profileKey ? prev.values : {}),
        ...values,
      },
    }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    updateForm({ [name]: limitText(value, getEmpresaProfileLimit(name)) } as Partial<EmpresaPerfil>)
  }

  const handleRemoveLogo = () => {
    updateForm({ logoUrl: '' })
  }

  const handleSelectLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const fileError = validateFile(file, {
      allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
      label: 'El logo',
      maxBytes: FILE_LIMITS.imageBytes,
    })

    if (fileError) {
      setToast({ type: 'error', title: 'Archivo no valido', message: fileError })
      return
    }

    try {
      await actualizarArchivos({ logo: file })
      setToast({ type: 'success', title: 'Logo actualizado', message: 'El logo de tu empresa se guardo correctamente.' })
    } catch {
      setToast({ type: 'error', title: 'No se pudo subir', message: 'La API rechazo el archivo. Intenta nuevamente.' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    const validationError =
      validateRequiredText(form.nombreEmpresa ?? '', 'Nombre de la empresa', SECURITY_LIMITS.companyName) ??
      validateOptionalText(form.direccion ?? '', 'Direccion', SECURITY_LIMITS.address) ??
      validateOptionalPhoneField(form.telefonoEmpresa ?? '', 'Telefono de la empresa') ??
      validateOptionalEmailField(form.correoEmpresa ?? '', 'Correo empresarial') ??
      validateOptionalUrlField(form.logoUrl ?? '', 'URL de imagen') ??
      validateOptionalUrlField(form.sitioWeb ?? '', 'Sitio web') ??
      validateOptionalText(form.descripcion ?? '', 'Descripcion', SECURITY_LIMITS.longText) ??
      validateOptionalText(form.repNombre ?? '', 'Nombre del representante', SECURITY_LIMITS.name) ??
      validateOptionalText(form.repApellidos ?? '', 'Apellidos del representante', SECURITY_LIMITS.name) ??
      validateOptionalText(form.repPuesto ?? '', 'Puesto', SECURITY_LIMITS.shortText) ??
      validateOptionalPhoneField(form.repTelefono ?? '', 'Telefono del representante') ??
      validateOptionalEmailField(form.repCorreo ?? '', 'Correo del representante')

    if (validationError) {
      setToast({
        type: 'error',
        title: 'Revisa los datos',
        message: validationError,
      })
      return
    }

    actualizarPerfil(form, {
      onSuccess: () => {
        navigate(ROUTES.EMPRESA_PERFIL, {
          state: {
            toast: {
              type: 'success',
              title: 'Perfil actualizado',
              message: 'Los cambios de tu empresa se guardaron correctamente.',
            },
          },
        })
      },
      onError: (error: unknown) => {
        const apiError = error as {
          status?: number
          title?: string
          detail?: string
          message?: string
          detalle?: string
        }
        const message = apiError.status === 415
          ? 'La API publicada no esta aceptando su contrato JSON de perfil. El equipo de backend debe revisar el endpoint.'
          : apiError.detalle ||
            apiError.detail ||
            apiError.message ||
            apiError.title ||
            'Revisa los datos e intenta de nuevo.'
        setToast({
          type: 'error',
          title: 'No se pudo guardar',
          message,
        })
      },
    })
  }

  if (isLoading || !form) return <PerfilLoading label="Cargando perfil..." />

  const isSaving = isPending

  return (
    <div>
      {toast && <PerfilToast toast={toast} onClose={() => setToast(null)} />}
      {isSaving && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-2xl">
            <Loader2 className="animate-spin text-emerald-500" size={22} />
            <span className="text-sm font-semibold text-slate-600">Guardando cambios...</span>
          </div>
        </div>
      )}

      <div className="mb-8 rounded-3xl brand-banner brand-banner--empresa p-7 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-3 text-2xl font-semibold">Editar perfil</h1>
            <p className="mt-2 text-sm text-white/80">
              Actualiza la información de tu empresa.
            </p>
          </div>
          <button
            onClick={() => navigate(ROUTES.EMPRESA_PERFIL)}
            className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Volver al perfil
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Foto de perfil</h2>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 to-orange-100 ring-1 ring-emerald-100">
                {logoDisplayUrl ? (
                  <img src={logoDisplayUrl} alt={form.nombreEmpresa ?? 'Empresa'} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-emerald-600">
                    {form.nombreEmpresa?.charAt(0) ?? 'E'}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleSelectLogo}
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                >
                  {isUploadingLogo ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                  {isUploadingLogo ? 'Subiendo...' : 'Subir logo desde tu equipo'}
                </button>

                <label className="mt-4 grid gap-1 text-sm font-medium text-gray-600">
                  O pega un enlace de imagen
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input
                      name="logoUrl"
                      value={form.logoUrl ?? ''}
                      onChange={handleChange}
                      placeholder="https://..."
                      maxLength={SECURITY_LIMITS.url}
                      className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </label>
                {logoDisplayUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="mt-3 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:border-orange-200 hover:text-orange-500"
                  >
                    Quitar imagen
                  </button>
                )}
                <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <AlertCircle className="mt-0.5 shrink-0 text-emerald-500" size={15} />
                  Formatos permitidos: PNG, JPG o WEBP. Tamaño maximo 2 MB.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Datos de la empresa</h2>
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Nombre de la empresa</label>
                <input
                  name="nombreEmpresa"
                  value={form.nombreEmpresa ?? ''}
                  onChange={handleChange}
                  required
                  maxLength={SECURITY_LIMITS.companyName}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Dirección</label>
                <input
                  name="direccion"
                  value={form.direccion ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.address}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <input
                  name="telefonoEmpresa"
                  value={form.telefonoEmpresa ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.phone}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Correo empresarial</label>
                <input
                  name="correoEmpresa"
                  value={form.correoEmpresa ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.email}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Sitio web</label>
                <input
                  name="sitioWeb"
                  value={form.sitioWeb ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.url}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion ?? ''}
                  onChange={handleChange}
                  rows={4}
                  maxLength={SECURITY_LIMITS.longText}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Datos del representante</h2>
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Nombre</label>
                <input
                  name="repNombre"
                  value={form.repNombre ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.name}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Apellidos</label>
                <input
                  name="repApellidos"
                  value={form.repApellidos ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.name}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Puesto</label>
                <input
                  name="repPuesto"
                  value={form.repPuesto ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.shortText}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <input
                  name="repTelefono"
                  value={form.repTelefono ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.phone}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Correo</label>
                <input
                  name="repCorreo"
                  value={form.repCorreo ?? ''}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.email}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

            </div>
          </div>

          <DocumentosEmpresa perfil={form} />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.EMPRESA_PERFIL)}
              className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </div>

      </form>
    </div>
  )
}
