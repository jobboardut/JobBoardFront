import { Mail, Phone, Heart, MapPin, Edit } from 'lucide-react'

interface ContactSectionProps {
  email: string
  phone: string
  civilStatus?: string
  address?: string
  onEditClick?: () => void
}

export const ContactSection = ({ email, phone, civilStatus = 'No especificado', address = 'No especificado', onEditClick }: ContactSectionProps) => {
  return (
    <div className="rounded-2xl border border-[#e6e0d7] bg-white p-6 shadow-[0_4px_15px_rgba(29,37,56,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Contacto</h2>
        <button
          type="button"
          onClick={onEditClick}
          className="flex items-center gap-2 rounded-lg border border-[#009A4D] bg-white px-3 py-2 font-medium text-[#009A4D] transition hover:bg-[#10B981] hover:text-white"
          aria-label="Editar contacto"
        >
          <Edit size={16} strokeWidth={2} />
          Editar
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#009A4D] text-white">
            <Phone size={16} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Teléfono</p>
            <p className="text-sm font-semibold text-slate-900">{phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#009A4D] text-white">
            <Mail size={16} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-sm font-semibold text-slate-900">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#009A4D] text-white">
            <Heart size={16} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Estado Civil</p>
            <p className="text-sm font-semibold text-slate-900">{civilStatus}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#009A4D] text-white">
            <MapPin size={16} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Domicilio</p>
            <p className="text-sm font-semibold text-slate-900">{address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
