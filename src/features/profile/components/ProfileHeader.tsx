import { Edit } from 'lucide-react'
import { useState } from 'react'
import type { StudentProfile } from '../types/profile.types'

interface ProfileHeaderProps {
  profile: StudentProfile
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)

  return (
    <div className="rounded-2xl border border-[#e6e0d7] bg-white p-6 shadow-[0_4px_15px_rgba(29,37,56,0.05)]">
      <div className="flex items-start gap-6">
        <div
          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-[#009A4D] to-[#009A4D] ring-2 ring-offset-2 ring-[#009A4D] transition-all"
          onMouseEnter={() => setIsHoveringAvatar(true)}
          onMouseLeave={() => setIsHoveringAvatar(false)}
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
          {isHoveringAvatar && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors">
              <Edit size={32} className="text-white" strokeWidth={2} />
            </div>
          )}
        </div>

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
              {new Date(profile.birthDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
