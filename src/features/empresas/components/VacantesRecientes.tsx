import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import type { VacanteUI } from '../types/empresa.types'

interface VacantesRecientesProps {
  vacantes: VacanteUI[]
  onView: (id: string) => void
  onPostulantes: () => void
}

const dotEstatus: Record<string, string> = {
  activo:   'bg-emerald-500',
  pendiente: 'bg-orange-400',
  cerrada:  'bg-red-400',
}

const textEstatus: Record<string, string> = {
  activo:   'text-emerald-500',
  pendiente: 'text-orange-400',
  cerrada:  'text-red-400',
}

export const VacantesRecientes = ({ vacantes, onView, onPostulantes }: VacantesRecientesProps) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Vacantes recientes</h2>
        <button
          type="button"
          onClick={() => navigate(ROUTES.EMPRESA_PUBLICACIONES)}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Ver todas
        </button>
      </div>

      {vacantes.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No hay vacantes publicadas aún.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {vacantes.map(vacante => (
            <div
              key={vacante.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm text-gray-800">{vacante.titulo}</p>
                <p className="text-xs text-gray-400">{vacante.descripcion}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dotEstatus[vacante.estatus] ?? 'bg-gray-300'}`} />
                  <span className={`text-xs font-semibold ${textEstatus[vacante.estatus] ?? 'text-gray-400'}`}>
                    {vacante.estatus.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{vacante.postulantes} postulantes</span>
                <button
                  type="button"
                  onClick={() => onView(vacante.id)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onPostulantes}
        className="mt-4 w-full rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
      >
        Ver todos los postulantes
      </button>
    </div>
  )
}