import { CheckCircle2, Mail, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { APP_ICON_STROKE_WIDTH } from '@/config/iconConfig'
import { ROUTES } from '@/router/routes'
import { AppButton } from '@/shared/components/AppButton'
import { FormControl, FORM_FIELD_CLASS } from '@/shared/components/FormControl'
import { useAppToast } from '@/shared/components/appToastContext'
import { limitText, SECURITY_LIMITS, validateEmailField } from '@/shared/security/inputRules'
import { PasswordRecoveryShell } from './PasswordRecoveryShell'

const SAFE_RESPONSE = 'Si el correo existe, recibirás el enlace para restablecer tu contraseña.'

export const RecuperarPassword = () => {
  const toast = useAppToast()
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const emailError = validateEmailField(email, 'Correo electronico')
    if (emailError) {
      toast.error('Correo no valido', emailError)
      return
    }

    setIsSending(true)

    await new Promise((resolve) => window.setTimeout(resolve, 650))

    setIsSending(false)
    setSubmitted(true)
    toast.notify({
      title: 'Solicitud recibida',
      message: SAFE_RESPONSE,
      tone: 'info',
      duration: 7000,
    })
  }

  return (
    <PasswordRecoveryShell
      eyebrow="Paso 1 de 2"
      icon={Mail}
      title="Recupera tu contraseña"
      description="Ingresa el correo asociado a tu cuenta. Te enviaremos instrucciones para crear una nueva contraseña."
    >
      {submitted ? (
        <div className="auth-recovery-result" role="status" aria-live="polite">
          <span>
            <CheckCircle2 size={24} strokeWidth={APP_ICON_STROKE_WIDTH} />
          </span>
          <div>
            <strong>Revisa tu bandeja de entrada</strong>
            <p>{SAFE_RESPONSE}</p>
          </div>
        </div>
      ) : (
        <form className="auth-recovery-form" onSubmit={handleSubmit}>
          <FormControl
            htmlFor="recovery-email"
            label="Correo electrónico"
            help="Por seguridad, la respuesta será la misma para cualquier correo."
          >
            <div className="auth-recovery-input-wrap">
              <Mail size={18} strokeWidth={APP_ICON_STROKE_WIDTH} />
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(limitText(event.target.value, SECURITY_LIMITS.email))}
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                maxLength={SECURITY_LIMITS.email}
                required
                className={`${FORM_FIELD_CLASS} auth-login-input`}
              />
            </div>
          </FormControl>

          <AppButton
            type="submit"
            fullWidth
            isLoading={isSending}
            icon={<Send size={18} strokeWidth={APP_ICON_STROKE_WIDTH} />}
            className="auth-login-submit"
          >
            {isSending ? 'Enviando...' : 'Enviar enlace'}
          </AppButton>
        </form>
      )}

      <div className="auth-recovery-actions">
        {submitted ? (
          <button type="button" onClick={() => setSubmitted(false)}>
            Usar otro correo
          </button>
        ) : null}
        <Link to={ROUTES.LOGIN}>Volver al inicio de sesión</Link>
      </div>
    </PasswordRecoveryShell>
  )
}
