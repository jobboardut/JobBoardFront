import { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import type { LoginRequest } from '../types/auth.types'
import campusImg from '@/assets/images/campus.png'
import logoBlanco from '@/assets/images/logoblanco.png'

export const LoginForm = () => {
  const { mutate: login, isPending, isError } = useLogin()

  const [form, setForm] = useState<LoginRequest>({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(form)
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-end bg-cover bg-center relative"
      style={{ backgroundImage: `url(${campusImg})` }}
    >
      {/* Overlay ligero */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Logo izquierda con efecto vidrio */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-2xl p-10 hidden lg:flex flex-col items-center justify-center">
        <img
          src={logoBlanco}
          alt="UTTecam"
          className="w-64"
        />
      </div>

      {/* Formulario derecha */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-10 w-full max-w-md mr-16">

        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Bienvenido
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Ingresa tus datos para acceder a la plataforma
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ingresa tu Email"
              required
              className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
              className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <p className="text-right text-sm text-emerald-500 cursor-pointer hover:underline">
            Olvidaste tu contraseña?
          </p>

          {isError && (
            <p className="text-red-500 text-sm text-center">
              Correo o contraseña incorrectos
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {isPending ? 'Entrando...' : 'Iniciar Sesión'}
          </button>

          <p className="text-center text-sm text-gray-500">
            No tienes cuenta?{' '}
            <span className="text-emerald-500 cursor-pointer hover:underline">
              Crea una aquí
            </span>
          </p>

        </form>
      </div>
    </div>
  )
}