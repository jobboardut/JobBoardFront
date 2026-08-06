import { Menu, PanelLeftClose, PanelLeftOpen, X, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { APP_ICONS, APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '@/config/iconConfig'
import { useLogout } from '@/features/auth/hooks/useAuth'
import type { UserRole } from '@/features/auth/types/auth.types'
import { ROUTES } from '@/router/routes'

export interface SidebarAccount {
  title: string
  subtitle?: string
  icon?: LucideIcon
}

interface SidebarProps {
  role: UserRole
  account?: SidebarAccount
}

type MenuItem = {
  label: string
  path: string
  icon: LucideIcon
}

type NavigationGroup = {
  label: string
  items: MenuItem[]
}

const estudianteGroups: NavigationGroup[] = [
  {
    label: 'General',
    items: [
      { label: 'Panel de control', path: ROUTES.ESTUDIANTE_DASHBOARD, icon: APP_ICONS.dashboard },
    ],
  },
  {
    label: 'Oportunidades',
    items: [
      { label: 'Publicaciones', path: ROUTES.ESTUDIANTE_PUBLICACIONES, icon: APP_ICONS.publications },
      { label: 'Seguimiento', path: ROUTES.ESTUDIANTE_SEGUIMIENTO, icon: APP_ICONS.tracking },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { label: 'Mi perfil', path: ROUTES.ESTUDIANTE_PERFIL, icon: APP_ICONS.profile },
    ],
  },
]

const navigationGroups: Record<UserRole, NavigationGroup[]> = {
  Admin: [
    {
      label: 'General',
      items: [
        { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: APP_ICONS.dashboard },
      ],
    },
    {
      label: 'Operacion',
      items: [
        { label: 'Centro de validacion', path: ROUTES.ADMIN_VALIDACION, icon: APP_ICONS.validation },
        { label: 'Centro de gestion', path: ROUTES.ADMIN_GESTION, icon: APP_ICONS.management },
        { label: 'Publicaciones', path: ROUTES.ADMIN_PUBLICACIONES, icon: APP_ICONS.publications },
        { label: 'Seguimiento', path: ROUTES.ADMIN_SEGUIMIENTO, icon: APP_ICONS.tracking },
      ],
    },
    {
      label: 'Sistema',
      items: [
        { label: 'Configuracion', path: ROUTES.ADMIN_CONFIGURACION, icon: APP_ICONS.settings },
      ],
    },
  ],
  Empresa: [
    {
      label: 'General',
      items: [
        { label: 'Panel de control', path: ROUTES.EMPRESA_DASHBOARD, icon: APP_ICONS.dashboard },
      ],
    },
    {
      label: 'Operacion',
      items: [
        { label: 'Mis publicaciones', path: ROUTES.EMPRESA_PUBLICACIONES, icon: APP_ICONS.publications },
        { label: 'Postulantes', path: ROUTES.EMPRESA_POSTULANTES, icon: APP_ICONS.applicants },
      ],
    },
    {
      label: 'Cuenta',
      items: [
        { label: 'Mi perfil', path: ROUTES.EMPRESA_PERFIL, icon: APP_ICONS.profile },
      ],
    },
  ],
  Estudiante: estudianteGroups,
  Egresado: estudianteGroups,
}

const roleAccount: Record<UserRole, Required<Pick<SidebarAccount, 'title' | 'subtitle' | 'icon'>>> = {
  Admin: {
    title: 'Administracion',
    subtitle: 'Control institucional',
    icon: APP_ICONS.validation,
  },
  Empresa: {
    title: 'Empresa',
    subtitle: 'Perfil empresarial',
    icon: APP_ICONS.company,
  },
  Estudiante: {
    title: 'Estudiante',
    subtitle: 'Bolsa de trabajo',
    icon: APP_ICONS.students,
  },
  Egresado: {
    title: 'Egresado',
    subtitle: 'Bolsa de trabajo',
    icon: APP_ICONS.students,
  },
}

const COLLAPSE_KEY = 'sidebar-collapsed'

/** Vistas de lista + detalle: se pliega sola para darles todo el ancho. */
const isDenseRoute = (pathname: string) => pathname.includes('/publicaciones')

export const Sidebar = ({ role, account }: SidebarProps) => {
  const { logout, isLoggingOut } = useLogout()
  const { pathname } = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Preferencia del usuario: la barra recuerda si quedo colapsada.
  const [userPreference, setUserPreference] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === 'true',
  )
  // Si el usuario decide manualmente en una vista densa, mandamos su decision
  // hasta que cambie de pantalla.
  const [manualOverride, setManualOverride] = useState<boolean | null>(null)
  const [lastPathname, setLastPathname] = useState(pathname)

  // Al navegar se vuelve a aplicar la regla automatica (patron de React para
  // ajustar estado cuando cambia una entrada, sin usar un efecto).
  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    setManualOverride(null)
  }

  const denseRoute = isDenseRoute(pathname)
  const isCollapsed = manualOverride ?? (denseRoute || userPreference)

  const groups = navigationGroups[role]
  const defaultAccount = roleAccount[role]
  const AccountIcon = account?.icon ?? defaultAccount.icon

  const toggleCollapse = () => {
    const next = !isCollapsed

    if (denseRoute) {
      // En vistas densas el cambio es temporal: no pisa la preferencia guardada.
      setManualOverride(next)
      return
    }

    setManualOverride(null)
    setUserPreference(next)
    localStorage.setItem(COLLAPSE_KEY, String(next))
  }

  // El layout lee esta clase para ajustar el ancho de la columna.
  useEffect(() => {
    document.documentElement.classList.toggle('sidebar-is-collapsed', isCollapsed)
  }, [isCollapsed])

  return (
    <aside
      className={`sidebar ${role.toLowerCase()}-sidebar ${isMenuOpen ? 'is-open' : ''} ${
        isCollapsed ? 'is-collapsed' : ''
      }`}
    >
      <div className="sidebar-topbar">
        <div className="brand">
          <div className="brand-mark">
            <img className="brand-logo" src="/logouttecam-removebg-preview.png" alt="UTTECAM" />
          </div>
        </div>

        <button
          type="button"
          className="sidebar-collapse-toggle"
          aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
          title={
            denseRoute
              ? `${isCollapsed ? 'Expandir' : 'Colapsar'} menu (esta vista se pliega sola)`
              : `${isCollapsed ? 'Expandir' : 'Colapsar'} menu`
          }
          onClick={toggleCollapse}
        >
          {isCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
        </button>

        <button
          type="button"
          className="sidebar-menu-toggle"
          aria-label={isMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <div className="sidebar-menu">
        <nav className="nav" aria-label={`Navegacion de ${role.toLowerCase()}`}>
          {groups.map((group) => (
            <section key={group.label} className="nav-group">
              <p className="nav-group-label">{group.label}</p>
              <div className="nav-group-items">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    // El title sirve de tooltip cuando la barra esta colapsada.
                    title={item.label}
                  >
                    <span className="nav-icon">
                      <item.icon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div className="nav-footer">
          <div className="sidebar-account">
            <span className="sidebar-account-icon">
              <AccountIcon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            </span>
            <span className="sidebar-account-copy">
              <strong>{account?.title || defaultAccount.title}</strong>
              <small>{account?.subtitle || defaultAccount.subtitle}</small>
            </span>
          </div>

          <button
            type="button"
            className="nav-item"
            onClick={logout}
            disabled={isLoggingOut}
            title="Salir"
          >
            <span className="nav-icon">
              <APP_ICONS.logout size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            </span>
            <span className="nav-label">{isLoggingOut ? 'Saliendo...' : 'Salir'}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
