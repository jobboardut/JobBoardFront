import { NavLink } from 'react-router-dom'
import type { UserRole } from '@/types/auth.types'
import { ROUTES } from '@/router/routes'

interface SidebarProps {
  role: UserRole
}

const menuItems = {
  administrador: [
    { label: 'Dashboard',                    path: ROUTES.DASHBOARD },
    { label: 'Centro de validación',         path: '/administradores/validacion' },
    { label: 'Centro de gestión',            path: '/administradores/gestion' },
    { label: 'Publicaciones',               path: '/administradores/publicaciones' },
    { label: 'Seguimiento de postulaciones', path: '/administradores/seguimiento' },
  ],
  empresa: [
    { label: 'Panel de control', path: '/empresas/dashboard' },
    { label: 'Publicaciones',   path: '/empresas/publicaciones' },
    { label: 'Postulantes',     path: '/empresas/postulantes' },
  ],
  estudiante: [
    { label: 'Publicaciones', path: '/estudiantes/publicaciones' },
    { label: 'Mi perfil',     path: '/estudiantes/perfil' },
    { label: 'Seguimiento',   path: '/estudiantes/seguimiento' },
  ],
}

export const Sidebar = ({ role }: SidebarProps) => {
  const items = menuItems[role]

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="mb-8 px-2">
        <img
          src="https://www.figma.com/api/mcp/asset/feae3d59-0aeb-4c97-a7d2-b94b64ab53f6"
          alt="UTTecam"
          className="w-40"
        />
      </div>

      {/* Menu */}
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