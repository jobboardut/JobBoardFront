import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, CheckCircle2, Globe, MapPin, PencilLine, Users } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import {
  defaultEmpresaProfile,
  getEmpresaProfileDraft,
  markEmpresaProfileIncomplete,
  saveEmpresaProfile,
  type EmpresaProfile,
} from '../services/empresaProfile.storage'

const modalidades = ['Hibrida y remota', 'Presencial', 'Remota']
const tamanos = ['1-5 colaboradores', '5-10 colaboradores', '11-25 colaboradores', '26-50 colaboradores', '50+ colaboradores']

const splitLines = (value: string) => value
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)

type TagInputProps = {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

const TagInput = ({ value, onChange, placeholder }: TagInputProps) => {
  const [draft, setDraft] = useState('')

  const addTag = (tag: string) => {
    const clean = tag.trim()
    if (!clean) return
    if (value.some((item) => item.toLowerCase() === clean.toLowerCase())) return
    onChange([...value, clean])
    setDraft('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-emerald-500 hover:text-emerald-700">×</button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              addTag(draft)
            }
            if (e.key === 'Backspace' && draft === '' && value.length > 0) {
              removeTag(value[value.length - 1])
            }
          }}
          onBlur={() => addTag(draft)}
          placeholder={placeholder}
          className="min-w-[180px] flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">Enter o coma para agregar.</p>
    </div>
  )
}

export const CompletarPerfilEmpresa = () => {
  const navigate = useNavigate()
  const draft = useMemo(() => getEmpresaProfileDraft(), [])

  const [form, setForm] = useState<EmpresaProfile>({
    ...defaultEmpresaProfile,
    ...draft,
  })

  const [logoPreview, setLogoPreview] = useState(form.logoUrl ?? '')
  const [responsabilidades, setResponsabilidades] = useState<string[]>(splitLines(form.responsabilidades))
  const [requerimientos, setRequerimientos] = useState<string[]>(splitLines(form.requerimientos))
  const [beneficios, setBeneficios] = useState<string[]>(splitLines(form.beneficios))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setLogoPreview(preview)
    setForm((current) => ({ ...current, logoUrl: preview }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveEmpresaProfile({
      ...form,
      responsabilidades: responsabilidades.join('\n'),
      requerimientos: requerimientos.join('\n'),
      beneficios: beneficios.join('\n'),
      logoUrl: logoPreview || form.logoUrl,
    })
    navigate(ROUTES.EMPRESA_DASHBOARD)
  }

  const handleSkip = () => {
    markEmpresaProfileIncomplete()
    navigate(ROUTES.EMPRESA_DASHBOARD)
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[32px] border border-emerald-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(16,185,129,0.08)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={16} />
                Completar perfil empresarial
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Antes de entrar al dashboard, deja lista tu ficha publica</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Estos datos son los que despues veran los estudiantes en tu perfil y tambien los que usara el dashboard para mostrar tu empresa.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
            >
              Omitir por ahora
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-10">
            <div className="grid gap-8 xl:grid-cols-2">
              <article className="rounded-3xl bg-slate-50 p-7">
                <div className="mb-4 flex items-center gap-2">
                  <PencilLine size={18} className="text-emerald-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Informacion general</h2>
                </div>
                <div className="grid gap-4">
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Nombre de la empresa
                    <input name="nombre" value={form.nombre} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Giro / lema
                    <input name="giro" value={form.giro} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Direccion
                    <input name="direccion" value={form.direccion} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Descripcion publica
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={6} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                </div>
              </article>

              <article className="rounded-3xl bg-slate-50 p-7">
                <div className="mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-orange-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Contacto y presencia</h2>
                </div>
                <div className="grid gap-4">
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Sitio web
                    <input name="sitioWeb" value={form.sitioWeb} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Correo
                    <input name="correo" value={form.correo} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Instagram
                    <input name="instagram" value={form.instagram} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Industria
                    <input name="industria" value={form.industria} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Ano de fundacion
                    <input name="fundacion" value={form.fundacion} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </label>
                </div>
              </article>
            </div>

            <div className="grid gap-8 xl:grid-cols-2">
              <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Estructura de empresa</h2>
                </div>
                <div className="grid gap-4">
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Modalidad
                    <select name="modalidad" value={form.modalidad} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                      {modalidades.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-600">
                    Tamano de la empresa
                    <select name="tamano" value={form.tamano} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                      {tamanos.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                </div>
              </article>

              <article className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-7">
                <div className="mb-4 flex items-center gap-2">
                  <Camera size={18} className="text-emerald-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Imagen de marca</h2>
                </div>
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl bg-white/90 p-6 text-center shadow-sm">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-emerald-100 bg-emerald-500/10">
                    {logoPreview
                      ? <img src={logoPreview} alt="Logo empresa" className="h-full w-full object-cover" />
                      : <Users size={40} className="text-emerald-500" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Sube el logotipo cuando quieras</p>
                    <p className="text-xs text-slate-500">Puedes dejarlo para despues y seguir navegando.</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleLogo} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-600" />
                </div>
              </article>
            </div>

            <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex items-center gap-2">
                <PencilLine size={18} className="text-emerald-500" />
                <h2 className="text-lg font-semibold text-slate-900">Contenido del perfil</h2>
              </div>
              <div className="grid gap-4">
                <label className="grid gap-1 text-sm font-medium text-slate-600">
                  Responsabilidades
                  <TagInput value={responsabilidades} onChange={setResponsabilidades} placeholder="Escribe y presiona Enter" />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-600">
                  Requerimientos
                  <TagInput value={requerimientos} onChange={setRequerimientos} placeholder="Escribe y presiona Enter" />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-600">
                  Beneficios
                  <TagInput value={beneficios} onChange={setBeneficios} placeholder="Escribe y presiona Enter" />
                </label>
              </div>
            </article>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Completar despues
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                Guardar y entrar al dashboard
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default CompletarPerfilEmpresa
