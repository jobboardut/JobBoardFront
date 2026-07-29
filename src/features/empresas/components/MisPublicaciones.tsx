import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, XCircle, Users, BriefcaseBusiness } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { formatMoney } from '@/shared/utils/money'
import { getLugaresInfo } from '@/shared/utils/lugares'
import type { Vacante } from '../types/empresa.types'
import { useConfirmDialog } from '@/shared/components/appConfirmContext'
import { useAppToast } from '@/shared/components/appToastContext'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/StateFeedback'
import { useVacantes, useActualizarEstatusVacante } from '../hooks/useEmpresa'

const filtros = ['Todo', 'Activas', 'Cerradas'] as const

const contarPostulantes = (vacante: { totalPostulantes?: number; postulantes?: number }): number =>
  vacante.totalPostulantes ?? vacante.postulantes ?? 0

// Busqueda tolerante a acentos y mayusculas.
const normalizar = (valor: string): string =>
  valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

// Ocupacion del cupo (ej. 1/10 contratados) con barra de avance.
// El cupo se descuenta al CONTRATAR, no al postularse: son dos metricas distintas.
const ContadorLugares = ({ vacante }: { vacante: Vacante }) => {
  const lugares = getLugaresInfo(vacante)
  if (!lugares) return <span className="text-xs text-slate-400">Cupo no especificado</span>

  return (
    <span className="grid gap-1">
      <span className="inline-flex flex-wrap items-center gap-1.5">
        <BriefcaseBusiness size={15} className={lugares.isFull ? 'text-red-500' : 'text-emerald-500'} />
        <strong className={lugares.isFull ? 'text-red-600' : 'text-slate-900'}>{lugares.label}</strong>
        <span className="text-slate-500">contratados</span>
        {lugares.isFull ? (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">CUPO LLENO</span>
        ) : null}
      </span>
      <span className="block h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <span
          className={`block h-full rounded-full ${lugares.isFull ? 'bg-red-400' : 'bg-emerald-500'}`}
          style={{ width: `${lugares.percent}%` }}
        />
      </span>
    </span>
  )
}

const dotEstatus: Record<string, string> = {
  Activa:   'bg-emerald-500',
  Pausada:  'bg-orange-400',
  Finalizada: 'bg-slate-400',
  Baneada:  'bg-red-400',
}

const textEstatus: Record<string, string> = {
  Activa:   'text-emerald-500',
  Pausada:  'text-orange-400',
  Finalizada: 'text-slate-500',
  Baneada:  'text-red-400',
}

export const MisPublicaciones = () => {
  const navigate = useNavigate()
  const { confirm } = useConfirmDialog()
  const toast = useAppToast()
  const [filtroActivo, setFiltroActivo] = useState('Todo')
  const [busqueda, setBusqueda] = useState('')

  const { data: vacantes = [], isLoading, isError } = useVacantes()
  const { mutate: actualizarEstatus } = useActualizarEstatusVacante()

  const handleCerrarVacante = async (id: number, titulo: string) => {
    const confirmar = await confirm({
      title: 'Cerrar vacante',
      message: `La vacante "${titulo}" dejara de estar disponible para postulaciones.`,
      confirmLabel: 'Cerrar vacante',
      tone: 'danger',
    })
    if (!confirmar) return
    actualizarEstatus(
      { publicacionId: id, data: { estatus: 'Finalizada' } },
      {
        onSuccess: () => toast.success('Vacante cerrada', `"${titulo}" se marco como finalizada.`),
        onError: () => toast.error('No se pudo cerrar', 'Intenta actualizar la vacante nuevamente.'),
      }
    )
  }

  const handleVerVacante = (id: number) => {
    navigate(ROUTES.EMPRESA_DETALLE_VACANTE.replace(':id', String(id)))
  }

  const vacantesFiltradas = vacantes.filter(v => {
    const estatus = v.estatus ?? ''
    const matchFiltro =
      filtroActivo === 'Todo' ||
      (filtroActivo === 'Activas' && estatus === 'Activa') ||
      (filtroActivo === 'Cerradas' && (estatus === 'Finalizada' || estatus === 'Pausada'))

    const matchBusqueda = normalizar(v.titulo).includes(normalizar(busqueda))
    return matchFiltro && matchBusqueda
  })

  if (isLoading) return (
    <LoadingState title="Cargando vacantes" message="Estamos consultando tus publicaciones." />
  )

  if (isError) return (
    <ErrorState title="Error al cargar vacantes" message="Intenta actualizar la pagina en unos segundos." />
  )

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mt-3 text-3xl font-semibold">Administra tus vacantes activas</h1>
            <p className="mt-2 text-sm text-white/80">
              Filtra, analiza y actualiza tus publicaciones sin perder el ritmo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.EMPRESA_CREAR_VACANTE)}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm"
          >
            Publicar nueva vacante
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
          <p className="text-2xl font-semibold text-slate-900">{vacantes.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Activas</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {vacantes.filter(v => v.estatus === 'Activa').length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pendientes</p>
          <p className="text-2xl font-semibold text-orange-500">
            {vacantes.filter(v => v.estatus === 'Pendiente').length}
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
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
              {f}
            </button>
          ))}
        </div>
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
        {vacantesFiltradas.length === 0 ? (
          <EmptyState title="No hay vacantes para mostrar" message="Cambia los filtros o publica una nueva vacante." compact />
        ) : (
          <>
          <div className="grid gap-3 p-3 md:hidden">
            {vacantesFiltradas.map((vacante) => (
              <article key={vacante.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{vacante.titulo}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{vacante.descripcion}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold ${textEstatus[vacante.estatus] ?? 'text-gray-400'}`}>
                    {vacante.estatus}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <span>Modalidad: <strong className="text-slate-900">{vacante.modalidad}</strong></span>
                  <span>Sueldo: <strong className="text-slate-900">{formatMoney(vacante.sueldoAprox)}</strong></span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={15} className="text-emerald-500" />
                    <strong className="text-slate-900">{contarPostulantes(vacante)}</strong> postulantes
                  </span>
                  <ContadorLugares vacante={vacante} />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => handleVerVacante(vacante.id)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">
                    Ver
                  </button>
                  <button type="button" onClick={() => handleCerrarVacante(vacante.id, vacante.titulo)} className="rounded-xl border border-orange-100 px-3 py-2 text-xs font-bold text-orange-600">
                    Cerrar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <table className="hidden w-full md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Vacante</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Modalidad</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sueldo aprox.</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Postulantes</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cupo</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estatus</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacantesFiltradas.map(vacante => (
                <tr key={vacante.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm text-gray-800">{vacante.titulo}</p>
                    <p className="text-xs text-gray-400">{vacante.descripcion}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{vacante.modalidad}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {formatMoney(vacante.sueldoAprox)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Users size={16} className="text-emerald-500" />
                      {contarPostulantes(vacante)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <ContadorLugares vacante={vacante} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dotEstatus[vacante.estatus] ?? 'bg-gray-300'}`} />
                      <span className={`text-sm font-semibold ${textEstatus[vacante.estatus] ?? 'text-gray-400'}`}>
                        {vacante.estatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleVerVacante(vacante.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCerrarVacante(vacante.id, vacante.titulo)}
                        className="text-gray-400 hover:text-orange-500"
                        title="Cerrar vacante"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </div>
    </div>
  )
}
