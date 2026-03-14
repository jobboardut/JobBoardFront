import { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import type { LoginRequest } from '../types/auth.types'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://www.figma.com/api/mcp/asset/feae3d59-0aeb-4c97-a7d2-b94b64ab53f6"
            alt="UTTecam"
            className="w-48"
          />
        </div>

        {/* Titulo */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Iniciar sesión
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Ingresa tus credenciales para continuar
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@uttecam.edu.mx"
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
              placeholder="••••••••"
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Error */}
          {isError && (
            <p className="text-red-500 text-sm text-center">
              Correo o contraseña incorrectos
            </p>
          )}

          {/* Boton */}
          <button
            type="submit"
            disabled={isPending}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {isPending ? 'Entrando...' : 'Entrar'}
          </button>

        </form>
      </div>
    </div>
  )
}