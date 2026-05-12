import { NavLink } from 'react-router-dom'
import type { UserRole } from '@/features/auth/types/auth.types'
import { ROUTES } from '@/router/routes'

interface SidebarProps {
  role: UserRole
}

const estudianteItems = [
  { label: 'Publicaciones', path: ROUTES.ESTUDIANTE_PUBLICACIONES },
  { label: 'Mi perfil', path: ROUTES.ESTUDIANTE_PERFIL },
  { label: 'Seguimiento', path: ROUTES.ESTUDIANTE_SEGUIMIENTO },
]

const menuItems: Record<UserRole, { label: string; path: string }[]> = {
  Admin: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Centro de validacion', path: ROUTES.ADMIN_VALIDACION },
    { label: 'Centro de gestion', path: ROUTES.ADMIN_GESTION },
    { label: 'Publicaciones', path: ROUTES.ADMIN_PUBLICACIONES },
    { label: 'Seguimiento de postulaciones', path: ROUTES.ADMIN_SEGUIMIENTO },
  ],
  Empresa: [
    { label: 'Panel de control', path: ROUTES.EMPRESA_DASHBOARD },
    { label: 'Publicaciones', path: ROUTES.EMPRESA_PUBLICACIONES },
    { label: 'Postulantes', path: ROUTES.EMPRESA_POSTULANTES },
  ],
  Estudiante: estudianteItems,
  Egresado: estudianteItems,
}

export const Sidebar = ({ role }: SidebarProps) => {
  const items = menuItems[role]

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col py-6 px-4">
      <div className="mb-8 px-2">
        <img
          src="https://www.figma.com/api/mcp/asset/feae3d59-0aeb-4c97-a7d2-b94b64ab53f6"
          alt="UTTecam"
          className="w-40"
        />
      </div>

      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-gray-100 text-emerald-500 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
