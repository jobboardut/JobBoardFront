import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { User, MapPin, Mail, Camera, Upload, GraduationCap, ArrowLeft, CheckCircle2, Hash } from 'lucide-react'
import campusImg from '@/assets/images/campus.png'
import { catalogService } from '@/services/catalog.service'
import type { CatalogItem } from '@/services/catalog.service'
import { useAppToast } from '@/shared/components/appToastContext'
import {
  FILE_LIMITS,
  limitText,
  SECURITY_LIMITS,
  validateEmailField,
  validateFile,
  validatePasswordField,
  validateRequiredText,
} from '@/shared/security/inputRules'
import { authService } from '../services/auth.service'
import { RegistroResumenDialog, type RegistroResumenSection } from './RegistroResumenDialog'

const pasos = [
  'Selección de tipo de cuenta',
  'Registro de Datos',
  'Confirmación',
  'Validación de Perfil',
]

const estadosCiviles = [
  'Soltero(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viudo(a)',
  'Unión libre',
]

const ESTUDIANTE_FIELD_LIMITS = {
  nombre: SECURITY_LIMITS.name,
  apellidos: SECURITY_LIMITS.name,
  direccion: SECURITY_LIMITS.address,
  fechaNacimiento: 10,
  estadoCivil: SECURITY_LIMITS.shortText,
  correo: SECURITY_LIMITS.email,
  password: SECURITY_LIMITS.passwordMax,
  matricula: SECURITY_LIMITS.shortText,
  programaEducativoId: 12,
} as const

const getEstudianteFieldLimit = (name: string): number =>
  ESTUDIANTE_FIELD_LIMITS[name as keyof typeof ESTUDIANTE_FIELD_LIMITS] ?? SECURITY_LIMITS.shortText

export const RegistroEstudiante = () => {
  const navigate = useNavigate()
  const toast = useAppToast()
  const [searchParams] = useSearchParams()
  const estatusAcademico = searchParams.get('tipo') === 'egresado' ? 'Egresado' : 'Estudiante'
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
    password: '',
    matricula: '',
    programaEducativoId: '',
  })

  const [foto, setFoto] = useState<string | null>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [cvNombre, setCvNombre] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [docNombre, setDocNombre] = useState<string | null>(null)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [programas, setProgramas] = useState<CatalogItem[]>([])
  const [isLoadingProgramas, setIsLoadingProgramas] = useState(true)
  const [programasError, setProgramasError] = useState<string | null>(null)
  const programaSeleccionado = programas.find((programa) => String(programa.id) === form.programaEducativoId)

  useEffect(() => {
    let isMounted = true

    catalogService.getCarreras()
      .then((items) => {
        if (!isMounted) return
        setProgramas(items)
        setProgramasError(items.length ? null : 'No hay programas educativos disponibles.')
      })
      .catch(() => {
        if (!isMounted) return
        setProgramas([])
        setProgramasError('No se pudieron cargar los programas educativos.')
      })
      .finally(() => {
        if (isMounted) setIsLoadingProgramas(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: limitText(e.target.value, getEstudianteFieldLimit(e.target.name)) }))
    setErrorMsg(null)
    setSuccessMsg(null)
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileError = validateFile(file, {
      allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
      label: 'La foto de perfil',
      maxBytes: FILE_LIMITS.imageBytes,
    })

    if (fileError) {
      setErrorMsg(fileError)
      setFoto(null)
      setFotoFile(null)
      e.target.value = ''
      return
    }

    setFotoFile(file)
    setFoto(URL.createObjectURL(file))
  }

  const handleCV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileError = validateFile(file, {
      allowedTypes: ['application/pdf'],
      label: 'El curriculum',
      maxBytes: FILE_LIMITS.documentBytes,
    })

    if (fileError) {
      setErrorMsg(fileError)
      setCvNombre(null)
      setCvFile(null)
      e.target.value = ''
      return
    }

    setCvFile(file)
    setCvNombre(file.name)
  }

  const handleDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileError = validateFile(file, {
      allowedTypes: ['application/pdf', 'image/png', 'image/jpeg'],
      label: 'El documento avalatorio',
      maxBytes: FILE_LIMITS.documentBytes,
    })

    if (fileError) {
      setErrorMsg(fileError)
      setDocNombre(null)
      setDocFile(null)
      e.target.value = ''
      return
    }

    setDocFile(file)
    setDocNombre(file.name)
  }

  const validateForm = () => {
    const validations = [
      validateRequiredText(form.nombre, 'Nombre', SECURITY_LIMITS.name),
      validateRequiredText(form.apellidos, 'Apellidos', SECURITY_LIMITS.name),
      validateRequiredText(form.direccion, 'Direccion', SECURITY_LIMITS.address),
      validateRequiredText(form.fechaNacimiento, 'Fecha de nacimiento', 10),
      validateRequiredText(form.estadoCivil, 'Estado civil', SECURITY_LIMITS.shortText),
      validateEmailField(form.correo, 'Correo electronico'),
      validatePasswordField(form.password),
      validateRequiredText(form.matricula, 'Matricula', SECURITY_LIMITS.shortText),
      validateRequiredText(form.programaEducativoId, 'Programa educativo', 12),
    ].filter(Boolean)

    if (validations.length > 0) {
      setErrorMsg(String(validations[0]))
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    if (!validateForm()) return

    if (!programaSeleccionado) {
      setErrorMsg('Selecciona un programa educativo valido.')
      return
    }

    setIsReviewOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)
    if (!validateForm()) return

    if (!programaSeleccionado) {
      setErrorMsg('Selecciona un programa educativo valido.')
      setIsReviewOpen(false)
      return
    }

    setIsSubmitting(true)

    try {
      await authService.registroEstudiante({
        email: form.correo,
        password: form.password,
        nombres: form.nombre,
        apellidos: form.apellidos,
        direccion: form.direccion,
        fechaNacimiento: form.fechaNacimiento,
        estadoCivil: form.estadoCivil,
        matricula: form.matricula,
        programaEducativoId: form.programaEducativoId,
        programaEducativo: programaSeleccionado?.nombre ?? '',
        estatusAcademico,
        fotoPerfil: fotoFile,
        cv: cvFile,
        docProbatorio: docFile,
      })

      const message = `Registro de ${estatusAcademico.toLowerCase()} enviado correctamente. Te avisaremos por correo cuando sea validado.`
      setSuccessMsg(message)
      toast.success('Registro enviado', message)
      window.setTimeout(() => {
        navigate(`/registro/confirmacion?tipo=${estatusAcademico.toLowerCase()}`)
      }, 1200)
    } catch (error) {
      const apiError = error as { message?: string; detalle?: string }
      setIsReviewOpen(false)
      setErrorMsg(apiError.detalle || apiError.message || 'No se pudo registrar el estudiante. Verifica los datos e intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resumenSections: RegistroResumenSection[] = [
    {
      title: 'Cuenta y tipo de registro',
      items: [
        { label: 'Tipo de cuenta', value: estatusAcademico },
        { label: 'Correo', value: form.correo },
        { label: 'Contrasena', value: form.password ? 'Configurada' : '' },
      ],
    },
    {
      title: 'Informacion personal',
      items: [
        { label: 'Nombre', value: `${form.nombre} ${form.apellidos}`.trim() },
        { label: 'Direccion', value: form.direccion },
        { label: 'Fecha de nacimiento', value: form.fechaNacimiento },
        { label: 'Estado civil', value: form.estadoCivil },
      ],
    },
    {
      title: 'Informacion escolar',
      items: [
        { label: 'Matricula', value: form.matricula },
        { label: 'Programa educativo', value: programaSeleccionado?.nombre },
      ],
    },
  ]

  const resumenFiles = [
    { label: 'Foto de perfil', value: fotoFile?.name ?? 'No adjunta' },
    { label: 'Curriculum Vitae', value: cvNombre ?? 'No adjunto' },
    { label: 'Documento avalatorio', value: docNombre ?? 'No adjunto' },
  ]
  return (
    <div className="h-screen w-full overflow-y-auto">
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
                      ? 'bg-[#009A4D] text-white'
                      : index === 1
                      ? 'bg-[#EA580C] text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {index === 0
                      ? <CheckCircle2 size={20} />
                      : <span className="text-sm font-bold">{index + 1}</span>
                    }
                  </div>
                  <span className={`text-xs text-center w-24 leading-tight ${
                    index === 0
                      ? 'text-[#009A4D] font-semibold'
                      : index === 1
                      ? 'text-[#EA580C] font-semibold'
                      : 'text-gray-400'
                  }`}>
                    {paso}
                  </span>
                </div>
                {index < pasos.length - 1 && (
                  <div className={`w-16 h-1 rounded mb-5 ${
                    index === 0
                      ? 'bg-gradient-to-r from-[#009A4D] to-[#EA580C]'
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
              <span className="bg-[#009A4D] text-white text-sm font-semibold px-3 py-1 rounded-full">
                Paso 2 de 4
              </span>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            {/* Seccion informacion personal */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#009A4D] rounded-lg flex items-center justify-center">
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
                    maxLength={SECURITY_LIMITS.name}
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
                    maxLength={SECURITY_LIMITS.name}
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
                  maxLength={SECURITY_LIMITS.address}
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
                  maxLength={SECURITY_LIMITS.email}
                  className="flex-1 text-sm outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm text-gray-600">Contrasena</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  maxLength={SECURITY_LIMITS.passwordMax}
                  className="flex-1 text-sm outline-none bg-transparent"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Seccion informacion escolar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#009A4D] rounded-lg flex items-center justify-center">
                <GraduationCap size={16} color="white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Información Escolar</p>
                <p className="text-gray-400 text-xs">Datos escolares necesarios para el registro</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Matricula</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white gap-2">
                  <Hash size={16} className="text-gray-400" />
                  <input
                    name="matricula"
                    value={form.matricula}
                    onChange={handleChange}
                    maxLength={SECURITY_LIMITS.shortText}
                    className="flex-1 text-sm outline-none bg-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Programa educativo del que proviene</label>
                <select
                  name="programaEducativoId"
                  value={form.programaEducativoId}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                  disabled={isLoadingProgramas || programas.length === 0}
                  required
                >
                  <option value="">
                    {isLoadingProgramas ? 'Cargando programas...' : 'Seleccione su programa'}
                  </option>
                  {programas.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                {programasError && (
                  <p className="text-xs text-red-500">{programasError}</p>
                )}
              </div>
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
                className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border-4 border-[#009A4D] hover:border-[#10B981] transition-colors"
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
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#10B981] transition-colors"
              >
                <div className="w-12 h-12 bg-[#009A4D] rounded-xl flex items-center justify-center">
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
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#10B981] transition-colors"
              >
                <div className="w-12 h-12 bg-[#009A4D] rounded-xl flex items-center justify-center">
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
              disabled={isSubmitting || isLoadingProgramas}
              className="bg-[#009A4D] hover:bg-[#10B981] text-white font-bold py-3 rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            >
              Revisar registro
            </button>

            </div>
          </form>
          {isReviewOpen && (
            <RegistroResumenDialog
              title={`Revisa el registro de ${estatusAcademico.toLowerCase()}`}
              description="Confirma que la informacion y los archivos sean correctos antes de enviarlos a validacion."
              sections={resumenSections}
              files={resumenFiles}
              successMessage={successMsg}
              errorMessage={errorMsg}
              isSubmitting={isSubmitting}
              onEdit={() => {
                setIsReviewOpen(false)
                setSuccessMsg(null)
              }}
              onConfirm={handleConfirmSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
