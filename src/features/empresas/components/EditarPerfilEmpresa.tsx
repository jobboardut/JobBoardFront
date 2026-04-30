import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { useEmpresaPerfil, useActualizarPerfil } from '../hooks/useEmpresa'
import type { EmpresaPerfil } from '../types/empresa.types'

export const EditarPerfilEmpresa = () => {
  const navigate = useNavigate()
  const { data: perfil, isLoading } = useEmpresaPerfil()
  const { mutate: actualizarPerfil, isPending } = useActualizarPerfil()

  const [form, setForm] = useState<Partial<EmpresaPerfil> | null>(null)

  // Inicializa el form cuando llegan los datos
  if (perfil && !form) {
    setForm(perfil)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => prev ? { ...prev, [name]: value } : prev)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    actualizarPerfil(form, {
      onSuccess: () => navigate(ROUTES.EMPRESA_PERFIL),
      onError: () => alert('Error al actualizar el perfil. Intenta de nuevo.'),
    })
  }

  if (isLoading || !form) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Cargando perfil...</p>
    </div>
  )

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-3 text-2xl font-semibold">Editar perfil</h1>
            <p className="mt-2 text-sm text-white/80">
              Actualiza la información de tu empresa.
            </p>
          </div>
          <button
            onClick={() => navigate(ROUTES.EMPRESA_PERFIL)}
            className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Volver al perfil
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Datos de la empresa</h2>
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Nombre de la empresa</label>
                <input
                  name="nombreEmpresa"
                  value={form.nombreEmpresa ?? ''}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Dirección</label>
                <input
                  name="direccion"
                  value={form.direccion ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <input
                  name="telefonoEmpresa"
                  value={form.telefonoEmpresa ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Correo empresarial</label>
                <input
                  name="correoEmpresa"
                  value={form.correoEmpresa ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Sitio web</label>
                <input
                  name="sitioWeb"
                  value={form.sitioWeb ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion ?? ''}
                  onChange={handleChange}
                  rows={4}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Datos del representante</h2>
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Nombre</label>
                <input
                  name="repNombre"
                  value={form.repNombre ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Apellidos</label>
                <input
                  name="repApellidos"
                  value={form.repApellidos ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Puesto</label>
                <input
                  name="repPuesto"
                  value={form.repPuesto ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <input
                  name="repTelefono"
                  value={form.repTelefono ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Correo</label>
                <input
                  name="repCorreo"
                  value={form.repCorreo ?? ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.EMPRESA_PERFIL)}
              className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </div>

      </form>
    </div>
  )
}