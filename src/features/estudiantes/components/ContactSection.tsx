import { Mail, Phone, Heart, MapPin, Pencil, type LucideIcon } from 'lucide-react'

interface ContactSectionProps {
  email: string
  phone: string
  civilStatus?: string
  address?: string
  onEditClick?: () => void
}

type CampoContacto = {
  icon: LucideIcon
  label: string
  value?: string
  /** Ocupa la fila completa (textos largos como el domicilio). */
  full?: boolean
}

/** Un dato de contacto. Si esta vacio lo dice en vez de dejar el hueco. */
const DatoContacto = ({ icon: Icon, label, value, full }: CampoContacto) => {
  const vacio = !value?.trim()

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition duration-200 hover:border-emerald-200 hover:bg-white ${
        full ? 'sm:col-span-2' : ''
      }`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#009A4D] shadow-sm ring-1 ring-emerald-100 transition group-hover:bg-[#009A4D] group-hover:text-white">
        <Icon size={17} strokeWidth={2} />
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p
          className={`truncate text-sm font-semibold ${
            vacio ? 'italic text-slate-400' : 'text-slate-900'
          }`}
          title={value ?? undefined}
        >
          {vacio ? 'No registrado' : value}
        </p>
      </div>
    </div>
  )
}

export const ContactSection = ({
  email,
  phone,
  civilStatus,
  address,
  onEditClick,
}: ContactSectionProps) => {
  const campos: CampoContacto[] = [
    { icon: Phone, label: 'Telefono', value: phone },
    { icon: Mail, label: 'Correo', value: email },
    { icon: Heart, label: 'Estado civil', value: civilStatus },
    { icon: MapPin, label: 'Domicilio', value: address, full: true },
  ]

  return (
    <div className="rounded-2xl border border-[#e6e0d7] bg-white p-6 shadow-[0_4px_15px_rgba(29,37,56,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Contacto</h2>
          <p className="mt-0.5 text-xs text-slate-400">Con estos datos te buscaran las empresas.</p>
        </div>
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#009A4D] bg-white px-3.5 py-2 text-sm font-bold text-[#009A4D] transition hover:bg-[#009A4D] hover:text-white"
          aria-label="Editar contacto"
        >
          <Pencil size={15} strokeWidth={2} />
          Editar
        </button>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {campos.map((campo) => (
          <DatoContacto key={campo.label} {...campo} />
        ))}
      </div>
    </div>
  )
}
