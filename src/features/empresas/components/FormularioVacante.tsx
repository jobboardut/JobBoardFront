import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { useCrearVacante, useVacante } from '../hooks/useEmpresa'
import type { CreateVacanteRequest } from '../types/empresa.types'

const modalidades = ['Presencial', 'Remota', 'Hibrida']

interface FormularioVacanteProps {
  modo?: 'crear' | 'editar'
}

export const FormularioVacante = ({ modo = 'crear' }: FormularioVacanteProps) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const publicacionId = Number(id)
  const isEditMode = modo === 'editar'
  const { mutate: crearVacante, isPending } = useCrearVacante()
  const { data: vacante, isLoading: isLoadingVacante } = useVacante(isEditMode ? publicacionId : 0)

  const [form, setForm] = useState<CreateVacanteRequest>({
    titulo: '',
    descripcion: '',
    requisitos: '',
    sueldoAprox: 0,
    modalidad: '',
  })

  useEffect(() => {
    if (!vacante) return

    setForm({
      titulo: vacante.titulo ?? '',
      descripcion: vacante.descripcion ?? '',
      requisitos: vacante.requisitos ?? '',
      sueldoAprox: vacante.sueldoAprox ?? 0,
      modalidad: vacante.modalidad ?? '',
    })
  }, [vacante])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'sueldoAprox' ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode) {
      alert('El backend actual no incluye un endpoint para editar los datos de la vacante.')
      return
    }

    crearVacante(form, {
      onSuccess: () => {
        navigate(ROUTES.EMPRESA_PUBLICACIONES)
      },
      onError: () => {
        alert('Error al crear la vacante. Intenta de nuevo.')
      },
    })
  }

  if (isEditMode && isLoadingVacante) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Cargando vacante...</p>
    </div>
  )

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles size={14} />
              Vacantes
            </div>
            <h1 className="mt-3 text-2xl font-semibold">
              {isEditMode ? 'Editar vacante' : 'Publicar nueva vacante'}
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Comparte los detalles clave para atraer al talento correcto.
            </p>
          </div>
          <button
            onClick={() => navigate(ROUTES.EMPRESA_PUBLICACIONES)}
            className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Volver a publicaciones
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className="mb-6 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-orange-700">
          La edicion de datos completos aun no esta disponible para esta vacante.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Informacion general</h2>
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Titulo del puesto</label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Desarrollador frontend"
                  required
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Modalidad</label>
                <select
                  name="modalidad"
                  value={form.modalidad}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Seleccione</option>
                  {modalidades.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Sueldo aproximado (MXN)</label>
                <input
                  name="sueldoAprox"
                  type="number"
                  value={form.sueldoAprox}
                  onChange={handleChange}
                  placeholder="Ej: 15000"
                  required
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Descripcion del puesto</h2>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe el puesto..."
              rows={5}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />
          </div>

        </div>

        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Requisitos</h2>
            <textarea
              name="requisitos"
              value={form.requisitos}
              onChange={handleChange}
              placeholder="Lista los requisitos del puesto..."
              rows={8}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.EMPRESA_PUBLICACIONES)}
              className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || isEditMode}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {isEditMode ? 'Edicion no disponible' : isPending ? 'Publicando...' : 'Publicar vacante'}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}

export default FormularioVacante
