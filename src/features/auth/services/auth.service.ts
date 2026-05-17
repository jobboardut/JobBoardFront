import api from '@/services/api'
import type { LoginRequest, LoginResponse, RegistroEmpresaRequest, RegistroEstudianteRequest } from '../types/auth.types'

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

const clearAuthSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('rol')
}

export const authService = {

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data) as LoginResponse

    localStorage.setItem('token', response.token)
    localStorage.setItem('userId', String(response.usuario.id))
    localStorage.setItem('rol', response.usuario.rol)

    return response
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout')
    } finally {
      clearAuthSession()
    }
  },

  registroEmpresa: async (data: RegistroEmpresaRequest) => {
    const formData = buildRegistroEmpresaFormData(data)
    return api.post('/registro/empresa', formData)
  },

  registroEstudiante: async (data: RegistroEstudianteRequest) => {
    const payload = {
      email: data.email,
      password: data.password,
      nombre: data.nombres,
      nombres: data.nombres,
      apellidos: data.apellidos,
      direccion: data.direccion,
      fechaNacimiento: data.fechaNacimiento,
      estadoCivil: data.estadoCivil,
      programaEducativo: data.programaEducativo,
    }

    return api.post('/registro/estudiante', payload)
  },

}
