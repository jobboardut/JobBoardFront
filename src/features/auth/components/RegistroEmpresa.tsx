import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  FileBadge2,
  FileCheck2,
  Globe,
  Mail,
  ShieldCheck,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react'
import campusImg from '@/assets/images/campus.png'
import { AppButton } from '@/shared/components/AppButton'
import { useAppToast } from '@/shared/components/appToastContext'
import { FormControl, FORM_FIELD_CLASS } from '@/shared/components/FormControl'
import { useFormDraft } from '@/shared/hooks/useFormDraft'
import { compressImage } from '@/shared/utils/imageCompression'
import { defaultEmpresaProfile, markEmpresaProfileIncomplete, saveEmpresaProfileDraft } from '@/features/empresas/services/empresaProfile.storage'
import { catalogService } from '@/services/catalog.service'
import { ROUTES } from '@/router/routes'
import {
  FILE_LIMITS,
  getLengthHelp,
  limitText,
  SECURITY_LIMITS,
  validateEmailField,
  validateFile,
  validateOptionalEmailField,
  validateOptionalPhoneField,
  validateOptionalText,
  validateOptionalUrlField,
  validatePasswordField,
  validateRequiredText,
} from '@/shared/security/inputRules'
import { authService } from '../services/auth.service'
import { getRegistroErrorMessage } from '../utils/registroErrors'
import { RegistroResumenDialog, type RegistroResumenSection } from './RegistroResumenDialog'
import './auth-flow.css'

const pasos = [
  'Tipo de cuenta',
  'Registro de datos',
  'Confirmacion',
  'Validacion de perfil',
]

type DocumentoKey = 'situacionFiscal' | 'docExistencia' | 'repDocCargo' | 'repFotoIne'

const EMPRESA_FIELD_LIMITS = {
  password: SECURITY_LIMITS.passwordMax,
  nombreEmpresa: SECURITY_LIMITS.companyName,
  telefonoEmpresa: SECURITY_LIMITS.phone,
  direccion: SECURITY_LIMITS.address,
  correoEmpresa: SECURITY_LIMITS.email,
  sectorId: 12,
  sitioWeb: SECURITY_LIMITS.url,
  descripcion: SECURITY_LIMITS.longText,
  nombreContacto: SECURITY_LIMITS.name,
  apellidosContacto: SECURITY_LIMITS.name,
  puesto: SECURITY_LIMITS.shortText,
  telefonoContacto: SECURITY_LIMITS.phone,
  correoContacto: SECURITY_LIMITS.email,
} as const

const getEmpresaFieldLimit = (name: string): number =>
  EMPRESA_FIELD_LIMITS[name as keyof typeof EMPRESA_FIELD_LIMITS] ?? SECURITY_LIMITS.shortText

const DOCUMENTOS: Array<{
  key: DocumentoKey
  label: string
  description: string
  icon: LucideIcon
  required: boolean
  // El backend valida por campo: la foto del INE solo acepta imagen; el resto tambien PDF.
  allowsPdf: boolean
}> = [
  {
    key: 'situacionFiscal',
    label: 'Situacion fiscal',
    description: 'PDF o imagen de la constancia de situacion fiscal.',
    icon: FileCheck2,
    required: true,
    allowsPdf: true,
  },
  {
    key: 'docExistencia',
    label: 'Existencia de empresa',
    description: 'Acta, alta o documento legal de la empresa (PDF o imagen).',
    icon: Building2,
    required: true,
    allowsPdf: true,
  },
  {
    key: 'repDocCargo',
    label: 'Cargo del representante',
    description: 'Documento que compruebe el cargo o autorizacion (PDF o imagen).',
    icon: FileBadge2,
    required: true,
    allowsPdf: true,
  },
  {
    key: 'repFotoIne',
    label: 'INE del representante',
    description: 'Foto de la identificacion oficial. Solo PNG o JPG (no PDF).',
    icon: ShieldCheck,
    required: true,
    allowsPdf: false,
  },
]

const documentoAllowedTypes = (allowsPdf: boolean): string[] =>
  allowsPdf ? ['application/pdf', 'image/png', 'image/jpeg'] : ['image/png', 'image/jpeg']

const documentoAccept = (allowsPdf: boolean): string =>
  allowsPdf ? 'application/pdf,image/png,image/jpeg' : 'image/png,image/jpeg'

type SectionHeadingProps = {
  icon: LucideIcon
  title: string
  description: string
}

const SectionHeading = ({ icon: Icon, title, description }: SectionHeadingProps) => (
  <div className="mb-5 flex items-start gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
      <Icon size={20} />
    </span>
    <div>
      <h2 className="text-base font-black text-slate-900">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  </div>
)

type DocumentUploadCardProps = {
  item: (typeof DOCUMENTOS)[number]
  file: File | null
  onChange: (key: DocumentoKey, file: File | null) => void
}

const DocumentUploadCard = ({ item, file, onChange }: DocumentUploadCardProps) => {
  const Icon = item.icon

  return (
    <label className={`auth-file-card relative block cursor-pointer ${file ? 'is-ready' : ''}`}>
      <input
        type="file"
        accept={documentoAccept(item.allowsPdf)}
        className="hidden"
        onChange={(event) => { void onChange(item.key, event.target.files?.[0] ?? null) }}
      />
      <span className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
          {file ? <CheckCircle2 size={20} className="text-emerald-600" /> : <Icon size={20} />}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-black text-slate-900">
            {item.label}
            <span className="text-orange-500"> *</span>
          </span>
          <span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span>
          <span className="mt-2 block truncate text-xs font-bold text-emerald-700">
            {file ? file.name : `Seleccionar archivo (${item.allowsPdf ? 'PDF, PNG o JPG' : 'PNG o JPG'})`}
          </span>
        </span>
      </span>
      {file ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void onChange(item.key, null)
          }}
          aria-label={`Quitar ${item.label}`}
          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-slate-400 shadow ring-1 ring-slate-200 transition-colors hover:text-red-500"
        >
          <X size={14} />
        </button>
      ) : null}
    </label>
  )
}

export const RegistroEmpresa = () => {
  const navigate = useNavigate()
  const toast = useAppToast()
  const logoRef = useRef<HTMLInputElement>(null)

  const { restoreDraft, saveDraft, clearDraft } = useFormDraft<typeof initialForm>({
    key: 'registro-empresa',
    exclude: ['password'],
  })

  const initialForm = {
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
  }

  const [form, setForm] = useState(() => {
    const draft = restoreDraft()
    if (draft) return { ...initialForm, ...draft, password: '' }
    return initialForm
  })
  const [draftRestored, setDraftRestored] = useState(() => Boolean(restoreDraft()))

  const [documentos, setDocumentos] = useState<Record<DocumentoKey, File | null>>({
    situacionFiscal: null,
    docExistencia: null,
    repDocCargo: null,
    repFotoIne: null,
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [sectores, setSectores] = useState<{ id: string; nombre: string }[]>([])
  const [isLoadingSectores, setIsLoadingSectores] = useState(true)
  const [sectoresError, setSectoresError] = useState<string | null>(null)
  const sectorSeleccionado = sectores.find((sector) => sector.id === form.sectorId)

  useEffect(() => {
    let isMounted = true

    catalogService.getSectores()
      .then((items) => {
        if (!isMounted) return
        setSectores(items.map((item) => ({ id: String(item.id), nombre: item.nombre })))
        setSectoresError(items.length ? null : 'No hay sectores disponibles.')
      })
      .catch(() => {
        if (!isMounted) return
        setSectores([])
        setSectoresError('No se pudieron cargar los sectores.')
      })
      .finally(() => {
        if (isMounted) setIsLoadingSectores(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
    }
  }, [logoPreview])

  useEffect(() => {
    if (draftRestored) {
      toast.info('Borrador restaurado', 'Se recuperaron los datos que habias capturado antes.')
      setDraftRestored(false)
    }
  }, [draftRestored, toast])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => {
      const next = {
        ...prev,
        [event.target.name]: limitText(event.target.value, getEmpresaFieldLimit(event.target.name)),
      }
      saveDraft(next)
      return next
    })
    setErrorMsg(null)
    setSuccessMsg(null)
  }

  const handleLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const original = input.files?.[0]
    if (!original) return

    const file = await compressImage(original)
    const fileError = validateFile(file, {
      allowedTypes: ['image/png', 'image/jpeg'],
      label: 'El logotipo',
      maxBytes: FILE_LIMITS.imageBytes,
    })

    if (fileError) {
      setErrorMsg(fileError)
      input.value = ''
      return
    }

    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (logoRef.current) logoRef.current.value = ''
  }

  const handleDocumento = async (key: DocumentoKey, rawFile: File | null) => {
    if (!rawFile) {
      setDocumentos((prev) => ({ ...prev, [key]: null }))
      setErrorMsg(null)
      return
    }

    const documento = DOCUMENTOS.find((item) => item.key === key)
    const allowsPdf = documento?.allowsPdf ?? true

    const file = await compressImage(rawFile)
    const fileError = validateFile(file, {
      allowedTypes: documentoAllowedTypes(allowsPdf),
      label: documento ? `El campo "${documento.label}"` : 'El documento',
      maxBytes: FILE_LIMITS.documentBytes,
    })

    if (fileError) {
      setErrorMsg(fileError)
      return
    }

    setDocumentos((prev) => ({ ...prev, [key]: file }))
    setErrorMsg(null)
  }

  const validateDocuments = () => {
    const missing = [
      ...(logoFile ? [] : ['Logotipo']),
      ...DOCUMENTOS.filter((item) => item.required && !documentos[item.key]).map((item) => item.label),
    ]
    if (missing.length) {
      setErrorMsg(`Faltan archivos obligatorios: ${missing.join(', ')}.`)
      return false
    }

    // El logotipo solo puede ser imagen.
    if (logoFile) {
      const logoError = validateFile(logoFile, {
        allowedTypes: ['image/png', 'image/jpeg'],
        label: 'El logotipo',
        maxBytes: FILE_LIMITS.imageBytes,
      })
      if (logoError) {
        setErrorMsg(logoError)
        return false
      }
    }

    // Reverifica el tipo de cada documento por si quedo uno invalido cargado en memoria.
    for (const item of DOCUMENTOS) {
      const file = documentos[item.key]
      if (!file) continue
      const typeError = validateFile(file, {
        allowedTypes: documentoAllowedTypes(item.allowsPdf),
        label: `El campo "${item.label}"`,
        maxBytes: FILE_LIMITS.documentBytes,
      })
      if (typeError) {
        setErrorMsg(`${typeError} Vuelve a subir ese archivo.`)
        return false
      }
    }

    return true
  }

  const validateForm = () => {
    const validations = [
      validateEmailField(form.correoEmpresa, 'Correo de la empresa'),
      validatePasswordField(form.password),
      validateRequiredText(form.nombreEmpresa, 'Nombre de la empresa', SECURITY_LIMITS.companyName),
      validateRequiredText(form.sectorId, 'Sector', 12),
      validateOptionalPhoneField(form.telefonoEmpresa, 'Telefono de la empresa'),
      validateOptionalText(form.direccion, 'Direccion', SECURITY_LIMITS.address),
      validateOptionalUrlField(form.sitioWeb, 'Sitio web'),
      validateOptionalText(form.descripcion, 'Descripcion', SECURITY_LIMITS.longText),
      validateRequiredText(form.nombreContacto, 'Nombre del representante', SECURITY_LIMITS.name),
      validateRequiredText(form.apellidosContacto, 'Apellidos del representante', SECURITY_LIMITS.name),
      validateOptionalText(form.puesto, 'Puesto o cargo', SECURITY_LIMITS.shortText),
      validateOptionalPhoneField(form.telefonoContacto, 'Telefono del representante'),
      validateOptionalEmailField(form.correoContacto, 'Correo del representante'),
    ].filter(Boolean)

    if (validations.length > 0) {
      setErrorMsg(String(validations[0]))
      return false
    }

    return true
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!validateForm()) return
    if (!validateDocuments()) return

    if (!sectorSeleccionado) {
      setErrorMsg('Selecciona un sector valido.')
      return
    }

    setIsReviewOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!validateForm()) return
    if (!validateDocuments()) return

    if (!sectorSeleccionado) {
      setErrorMsg('Selecciona un sector valido.')
      setIsReviewOpen(false)
      return
    }

    setIsSubmitting(true)

    try {
      await authService.registroEmpresa({
        email: form.correoEmpresa,
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
        situacionFiscal: documentos.situacionFiscal,
        docExistencia: documentos.docExistencia,
        repDocCargo: documentos.repDocCargo,
        repFotoIne: documentos.repFotoIne,
      })

      clearDraft()
      saveEmpresaProfileDraft({
        nombre: form.nombreEmpresa || defaultEmpresaProfile.nombre,
        giro: sectorSeleccionado.nombre || defaultEmpresaProfile.giro,
        direccion: form.direccion || defaultEmpresaProfile.direccion,
        correo: form.correoEmpresa || defaultEmpresaProfile.correo,
        industria: sectorSeleccionado.nombre || defaultEmpresaProfile.industria,
      })
      markEmpresaProfileIncomplete()
      const message = 'Registro de empresa enviado correctamente. Te avisaremos por correo cuando sea validado.'
      setSuccessMsg(message)
      toast.success('Registro enviado', message)
      window.setTimeout(() => {
        navigate('/registro/confirmacion?tipo=empresa')
      }, 1200)
    } catch (error) {
      setIsReviewOpen(false)
      setErrorMsg(getRegistroErrorMessage(error, 'empresa'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const resumenSections: RegistroResumenSection[] = [
    {
      title: 'Datos de la empresa',
      items: [
        { label: 'Nombre', value: form.nombreEmpresa },
        { label: 'Sector', value: sectorSeleccionado?.nombre },
        { label: 'Correo de acceso', value: form.correoEmpresa },
        { label: 'Contraseña', value: form.password ? 'Configurada' : '' },
        { label: 'Telefono', value: form.telefonoEmpresa },
        { label: 'Direccion', value: form.direccion },
        { label: 'Sitio web', value: form.sitioWeb },
      ],
    },
    {
      title: 'Representante',
      items: [
        { label: 'Nombre', value: `${form.nombreContacto} ${form.apellidosContacto}`.trim() },
        { label: 'Puesto', value: form.puesto },
        { label: 'Telefono', value: form.telefonoContacto },
        { label: 'Correo', value: form.correoContacto },
      ],
    },
  ]

  const resumenFiles = [
    { label: 'Logotipo', value: logoFile?.name ?? 'No adjunto' },
    ...DOCUMENTOS.map((item) => ({
      label: item.label,
      value: documentos[item.key]?.name ?? 'No adjunto',
    })),
  ]

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${campusImg})` }}>
      <div className="auth-page__shade">
        <section className="auth-panel auth-panel--wide p-5 sm:p-7 lg:p-8" aria-labelledby="registro-empresa-title">
          <div className="mb-7 flex items-start justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.SELECCION_CUENTA)}
              className="auth-back-button"
              aria-label="Volver a seleccion de cuenta"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="auth-stepper flex-1">
              {pasos.map((paso, index) => (
                <div
                  key={paso}
                  className={`auth-step ${index === 0 ? 'is-complete' : index === 1 ? 'is-current' : ''}`}
                >
                  <span className="auth-step__dot">
                    {index === 0 ? <CheckCircle2 size={20} /> : index + 1}
                  </span>
                  <span className="auth-step__label">{paso}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <p className="auth-eyebrow">Registro empresarial</p>
              <h1 id="registro-empresa-title" className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
                Alta de empresa para validacion
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                Completa los datos fiscales, del representante y los documentos probatorios para que administracion pueda aprobar el perfil.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              <strong className="block text-emerald-900">Antes de enviar</strong>
              Ten a la mano el logotipo y los documentos de la empresa. Se envian junto con el registro para que administracion pueda validarlo.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1.32fr)_minmax(320px,0.68fr)]">
            <div className="grid gap-5">
              <section className="auth-section-card">
                <SectionHeading
                  icon={Globe}
                  title="Datos de la empresa"
                  description="Informacion de la empresa y datos con los que iniciara sesion en la plataforma."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormControl label="Nombre de la empresa" help={getLengthHelp(SECURITY_LIMITS.companyName)}>
                    <input
                      name="nombreEmpresa"
                      value={form.nombreEmpresa}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="Nombre comercial o razon social"
                      maxLength={SECURITY_LIMITS.companyName}
                      required
                    />
                  </FormControl>
                  <FormControl label="Sector" help="Selecciona el giro principal de la empresa.">
                    <select
                      name="sectorId"
                      value={form.sectorId}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      disabled={isLoadingSectores || sectores.length === 0}
                      required
                    >
                      <option value="">
                        {isLoadingSectores ? 'Cargando sectores...' : 'Seleccione una opcion'}
                      </option>
                      {sectores.map((sector) => (
                        <option key={sector.id} value={sector.id}>
                          {sector.nombre}
                        </option>
                      ))}
                    </select>
                    {sectoresError && (
                      <p className="text-xs font-semibold text-red-500">{sectoresError}</p>
                    )}
                  </FormControl>
                  <FormControl
                    label="Correo de la empresa (acceso)"
                    help="Con este correo la empresa iniciara sesion. Usa el formato correo@dominio.com."
                  >
                    <input
                      type="email"
                      name="correoEmpresa"
                      value={form.correoEmpresa}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="contacto@empresa.com"
                      maxLength={SECURITY_LIMITS.email}
                      required
                    />
                  </FormControl>
                  <FormControl label="Contraseña" help="Minimo 8 caracteres, con al menos una mayuscula, una minuscula y un numero.">
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="Crea una contraseña segura"
                      minLength={SECURITY_LIMITS.passwordMin}
                      maxLength={SECURITY_LIMITS.passwordMax}
                      required
                    />
                  </FormControl>
                  <FormControl label="Telefono de la empresa" help="Opcional. De 7 a 18 caracteres: numeros, espacios, +, - o parentesis.">
                    <input
                      name="telefonoEmpresa"
                      value={form.telefonoEmpresa}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="222 000 0000"
                      maxLength={SECURITY_LIMITS.phone}
                    />
                  </FormControl>
                  <FormControl label="Direccion" help={getLengthHelp(SECURITY_LIMITS.address, 'Opcional. Calle, numero y ciudad.')}>
                    <input
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="Calle, numero, ciudad"
                      maxLength={SECURITY_LIMITS.address}
                    />
                  </FormControl>
                  <FormControl label="Sitio web" help={getLengthHelp(SECURITY_LIMITS.url, 'Opcional. Debe iniciar con http:// o https://.')}>
                    <input
                      name="sitioWeb"
                      value={form.sitioWeb}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="https://empresa.com"
                      maxLength={SECURITY_LIMITS.url}
                    />
                  </FormControl>
                  <div className="md:col-span-2">
                    <FormControl label="Descripcion" help={getLengthHelp(SECURITY_LIMITS.longText, 'Opcional. Describe a que se dedica la empresa.')}>
                      <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        rows={4}
                        className={`${FORM_FIELD_CLASS} resize-none`}
                        placeholder="Describe brevemente la actividad de la empresa"
                        maxLength={SECURITY_LIMITS.longText}
                      />
                    </FormControl>
                  </div>
                </div>
              </section>

              <section className="auth-section-card">
                <SectionHeading
                  icon={Mail}
                  title="Representante o responsable"
                  description="Persona que administracion contactara para validar el registro."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormControl label="Nombre(s)" help={getLengthHelp(SECURITY_LIMITS.name)}>
                    <input
                      name="nombreContacto"
                      value={form.nombreContacto}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      maxLength={SECURITY_LIMITS.name}
                      required
                    />
                  </FormControl>
                  <FormControl label="Apellidos" help={getLengthHelp(SECURITY_LIMITS.name)}>
                    <input
                      name="apellidosContacto"
                      value={form.apellidosContacto}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      maxLength={SECURITY_LIMITS.name}
                      required
                    />
                  </FormControl>
                  <FormControl label="Puesto o cargo" help={getLengthHelp(SECURITY_LIMITS.shortText, 'Opcional.')}>
                    <input
                      name="puesto"
                      value={form.puesto}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="Representante legal, RH, direccion..."
                      maxLength={SECURITY_LIMITS.shortText}
                    />
                  </FormControl>
                  <FormControl label="Telefono" help="Opcional. De 7 a 18 caracteres: numeros, espacios, +, - o parentesis.">
                    <input
                      name="telefonoContacto"
                      value={form.telefonoContacto}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="222 000 0000"
                      maxLength={SECURITY_LIMITS.phone}
                    />
                  </FormControl>
                  <div className="md:col-span-2">
                    <FormControl label="Correo del representante" help={getLengthHelp(SECURITY_LIMITS.email, 'Opcional. Formato correo@dominio.com.')}>
                      <input
                        type="email"
                        name="correoContacto"
                        value={form.correoContacto}
                        onChange={handleChange}
                        className={FORM_FIELD_CLASS}
                        placeholder="representante@empresa.com"
                        maxLength={SECURITY_LIMITS.email}
                      />
                    </FormControl>
                  </div>
                </div>
              </section>
            </div>

            <aside className="grid content-start gap-5">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
                El logotipo y la foto del INE deben ser PNG o JPG. Los demas documentos aceptan PDF, PNG o JPG. Todos son obligatorios.
              </div>

              <section className="auth-section-card">
                <SectionHeading
                  icon={Camera}
                  title="Logotipo *"
                  description="Obligatorio. Ayuda a reconocer la empresa en la plataforma."
                />
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  className={`auth-spotlight grid w-full place-items-center rounded-2xl border border-dashed bg-slate-50 p-5 text-center transition hover:bg-white ${logoFile ? 'border-emerald-400' : 'border-slate-300 hover:border-emerald-300'}`}
                >
                  <span className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-slate-200 shadow-sm">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo de empresa" className="h-full w-full object-cover" />
                    ) : (
                      <Camera size={34} className="text-slate-400" />
                    )}
                    {logoFile ? (
                      <span className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-white shadow ring-1 ring-emerald-100">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-3 flex items-center gap-1.5 text-sm font-black">
                    {logoFile ? (
                      <><CheckCircle2 size={15} className="text-emerald-600" /><span className="text-emerald-700">Logotipo cargado</span></>
                    ) : (
                      <span className="text-slate-900">Subir logotipo</span>
                    )}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">Solo PNG o JPG. Maximo 2 MB.</span>
                </button>
                {logoFile ? (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-500 transition-colors hover:text-red-600"
                  >
                    <X size={13} /> Quitar logotipo
                  </button>
                ) : null}
                <input ref={logoRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => void handleLogo(e)} />
              </section>

              <section className="auth-section-card">
                <SectionHeading
                  icon={Upload}
                  title="Documentos probatorios"
                  description="Obligatorios. PDF, PNG o JPG. Se envian a validacion del administrador."
                />
                <div className="grid gap-3">
                  {DOCUMENTOS.map((item) => (
                    <DocumentUploadCard
                      key={item.key}
                      item={item}
                      file={documentos[item.key]}
                      onChange={handleDocumento}
                    />
                  ))}
                </div>
              </section>

              {errorMsg ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {errorMsg}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <AppButton type="submit" isLoading={isSubmitting} disabled={isLoadingSectores} fullWidth>
                  Revisar registro
                </AppButton>
                <AppButton type="button" variant="secondary" onClick={() => navigate(ROUTES.SELECCION_CUENTA)} fullWidth>
                  Cambiar tipo de cuenta
                </AppButton>
              </div>
            </aside>
          </form>
          {isReviewOpen ? (
            <RegistroResumenDialog
              title="Revisa el registro de empresa"
              description="Confirma que los datos fiscales, el representante y los documentos sean correctos antes de enviarlos a validacion."
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
          ) : null}
        </section>
      </div>
    </main>
  )
}
