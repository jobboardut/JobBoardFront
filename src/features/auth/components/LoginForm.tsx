import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import campusImg from '@/assets/images/campus.png'
import logoBlanco from '@/assets/images/logoblanco.png'
import { ROUTES } from '@/router/routes'
import {
  limitText,
  SECURITY_LIMITS,
  validateEmailField,
  validateLoginPasswordField,
} from '@/shared/security/inputRules'
import { getLoginErrorCopy, useLogin } from '../hooks/useAuth'
import type { LoginRequest } from '../types/auth.types'
import './auth-flow.css'

export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [form, setForm] = useState<LoginRequest>({
    email: '',
    password: '',
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const limit = event.target.name === 'email' ? SECURITY_LIMITS.email : SECURITY_LIMITS.passwordMax
    setForm((prev) => ({ ...prev, [event.target.name]: limitText(event.target.value, limit) }))
    setErrorMsg(null)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setErrorMsg(null)

    const emailError = validateEmailField(form.email, 'Email')
    const passwordError = validateLoginPasswordField(form.password)

    if (emailError || passwordError) {
      setErrorMsg(emailError ?? passwordError ?? null)
      return
    }

    login(form, {
      onError: (error) => {
        const copy = getLoginErrorCopy(error)
        setErrorMsg(`${copy.title}. ${copy.message}`)
      },
      onSuccess: () => setErrorMsg(null),
    })
  }

  return (
    <main className="auth-login-screen h-[100dvh] w-full overflow-hidden bg-slate-950">
      <div
        className="relative flex h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${campusImg})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="auth-login-ambient" aria-hidden="true" />

        <section className="relative z-10 hidden h-full w-1/2 items-center justify-center p-8 lg:flex xl:p-14">
          <div className="auth-login-logo-frame flex h-full max-h-[720px] w-full max-w-[620px] items-center justify-center rounded-[40px] bg-white/10 p-10 shadow-2xl backdrop-blur-md">
            <img src={logoBlanco} alt="UTTecam" className="w-72 max-w-full" />
          </div>
        </section>

        <section className="relative z-10 flex h-full w-full items-center justify-center px-5 py-4 lg:w-1/2">
          <div className="auth-login-form-card w-full max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-9">
            <h1 className="mb-1 text-3xl font-bold text-gray-800">Bienvenido</h1>
            <p className="auth-login-subtitle mb-8 text-sm text-gray-500">
              Ingresa tus datos para acceder a la plataforma
            </p>

            <form onSubmit={handleSubmit} className="auth-login-form flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Email
                <span className="relative">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Ingresa tu Email"
                    maxLength={SECURITY_LIMITS.email}
                    required
                    className="auth-login-input w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#009A4D] focus:ring-2 focus:ring-[#009A4D]/25"
                  />
                </span>
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Contraseña
                <span className="relative">
                  <input
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    maxLength={SECURITY_LIMITS.passwordMax}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    required
                    className="auth-login-input w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm outline-none focus:border-[#009A4D] focus:ring-2 focus:ring-[#009A4D]/25"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((current) => !current)}
                    aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    title={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  >
                    {isPasswordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              <Link
                to={ROUTES.RECUPERAR_PASSWORD}
                className="text-right text-sm font-semibold text-[#009A4D] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>

              {errorMsg ? (
                <div
                  className="auth-login-error rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600"
                  role="alert"
                >
                  {errorMsg}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="auth-login-submit rounded-xl bg-[#009A4D] py-3 font-semibold text-white transition-colors hover:bg-[#10B981] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isPending ? 'Entrando...' : 'Iniciar Sesión'}
              </button>

              <p className="text-center text-sm text-gray-500">
                No tienes cuenta?{' '}
                <Link to={ROUTES.SELECCION_CUENTA} className="font-semibold text-[#009A4D] hover:underline">
                  Crea una aquí
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
