import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Camera, CheckCircle2, ImagePlus, Loader2, Save, X } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { useEmpresaPerfil, useActualizarPerfil } from '../hooks/useEmpresa'
import type { EmpresaPerfil } from '../types/empresa.types'

type ToastState = {
  type: 'success' | 'error'
  title: string
  message: string
}

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
  const { data: perfil, isLoading } = useEmpresaPerfil()
  const { mutate: actualizarPerfil, isPending } = useActualizarPerfil()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const profileKey = perfil?.id ?? perfil?.userId ?? 0
  const [draftState, setDraftState] = useState<{
    key: number
    values: Partial<EmpresaPerfil>
  }>({ key: profileKey, values: {} })
  const [toast, setToast] = useState<ToastState | null>(null)

  const draftValues = draftState.key === profileKey ? draftState.values : {}
  const form = perfil ? { ...perfil, ...draftValues } : null

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
    updateForm({ [name]: value } as Partial<EmpresaPerfil>)
  }

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setToast({
        type: 'error',
        title: 'Archivo no valido',
        message: 'Selecciona una imagen en formato PNG, JPG o WebP.',
      })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setToast({
        type: 'error',
        title: 'Imagen muy pesada',
        message: 'Usa una imagen menor a 2 MB para mantener rapido el perfil.',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const logoUrl = String(reader.result ?? '')
      updateForm({ logoUrl })
      setToast({
        type: 'success',
        title: 'Vista previa lista',
        message: 'La imagen se guardara cuando confirmes los cambios.',
      })
    }
    reader.onerror = () => {
      setToast({
        type: 'error',
        title: 'No se pudo leer la imagen',
        message: 'Intenta con otro archivo.',
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
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
      onError: () => {
        setToast({
          type: 'error',
          title: 'No se pudo guardar',
          message: 'Revisa los datos e intenta de nuevo.',
        })
      },
    })
  }

  if (isLoading || !form) return <PerfilLoading label="Cargando perfil..." />

  return (
    <div>
      {toast && <PerfilToast toast={toast} onClose={() => setToast(null)} />}
      {isPending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-2xl">
            <Loader2 className="animate-spin text-emerald-500" size={22} />
            <span className="text-sm font-semibold text-slate-600">Guardando cambios...</span>
          </div>
        </div>
      )}

      <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg">
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
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt={form.nombreEmpresa ?? 'Empresa'} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-emerald-600">
                    {form.nombreEmpresa?.charAt(0) ?? 'E'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-600 shadow-lg transition-colors hover:bg-emerald-50"
                >
                  <Camera size={17} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                  >
                    <ImagePlus size={16} />
                    Subir imagen
                  </button>
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => updateForm({ logoUrl: '' })}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:border-orange-200 hover:text-orange-500"
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoFile} className="hidden" />
                <label className="mt-4 grid gap-1 text-sm font-medium text-gray-600">
                  URL de imagen
                  <input
                    name="logoUrl"
                    value={form.logoUrl ?? ''}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </label>
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
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Dirección</label>
                <input
                  name="direccion"
                  value={form.direccion ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <input
                  name="telefonoEmpresa"
                  value={form.telefonoEmpresa ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Correo empresarial</label>
                <input
                  name="correoEmpresa"
                  value={form.correoEmpresa ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Sitio web</label>
                <input
                  name="sitioWeb"
                  value={form.sitioWeb ?? ''}
                  onChange={handleChange}
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
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Apellidos</label>
                <input
                  name="repApellidos"
                  value={form.repApellidos ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Puesto</label>
                <input
                  name="repPuesto"
                  value={form.repPuesto ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <input
                  name="repTelefono"
                  value={form.repTelefono ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Correo</label>
                <input
                  name="repCorreo"
                  value={form.repCorreo ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

            </div>
          </div>

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
              disabled={isPending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </div>

      </form>
    </div>
  )
}
