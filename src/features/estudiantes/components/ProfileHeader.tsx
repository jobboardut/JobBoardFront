import { Camera } from 'lucide-react'
import type { StudentProfile } from '../types/profile.types'

interface ProfileHeaderProps {
  profile: StudentProfile
  onEditImage: () => void
}

export const ProfileHeader = ({ profile, onEditImage }: ProfileHeaderProps) => {
  const birthDate = new Date(profile.birthDate)
  const formattedBirthDate = Number.isNaN(birthDate.getTime())
    ? 'No especificada'
    : birthDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  return (
    <div className="rounded-2xl border border-[#e6e0d7] bg-white p-6 shadow-[0_4px_15px_rgba(29,37,56,0.05)]">
      <div className="flex items-start gap-6">
        <button
          type="button"
          onClick={onEditImage}
          className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-[#009A4D] to-[#009A4D] text-left ring-2 ring-[#009A4D] ring-offset-2 transition hover:ring-4 focus:outline-none focus:ring-4"
          aria-label="Cambiar foto de perfil"
        >
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/45 group-focus:bg-black/45">
            <Camera size={30} className="scale-75 text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100 group-focus:scale-100 group-focus:opacity-100" />
          </span>
          <span className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-md">
            <Camera size={15} />
          </span>
        </button>

        <div className="flex-1">
          <h1 className="mb-2 text-2xl font-bold leading-tight text-slate-900">
            {profile.firstName}
            <br />
            {profile.lastName}
          </h1>

          <p className="mb-1 text-base font-medium text-[#4a5f99]">{profile.career}</p>
          <p className="mb-3 text-sm text-[#4a5f99]">{profile.institutionalEmail}</p>

          <div className="space-y-1 text-xs text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Fecha de nacimiento:</span>{' '}
              {formattedBirthDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
