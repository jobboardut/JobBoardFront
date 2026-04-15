import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Users, Bell, Building2 } from 'lucide-react'


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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-20">
        <img
          src="https://www.figma.com/api/mcp/asset/85f9971e-856a-480c-a67c-4332dd4452d8"
          alt="UTTecam"
          className="h-12"
        />
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Bell size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => navigate('/empresas/publicaciones')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2"
          >
            + Publicar vacante
          </button>
        </div>
      </header>

      <div className="flex pt-20">

        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-sm fixed left-0 top-20 bottom-0 flex flex-col justify-between py-6 px-4">
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
                      ? 'bg-emerald-500 text-white'
                      : 'text-emerald-500 hover:bg-gray-50'
                  }`}
                >
                  <Icono size={18} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Usuario abajo */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 p-3 border-2 border-emerald-400 rounded-2xl">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Users size={18} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Jesús Daniel Gonzalez</p>
                <p className="text-xs text-gray-400">Codedrilos</p>
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