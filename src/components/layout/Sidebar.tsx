import { NavLink } from 'react-router-dom'
import {
  BriefcaseBusiness,
  CircleUserRound,
  ClipboardList,
  Home,
  LogOut,
  ShieldCheck,
  UserRoundCheck,
  Users,
} from 'lucide-react'
import type { UserRole } from '@/features/auth/types/auth.types'
import { ROUTES } from '@/router/routes'

interface SidebarProps {
  role: UserRole
}

type MenuItem = {
  label: string
  path: string
  icon: typeof Home
}

const estudianteItems: MenuItem[] = [
  { label: 'Panel de control', path: ROUTES.ESTUDIANTE_DASHBOARD, icon: Home },
  { label: 'Publicaciones', path: ROUTES.ESTUDIANTE_PUBLICACIONES, icon: BriefcaseBusiness },
  { label: 'Mi perfil', path: ROUTES.ESTUDIANTE_PERFIL, icon: CircleUserRound },
  { label: 'Seguimiento', path: ROUTES.ESTUDIANTE_SEGUIMIENTO, icon: UserRoundCheck },
]

const menuItems: Record<UserRole, MenuItem[]> = {
  Admin: [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: Home },
    { label: 'Centro de validacion', path: ROUTES.ADMIN_VALIDACION, icon: ShieldCheck },
    { label: 'Centro de gestion', path: ROUTES.ADMIN_GESTION, icon: ClipboardList },
    { label: 'Publicaciones', path: ROUTES.ADMIN_PUBLICACIONES, icon: BriefcaseBusiness },
    { label: 'Seguimiento de postulaciones', path: ROUTES.ADMIN_SEGUIMIENTO, icon: Users },
  ],
  Empresa: [
    { label: 'Panel de control', path: ROUTES.EMPRESA_DASHBOARD, icon: Home },
    { label: 'Publicaciones', path: ROUTES.EMPRESA_PUBLICACIONES, icon: BriefcaseBusiness },
    { label: 'Postulantes', path: ROUTES.EMPRESA_POSTULANTES, icon: UserRoundCheck },
    { label: 'Perfil', path: ROUTES.EMPRESA_PERFIL, icon: CircleUserRound },
  ],
  Estudiante: estudianteItems,
  Egresado: estudianteItems,
}

export const Sidebar = ({ role }: SidebarProps) => {
  const items = menuItems[role]

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-[#ece7df] bg-white">
      <div className="px-4 py-8">
        <div className="flex items-center justify-center">
          <img
            src="/logouttecam-removebg-preview.png"
            alt="UTTECAM"
            className="h-16 w-auto max-w-52 object-contain"
          />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-3 p-4 pt-5">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#10B981] text-white shadow-[0_8px_16px_rgba(16,185,129,0.35)]'
                  : 'text-slate-500 hover:-translate-y-0.5 hover:bg-[#efebe5] hover:text-slate-700'
              }`
            }
          >
            <item.icon size={20} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#ece7df] p-4">
        <NavLink
          to={ROUTES.LOGIN}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 font-semibold text-slate-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
        >
          <LogOut size={20} strokeWidth={2} />
          <span>Salir</span>
        </NavLink>
      </div>
    </aside>
  )
}
