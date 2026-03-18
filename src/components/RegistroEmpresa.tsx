import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Phone, MapPin, Mail, Camera, User, ArrowLeft, CheckCircle2 } from 'lucide-react'
import campusImg from '@/assets/images/campus.png'

const pasos = [
  'Selección de tipo de cuenta',
  'Registro de Datos',
  'Confirmación',
  'Validación de Perfil',
]

const sectores = [
  'Tecnología',
  'Manufactura',
  'Salud',
  'Educación',
  'Construcción',
  'Comercio',
  'Servicios',
  'Agricultura',
  'Transporte',
  'Otro',
]

export const RegistroEmpresa = () => {
  const navigate = useNavigate()
  const logoRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nombreEmpresa: '',
    telefonoEmpresa: '',
    direccion: '',
    correoEmpresa: '',
    sector: '',
    nombreContacto: '',
    apellidosContacto: '',
    puesto: '',
    telefonoContacto: '',
    correoContacto: '',
  })

  const [logo, setLogo] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setLogo(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  navigate('/registro/confirmacion?tipo=empresa')
}

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${campusImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Contenedor principal */}
      <div className="relative z-10 bg-white rounded-3xl shadow-xl w-[90%] max-w-6xl p-8 my-8">

        {/* Boton regresar */}
        <button
          onClick={() => navigate('/registro')}
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Stepper */}
        <div className="flex items-start justify-center gap-2 mb-8 px-8">
          {pasos.map((paso, index) => (
            <div key={paso} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  index === 0
                    ? 'bg-emerald-500 text-white'
                    : index === 1
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index === 0
                    ? <CheckCircle2 size={20} />
                    : <span className="text-sm font-bold">{index + 1}</span>
                  }
                </div>
                <span className={`text-xs text-center w-24 leading-tight ${
                  index === 0
                    ? 'text-emerald-500 font-semibold'
                    : index === 1
                    ? 'text-orange-400 font-semibold'
                    : 'text-gray-400'
                }`}>
                  {paso}
                </span>
              </div>
              {index < pasos.length - 1 && (
                <div className={`w-16 h-1 rounded mb-5 ${
                  index === 0
                    ? 'bg-gradient-to-r from-emerald-500 to-orange-400'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Contenido en dos columnas */}
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">

          {/* Columna izquierda — formulario */}
          <div className="col-span-2 bg-gray-50 rounded-2xl p-6">

            {/* Titulo */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Registro de datos</h2>
              <span className="bg-emerald-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Paso 2 de 4
              </span>
            </div>

            {/* Seccion informacion general */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Globe size={16} color="white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Información general</p>
                <p className="text-gray-400 text-xs">Datos basicos de identificación</p>
              </div>
            </div>

            {/* Nombre empresa y telefono */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Nombre de la empresa</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                  <Globe size={16} className="text-gray-400" />
                  <input
                    name="nombreEmpresa"
                    value={form.nombreEmpresa}
                    onChange={handleChange}
                    className="flex-1 text-sm outline-none bg-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Telefono de la Empresa</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <input
                    name="telefonoEmpresa"
                    value={form.telefonoEmpresa}
                    onChange={handleChange}
                    className="flex-1 text-sm outline-none bg-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Direccion */}
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm text-gray-600">Direccion completa</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                <MapPin size={16} className="text-gray-400" />
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Correo empresa */}
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm text-gray-600">Correo de la empresa</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  name="correoEmpresa"
                  value={form.correoEmpresa}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Sector */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm text-gray-600">Sector al que pertenece</label>
              <select
                name="sector"
                value={form.sector}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                required
              >
                <option value="">Seleccione una opción</option>
                {sectores.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Seccion informacion de contacto */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <User size={16} color="white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Información de contacto</p>
                <p className="text-gray-400 text-xs">Datos basicos de identificacion del usuario</p>
              </div>
            </div>

            {/* Nombre y apellidos contacto */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Nombre(s)</label>
                <input
                  name="nombreContacto"
                  value={form.nombreContacto}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Apellidos</label>
                <input
                  name="apellidosContacto"
                  value={form.apellidosContacto}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </div>
            </div>

            {/* Puesto y telefono contacto */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Puesto</label>
                <input
                  name="puesto"
                  value={form.puesto}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Telefono</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <input
                    name="telefonoContacto"
                    value={form.telefonoContacto}
                    onChange={handleChange}
                    className="flex-1 text-sm outline-none bg-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Correo contacto */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Correo</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  name="correoContacto"
                  value={form.correoContacto}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent"
                  required
                />
              </div>
            </div>

          </div>

          {/* Columna derecha — logo */}
          <div className="col-span-1 flex flex-col gap-4">

            {/* Logo empresa */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center gap-3">
              <div
                onClick={() => logoRef.current?.click()}
                className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border-4 border-emerald-100 hover:border-emerald-300 transition-colors"
              >
                {logo
                  ? <img src={logo} alt="logo" className="w-full h-full object-cover" />
                  : <Camera size={36} className="text-gray-400" />
                }
              </div>
              <p className="text-sm text-gray-600 font-medium text-center">
                Subir logotipo de la empresa
              </p>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </div>

            {/* Boton continuar */}
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Continuar
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}