import { useState } from 'react'
import { Eye, UserCircle } from 'lucide-react'
import type { Postulante } from '../types/empresa.types'

const MOCK_POSTULANTES: (Postulante & {
  email: string
  aplicoPara: string
  departamento: string
  tipoUsuario: string
})[] = [
  { id: '1', nombre: 'David Antonio Primero Aguilar', email: 'david03@gmail.com', aplicoPara: 'Desarrollador frontend', departamento: 'Desarrollo web·Tiempo completo', tipoUsuario: 'Estudiante', estatus: 'pendiente', descripcion: '' },
  { id: '2', nombre: 'Hector Rosas Oropeza', email: 'hector05@gmail.com', aplicoPara: 'Desarrollador backend', departamento: 'Ingenieria de software·Tiempo completo', tipoUsuario: 'Egresado', estatus: 'revision', descripcion: '' },
  { id: '3', nombre: 'Luis Angel Antonio Alvarez', email: 'luis20@gmail.com', aplicoPara: 'Desarrollador full stack', departamento: 'Ingenieria de software·Medio tiempo', tipoUsuario: 'Estudiante', estatus: 'entrevista', descripcion: '' },
  { id: '4', nombre: 'Jesús Baylón Báez', email: 'jesus29@gmail.com', aplicoPara: 'Diseñador UX/UI', departamento: 'Diseño de producto·Medio tiempo', tipoUsuario: 'Egresado', estatus: 'revision', descripcion: '' },
]

const filtros = ['Filtros', 'Activas (12)', 'Pendientes (3)', 'Cerradas (2)'] as const

const dotEstatus = {
  pendiente: 'bg-orange-400',
  revision: 'bg-gray-300',
  entrevista: 'bg-blue-500',
  rechazado: 'bg-red-400',
}

const textEstatus = {
  pendiente: 'text-orange-400',
  revision: 'text-gray-500',
  entrevista: 'text-blue-500',
  rechazado: 'text-red-400',
}

export const Postulantes = () => {
  const [filtroActivo, setFiltroActivo] = useState('Filtros')

  return (
    <div>
      {/* Titulo */}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Postulantes</h1>
      <p className="text-gray-400 text-sm mb-6">
        Gestiona y aborda tu cartera de candidatos en todos los puestos abiertos
      </p>

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-6">
        {filtros.map(f => (
          <button
            key={f}
            onClick={() => setFiltroActivo(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filtroActivo === f
                ? 'bg-emerald-500 text-white'
                : 'border border-gray-300 text-gray-500 hover:border-emerald-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Candidatos</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Aplico para</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Estatus</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_POSTULANTES.map((postulante) => (
              <tr key={postulante.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserCircle size={36} className="text-gray-300" />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{postulante.nombre}</p>
                      <p className="text-xs text-gray-400">{postulante.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-sm text-gray-800">{postulante.aplicoPara}</p>
                  <p className="text-xs text-gray-400">{postulante.departamento}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {postulante.tipoUsuario}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dotEstatus[postulante.estatus]}`} />
                    <span className={`text-sm font-semibold ${textEstatus[postulante.estatus]}`}>
                      {postulante.estatus.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="hover:text-emerald-500 text-gray-400 transition-colors">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}