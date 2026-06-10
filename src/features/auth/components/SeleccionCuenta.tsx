import { type CSSProperties, type MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BriefcaseBusiness, Building2, CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react'
import campusImg from '@/assets/images/campus.png'
import { AppButton } from '@/shared/components/AppButton'
import { ROUTES } from '@/router/routes'
import './auth-flow.css'

type TipoCuenta = 'egresado' | 'estudiante' | 'empresa' | null

type SpotlightStyle = CSSProperties & {
  '--spotlight-x'?: string
  '--spotlight-y'?: string
}

const tarjetas = [
  {
    tipo: 'egresado' as TipoCuenta,
    titulo: 'Egresado',
    descripcion: 'Crea tu perfil profesional y consulta oportunidades para egresados.',
    icono: GraduationCap,
  },
  {
    tipo: 'estudiante' as TipoCuenta,
    titulo: 'Estudiante',
    descripcion: 'Encuentra vacantes, practicas y oportunidades activas.',
    icono: BriefcaseBusiness,
  },
  {
    tipo: 'empresa' as TipoCuenta,
    titulo: 'Empresa',
    descripcion: 'Registra tu empresa para publicar vacantes validadas.',
    icono: Building2,
  },
]

const pasos = [
  'Tipo de cuenta',
  'Registro de datos',
  'Confirmacion',
  'Validacion de perfil',
]

const updateSpotlight = (event: MouseEvent<HTMLElement>) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const style = event.currentTarget.style as CSSStyleDeclaration
  style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
  style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
}

export const SeleccionCuenta = () => {
  const [seleccionado, setSeleccionado] = useState<TipoCuenta>('estudiante')
  const navigate = useNavigate()

  const handleContinuar = () => {
    if (!seleccionado) return
    navigate(seleccionado === 'empresa' ? '/registro/empresa' : `/registro/estudiante?tipo=${seleccionado}`)
  }

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${campusImg})` }}>
      <div className="auth-page__shade">
        <section className="auth-panel p-5 sm:p-7 lg:p-9" aria-labelledby="seleccion-cuenta-title">
          <div className="mb-7 flex items-start justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="auth-back-button"
              aria-label="Volver al inicio de sesion"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="auth-stepper flex-1">
              {pasos.map((paso, index) => (
                <div key={paso} className={`auth-step ${index === 0 ? 'is-complete' : ''}`}>
                  <span className="auth-step__dot">
                    {index === 0 ? <CheckCircle2 size={20} /> : index + 1}
                  </span>
                  <span className="auth-step__label">{paso}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="auth-eyebrow mx-auto">Registro de acceso</p>
            <h1 id="seleccion-cuenta-title" className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
              Elige como quieres entrar
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Selecciona el perfil correcto para preparar el registro con los datos y validaciones que necesita cada usuario.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {tarjetas.map((tarjeta) => {
              const Icono = tarjeta.icono
              const activo = seleccionado === tarjeta.tipo
              const style: SpotlightStyle = {}

              return (
                <button
                  key={tarjeta.tipo}
                  type="button"
                  onClick={() => setSeleccionado(tarjeta.tipo)}
                  onMouseMove={updateSpotlight}
                  className={`auth-spotlight auth-account-card flex flex-col items-start p-5 text-left ${activo ? 'is-active' : ''}`}
                  style={style}
                  aria-pressed={activo}
                >
                  <span className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl ${activo ? 'bg-white/16 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Icono size={30} />
                  </span>
                  <span className="text-2xl font-black">{tarjeta.titulo}</span>
                  <span className={`mt-2 text-sm leading-6 ${activo ? 'text-white/84' : 'text-slate-500'}`}>
                    {tarjeta.descripcion}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="text-sm font-black text-slate-900">Validacion segura antes de publicar o postular</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  La plataforma revisa perfiles para mantener oportunidades confiables para la comunidad.
                </p>
              </div>
            </div>

            <AppButton onClick={handleContinuar} disabled={!seleccionado} className="sm:min-w-40">
              Continuar
            </AppButton>
          </div>
        </section>
      </div>
    </main>
  )
}
