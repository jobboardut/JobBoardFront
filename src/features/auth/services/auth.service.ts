import api from '@/services/api'
import type { LoginRequest, LoginResponse, RegistroEmpresaRequest } from '../types/auth.types'

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

export const authService = {

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data) as LoginResponse

    localStorage.setItem('token', response.token)
    localStorage.setItem('userId', String(response.usuario.id))
    localStorage.setItem('rol', response.usuario.rol)

    return response
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('rol')
  },

  registroEmpresa: async (data: RegistroEmpresaRequest) => {
    const formData = buildRegistroEmpresaFormData(data)
    return api.post('/registro/empresa', formData)
  },

}
