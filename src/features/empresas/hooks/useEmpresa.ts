import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { empresaService } from '../services/empresa.service'
import type {
  CambiarEstatusPostulacionRequest,
  CreateVacanteRequest,
  EmpresaArchivos,
  EmpresaPerfilUpdateRequest,
  UpdateEstatusRequest,
} from '../types/empresa.types'

const getUserId = () => Number(localStorage.getItem('userId'))

export const useEmpresaPerfil = () => {
  const userId = getUserId()

  return useQuery({
    queryKey: ['empresa', 'perfil', userId],
    queryFn: () => empresaService.getPerfil(userId),
    enabled: !!userId,
  })
}

export const useActualizarPerfil = () => {
  const userId = getUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EmpresaPerfilUpdateRequest) => empresaService.actualizarPerfil(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa', 'perfil', userId] })
    },
  })
}

export const useActualizarArchivosEmpresa = () => {
  const userId = getUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (archivos: EmpresaArchivos) => empresaService.actualizarArchivos(userId, archivos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa', 'perfil', userId] })
    },
  })
}

export const useVacantes = () => {
  const empresaId = getUserId()

  return useQuery({
    queryKey: ['empresa', 'vacantes', empresaId],
    queryFn: () => empresaService.getVacantes(empresaId),
    enabled: !!empresaId,
  })
}

export const useVacante = (publicacionId: number) => {
  const empresaId = getUserId()

  return useQuery({
    queryKey: ['empresa', 'vacante', empresaId, publicacionId],
    queryFn: () => empresaService.getVacante(empresaId, publicacionId),
    enabled: !!empresaId && !!publicacionId,
  })
}

export const useCrearVacante = () => {
  const empresaId = getUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVacanteRequest) => empresaService.crearVacante(empresaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa', 'vacantes', empresaId] })
    },
  })
}

export const useActualizarEstatusVacante = () => {
  const empresaId = getUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ publicacionId, data }: { publicacionId: number; data: UpdateEstatusRequest }) =>
      empresaService.actualizarEstatusVacante(publicacionId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['empresa', 'vacantes', empresaId] })
      queryClient.invalidateQueries({ queryKey: ['empresa', 'vacante', empresaId, variables.publicacionId] })
      queryClient.invalidateQueries({ queryKey: ['empresa', 'postulantes', empresaId, variables.publicacionId] })
    },
  })
}

export const usePostulantes = (publicacionId: number) => {
  const empresaId = getUserId()

  return useQuery({
    queryKey: ['empresa', 'postulantes', empresaId, publicacionId],
    queryFn: () => empresaService.getPostulantes(empresaId, publicacionId),
    enabled: !!empresaId && !!publicacionId,
  })
}

export const useCambiarEstatusPostulante = (publicacionId: number) => {
  const empresaId = getUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postulacionId, ...data }: CambiarEstatusPostulacionRequest & { postulacionId: number }) =>
      empresaService.cambiarEstatusPostulante(empresaId, postulacionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa', 'postulantes', empresaId, publicacionId] })
      // Contratar consume cupo: refresca tambien las vacantes.
      queryClient.invalidateQueries({ queryKey: ['empresa', 'vacantes', empresaId] })
      queryClient.invalidateQueries({ queryKey: ['empresa', 'vacante', empresaId, publicacionId] })
    },
  })
}
