import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Globe, Loader2, Mail, MapPin, Pencil, X } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { useEmpresaPerfil } from '../hooks/useEmpresa'

type Tab = 'descripcion' | 'requisitos'
type ProfileToast = {
  type: 'success'
  title: string
  message: string
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'descripcion', label: 'Descripción' },
  { key: 'requisitos',  label: 'Requisitos' },
]

export const PerfilEmpresa = () => {
  const [tabActiva, setTabActiva] = useState<Tab>('descripcion')
  const navigate = useNavigate()
  const location = useLocation()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [toast, setToast] = useState<ProfileToast | null>(() => {
    const state = location.state as { toast?: ProfileToast } | null
    return state?.toast ?? null
  })

  const { data: perfil, isLoading, isError } = useEmpresaPerfil()

  useEffect(() => {
    const state = location.state as { toast?: ProfileToast } | null
    if (!state?.toast) return

    const timer = window.setTimeout(() => setToast(null), 4200)
    window.history.replaceState({}, document.title)

    return () => window.clearTimeout(timer)
  }, [location.state])

  useEffect(() => {
    const element = mapRef.current
    if (!element || mapReady) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapReady(true)
          observer.disconnect()
        }
      },
      { rootMargin: '120px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [mapReady])

  if (isLoading) return (
    <div className="flex min-h-[360px] items-center justify-center">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-emerald-100 bg-white px-8 py-7 shadow-sm">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-200 opacity-40" />
          <Loader2 className="relative animate-spin text-emerald-500" size={28} />
        </div>
        <p className="text-sm font-semibold text-slate-500">Cargando perfil...</p>
      </div>
    </div>
  )

  if (isError || !perfil) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-red-400 text-sm">Error al cargar el perfil. Intenta de nuevo.</p>
    </div>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      {toast && (
        <div className="fixed right-6 top-24 z-50 flex w-[min(92vw,360px)] items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 text-emerald-600 shadow-2xl shadow-emerald-900/10">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={19} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">{toast.title}</p>
            <p className="mt-1 text-sm leading-5 text-slate-500">{toast.message}</p>
          </div>
          <button type="button" onClick={() => setToast(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      <div>
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg mb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden ring-2 ring-white/20">
                {perfil.logoUrl ? (
                  <img src={perfil.logoUrl} alt={perfil.nombreEmpresa} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {perfil.nombreEmpresa?.charAt(0) ?? 'E'}
                  </span>
                )}
              </div>
              <div>
                <h1 className="mt-3 text-2xl font-semibold">{perfil.nombreEmpresa}</h1>
                <div className="flex items-center gap-1 mt-2 text-white/80">
                  <MapPin size={14} />
                  <p className="text-sm">{perfil.direccion}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(ROUTES.EMPRESA_EDITAR_PERFIL)}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-600"
            >
              <Pencil size={15} />
              Editar perfil
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          {[
            { label: 'Estatus',  value: perfil.estatusValidacion ?? 'Sin dato' },
            { label: 'RFC',      value: perfil.rfc ?? 'Sin dato' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTabActiva(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tabActiva === tab.key
                  ? 'bg-emerald-500 text-white'
                  : 'border border-slate-200 text-slate-500 hover:border-emerald-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tabActiva === 'descripcion' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Descripción</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {perfil.descripcion || 'Sin descripción registrada.'}
            </p>
          </div>
        )}

        {tabActiva === 'requisitos' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Requisitos</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Sin información registrada.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Contacto</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-orange-400" />
              <p className="text-sm text-gray-600">{perfil.sitioWeb || 'Sin sitio web'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-orange-400" />
              <p className="text-sm text-gray-600">{perfil.correoEmpresa}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Representante</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Nombre',   valor: `${perfil.repNombre} ${perfil.repApellidos}` },
              { label: 'Puesto',   valor: perfil.repPuesto },
              { label: 'Teléfono', valor: perfil.repTelefono },
              { label: 'Correo',   valor: perfil.repCorreo },
            ].map(dato => (
              <div key={dato.label} className="flex justify-between">
                <p className="text-sm text-gray-400">{dato.label}</p>
                <p className="text-sm text-gray-700 font-medium text-right max-w-40">{dato.valor}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-emerald-500 mb-3">Ubicación</h3>
          <div ref={mapRef} className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden">
            {mapReady ? (
              <iframe
                title="ubicacion"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(perfil.direccion ?? 'Tecamachalco,Puebla')}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
                Cargando mapa...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
