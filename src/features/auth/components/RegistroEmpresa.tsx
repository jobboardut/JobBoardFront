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
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import campusImg from '@/assets/images/campus.png'
import { AppButton } from '@/shared/components/AppButton'
import { FormControl, FORM_FIELD_CLASS } from '@/shared/components/FormControl'
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
import './auth-flow.css'

const pasos = [
  'Tipo de cuenta',
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

type DocumentoKey = 'situacionFiscal' | 'docExistencia' | 'repDocCargo' | 'repFotoIne'

const EMPRESA_FIELD_LIMITS = {
  email: SECURITY_LIMITS.email,
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
}> = [
  {
    key: 'situacionFiscal',
    label: 'Situacion fiscal',
    description: 'PDF o imagen de la constancia fiscal.',
    icon: FileCheck2,
    required: true,
  },
  {
    key: 'docExistencia',
    label: 'Existencia de empresa',
    description: 'Acta, alta o documento legal de la empresa.',
    icon: Building2,
    required: true,
  },
  {
    key: 'repDocCargo',
    label: 'Cargo del representante',
    description: 'Documento que compruebe el cargo o autorizacion.',
    icon: FileBadge2,
    required: true,
  },
  {
    key: 'repFotoIne',
    label: 'INE del representante',
    description: 'Identificacion oficial del responsable.',
    icon: ShieldCheck,
    required: true,
  },
]

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
    <label className={`auth-file-card block cursor-pointer ${file ? 'is-ready' : ''}`}>
      <input
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={(event) => onChange(item.key, event.target.files?.[0] ?? null)}
      />
      <span className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
          {file ? <CheckCircle2 size={20} className="text-emerald-600" /> : <Icon size={20} />}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-black text-slate-900">
            {item.label}
            {item.required ? <span className="text-orange-500"> *</span> : null}
          </span>
          <span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span>
          <span className="mt-2 block truncate text-xs font-bold text-emerald-700">
            {file ? file.name : 'Seleccionar archivo'}
          </span>
        </span>
      </span>
    </label>
  )
}

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

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
    }
  }, [logoPreview])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: limitText(event.target.value, getEmpresaFieldLimit(event.target.name)),
    }))
    setErrorMsg(null)
  }

  const handleLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileError = validateFile(file, {
      allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
      label: 'El logotipo',
      maxBytes: FILE_LIMITS.imageBytes,
    })

    if (fileError) {
      setErrorMsg(fileError)
      event.target.value = ''
      return
    }

    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleDocumento = (key: DocumentoKey, file: File | null) => {
    if (file) {
      const fileError = validateFile(file, {
        allowedTypes: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
        label: 'El documento',
        maxBytes: FILE_LIMITS.documentBytes,
      })

      if (fileError) {
        setErrorMsg(fileError)
        return
      }
    }

    setDocumentos((prev) => ({ ...prev, [key]: file }))
    setErrorMsg(null)
  }

  const validateDocuments = () => {
    const missing = DOCUMENTOS.filter((item) => item.required && !documentos[item.key])
    if (!missing.length) return true

    setErrorMsg(`Faltan documentos de validacion: ${missing.map((item) => item.label).join(', ')}.`)
    return false
  }

  const validateForm = () => {
    const validations = [
      validateEmailField(form.email, 'Email de acceso'),
      validatePasswordField(form.password),
      validateRequiredText(form.nombreEmpresa, 'Nombre de la empresa', SECURITY_LIMITS.companyName),
      validateOptionalPhoneField(form.telefonoEmpresa, 'Telefono de la empresa'),
      validateOptionalEmailField(form.correoEmpresa, 'Correo de la empresa'),
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

    if (!validateForm()) return
    if (!validateDocuments()) return

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
        situacionFiscal: documentos.situacionFiscal,
        docExistencia: documentos.docExistencia,
        repDocCargo: documentos.repDocCargo,
        repFotoIne: documentos.repFotoIne,
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
              <strong className="block text-emerald-900">Archivos requeridos</strong>
              La API de registro usa multipart-form, por eso los documentos se envian junto con los datos de la empresa.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1.32fr)_minmax(320px,0.68fr)]">
            <div className="grid gap-5">
              <section className="auth-section-card">
                <SectionHeading
                  icon={UserRound}
                  title="Cuenta de acceso"
                  description="Credenciales que usara la empresa despues de la validacion."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormControl label="Email de acceso" help={getLengthHelp(SECURITY_LIMITS.email, 'Formato correo@dominio.com.')}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="empresa@correo.com"
                      maxLength={SECURITY_LIMITS.email}
                      required
                    />
                  </FormControl>
                  <FormControl label="Password" help="Minimo 8 caracteres, mayuscula, minuscula, numero y maximo 72 caracteres.">
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="Minimo 6 caracteres"
                      minLength={SECURITY_LIMITS.passwordMin}
                      maxLength={SECURITY_LIMITS.passwordMax}
                      required
                    />
                  </FormControl>
                </div>
              </section>

              <section className="auth-section-card">
                <SectionHeading
                  icon={Globe}
                  title="Datos de la empresa"
                  description="Informacion publica y fiscal para identificar a la organizacion."
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
                  <FormControl label="Sector">
                    <select
                      name="sectorId"
                      value={form.sectorId}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      required
                    >
                      <option value="">Seleccione una opcion</option>
                      {sectores.map((sector) => (
                        <option key={sector.id} value={sector.id}>
                          {sector.nombre}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormControl label="Telefono de la empresa" help="De 7 a 18 caracteres. Solo numeros, espacios, +, - o parentesis.">
                    <input
                      name="telefonoEmpresa"
                      value={form.telefonoEmpresa}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="222 000 0000"
                      maxLength={SECURITY_LIMITS.phone}
                    />
                  </FormControl>
                  <FormControl label="Correo de la empresa" help={getLengthHelp(SECURITY_LIMITS.email, 'Formato correo@dominio.com.')}>
                    <input
                      type="email"
                      name="correoEmpresa"
                      value={form.correoEmpresa}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="contacto@empresa.com"
                      maxLength={SECURITY_LIMITS.email}
                    />
                  </FormControl>
                  <FormControl label="Direccion" help={getLengthHelp(SECURITY_LIMITS.address)}>
                    <input
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="Calle, numero, ciudad"
                      maxLength={SECURITY_LIMITS.address}
                    />
                  </FormControl>
                  <FormControl label="Sitio web" help={getLengthHelp(SECURITY_LIMITS.url, 'Debe iniciar con http:// o https://.')}>
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
                    <FormControl label="Descripcion" help={getLengthHelp(SECURITY_LIMITS.longText)}>
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
                  <FormControl label="Puesto o cargo" help={getLengthHelp(SECURITY_LIMITS.shortText)}>
                    <input
                      name="puesto"
                      value={form.puesto}
                      onChange={handleChange}
                      className={FORM_FIELD_CLASS}
                      placeholder="Representante legal, RH, direccion..."
                      maxLength={SECURITY_LIMITS.shortText}
                    />
                  </FormControl>
                  <FormControl label="Telefono" help="De 7 a 18 caracteres. Solo numeros, espacios, +, - o parentesis.">
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
                    <FormControl label="Correo del representante" help={getLengthHelp(SECURITY_LIMITS.email, 'Formato correo@dominio.com.')}>
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
              <section className="auth-section-card">
                <SectionHeading
                  icon={Camera}
                  title="Logotipo"
                  description="Opcional, ayuda a reconocer la empresa en la plataforma."
                />
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  className="auth-spotlight grid w-full place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-emerald-300 hover:bg-white"
                >
                  <span className="grid h-28 w-28 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-slate-200 shadow-sm">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo de empresa" className="h-full w-full object-cover" />
                    ) : (
                      <Camera size={34} className="text-slate-400" />
                    )}
                  </span>
                  <span className="mt-3 text-sm font-black text-slate-900">
                    {logoFile ? logoFile.name : 'Subir logotipo'}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">PNG, JPG o WEBP</span>
                </button>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </section>

              <section className="auth-section-card">
                <SectionHeading
                  icon={Upload}
                  title="Documentos probatorios"
                  description="Estos archivos se envian a validacion del administrador."
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
                <AppButton type="submit" isLoading={isSubmitting} fullWidth>
                  Continuar
                </AppButton>
                <AppButton type="button" variant="secondary" onClick={() => navigate(ROUTES.SELECCION_CUENTA)} fullWidth>
                  Cambiar tipo de cuenta
                </AppButton>
              </div>
            </aside>
          </form>
        </section>
      </div>
    </main>
  )
}
