import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppToast } from '@/shared/components/appToastContext'
import { extractFileName, getPresignedUrl } from '@/services/filesService'
import { FILE_LIMITS, validateFile } from '@/shared/security/inputRules'
import { estudianteService } from '../services/estudiante.service'
import type { CurriculumData, EditContactFormData, StudentProfile } from '../types/profile.types'

const getUserId = () => Number(localStorage.getItem('userId'))

const EMPTY_PROFILE: StudentProfile = {
  id: '',
  firstName: 'Estudiante',
  lastName: '',
  email: '',
  phone: '',
  career: 'Programa no especificado',
  institutionalEmail: '',
  birthDate: '',
  civilStatus: 'No especificado',
  address: 'No especificado',
  academicStatus: 'Estudiante',
}

const buildCurriculumData = (profile: StudentProfile): CurriculumData => {
  if (!profile.cvUrl) {
    return {
      fileName: 'Aun no has subido tu CV',
      uploadDate: 'Sin archivo cargado',
    }
  }

  // El almacenamiento guarda el archivo con un UUID; se muestra un nombre legible.
  const nombreCompleto = `${profile.firstName} ${profile.lastName}`.trim()
  const extension = extractFileName(profile.cvUrl).split('.').pop()?.toLowerCase()

  return {
    fileName: nombreCompleto ? `CV - ${nombreCompleto}.${extension ?? 'pdf'}` : 'Tu curriculum',
    uploadDate: 'Disponible en tu perfil',
    url: profile.cvUrl,
  }
}

export const useProfile = () => {
  const userId = getUserId()
  const toast = useAppToast()
  const queryClient = useQueryClient()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const profileQuery = useQuery({
    queryKey: ['estudiante', 'perfil', userId],
    queryFn: () => estudianteService.getPerfil(userId),
    enabled: !!userId,
  })

  // El perfil viene siempre del servidor: los cambios se guardan y se recargan.
  const studentProfile = useMemo(
    () => profileQuery.data ?? EMPTY_PROFILE,
    [profileQuery.data]
  )

  const curriculumData = useMemo(() => buildCurriculumData(studentProfile), [studentProfile])

  const imageMutation = useMutation({
    mutationFn: (file: File) =>
      estudianteService.actualizarArchivos(userId, { fotoPerfil: file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'perfil', userId] })
    },
  })

  const cvMutation = useMutation({
    mutationFn: (file: File) =>
      estudianteService.actualizarArchivos(userId, { cv: file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'perfil', userId] })
    },
  })

  const contactMutation = useMutation({
    mutationFn: (data: EditContactFormData) =>
      estudianteService.actualizarContacto(userId, studentProfile, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'perfil', userId] })
    },
  })

  const handleEditClick = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
  }

  const handleOpenImageModal = () => {
    setIsImageModalOpen(true)
  }

  const handleCloseImageModal = () => {
    if (!imageMutation.isPending) setIsImageModalOpen(false)
  }

  const describeApiError = (error: unknown, fallback: string) => {
    const apiError = error as {
      title?: string
      detail?: string
      message?: string
      detalle?: string
    }
    return apiError.detalle || apiError.detail || apiError.message || apiError.title || fallback
  }

  const handleSaveProfileImage = async (file: File) => {
    try {
      await imageMutation.mutateAsync(file)
      toast.success('Foto actualizada', 'El cambio ya se guardo en tu perfil.')
      setIsImageModalOpen(false)
    } catch (error) {
      toast.error(
        'No se pudo actualizar la foto',
        describeApiError(error, 'La API rechazo el archivo. Intenta nuevamente.')
      )
      throw error
    }
  }

  const handleUploadCV = async (file: File) => {
    const fileError = validateFile(file, {
      allowedTypes: ['application/pdf'],
      label: 'El curriculum',
      maxBytes: FILE_LIMITS.documentBytes,
    })

    if (fileError) {
      toast.error('Archivo no valido', fileError)
      return
    }

    try {
      await cvMutation.mutateAsync(file)
      toast.success('Curriculum actualizado', 'Tu nuevo CV ya se guardo en el perfil.')
    } catch (error) {
      toast.error(
        'No se pudo subir el CV',
        describeApiError(error, 'La API rechazo el archivo. Intenta nuevamente.')
      )
      throw error
    }
  }

  const handleSaveContact = async (data: EditContactFormData) => {
    try {
      await contactMutation.mutateAsync(data)
      toast.success('Contacto actualizado', 'Tus datos se guardaron correctamente.')
      setIsContactModalOpen(false)
    } catch (error) {
      toast.error(
        'No se pudo guardar',
        describeApiError(error, 'Intenta de nuevo en unos segundos.')
      )
      throw error
    }
  }

  const handleDownloadCV = async () => {
    if (!curriculumData.url) {
      toast.info('CV no disponible', 'Este perfil todavia no tiene un archivo para consultar.')
      return
    }

    const viewer = window.open('', '_blank')
    if (!viewer) {
      toast.warning('Ventana bloqueada', 'Permite ventanas emergentes para abrir el CV.')
      return
    }
    viewer.opener = null

    try {
      const freshUrl = await getPresignedUrl(curriculumData.url)
      viewer.location.href = freshUrl
    } catch {
      viewer.close()
      toast.error('No se pudo abrir el CV', 'Intenta nuevamente en unos segundos.')
    }
  }

  return {
    studentProfile,
    curriculumData,
    isEditing: false,
    isContactModalOpen,
    isImageModalOpen,
    isSavingImage: imageMutation.isPending,
    isUploadingCV: cvMutation.isPending,
    isSavingContact: contactMutation.isPending,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    handleEditClick,
    handleCloseContactModal,
    handleOpenImageModal,
    handleCloseImageModal,
    handleSaveProfileImage,
    handleUploadCV,
    handleSaveContact,
    handleDownloadCV,
  }
}
