import { GraduationCap, UserRound } from 'lucide-react'
import { getAcademicLabel, isGraduate } from '@/shared/utils/academicStatus'

interface AcademicPillProps {
  estatusAcademico?: string | null
  /** Version compacta, sin icono, para espacios reducidos. */
  compact?: boolean
}

/**
 * Distintivo de Estudiante o Egresado.
 * Se usa en las listas donde la empresa y el administrador necesitan saber
 * con quien estan tratando sin abrir el detalle.
 */
export const AcademicPill = ({ estatusAcademico, compact = false }: AcademicPillProps) => {
  const graduate = isGraduate(estatusAcademico)
  const label = getAcademicLabel(estatusAcademico)
  const Icon = graduate ? GraduationCap : UserRound

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border font-bold ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'
      } ${
        graduate
          ? 'border-orange-200 bg-orange-50 text-orange-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
    >
      {compact ? null : <Icon size={12} strokeWidth={2.4} />}
      {label}
    </span>
  )
}

export default AcademicPill
