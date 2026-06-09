import { Check, CheckCircle2, Eye, EyeOff, KeyRound, ShieldAlert } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { APP_ICON_STROKE_WIDTH } from '@/config/iconConfig'
import { ROUTES } from '@/router/routes'
import { AppButton } from '@/shared/components/AppButton'
import { FormControl, FORM_FIELD_CLASS } from '@/shared/components/FormControl'
import { useAppToast } from '@/shared/components/appToastContext'
import { limitText, SECURITY_LIMITS } from '@/shared/security/inputRules'
import { PasswordRecoveryShell } from './PasswordRecoveryShell'

type PasswordErrors = {
  confirmation?: string
  password?: string
}

export const RestablecerPassword = () => {
  const navigate = useNavigate()
  const toast = useAppToast()
  const [searchParams] = useSearchParams()
  const hasToken = Boolean(searchParams.get('token')?.trim())
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [errors, setErrors] = useState<PasswordErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [completed, setCompleted] = useState(false)

  const requirements = useMemo(() => [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Una letra mayúscula', met: /[A-Z]/.test(password) },
    { label: 'Una letra minúscula', met: /[a-z]/.test(password) },
    { label: 'Un número', met: /\d/.test(password) },
    { label: `Maximo ${SECURITY_LIMITS.passwordMax} caracteres`, met: password.length <= SECURITY_LIMITS.passwordMax },
  ], [password])

  const isStrongPassword = requirements.every((requirement) => requirement.met)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: PasswordErrors = {}
    if (!isStrongPassword) nextErrors.password = 'La contraseña todavía no cumple todos los requisitos.'
    if (password !== confirmation) nextErrors.confirmation = 'Las contraseñas no coinciden.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length || !hasToken) return

    setIsSaving(true)
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    setIsSaving(false)
    setCompleted(true)
    toast.notify({
      title: 'Contraseña actualizada',
      message: 'Tu contraseña fue restablecida correctamente.',
      tone: 'success',
      duration: 7000,
    })
  }

  if (completed) {
    return (
      <PasswordRecoveryShell
        eyebrow="Proceso completado"
        icon={CheckCircle2}
        title="Contraseña restablecida"
        description="Tu nueva contraseña está lista. Inicia sesión nuevamente para continuar."
      >
        <div className="auth-recovery-result auth-recovery-result--success" role="status">
          <span>
            <CheckCircle2 size={24} strokeWidth={APP_ICON_STROKE_WIDTH} />
          </span>
          <div>
            <strong>Cambio realizado correctamente</strong>
            <p>Por seguridad, deberás iniciar sesión con tu nueva contraseña.</p>
          </div>
        </div>
        <div className="auth-recovery-form">
          <AppButton
            fullWidth
            icon={<KeyRound size={18} strokeWidth={APP_ICON_STROKE_WIDTH} />}
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Ir al inicio de sesión
          </AppButton>
        </div>
      </PasswordRecoveryShell>
    )
  }

  return (
    <PasswordRecoveryShell
      eyebrow="Paso 2 de 2"
      icon={KeyRound}
      title="Crea una nueva contraseña"
      description="Elige una contraseña segura que no hayas utilizado anteriormente."
    >
      {!hasToken ? (
        <div className="auth-recovery-result auth-recovery-result--warning" role="alert">
          <span>
            <ShieldAlert size={24} strokeWidth={APP_ICON_STROKE_WIDTH} />
          </span>
          <div>
            <strong>El enlace está incompleto</strong>
            <p>Solicita un nuevo enlace para continuar con el cambio de contraseña.</p>
          </div>
        </div>
      ) : null}

      <form className="auth-recovery-form" onSubmit={handleSubmit}>
        <FormControl htmlFor="new-password" label="Nueva contraseña" error={errors.password}>
          <div className="auth-recovery-input-wrap">
            <KeyRound size={18} strokeWidth={APP_ICON_STROKE_WIDTH} />
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              maxLength={SECURITY_LIMITS.passwordMax}
              onChange={(event) => {
                setPassword(limitText(event.target.value, SECURITY_LIMITS.passwordMax))
                setErrors((current) => ({ ...current, password: undefined }))
              }}
              autoComplete="new-password"
              placeholder="Nueva contraseña"
              required
              disabled={!hasToken}
              className={`${FORM_FIELD_CLASS} auth-login-input`}
            />
            <button
              type="button"
              className="auth-recovery-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              disabled={!hasToken}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormControl>

        <div className="auth-recovery-requirements" aria-label="Requisitos de contraseña">
          {requirements.map((requirement) => (
            <span className={requirement.met ? 'is-met' : ''} key={requirement.label}>
              <Check size={14} strokeWidth={APP_ICON_STROKE_WIDTH} />
              {requirement.label}
            </span>
          ))}
        </div>

        <FormControl htmlFor="confirm-password" label="Confirmar contraseña" error={errors.confirmation}>
          <div className="auth-recovery-input-wrap">
            <KeyRound size={18} strokeWidth={APP_ICON_STROKE_WIDTH} />
            <input
              id="confirm-password"
              type={showConfirmation ? 'text' : 'password'}
              value={confirmation}
              maxLength={SECURITY_LIMITS.passwordMax}
              onChange={(event) => {
                setConfirmation(limitText(event.target.value, SECURITY_LIMITS.passwordMax))
                setErrors((current) => ({ ...current, confirmation: undefined }))
              }}
              autoComplete="new-password"
              placeholder="Confirma tu contraseña"
              required
              disabled={!hasToken}
              className={`${FORM_FIELD_CLASS} auth-login-input`}
            />
            <button
              type="button"
              className="auth-recovery-password-toggle"
              onClick={() => setShowConfirmation((current) => !current)}
              aria-label={showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'}
              disabled={!hasToken}
            >
              {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormControl>

        <AppButton
          type="submit"
          fullWidth
          disabled={!hasToken}
          isLoading={isSaving}
          icon={<KeyRound size={18} strokeWidth={APP_ICON_STROKE_WIDTH} />}
          className="auth-login-submit"
        >
          {isSaving ? 'Guardando...' : 'Restablecer contraseña'}
        </AppButton>
      </form>

      <div className="auth-recovery-actions">
        {!hasToken ? <Link to={ROUTES.RECUPERAR_PASSWORD}>Solicitar nuevo enlace</Link> : null}
        <Link to={ROUTES.LOGIN}>Volver al inicio de sesión</Link>
      </div>
    </PasswordRecoveryShell>
  )
}
