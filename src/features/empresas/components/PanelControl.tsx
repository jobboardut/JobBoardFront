import { Briefcase, TrendingUp, Users, MoreHorizontal } from 'lucide-react'
import type { Vacante, Postulante } from '../types/empresa.types'

// Datos mock — se reemplazan cuando el backend esté listo
const MOCK_STATS = [
  { label: 'Vacantes', valor: 12, icono: Briefcase, color: 'bg-orange-100', iconColor: 'text-orange-500' },
  { label: 'Activas', valor: 10, icono: TrendingUp, color: 'bg-emerald-100', iconColor: 'text-emerald-500' },
  { label: 'Postulantes', valor: 5, icono: Users, color: 'bg-orange-100', iconColor: 'text-orange-500' },
]

const MOCK_VACANTES: Vacante[] = [
  { id: '1', titulo: 'Desarrollador frontend', descripcion: 'Desarrollo web·Tiempo completo', estatus: 'activo', postulantes: 10 },
  { id: '2', titulo: 'Desarrollador backend', descripcion: 'Ingenieria de software·Tiempo completo', estatus: 'activo', postulantes: 20 },
  { id: '3', titulo: 'Diseñador UX/UI', descripcion: 'Diseño de producto·Medio tiempo', estatus: 'pendiente', postulantes: 0 },
]

const MOCK_POSTULANTES: Record<string, Postulante[]> = {
  pendiente: [
    { id: '1', nombre: 'David Antonio Primero Aguilar', descripcion: 'Perfil recibido correctamente. Aún no ha sido evaluado por el equipo de reclutamiento.', estatus: 'pendiente' },
  ],
  revision: [
    { id: '2', nombre: 'Hector Rosas Oropeza', descripcion: 'Perfil en análisis. Se están evaluando experiencia, habilidades y compatibilidad con la vacante.', estatus: 'revision' },
  ],
  entrevista: [
    { id: '3', nombre: 'Luis Angel Antonio Alvarez', descripcion: 'Perfil seleccionado para entrevista. Se encuentra en proceso de evaluación directa con el reclutador.', estatus: 'entrevista' },
  ],
}

const colorEstatus = {
  activo: 'text-emerald-500',
  pendiente: 'text-orange-400',
  cerrada: 'text-gray-400',
}

const dotEstatus = {
  activo: 'bg-emerald-500',
  pendiente: 'bg-orange-400',
  cerrada: 'bg-gray-400',
}

const colorKanban = {
  pendiente: 'bg-orange-400',
  revision: 'bg-orange-400',
  entrevista: 'bg-orange-400',
}

export const PanelControl = () => {
  return (
    <div>
      {/* Titulo */}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Panel de control</h1>
      <p className="text-gray-400 text-sm mb-8">
        Hola buenos dias Daniel. Esto es lo que está sucediendo con su feed hoy
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {MOCK_STATS.map((stat) => {
          const Icono = stat.icono
          return (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                <Icono size={28} className={stat.iconColor} />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-800">{stat.valor}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          )
        })}
        {/* Cuarta tarjeta vacía como en el diseño */}
        <div className="bg-white rounded-2xl shadow-sm p-6" />
      </div>

      {/* Vacantes recientes */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Vacantes recientes</h2>
      <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Vacante</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estatus</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Postulantes</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_VACANTES.map((vacante) => (
              <tr key={vacante.id} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <p className="font-semibold text-sm text-gray-800">{vacante.titulo}</p>
                  <p className="text-xs text-gray-400">{vacante.descripcion}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dotEstatus[vacante.estatus]}`} />
                    <span className={`text-sm font-semibold ${colorEstatus[vacante.estatus]}`}>
                      {vacante.estatus.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  {vacante.postulantes}
                </td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Postulaciones recientes */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Postulaciones recientes</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(MOCK_POSTULANTES).map(([columna, postulantes]) => (
          <div key={columna} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 capitalize">{columna}</span>
                <span className={`w-5 h-5 rounded-full ${colorKanban[columna as keyof typeof colorKanban]} text-white text-xs flex items-center justify-center`}>
                  {postulantes.length}
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">+</button>
            </div>
            {postulantes.map((postulante) => (
              <div key={postulante.id} className="border-l-4 border-emerald-400 rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={16} className="text-emerald-500" />
                  <p className="text-sm font-semibold text-gray-800">{postulante.nombre}</p>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{postulante.descripcion}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}