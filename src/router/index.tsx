import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { EstudianteDashboardPage } from '@/pages/EstudianteDashboardPage'
import { EstudiantePublicacionesPage } from '@/pages/EstudiantePublicacionesPage'
import { EstudiantePerfilPage } from '@/pages/EstudiantePerfilPage'
import { EstudianteSeguimientoPage } from '@/pages/EstudianteSeguimientoPage'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.ESTUDIANTE_DASHBOARD} replace />} />

        {/*
          Rutas de auth desactivadas temporalmente.
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SELECCION_CUENTA} element={<SeleccionCuenta />} />
          <Route path="/registro/estudiante" element={<RegistroEstudiante />} />
          <Route path="/registro/empresa" element={<RegistroEmpresa />} />
          <Route path="/registro/confirmacion" element={<RegistroCompletado />} />
        */}

        {/* Rutas privadas desactivadas temporalmente */}
        {/*
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PrivateRoute>
                <div className="p-8">Dashboard — en construcción</div>
              </PrivateRoute>
            }
          />
        */}

        {/*
          <Route
            path={ROUTES.EMPRESA_DASHBOARD}
            element={
              <PrivateRoute>
                <EmpresaDashboardPage />
              </PrivateRoute>
            }
          />
        */}

        <Route
          path={ROUTES.ESTUDIANTE_DASHBOARD}
          element={<EstudianteDashboardPage />}
        />

        <Route
          path={ROUTES.ESTUDIANTE_PUBLICACIONES}
          element={<EstudiantePublicacionesPage />}
        />

        <Route
          path={ROUTES.ESTUDIANTE_PERFIL}
          element={<EstudiantePerfilPage />}
        />

        <Route
          path={ROUTES.ESTUDIANTE_SEGUIMIENTO}
          element={<EstudianteSeguimientoPage />}
        />

        <Route path="*" element={<div className="p-8">404</div>} />
      </Routes>
    </BrowserRouter>
  )
}