import { useNavigate, useSearchParams } from 'react-router-dom'
import { BadgeCheck, Clock, Mail } from 'lucide-react'
import campusImg from '@/assets/images/campus.png'

const pasos = [
  'Selección de tipo de cuenta',
  'Registro de Datos',
  'Confirmación',
  'Validación de Perfil',
]

export const RegistroCompletado = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tipo = searchParams.get('tipo')

  // Color según el tipo de usuario
  const colorIcono = tipo === 'empresa' ? 'bg-blue-500' : 'bg-[#EA580C]'

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${campusImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Contenedor principal */}
      <div className="relative z-10 bg-white rounded-3xl shadow-xl w-[85%] max-w-4xl p-10">

        {/* Stepper */}
        <div className="flex items-start justify-center gap-2 mb-10 px-8">
          {pasos.map((paso, index) => (
            <div key={paso} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  index < 3
                    ? 'bg-[#009A4D] text-white'
                    : 'bg-[#EA580C] text-white'
                }`}>
                  <BadgeCheck size={20} />
                </div>
                <span className={`text-xs text-center w-24 leading-tight ${
                  index < 3
                    ? 'text-[#009A4D] font-semibold'
                    : 'text-[#EA580C] font-semibold'
                }`}>
                  {paso}
                </span>
              </div>
              {index < pasos.length - 1 && (
                <div className={`w-16 h-1 rounded mb-5 ${
                  index < 2
                    ? 'bg-[#009A4D]'
                    : 'bg-gradient-to-r from-[#009A4D] to-[#EA580C]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Icono central */}
        <div className="flex justify-center mb-6 relative">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center ${colorIcono}`}>
            <BadgeCheck size={64} color="white" />
          </div>
          <div className="absolute -top-2 right-[calc(50%-80px)] w-10 h-10 bg-[#009A4D] rounded-full flex items-center justify-center border-2 border-white">
            <Clock size={20} color="white" />
          </div>
        </div>

        {/* Texto */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">
          Registro Completado
        </h1>
        <p className="text-center text-gray-600 text-base max-w-lg mx-auto mb-8">
          Tu cuenta está pendiente de validación. Recibirás un correo electrónico cuando tu perfil sea aprobado.
        </p>

        {/* Boton bandeja */}
        <div className="flex justify-center mb-4">
          <button className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-blue-800 font-semibold px-8 py-4 rounded-2xl transition-colors w-full max-w-sm justify-center">
            <Mail size={22} className="text-blue-800" />
            Revisa tu bandeja de entrada
          </button>
        </div>

        {/* Boton volver */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-10 py-3 rounded-2xl transition-colors"
          >
            Volver al inicio
          </button>
        </div>

      </div>
    </div>
  )
}