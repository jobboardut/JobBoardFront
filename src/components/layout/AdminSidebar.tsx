import { BriefcaseBusiness, FileText, LayoutDashboard, LogOut, Send, Settings2, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../config/iconConfig'
import { ROUTES } from '../../router/routes'

type SidebarKey = 'dashboard' | 'validation' | 'management' | 'publications' | 'tracking' | 'settings' | 'logout'

type AdminSidebarProps = {
  activeItem?: SidebarKey
}

const navigationItems = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, to: ROUTES.ADMIN_DASHBOARD },
  { key: 'validation', label: 'Centro de validacion', Icon: ShieldCheck, to: ROUTES.ADMIN_VALIDACION },
  { key: 'management', label: 'Centro de gestion', Icon: BriefcaseBusiness, to: ROUTES.ADMIN_GESTION },
  { key: 'settings', label: 'Configuracion', Icon: Settings2, to: ROUTES.ADMIN_CONFIGURACION },
  { key: 'publications', label: 'Publicaciones', Icon: FileText, to: ROUTES.ADMIN_PUBLICACIONES },
  { key: 'tracking', label: 'Seguimiento de postulaciones', Icon: Send, to: ROUTES.ADMIN_SEGUIMIENTO },
] as const

function AdminSidebar({ activeItem = 'dashboard' }: AdminSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <img className="brand-logo" src="/logouttecam-removebg-preview%20-%20copia.png" alt="UTTECAM" />
        </div>
      </div>

      <nav className="nav">
        {navigationItems.map((item) => (
          <Link key={item.label} className={`nav-item${item.key === activeItem ? ' active' : ''}`} to={item.to}>
            <span className="nav-icon">
              <item.Icon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <nav className="nav-footer">
        <Link className="nav-item" to={ROUTES.LOGIN}>
          <span className="nav-icon">
            <LogOut size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
          </span>
          Salir
        </Link>
      </nav>
    </aside>
  )
}

export default AdminSidebar
