import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { AppButton } from '@/shared/components/AppButton'
import { BulletListInput } from '@/shared/components/BulletListInput'
import { FormControl, FORM_FIELD_CLASS } from '@/shared/components/FormControl'
import { LoadingState } from '@/shared/components/StateFeedback'
import { useAppToast } from '@/shared/components/appToastContext'
import {
  getLengthHelp,
  limitText,
  SECURITY_LIMITS,
  validateRequiredText,
} from '@/shared/security/inputRules'
import { useCrearVacante, useVacante } from '../hooks/useEmpresa'
import type { CreateVacanteRequest, Vacante } from '../types/empresa.types'

// El backend valida el valor exacto: acepta "Hibrido", no "Hibrida".
const modalidades = ['Presencial', 'Remota', 'Hibrido']

const MAX_LUGARES = 999

// Los numericos se manejan como texto mientras se escribe para poder borrarlos
// por completo; se convierten a numero al enviar.
type VacanteForm = Omit<CreateVacanteRequest, 'sueldoAprox' | 'lugares' | 'competencias'> & {
  sueldoAprox: string
  lugares: string
}

const EMPTY_VACANTE_FORM: VacanteForm = {
  titulo: '',
  descripcion: '',
  requisitos: '',
  sueldoAprox: '',
  modalidad: '',
  lugares: '1',
  ubicacion: '',
  responsabilidades: '',
}

const VACANTE_FIELD_LIMITS = {
  titulo: SECURITY_LIMITS.shortText,
  descripcion: SECURITY_LIMITS.vacancyText,
  requisitos: SECURITY_LIMITS.vacancyText,
  responsabilidades: SECURITY_LIMITS.vacancyText,
  ubicacion: SECURITY_LIMITS.address,
} as const

const getVacanteFieldLimit = (name: string): number =>
  VACANTE_FIELD_LIMITS[name as keyof typeof VACANTE_FIELD_LIMITS] ?? SECURITY_LIMITS.shortText

// El editor de viñetas conserva lineas vacias mientras se escribe.
const limpiarViñetas = (valor: string): string =>
  valor
    .split('\n')
    .map((linea) => linea.trim())
    .filter(Boolean)
    .join('\n')

// Deja solo digitos y respeta el campo vacio (para poder borrar y reescribir).
const limitDigits = (value: string, max: number): string => {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''

  return String(Math.min(Number(digits), max))
}

const toVacanteForm = (vacante?: Vacante): VacanteForm => ({
  titulo: vacante?.titulo ?? '',
  descripcion: vacante?.descripcion ?? '',
  requisitos: vacante?.requisitos ?? '',
  sueldoAprox: vacante?.sueldoAprox ? String(vacante.sueldoAprox) : '',
  modalidad: vacante?.modalidad ?? '',
  lugares: vacante?.lugares ? String(vacante.lugares) : '1',
  ubicacion: vacante?.ubicacion ?? '',
  responsabilidades: vacante?.responsabilidades ?? '',
})

interface FormularioVacanteProps {
  modo?: 'crear' | 'editar'
}

export const FormularioVacante = ({ modo = 'crear' }: FormularioVacanteProps) => {
  const navigate = useNavigate()
  const toast = useAppToast()
  const { id } = useParams()
  const publicacionId = Number(id)
  const isEditMode = modo === 'editar'
  const { mutate: crearVacante, isPending } = useCrearVacante()
  const { data: vacante, isLoading: isLoadingVacante } = useVacante(isEditMode ? publicacionId : 0)
  const formKey = isEditMode ? publicacionId : 0

  const baseForm = useMemo(
    () => isEditMode ? toVacanteForm(vacante) : EMPTY_VACANTE_FORM,
    [isEditMode, vacante]
  )
  const [draftState, setDraftState] = useState<{
    key: number
    values: Partial<VacanteForm>
  }>({ key: formKey, values: {} })

  const draftValues = draftState.key === formKey ? draftState.values : {}
  const form = { ...baseForm, ...draftValues }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    // Los numericos aceptan vacio mientras se edita; el minimo se valida al enviar.
    const nextValue = name === 'sueldoAprox'
      ? limitDigits(value, SECURITY_LIMITS.moneyMax)
      : name === 'lugares'
        ? limitDigits(value, MAX_LUGARES)
        : limitText(value, getVacanteFieldLimit(name))

    setDraftState(prev => ({
      key: formKey,
      values: {
        ...(prev.key === formKey ? prev.values : {}),
        [name]: nextValue,
      },
    }))
  }

  // Para campos que no emiten un evento de input (editor de viñetas).
  const handleFieldChange = (name: keyof VacanteForm, value: string) => {
    setDraftState(prev => ({
      key: formKey,
      values: {
        ...(prev.key === formKey ? prev.values : {}),
        [name]: limitText(value, getVacanteFieldLimit(name)),
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode) {
      toast.info(
        'Edicion no disponible',
        'El backend actual no incluye un endpoint para editar los datos completos de la vacante.'
      )
      return
    }

    // Las viñetas vacias no deben viajar al backend ni contar como contenido.
    const requisitos = limpiarViñetas(form.requisitos)
    const responsabilidades = limpiarViñetas(form.responsabilidades)

    const validationError =
      validateRequiredText(form.titulo, 'Titulo del puesto', SECURITY_LIMITS.shortText) ??
      validateRequiredText(form.ubicacion, 'Ubicacion', SECURITY_LIMITS.address) ??
      validateRequiredText(form.modalidad, 'Modalidad', SECURITY_LIMITS.shortText) ??
      validateRequiredText(form.descripcion, 'Descripcion del puesto', SECURITY_LIMITS.vacancyText) ??
      validateRequiredText(requisitos, 'Requisitos', SECURITY_LIMITS.vacancyText) ??
      validateRequiredText(responsabilidades, 'Responsabilidades', SECURITY_LIMITS.vacancyText)

    if (validationError) {
      toast.warning('Revisa los datos', validationError)
      return
    }

    const sueldoAprox = Number(form.sueldoAprox)
    const lugares = Number(form.lugares)

    if (!form.sueldoAprox || !Number.isFinite(sueldoAprox) || sueldoAprox <= 0 || sueldoAprox > SECURITY_LIMITS.moneyMax) {
      toast.warning('Sueldo no valido', `El sueldo debe estar entre 1 y ${SECURITY_LIMITS.moneyMax.toLocaleString('es-MX')} MXN.`)
      return
    }

    if (!form.lugares || !Number.isFinite(lugares) || lugares < 1 || lugares > MAX_LUGARES) {
      toast.warning('Lugares no validos', `El numero de lugares debe estar entre 1 y ${MAX_LUGARES}.`)
      return
    }

    const payload: CreateVacanteRequest = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      requisitos,
      modalidad: form.modalidad,
      ubicacion: form.ubicacion,
      responsabilidades,
      sueldoAprox,
      lugares,
    }

    crearVacante(payload, {
      onSuccess: () => {
        toast.success('Vacante publicada', 'La publicacion se creo correctamente.')
        navigate(ROUTES.EMPRESA_PUBLICACIONES)
      },
      onError: () => {
        toast.error('No se pudo publicar', 'Revisa los datos e intenta de nuevo.')
      },
    })
  }

  if (isEditMode && isLoadingVacante) return (
    <LoadingState title="Cargando vacante" message="Estamos preparando la informacion para editar." />
  )

  return (
    <div>
      <div className="mb-8 rounded-3xl brand-banner brand-banner--empresa p-7 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 border-l-2 border-white/60 pl-3 text-xs font-semibold uppercase tracking-[0.12em]">
              <BriefcaseBusiness size={14} />
              Vacantes
            </div>
            <h1 className="mt-3 text-2xl font-semibold">
              {isEditMode ? 'Editar vacante' : 'Publicar nueva vacante'}
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Comparte los detalles clave para atraer al talento correcto.
            </p>
          </div>
          <AppButton
            onClick={() => navigate(ROUTES.EMPRESA_PUBLICACIONES)}
            icon={<ArrowLeft size={16} />}
            variant="ghost"
            className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            Volver a publicaciones
          </AppButton>
        </div>
      </div>

      {isEditMode && (
        <div className="mb-6 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-orange-700">
          La edicion de datos completos aun no esta disponible para esta vacante.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Informacion general</h2>
            <div className="flex flex-col gap-4">

              <FormControl label="Titulo del puesto" help={getLengthHelp(SECURITY_LIMITS.shortText)}>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Desarrollador frontend"
                  maxLength={SECURITY_LIMITS.shortText}
                  required
                  className={FORM_FIELD_CLASS}
                />
              </FormControl>

              <FormControl label="Modalidad">
                <select
                  name="modalidad"
                  value={form.modalidad}
                  onChange={handleChange}
                  required
                  className={FORM_FIELD_CLASS}
                >
                  <option value="">Seleccione</option>
                  {modalidades.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </FormControl>

              <FormControl label="Ubicacion" help={getLengthHelp(SECURITY_LIMITS.address, 'Ciudad y estado donde se realizara el trabajo.')}>
                <input
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  placeholder="Ej: Tecamachalco, Puebla"
                  maxLength={SECURITY_LIMITS.address}
                  required
                  className={FORM_FIELD_CLASS}
                />
              </FormControl>

              {/* inputMode numerico con type=text para poder borrar el campo completo. */}
              <FormControl label="Sueldo aproximado (MXN)" help={`Entre 1 y ${SECURITY_LIMITS.moneyMax.toLocaleString('es-MX')} MXN.`}>
                <input
                  name="sueldoAprox"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={form.sueldoAprox}
                  onChange={handleChange}
                  placeholder="Ej: 15000"
                  required
                  className={FORM_FIELD_CLASS}
                />
              </FormControl>

              <FormControl label="Numero de lugares" help={`Cuantas personas se contrataran. Entre 1 y ${MAX_LUGARES}.`}>
                <input
                  name="lugares"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={form.lugares}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  required
                  className={FORM_FIELD_CLASS}
                />
              </FormControl>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Descripcion del puesto</h2>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe el puesto..."
              rows={5}
              maxLength={SECURITY_LIMITS.vacancyText}
              required
              className={`${FORM_FIELD_CLASS} resize-none`}
            />
            <p className="mt-2 text-xs text-slate-500">{getLengthHelp(SECURITY_LIMITS.vacancyText)}</p>
          </div>

        </div>

        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Requisitos</h2>
            <p className="mb-3 text-xs text-slate-500">
              Un requisito por viñeta. Asi los ve el candidato en la vacante.
            </p>
            <BulletListInput
              value={form.requisitos}
              onChange={(value) => handleFieldChange('requisitos', value)}
              placeholder="Ej: Licenciatura en Administracion o afin"
              addLabel="Agregar requisito"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Responsabilidades</h2>
            <p className="mb-3 text-xs text-slate-500">
              Una responsabilidad por viñeta.
            </p>
            <BulletListInput
              value={form.responsabilidades}
              onChange={(value) => handleFieldChange('responsabilidades', value)}
              placeholder="Ej: Elaborar y controlar presupuestos"
              addLabel="Agregar responsabilidad"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AppButton
              onClick={() => navigate(ROUTES.EMPRESA_PUBLICACIONES)}
              variant="secondary"
              fullWidth
            >
              Cancelar
            </AppButton>
            <AppButton
              type="submit"
              disabled={isEditMode}
              isLoading={isPending}
              fullWidth
            >
              {isEditMode ? 'Edicion no disponible' : 'Publicar vacante'}
            </AppButton>
          </div>

        </div>
      </form>
    </div>
  )
}

export default FormularioVacante
