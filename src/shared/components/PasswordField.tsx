import { useId, useState } from 'react'
import { Check, Eye, EyeOff, Lock, X } from 'lucide-react'
import { SECURITY_LIMITS } from '@/shared/security/inputRules'
import { analyzePassword, type PasswordLevel } from '@/shared/security/passwordStrength'

interface PasswordFieldProps {
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
  /** Muestra la barra de fuerza y la lista de requisitos. */
  showStrength?: boolean
  /** Mensaje de error externo (por ejemplo, que no coincide la confirmacion). */
  error?: string | null
  /** Texto de ayuda cuando no hay error ni medidor. */
  hint?: string
  className?: string
}

const LEVEL_STYLES: Record<PasswordLevel, { bar: string; text: string }> = {
  vacia: { bar: 'bg-slate-200', text: 'text-slate-400' },
  debil: { bar: 'bg-red-500', text: 'text-red-600' },
  regular: { bar: 'bg-amber-500', text: 'text-amber-600' },
  segura: { bar: 'bg-emerald-500', text: 'text-emerald-600' },
}

/**
 * Campo de contraseña con boton para mostrarla y, opcionalmente, un medidor
 * de seguridad que va marcando los requisitos conforme se escriben.
 */
export const PasswordField = ({
  name,
  value,
  onChange,
  label = 'Contraseña',
  placeholder = '********',
  required = true,
  autoComplete = 'new-password',
  showStrength = false,
  error,
  hint,
  className = '',
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const inputId = useId()
  const analysis = analyzePassword(value)
  const styles = LEVEL_STYLES[analysis.level]
  const showMeter = showStrength && value.length > 0

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={inputId} className="text-sm text-gray-600">
        {label}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 transition ${
          error ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-300 focus-within:border-[#009A4D]'
        }`}
      >
        <Lock size={16} className="shrink-0 text-gray-400" />
        <input
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          maxLength={SECURITY_LIMITS.passwordMax}
          aria-invalid={Boolean(error)}
          className="flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          title={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {showMeter ? (
        <div className="mt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <span
                className={`block h-full rounded-full transition-all duration-300 ${styles.bar}`}
                style={{ width: `${analysis.score}%` }}
              />
            </span>
            <span className={`text-xs font-bold ${styles.text}`}>{analysis.levelLabel}</span>
          </div>

          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {analysis.requirements.map((requirement) => (
              <li
                key={requirement.id}
                className={`flex items-center gap-1.5 text-xs ${
                  requirement.met ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {requirement.met ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  <X size={13} strokeWidth={2.5} />
                )}
                {requirement.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs font-semibold text-red-600">{error}</p>
      ) : !showMeter && hint ? (
        <p className="text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  )
}

export default PasswordField
