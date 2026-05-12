import { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import type { LoginRequest } from '../types/auth.types'
import campusImg from '@/assets/images/campus.png'
import logoBlanco from '@/assets/images/logoblanco.png'

export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [form, setForm] = useState<LoginRequest>({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrorMsg(null) // limpia el error cuando el usuario escribe
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    login(form, {
      onError: () => {
        setErrorMsg('Correo o contraseña incorrectos. Verifica tus datos.')
      }
    })
  }

  return (
    <div
      className="min-h-screen w-full flex bg-cover bg-center relative"
      style={{ backgroundImage: `url(${campusImg})` }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-1/2 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-[40px] m-29">
        <img src={logoBlanco} alt="UTTecam" className="w-72" />
      </div>

      <div className="relative z-10 w-1/2 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md mx-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-1">Bienvenido</h1>
          <p className="text-gray-500 text-sm mb-8">
            Ingresa tus datos para acceder a la plataforma
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ingresa tu Email"
                required
                className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009A4D]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009A4D]"
              />
            </div>

            <p className="text-right text-sm text-[#009A4D] cursor-pointer hover:underline">
              Olvidaste tu contraseña?
            </p>

            {/* Error que persiste hasta que el usuario escribe */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="bg-[#009A4D] hover:bg-[#10B981] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {isPending ? 'Entrando...' : 'Iniciar Sesión'}
            </button>

            <p className="text-center text-sm text-gray-500">
              No tienes cuenta?{' '}
              <span
                onClick={() => window.location.href = '/registro'}
                className="text-[#009A4D] cursor-pointer hover:underline"
              >
                Crea una aquí
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}