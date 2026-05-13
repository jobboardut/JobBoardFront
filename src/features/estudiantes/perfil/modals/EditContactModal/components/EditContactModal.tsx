import { X } from 'lucide-react'
import type { EditContactModalProps } from '../types'
import { useEditContact } from '../hooks'

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
    await handleSubmit(onSave)
    if (!error) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      {/* Modal Container */}
      <div className="w-full max-w-md rounded-2xl border border-[#e6e0d7] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e6e0d7] px-6 py-4">
          <h2 className="text-2xl font-bold text-slate-900">Editar Contacto</h2>
          <button
            onClick={handleClose}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[#f4f1ec]"
            aria-label="Cerrar"
          >
            <X size={20} className="text-slate-500" strokeWidth={2} />
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
            className="flex-1 rounded-lg border border-[#009A4D] bg-[#009A4D] py-2.5 font-semibold text-white transition hover:bg-[#10B981] disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
