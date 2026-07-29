import { useRef, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldAlert,
  Upload,
  UserCircle,
} from 'lucide-react'
import campusImg from '@/assets/images/campus.png'
import { useAppToast } from '@/shared/components/appToastContext'
import { FILE_LIMITS, validateFile } from '@/shared/security/inputRules'
import { compressImage } from '@/shared/utils/imageCompression'
import { estudianteService } from '@/features/estudiantes/services/estudiante.service'
import { useLogout } from '../hooks/useAuth'
import {
  getLastObservation,
  getUserId,
  getValidationState,
  normalizeValidationState,
  updateValidationState,
  type ValidationState,
} from '../services/session'
import './auth-flow.css'

type CampoArchivo = 'fotoPerfil' | 'cv' | 'docProbatorio'

const CAMPOS: Array<{
  key: CampoArchivo
  label: string
  ayuda: string
  accept: string
  soloImagen: boolean
}> = [
  {
    key: 'fotoPerfil',
    label: 'Foto de perfil',
    ayuda: 'Solo PNG o JPG. Maximo 2 MB.',
    accept: 'image/png,image/jpeg',
    soloImagen: true,
  },
  {
    key: 'cv',
    label: 'Curriculum Vitae',
    ayuda: 'PDF, PNG o JPG. Maximo 5 MB.',
    accept: 'application/pdf,image/png,image/jpeg',
    soloImagen: false,
  },
  {
    key: 'docProbatorio',
    label: 'Documento avalatorio',
    ayuda: 'PDF, PNG o JPG. Maximo 5 MB.',
    accept: 'application/pdf,image/png,image/jpeg',
    soloImagen: false,
  },
]

// Copys por estado: solo "devuelto" permite corregir y reenviar.
const COPY: Record<Exclude<ValidationState, 'validado'>, {
  titulo: string
  mensaje: string
  Icon: typeof Clock3
  tone: string
  puedeReenviar: boolean
}> = {
  pendiente: {
    titulo: 'Tu registro esta en revision',
    mensaje:
      'Administracion esta validando tus documentos. Te avisaremos por correo en cuanto tu perfil sea aprobado.',
    Icon: Clock3,
    tone: 'text-orange-600 bg-orange-50 border-orange-200',
    puedeReenviar: false,
  },
  devuelto: {
    titulo: 'Necesitamos que corrijas tu registro',
    mensaje:
      'Administracion reviso tu perfil y encontro algo que debes corregir. Sube de nuevo los documentos indicados y tu registro volvera a revision.',
    Icon: AlertTriangle,
    tone: 'text-amber-700 bg-amber-50 border-amber-200',
    puedeReenviar: true,
  },
  rechazado: {
    titulo: 'Tu registro fue rechazado',
    mensaje:
      'Tu perfil no fue aprobado. Puedes corregir tus documentos y enviarlos de nuevo para una segunda revision.',
    Icon: ShieldAlert,
    tone: 'text-red-700 bg-red-50 border-red-200',
    puedeReenviar: true,
  },
  inhabilitado: {
    titulo: 'Tu cuenta esta inhabilitada',
    mensaje:
      'Administracion desactivo el acceso a esta cuenta. Contacta a la coordinacion de la bolsa de trabajo para mas informacion.',
    Icon: ShieldAlert,
    tone: 'text-slate-700 bg-slate-100 border-slate-200',
    puedeReenviar: false,
  },
}

/**
 * Puerta de acceso para perfiles sin validar.
 * Bloquea la plataforma y, si el registro fue devuelto o rechazado,
 * permite reenviar los documentos con PATCH /estudiante/{id}/archivos.
 */
export const CuentaEnRevision = () => {
  const estado = getValidationState()
  const observacion = getLastObservation()
  const userId = getUserId()
  const toast = useAppToast()
  const { logout, isLoggingOut } = useLogout()

  const [archivos, setArchivos] = useState<Record<CampoArchivo, File | null>>({
    fotoPerfil: null,
    cv: null,
    docProbatorio: null,
  })
  const [isSending, setIsSending] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const inputsRef = useRef<Record<string, HTMLInputElement | null>>({})

  // Permite refrescar el estatus sin cerrar sesion: si administracion ya aprobo
  // el perfil, la pantalla se libera al recargar.
  const revisarEstatus = async () => {
    setIsChecking(true)

    try {
      const perfil = await estudianteService.getPerfil(userId)
      const nuevoEstado = normalizeValidationState(perfil.validationStatus)
      updateValidationState(perfil.validationStatus)

      if (nuevoEstado === 'validado') {
        toast.success('Perfil aprobado', 'Ya puedes usar la plataforma.')
        window.location.reload()
        return
      }

      toast.info('Sin cambios', 'Tu registro sigue en revision por administracion.')
    } catch {
      toast.error('No se pudo consultar', 'Intenta de nuevo en unos segundos.')
    } finally {
      setIsChecking(false)
    }
  }

  if (estado === 'validado') return null

  const copy = COPY[estado]
  const algunArchivo = Object.values(archivos).some(Boolean)

  const handleArchivo = async (campo: CampoArchivo, input: HTMLInputElement) => {
    const original = input.files?.[0]
    if (!original) return

    const definicion = CAMPOS.find((item) => item.key === campo)!
    const file = await compressImage(original)
    const error = validateFile(file, {
      allowedTypes: definicion.soloImagen
        ? ['image/png', 'image/jpeg']
        : ['application/pdf', 'image/png', 'image/jpeg'],
      label: definicion.label,
      maxBytes: definicion.soloImagen ? FILE_LIMITS.imageBytes : FILE_LIMITS.documentBytes,
    })

    if (error) {
      toast.error('Archivo no valido', error)
      input.value = ''
      return
    }

    setArchivos((current) => ({ ...current, [campo]: file }))
  }

  const quitarArchivo = (campo: CampoArchivo) => {
    setArchivos((current) => ({ ...current, [campo]: null }))
    const input = inputsRef.current[campo]
    if (input) input.value = ''
  }

  const handleEnviar = async () => {
    if (!algunArchivo) {
      toast.warning('Sin archivos', 'Selecciona al menos un documento para reenviar.')
      return
    }

    setIsSending(true)

    try {
      await estudianteService.actualizarArchivos(userId, archivos)
      setEnviado(true)
      toast.success('Documentos enviados', 'Tu registro volvio a la fila de revision.')
    } catch {
      toast.error('No se pudieron enviar', 'Intenta de nuevo en unos segundos.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${campusImg})` }}>
      <div className="auth-page__shade">
        <section className="auth-panel w-full max-w-2xl p-6 sm:p-8">
          <div className={`flex items-start gap-4 rounded-2xl border p-4 ${copy.tone}`}>
            <copy.Icon size={26} className="mt-0.5 shrink-0" />
            <div>
              <h1 className="text-lg font-black sm:text-xl">{copy.titulo}</h1>
              <p className="mt-1 text-sm leading-6">{copy.mensaje}</p>
            </div>
          </div>

          {observacion ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                Observaciones de administracion
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{observacion}</p>
            </div>
          ) : null}

          {copy.puedeReenviar && !enviado ? (
            <>
              <h2 className="mt-7 text-base font-black text-slate-900">Reenviar documentos</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Sube solo los archivos que necesitas corregir. Los que no adjuntes se quedan como estan.
              </p>

              <div className="mt-4 grid gap-3">
                {CAMPOS.map((campo) => {
                  const archivo = archivos[campo.key]
                  const Icono = campo.key === 'fotoPerfil' ? UserCircle : FileText

                  return (
                    <div
                      key={campo.key}
                      className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3 transition ${
                        archivo ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                          archivo ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {archivo ? <CheckCircle2 size={20} /> : <Icono size={20} />}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">{campo.label}</p>
                        <p className="truncate text-xs text-slate-500">
                          {archivo ? archivo.name : campo.ayuda}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {archivo ? (
                          <button
                            type="button"
                            onClick={() => quitarArchivo(campo.key)}
                            className="rounded-lg px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50"
                          >
                            Quitar
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => inputsRef.current[campo.key]?.click()}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                        >
                          <Upload size={14} />
                          {archivo ? 'Cambiar' : 'Elegir'}
                        </button>
                      </div>

                      <input
                        ref={(element) => {
                          inputsRef.current[campo.key] = element
                        }}
                        type="file"
                        accept={campo.accept}
                        className="hidden"
                        onChange={(event) => void handleArchivo(campo.key, event.target)}
                      />
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => void handleEnviar()}
                disabled={!algunArchivo || isSending}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#009A4D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#10B981] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSending ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}
                {isSending ? 'Enviando...' : 'Enviar a revision'}
              </button>
            </>
          ) : null}

          {enviado ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-black text-emerald-800">Documentos enviados</p>
                <p className="mt-1 text-sm leading-6 text-emerald-700">
                  Administracion revisara tu registro de nuevo. Te avisaremos por correo cuando sea aprobado.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-800 disabled:opacity-60"
            >
              <LogOut size={16} />
              {isLoggingOut ? 'Saliendo...' : 'Cerrar sesion'}
            </button>

            <button
              type="button"
              onClick={() => void revisarEstatus()}
              disabled={isChecking}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-60"
            >
              {isChecking ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {isChecking ? 'Consultando...' : 'Revisar estatus'}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CuentaEnRevision
