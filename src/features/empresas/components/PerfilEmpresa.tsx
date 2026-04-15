import { useState } from 'react'
import { MapPin, Globe, Mail, Instagram, CheckCircle2 } from 'lucide-react'

type Tab = 'descripcion' | 'responsabilidades' | 'requerimientos' | 'beneficios'

const tabs: { key: Tab; label: string }[] = [
  { key: 'descripcion', label: 'Descripción' },
  { key: 'responsabilidades', label: 'Responsabilidades' },
  { key: 'requerimientos', label: 'Requerimientos' },
  { key: 'beneficios', label: 'Beneficios' },
]

const responsabilidades = [
  'Diseñar y desarrollar soluciones de software a la medida de las necesidades del cliente.',
  'Garantizar la calidad, seguridad y escalabilidad de las aplicaciones desarrolladas.',
  'Mantener y mejorar sistemas existentes.',
  'Implementar buenas prácticas de desarrollo y metodologías ágiles.',
]

export const PerfilEmpresa = () => {
  const [tabActiva, setTabActiva] = useState<Tab>('descripcion')

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* Columna izquierda — info principal */}
      <div className="col-span-2">

        {/* Header empresa */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border-b-4 border-emerald-400">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Codedrilos</h1>
              <p className="text-emerald-500 font-semibold text-sm">Soluciones Tecnologicas</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={14} className="text-gray-400" />
                <p className="text-sm text-gray-400">San Mateo Sur 233, Lonetlán, 75484 Tecamachalco, Pue.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTabActiva(tab.key)}
              className={`pb-3 text-sm font-semibold transition-colors ${
                tabActiva === tab.key
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido del tab */}
        {tabActiva === 'descripcion' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Descripción</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Somos una empresa de desarrollo de software especializada en crear soluciones tecnológicas 
              innovadoras para empresas de distintos sectores. Diseñamos, desarrollamos e implementamos 
              aplicaciones web y móviles que optimizan procesos, mejoran la experiencia del usuario y 
              apoyan el crecimiento de nuestros clientes mediante tecnología moderna y escalable.
            </p>
          </div>
        )}

        {tabActiva === 'responsabilidades' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Responsabilidades</h2>
            <div className="grid grid-cols-2 gap-3">
              {responsabilidades.map((resp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-500 leading-relaxed">{resp}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tabActiva === 'requerimientos' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Requerimientos</h2>
            <p className="text-sm text-gray-500">Sin requerimientos especificados aún.</p>
          </div>
        )}

        {tabActiva === 'beneficios' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Beneficios</h2>
            <p className="text-sm text-gray-500">Sin beneficios especificados aún.</p>
          </div>
        )}
      </div>

      {/* Columna derecha */}
      <div className="col-span-1 flex flex-col gap-4">

        {/* Contacto */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Contacto</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-orange-400" />
              <p className="text-sm text-gray-600">Sitio Web: www.codedrilos.com</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-orange-400" />
              <p className="text-sm text-gray-600">Correo: codedrilos@gmail.com</p>
            </div>
            <div className="flex items-center gap-3">
              <Instagram size={18} className="text-orange-400" />
              <p className="text-sm text-gray-600">Instagram: codedrilos.site</p>
            </div>
          </div>
        </div>

        {/* Datos esenciales */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Datos esenciales</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Industria', valor: 'Desarrollo de Software' },
              { label: 'Año de fundación', valor: '2025' },
              { label: 'Modalidad', valor: 'Híbrida y remota' },
              { label: 'Tamaño de la empresa', valor: '5-10 colaboradores' },
            ].map(dato => (
              <div key={dato.label} className="flex justify-between">
                <p className="text-sm text-gray-400">{dato.label}</p>
                <p className="text-sm text-gray-700 font-medium text-right max-w-32">{dato.valor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ubicacion */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-emerald-500 mb-3">Ubicación</h3>
          <div className="w-full h-40 bg-gray-200 rounded-xl overflow-hidden">
            <iframe
              title="ubicacion"
              src="https://maps.google.com/maps?q=Tecamachalco,Puebla,Mexico&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>
  )
}