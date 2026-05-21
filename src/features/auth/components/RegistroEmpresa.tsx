import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, CheckCircle2, Globe, Mail, MapPin, Phone, User } from 'lucide-react'
import campusImg from '@/assets/images/campus.png'
import { defaultEmpresaProfile, markEmpresaProfileIncomplete, saveEmpresaProfileDraft } from '@/features/empresas/services/empresaProfile.storage'
import { catalogService } from '@/services/catalog.service'
import { authService } from '../services/auth.service'

const pasos = [
  'Seleccion de tipo de cuenta',
  'Registro de datos',
  'Confirmacion',
  'Validacion de perfil',
]

const DEFAULT_SECTORES = [
  { id: '1', nombre: 'Tecnologia' },
  { id: '2', nombre: 'Manufactura' },
  { id: '3', nombre: 'Salud' },
  { id: '4', nombre: 'Educacion' },
  { id: '5', nombre: 'Construccion' },
  { id: '6', nombre: 'Comercio' },
  { id: '7', nombre: 'Servicios' },
  { id: '8', nombre: 'Agricultura' },
  { id: '9', nombre: 'Transporte' },
  { id: '10', nombre: 'Otro' },
]

export const RegistroEmpresa = () => {
  const navigate = useNavigate()
  const logoRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    email: '',
    password: '',
    nombreEmpresa: '',
    telefonoEmpresa: '',
    direccion: '',
    correoEmpresa: '',
    sectorId: '',
    sitioWeb: '',
    descripcion: '',
    nombreContacto: '',
    apellidosContacto: '',
    puesto: '',
    telefonoContacto: '',
    correoContacto: '',
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sectores, setSectores] = useState(DEFAULT_SECTORES)

  useEffect(() => {
    let isMounted = true

    catalogService.getSectores()
      .then((items) => {
        if (!isMounted || !items.length) return
        setSectores(items.map((item) => ({ id: String(item.id), nombre: item.nombre })))
      })
      .catch(() => {
        if (isMounted) setSectores(DEFAULT_SECTORES)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrorMsg(null)
  }

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)

    try {
      await authService.registroEmpresa({
        email: form.email,
        password: form.password,
        nombreEmpresa: form.nombreEmpresa,
        telefonoEmpresa: form.telefonoEmpresa,
        direccion: form.direccion,
        correoEmpresa: form.correoEmpresa,
        sectorId: form.sectorId,
        sitioWeb: form.sitioWeb,
        descripcion: form.descripcion,
        repNombre: form.nombreContacto,
        repApellidos: form.apellidosContacto,
        repPuesto: form.puesto,
        repTelefono: form.telefonoContacto,
        repCorreo: form.correoContacto,
        logo: logoFile,
      })

      const sectorNombre = sectores.find((sector) => sector.id === form.sectorId)?.nombre
      saveEmpresaProfileDraft({
        nombre: form.nombreEmpresa || defaultEmpresaProfile.nombre,
        giro: sectorNombre || defaultEmpresaProfile.giro,
        direccion: form.direccion || defaultEmpresaProfile.direccion,
        correo: form.correoEmpresa || defaultEmpresaProfile.correo,
        industria: sectorNombre || defaultEmpresaProfile.industria,
      })
      markEmpresaProfileIncomplete()
      navigate('/registro/confirmacion?tipo=empresa')
    } catch {
      setErrorMsg('No se pudo registrar la empresa. Verifica los datos e intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen w-full overflow-y-auto">
      <div
        className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${campusImg})` }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 bg-white rounded-3xl shadow-xl w-[90%] max-w-6xl p-8 my-8">
          <button
            type="button"
            onClick={() => navigate('/registro')}
            className="absolute top-5 left-5 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
          >
            <ArrowLeft size={18} />
          </button>

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

          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Registro de empresa</h2>
              <span className="bg-emerald-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Paso 2 de 4
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <User size={16} color="white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Cuenta de acceso</p>
                <p className="text-gray-400 text-xs">Datos para iniciar sesion despues de la validacion</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </label>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Globe size={16} color="white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Informacion general</p>
                <p className="text-gray-400 text-xs">Datos basicos de la empresa</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Nombre de la empresa
                <input
                  name="nombreEmpresa"
                  value={form.nombreEmpresa}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Telefono de la empresa
                <input
                  name="telefonoEmpresa"
                  value={form.telefonoEmpresa}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Correo de la empresa
                <input
                  type="email"
                  name="correoEmpresa"
                  value={form.correoEmpresa}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Sector
                <select
                  name="sectorId"
                  value={form.sectorId}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                >
                  <option value="">Seleccione una opcion</option>
                  {sectores.map(sector => (
                    <option key={sector.id} value={sector.id}>
                      {sector.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Direccion
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <input
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    className="flex-1 text-sm outline-none bg-transparent"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Sitio web
                <input
                  name="sitioWeb"
                  value={form.sitioWeb}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm text-gray-600 mb-6">
              Descripcion
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none resize-none"
              />
            </label>

            <hr className="border-gray-200 mb-6" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Mail size={16} color="white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Representante</p>
                <p className="text-gray-400 text-xs">Datos del contacto responsable</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Nombre(s)
                <input
                  name="nombreContacto"
                  value={form.nombreContacto}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Apellidos
                <input
                  name="apellidosContacto"
                  value={form.apellidosContacto}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Puesto
                <input
                  name="puesto"
                  value={form.puesto}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Telefono
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <input
                    name="telefonoContacto"
                    value={form.telefonoContacto}
                    onChange={handleChange}
                    className="flex-1 text-sm outline-none bg-transparent"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-600">
                Correo
                <input
                  type="email"
                  name="correoContacto"
                  value={form.correoContacto}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                />
              </label>
            </div>

            {errorMsg && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </div>
            )}
          </div>

            <div className="col-span-1 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center gap-3">
              <div
                onClick={() => logoRef.current?.click()}
                className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border-4 border-emerald-100 hover:border-emerald-300 transition-colors"
              >
                {logoPreview
                  ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                  : <Camera size={36} className="text-gray-400" />
                }
              </div>
              <p className="text-sm text-gray-600 font-medium text-center">
                Subir logotipo de la empresa
              </p>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Registrando...' : 'Continuar'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
