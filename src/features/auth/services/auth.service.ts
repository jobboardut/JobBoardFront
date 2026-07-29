import api from '@/services/api'
import { clearSession, saveSession } from './session'
import type { LoginRequest, LoginResponse, RegistroEmpresaRequest, RegistroEstudianteRequest } from '../types/auth.types'

// Tiempo extra para las subidas de archivos del registro (el timeout global de axios es de 10s).
const UPLOAD_TIMEOUT = 60000

const appendFileOrEmpty = (formData: FormData, key: string, file?: File | null) => {
  if (file) {
    formData.append(key, file)
    return
  }

  formData.append(key, '')
}

const buildRegistroEmpresaFormData = (data: RegistroEmpresaRequest) => {
  const formData = new FormData()

  formData.append('Email', data.email)
  formData.append('Password', data.password)
  formData.append('NombreEmpresa', data.nombreEmpresa)
  formData.append('TelefonoEmpresa', data.telefonoEmpresa)
  formData.append('Direccion', data.direccion)
  formData.append('CorreoEmpresa', data.correoEmpresa)
  formData.append('SectorId', data.sectorId)
  formData.append('SitioWeb', data.sitioWeb)
  formData.append('Descripcion', data.descripcion)
  formData.append('RepNombre', data.repNombre)
  formData.append('RepApellidos', data.repApellidos)
  formData.append('RepPuesto', data.repPuesto)
  formData.append('RepTelefono', data.repTelefono)
  formData.append('RepCorreo', data.repCorreo)
  appendFileOrEmpty(formData, 'Logo', data.logo)
  appendFileOrEmpty(formData, 'SituacionFiscal', data.situacionFiscal)
  appendFileOrEmpty(formData, 'DocExistencia', data.docExistencia)
  appendFileOrEmpty(formData, 'RepDocCargo', data.repDocCargo)
  appendFileOrEmpty(formData, 'RepFotoIne', data.repFotoIne)

  return formData
}

const buildRegistroEstudianteFormData = (data: RegistroEstudianteRequest) => {
  const formData = new FormData()

  formData.append('Email', data.email)
  formData.append('Password', data.password)
  formData.append('Nombre', data.nombres)
  formData.append('Nombres', data.nombres)
  formData.append('Apellidos', data.apellidos)
  formData.append('Direccion', data.direccion)
  formData.append('FechaNacimiento', data.fechaNacimiento)
  formData.append('EstadoCivil', data.estadoCivil)
  formData.append('Matricula', data.matricula)
  formData.append('Telefono', data.telefono ?? '')
  formData.append('ProgramaEducativoId', data.programaEducativoId)
  formData.append('CarreraId', data.programaEducativoId)
  formData.append('ProgramaEducativo', data.programaEducativo)
  formData.append('EstatusAcademico', data.estatusAcademico ?? 'Estudiante')
  appendFileOrEmpty(formData, 'FotoPerfil', data.fotoPerfil)
  appendFileOrEmpty(formData, 'Cv', data.cv)
  appendFileOrEmpty(formData, 'DocProbatorio', data.docProbatorio)

  return formData
}

export const authService = {

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data) as LoginResponse

    saveSession({
      token: response.token,
      userId: response.usuario.id,
      rol: response.usuario.rol,
      estatusValidacion: response.usuario.estatusValidacion,
      ultimaObservacion: response.usuario.ultimaObservacion,
    })

    return response
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout')
    } finally {
      clearSession()
    }
  },

  registroEmpresa: async (data: RegistroEmpresaRequest) => {
    const formData = buildRegistroEmpresaFormData(data)
    // Los registros suben archivos (multipart), por eso necesitan mas tiempo que el timeout global.
    return api.post('/registro/empresa', formData, { timeout: UPLOAD_TIMEOUT })
  },

  registroEstudiante: async (data: RegistroEstudianteRequest) => {
    const formData = buildRegistroEstudianteFormData(data)
    return api.post('/registro/estudiante', formData, { timeout: UPLOAD_TIMEOUT })
  },

}
