import { Bell } from 'lucide-react'

interface ProfileHeaderBarProps {
  onNotificationsClick?: () => void
}

export const ProfileHeaderBar = ({ onNotificationsClick }: ProfileHeaderBarProps) => {
  return (
    <header className="flex items-center justify-end gap-3 border-b border-[#e7e1d9] bg-[#f8f7f4] px-6 py-4">
      <button
        type="button"
        onClick={onNotificationsClick}
        aria-label="Notificaciones"
        className="relative z-20 grid h-9 w-9 place-items-center rounded-xl border border-[#ddd8d0] bg-white text-slate-500 transition hover:bg-[#f4f1ec]"
      >
        <Bell size={19} />
      </button>
    </header>
  )
}
