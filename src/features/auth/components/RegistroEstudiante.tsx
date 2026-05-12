import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, Mail, Camera, Upload, GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react'
import campusImg from '@/assets/images/campus.png'

const pasos = [
  'Selección de tipo de cuenta',
  'Registro de Datos',
  'Confirmación',
  'Validación de Perfil',
]

const programas = [
  'Ingeniería en Tecnologías de la Información',
  'Ingeniería en Desarrollo de Software',
  'Ingeniería Industrial',
  'Ingeniería en Mecatrónica',
  'Licenciatura en Administración',
  'Licenciatura en Contaduría',
]

const estadosCiviles = [
  'Soltero(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viudo(a)',
  'Unión libre',
]

export const RegistroEstudiante = () => {
  const navigate = useNavigate()
  const fotoRef = useRef<HTMLInputElement>(null)
  const cvRef = useRef<HTMLInputElement>(null)
  const docRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    direccion: '',
    fechaNacimiento: '',
    estadoCivil: '',
    correo: '',
    programa: '',
  })

  const [foto, setFoto] = useState<string | null>(null)
  const [cvNombre, setCvNombre] = useState<string | null>(null)
  const [docNombre, setDocNombre] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFoto(URL.createObjectURL(file))
  }

  const handleCV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setCvNombre(file.name)
  }

  const handleDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setDocNombre(file.name)
  }

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  navigate('/registro/confirmacion?tipo=estudiante')
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

            {/* Seccion informacion personal */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <User size={16} color="white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Información personal</p>
                <p className="text-gray-400 text-xs">Datos basicos de identificación</p>
              </div>
            </div>

            {/* Nombre y apellidos */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Nombre(s)</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                  <User size={16} className="text-gray-400" />
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="flex-1 text-sm outline-none bg-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Apellidos</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                  <User size={16} className="text-gray-400" />
                  <input
                    name="apellidos"
                    value={form.apellidos}
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

            {/* Fecha y estado civil */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Estado civil</label>
                <select
                  name="estadoCivil"
                  value={form.estadoCivil}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  {estadosCiviles.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Correo */}
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm text-gray-600">Correo Electrónico</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Seccion informacion escolar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <GraduationCap size={16} color="white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Información Escolar</p>
                <p className="text-gray-400 text-xs">Datos escolares necesarios para el registro</p>
              </div>
            </div>

            {/* Programa educativo */}
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm text-gray-600">Programa educativo del que proviene</label>
              <select
                name="programa"
                value={form.programa}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none"
                required
              >
                <option value="">Seleccione su programa</option>
                {programas.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Nota documentos */}
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="mb-1">*Sube un documento que avale tu estatus como egresado o estudiante</p>
              <p>-Foto de tu credencial de estudiante</p>
              <p>-Cedula profesional</p>
              <p>-Titulo universitario</p>
              <p>-Comprobante de examen profesional</p>
              <p>-Kardex</p>
            </div>

          </div>

          {/* Columna derecha — archivos */}
          <div className="col-span-1 flex flex-col gap-4">

            {/* Foto de perfil */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center gap-3">
              <div
                onClick={() => fotoRef.current?.click()}
                className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border-4 border-emerald-100 hover:border-emerald-300 transition-colors"
              >
                {foto
                  ? <img src={foto} alt="foto" className="w-full h-full object-cover" />
                  : <Camera size={36} className="text-gray-400" />
                }
              </div>
              <p className="text-sm text-gray-600 font-medium">Subir Foto de Perfil</p>
              <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </div>

            {/* CV */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Curriculum Vitae</p>
              <div
                onClick={() => cvRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Upload size={22} color="white" />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {cvNombre ?? 'Arrastra y suelta tu archivo PDF aquí'}
                </p>
              </div>
              <input ref={cvRef} type="file" accept=".pdf" className="hidden" onChange={handleCV} />
            </div>

            {/* Documento avalatorio */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Documento avalatorio</p>
              <div
                onClick={() => docRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Upload size={22} color="white" />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {docNombre ?? 'Arrastra y suelta tu archivo aquí PDF, JPG, PNG... (Max. 5MB)'}
                </p>
              </div>
              <input ref={docRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleDoc} />
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