import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Briefcase, Building2, CheckCircle2 } from 'lucide-react'
import campusImg from '@/assets/images/campus.png'

type TipoCuenta = 'egresado' | 'estudiante' | 'empresa' | null

const tarjetas = [
  {
    tipo: 'egresado' as TipoCuenta,
    titulo: 'Egresado',
    descripcion: 'Registro para egresados buscando oportunidades',
    icono: GraduationCap,
  },
  {
    tipo: 'estudiante' as TipoCuenta,
    titulo: 'Estudiante',
    descripcion: 'Registro para estudiantes buscando oportunidades',
    icono: Briefcase,
  },
  {
    tipo: 'empresa' as TipoCuenta,
    titulo: 'Empresa',
    descripcion: 'Registro de empresas',
    icono: Building2,
  },
]

const pasos = [
  'Selección de tipo de cuenta',
  'Registro de Datos',
  'Confirmación',
  'Validación de Perfil',
]

export const SeleccionCuenta = () => {
  const [seleccionado, setSeleccionado] = useState<TipoCuenta>(null)
  const navigate = useNavigate()

  const handleContinuar = () => {
    if (!seleccionado) return
    if (seleccionado === 'empresa') {
      navigate('/registro/empresa')
    } else {
      navigate('/registro/estudiante')
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${campusImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Contenedor principal */}
      <div className="relative z-10 bg-white rounded-3xl shadow-xl w-[85%] max-w-4xl p-8">

        {/* Boton regresar */}
        <button
          onClick={() => navigate('/login')}
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
        >
          ←
        </button>

        {/* Stepper */}
        <div className="flex items-start justify-center gap-2 mb-8 px-8">
          {pasos.map((paso, index) => (
            <div key={paso} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  index === 0
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index === 0
                    ? <CheckCircle2 size={20} />
                    : <span className="text-sm font-bold">{index + 1}</span>
                  }
                </div>
                <span className={`text-xs text-center w-24 leading-tight ${
                  index === 0 ? 'text-emerald-500 font-semibold' : 'text-gray-400'
                }`}>
                  {paso}
                </span>
              </div>
              {index < pasos.length - 1 && (
                <div className={`w-16 h-1 rounded mb-5 ${
                  index === 0 ? 'bg-emerald-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Titulo */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Bienvenido
        </h1>
        <p className="text-center text-gray-500 text-base mb-8">
          Por favor selecciona tu tipo de usuario para continuar...
        </p>

        {/* Tarjetas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tarjetas.map((tarjeta) => {
            const Icono = tarjeta.icono
            const activo = seleccionado === tarjeta.tipo
            return (
              <button
                key={tarjeta.tipo}
                onClick={() => setSeleccionado(tarjeta.tipo)}
                className={`flex flex-col items-center p-6 rounded-2xl border-4 transition-all ${
                  activo
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Icono */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  activo ? 'bg-emerald-500' : 'bg-gray-200'
                }`}>
                  <Icono size={32} color={activo ? 'white' : '#9ca3af'} />
                </div>

                {/* Titulo */}
                <p className={`text-xl font-bold mb-1 ${
                  activo ? 'text-emerald-500' : 'text-gray-500'
                }`}>
                  {tarjeta.titulo}
                </p>

                {/* Descripcion */}
                <p className="text-gray-400 text-center text-xs leading-tight">
                  {tarjeta.descripcion}
                </p>

                {/* Linea indicador */}
                <div className={`mt-3 h-1.5 w-16 rounded-full transition-colors ${
                  activo ? 'bg-emerald-500' : 'bg-gray-200'
                }`} />
              </button>
            )
          })}
        </div>

        {/* Boton continuar */}
        <div className="flex justify-end">
          <button
            onClick={handleContinuar}
            disabled={!seleccionado}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg px-10 py-3 rounded-xl transition-colors"
          >
            Continuar
          </button>
        </div>

      </div>
    </div>
  )
}