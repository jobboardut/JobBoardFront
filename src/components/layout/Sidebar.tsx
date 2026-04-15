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
import type { UserRole } from '@/types/auth.types'
import { ROUTES } from '@/router/routes'

interface SidebarProps {
  role: UserRole
}

const menuItems = {
  administrador: [
    { label: 'Dashboard',                    path: ROUTES.DASHBOARD, icon: Home },
    { label: 'Centro de validacion',         path: '/administradores/validacion', icon: ShieldCheck },
    { label: 'Centro de gestion',            path: '/administradores/gestion', icon: ClipboardList },
    { label: 'Publicaciones',                path: '/administradores/publicaciones', icon: BriefcaseBusiness },
    { label: 'Seguimiento de postulaciones', path: '/administradores/seguimiento', icon: Users },
  ],
  empresa: [
    { label: 'Panel de control', path: '/empresas/dashboard', icon: Home },
    { label: 'Publicaciones',    path: '/empresas/publicaciones', icon: BriefcaseBusiness },
    { label: 'Seguimiento',      path: '/empresas/postulantes', icon: UserRoundCheck },
  ],
  estudiante: [
    { label: 'Panel de control', path: '/estudiantes/dashboard', icon: Home },
    { label: 'Publicaciones', path: '/estudiantes/publicaciones', icon: BriefcaseBusiness },
    { label: 'Mi perfil',     path: '/estudiantes/perfil', icon: CircleUserRound },
    { label: 'Seguimiento',   path: '/estudiantes/seguimiento', icon: UserRoundCheck },
  ],
}

export const Sidebar = ({ role }: SidebarProps) => {
  const items = menuItems[role]

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-[#dfd9cf] bg-[#f8f7f4]">
      <div className="border-b border-[#e6dfd5] px-4 py-4">
        <div className="flex items-center">
          <img
            src="/logouttecam-removebg-preview.png"
            alt="UTTECAM"
            className="h-10 w-auto max-w-40"
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

      <div className="border-t border-[#e6dfd5] p-4">
        <button
          type="button"
          aria-label="Salir"
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 font-semibold transition-all duration-200 text-slate-500 hover:bg-red-500 hover:text-white"
        >
          <LogOut size={20} strokeWidth={2} />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  )
}