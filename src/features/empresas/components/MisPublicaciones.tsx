import { useState } from 'react'
import { Search, Eye, FileEdit } from 'lucide-react'
import type { Vacante } from '../types/empresa.types'

const MOCK_VACANTES: Vacante[] = [
  { id: '1', titulo: 'Desarrollador frontend', descripcion: 'Desarrollo web·Tiempo completo', estatus: 'activo', postulantes: 10, fechaPublicacion: 'Enero, 22, 2026' },
  { id: '2', titulo: 'Desarrollador backend', descripcion: 'Ingenieria de software·Tiempo completo', estatus: 'activo', postulantes: 20, fechaPublicacion: 'Enero, 10, 2026' },
  { id: '3', titulo: 'Diseñador UX/UI', descripcion: 'Diseño de producto·Medio tiempo', estatus: 'pendiente', postulantes: 12, fechaPublicacion: 'Diciembre, 10, 2025' },
  { id: '4', titulo: 'Desarrollador full stack', descripcion: 'Ingenieria de software·Medio tiempo', estatus: 'cerrada', postulantes: 5, fechaPublicacion: 'Diciembre, 4, 2025' },
]

const filtros = ['Todo', 'Activas', 'Pendientes', 'Cerradas'] as const

const dotEstatus = {
  activo: 'bg-emerald-500',
  pendiente: 'bg-orange-400',
  cerrada: 'bg-red-400',
}

const textEstatus = {
  activo: 'text-emerald-500',
  pendiente: 'text-orange-400',
  cerrada: 'text-red-400',
}

export const MisPublicaciones = () => {
  
  const [filtroActivo, setFiltroActivo] = useState('Todo')
  const [busqueda, setBusqueda] = useState('')

  const vacantesFiltradas = MOCK_VACANTES.filter(v => {
    const matchFiltro =
      filtroActivo === 'Todo' ||
      (filtroActivo === 'Activas' && v.estatus === 'activo') ||
      (filtroActivo === 'Pendientes' && v.estatus === 'pendiente') ||
      (filtroActivo === 'Cerradas' && v.estatus === 'cerrada')

    const matchBusqueda = v.titulo.toLowerCase().includes(busqueda.toLowerCase())

    return matchFiltro && matchBusqueda
  })

  return (
    <div>
      {/* Filtros y busqueda */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
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
              {f} {f === 'Todo' ? `(${MOCK_VACANTES.length})` :
                   f === 'Activas' ? `(${MOCK_VACANTES.filter(v => v.estatus === 'activo').length})` :
                   f === 'Pendientes' ? `(${MOCK_VACANTES.filter(v => v.estatus === 'pendiente').length})` :
                   `(${MOCK_VACANTES.filter(v => v.estatus === 'cerrada').length})`}
            </button>
          ))}
        </div>

        {/* Busqueda */}
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 gap-2 bg-white">
          <Search size={16} className="text-gray-400" />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar vacante..."
            className="text-sm outline-none bg-transparent w-48"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Vacantes</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha de publicación</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Postulantes</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estatus</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacantesFiltradas.map((vacante) => (
              <tr key={vacante.id} className={`border-t border-gray-100 ${vacante.estatus === 'cerrada' ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-sm text-gray-800">{vacante.titulo}</p>
                  <p className="text-xs text-gray-400">{vacante.descripcion}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {vacante.fechaPublicacion}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  {vacante.postulantes}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dotEstatus[vacante.estatus]}`} />
                    <span className={`text-sm font-semibold ${textEstatus[vacante.estatus]}`}>
                      {vacante.estatus.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {vacante.estatus === 'cerrada'
                    ? <Eye size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                    : <FileEdit size={18} className="text-gray-400 cursor-pointer hover:text-emerald-500" />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginacion */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Mostrando 1-{vacantesFiltradas.length} de {MOCK_VACANTES.length} vacantes
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-500 hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-4 py-2 bg-orange-400 text-white rounded-full text-sm font-semibold hover:bg-orange-500">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}