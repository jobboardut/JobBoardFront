import { BriefcaseBusiness, FileText, LayoutDashboard, Send, Settings2, ShieldCheck } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../config/iconConfig'

type SidebarKey = 'dashboard' | 'validation' | 'management' | 'publications' | 'tracking' | 'settings'

type AdminSidebarProps = {
  activeItem?: SidebarKey
}

const navigationItems = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, href: '#dashboard' },
  { key: 'validation', label: 'Centro de validación', Icon: ShieldCheck, href: '#validacion' },
  { key: 'management', label: 'Centro de gestión', Icon: BriefcaseBusiness, href: '#gestion' },
  { key: 'settings', label: 'Configuración', Icon: Settings2, href: '#configuracion' },
  { key: 'publications', label: 'Publicaciones', Icon: FileText, href: '#publicaciones' },
  { key: 'tracking', label: 'Seguimiento de postulaciones', Icon: Send, href: '#tracking' },
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
          <a key={item.label} className={`nav-item${item.key === activeItem ? ' active' : ''}`} href={item.href}>
            <span className="nav-icon">
              <item.Icon size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
            </span>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar