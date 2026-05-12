import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Users, Bell, Building2, LogOut } from 'lucide-react'
import { ROUTES } from '@/router/routes'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { useEmpresaPerfil } from '../hooks/useEmpresa'


interface EmpresaLayoutProps {
  children: React.ReactNode   
}

const menuItems = [
  { label: 'Panel de control', path: '/empresas/dashboard', icon: LayoutDashboard },
  { label: 'Mis publicaciones', path: '/empresas/publicaciones', icon: Briefcase },
  { label: 'Postulantes', path: '/empresas/postulantes', icon: Users },
  { label: 'Mi perfil', path: '/empresas/perfil', icon: Building2 },
]

export const EmpresaLayout = ({ children }: EmpresaLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: perfil } = useEmpresaPerfil()
  const { logout } = useLogout()

  return (
    <div className="min-h-screen bg-transparent flex flex-col">

      {/* Header */}
      <header className="bg-white/90 backdrop-blur shadow-sm px-8 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-20 border-b border-emerald-100">
        <img
          src="https://www.figma.com/api/mcp/asset/85f9971e-856a-480c-a67c-4332dd4452d8"
          alt="UTTecam"
          className="h-12"
        />
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors">
            <Bell size={18} className="text-emerald-600" />
          </button>
          <button
            onClick={() => navigate(ROUTES.EMPRESA_CREAR_VACANTE)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2"
          >
            + Publicar vacante
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
          >
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>
      </header>

      <div className="flex pt-20">

        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/95 backdrop-blur shadow-sm fixed left-0 top-20 bottom-0 flex flex-col justify-between py-6 px-4 border-r border-emerald-100">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icono = item.icon
              const activo = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                    activo
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <Icono size={18} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Usuario abajo */}
          <div className="border-t border-emerald-100 pt-4">
            <div className="flex items-center gap-3 p-3 border border-emerald-100 rounded-2xl bg-emerald-50">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Users size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{perfil?.nombreEmpresa ?? 'Empresa'}</p>
                <p className="text-xs text-slate-400">{perfil?.correoEmpresa ?? perfil?.email ?? 'Perfil empresarial'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido */}
        <main className="ml-64 flex-1 p-8">
          {children}
        </main>

      </div>
    </div>
  )
}
