import { Loader2, UserRound, X } from 'lucide-react'
import { SECURITY_LIMITS } from '@/shared/security/inputRules'
import type { EditContactModalProps } from '../types/profile.types'
import { useEditContact } from '../hooks/useEditContact'

export const EditContactModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditContactModalProps) => {
  const { formData, isLoading, error, handleInputChange, handleSubmit, resetForm } =
    useEditContact({ initialData })

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSaveClick = async () => {
    // El padre cierra el modal cuando el guardado fue exitoso.
    await handleSubmit(onSave)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e6e0d7] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#e6e0d7] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-[#009A4D]">
              <UserRound size={19} strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Editar contacto</h2>
              <p className="text-xs text-slate-500">Los cambios se guardan en tu perfil.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-[#f4f1ec]"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Ej: 2491163536"
                maxLength={SECURITY_LIMITS.phone}
                className="w-full rounded-lg border border-[#ddd8d0] bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:border-[#009A4D] focus:outline-none focus:ring-1 focus:ring-[#009A4D]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Ej: tu@email.com"
                maxLength={SECURITY_LIMITS.email}
                className="w-full rounded-lg border border-[#ddd8d0] bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:border-[#009A4D] focus:outline-none focus:ring-1 focus:ring-[#009A4D]"
              />
            </div>

            {/* Estado Civil */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Estado Civil
              </label>
              <select
                value={formData.civilStatus}
                onChange={(e) => handleInputChange('civilStatus', e.target.value)}
                className="w-full rounded-lg border border-[#ddd8d0] bg-white px-4 py-2 text-slate-900 transition focus:border-[#009A4D] focus:outline-none focus:ring-1 focus:ring-[#009A4D]"
              >
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viudo">Viudo</option>
              </select>
            </div>

            {/* Domicilio */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Domicilio
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Ej: Calle Principal 123, Apt 4B"
                rows={3}
                maxLength={SECURITY_LIMITS.address}
                className="w-full rounded-lg border border-[#ddd8d0] bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:border-[#009A4D] focus:outline-none focus:ring-1 focus:ring-[#009A4D] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer with Buttons */}
        <div className="flex gap-3 border-t border-[#e6e0d7] px-6 py-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-[#ddd8d0] bg-white py-2.5 font-semibold text-slate-700 transition hover:bg-[#f4f1ec] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isLoading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#009A4D] bg-[#009A4D] py-2.5 font-semibold text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
