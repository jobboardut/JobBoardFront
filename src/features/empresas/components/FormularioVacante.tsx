import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { AppButton } from '@/shared/components/AppButton'
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

const modalidades = ['Presencial', 'Remota', 'Hibrida']

const EMPTY_VACANTE_FORM: CreateVacanteRequest = {
  titulo: '',
  descripcion: '',
  requisitos: '',
  sueldoAprox: 0,
  modalidad: '',
}

const VACANTE_FIELD_LIMITS = {
  titulo: SECURITY_LIMITS.shortText,
  descripcion: SECURITY_LIMITS.vacancyText,
  requisitos: SECURITY_LIMITS.vacancyText,
} as const

const getVacanteFieldLimit = (name: string): number =>
  VACANTE_FIELD_LIMITS[name as keyof typeof VACANTE_FIELD_LIMITS] ?? SECURITY_LIMITS.shortText

const toVacanteForm = (vacante?: Vacante): CreateVacanteRequest => ({
  titulo: vacante?.titulo ?? '',
  descripcion: vacante?.descripcion ?? '',
  requisitos: vacante?.requisitos ?? '',
  sueldoAprox: vacante?.sueldoAprox ?? 0,
  modalidad: vacante?.modalidad ?? '',
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
    values: Partial<CreateVacanteRequest>
  }>({ key: formKey, values: {} })

  const draftValues = draftState.key === formKey ? draftState.values : {}
  const form = { ...baseForm, ...draftValues }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const nextValue = name === 'sueldoAprox'
      ? Math.min(Number(value), SECURITY_LIMITS.moneyMax)
      : limitText(value, getVacanteFieldLimit(name))

    setDraftState(prev => ({
      key: formKey,
      values: {
        ...(prev.key === formKey ? prev.values : {}),
        [name]: nextValue,
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

    const validationError =
      validateRequiredText(form.titulo, 'Titulo del puesto', SECURITY_LIMITS.shortText) ??
      validateRequiredText(form.descripcion, 'Descripcion del puesto', SECURITY_LIMITS.vacancyText) ??
      validateRequiredText(form.requisitos, 'Requisitos', SECURITY_LIMITS.vacancyText)

    if (validationError) {
      toast.warning('Revisa los datos', validationError)
      return
    }

    if (!form.sueldoAprox || form.sueldoAprox < 0 || form.sueldoAprox > SECURITY_LIMITS.moneyMax) {
      toast.warning('Sueldo no valido', `El sueldo debe estar entre 0 y ${SECURITY_LIMITS.moneyMax.toLocaleString('es-MX')} MXN.`)
      return
    }

    crearVacante(form, {
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
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-400 p-7 text-white shadow-lg">
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

              <FormControl label="Sueldo aproximado (MXN)">
                <input
                  name="sueldoAprox"
                  type="number"
                  value={form.sueldoAprox}
                  onChange={handleChange}
                  placeholder="Ej: 15000"
                  min={0}
                  max={SECURITY_LIMITS.moneyMax}
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
            <h2 className="text-lg font-bold text-gray-800 mb-4">Requisitos</h2>
            <textarea
              name="requisitos"
              value={form.requisitos}
              onChange={handleChange}
              placeholder="Lista los requisitos del puesto..."
              rows={8}
              maxLength={SECURITY_LIMITS.vacancyText}
              required
              className={`${FORM_FIELD_CLASS} resize-none`}
            />
            <p className="mt-2 text-xs text-slate-500">{getLengthHelp(SECURITY_LIMITS.vacancyText)}</p>
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
