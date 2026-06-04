import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { estudianteService } from '../services/estudiante.service'
import { extractFileName, getPresignedUrl } from '@/services/filesService'
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
      fileName: 'CV no disponible',
      uploadDate: 'Sin archivo cargado',
    }
  }

  return {
    // extractFileName descarta el query-string de la pre-signed URL antes de
    // tomar el nombre del archivo, evitando "?X-Amz-..." en el texto visible.
    fileName: extractFileName(profile.cvUrl) || 'Curriculum del estudiante',
    uploadDate: 'Disponible en perfil',
    url: profile.cvUrl,
  }
}

export const useProfile = () => {
  const userId = getUserId()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactOverrides, setContactOverrides] =
    useState<Partial<Pick<StudentProfile, 'phone' | 'email' | 'civilStatus' | 'address'>>>({})

  const profileQuery = useQuery({
    queryKey: ['estudiante', 'perfil', userId],
    queryFn: () => estudianteService.getPerfil(userId),
    enabled: !!userId,
  })

  const studentProfile = useMemo(
    () => ({
      ...(profileQuery.data ?? EMPTY_PROFILE),
      ...contactOverrides,
    }),
    [contactOverrides, profileQuery.data]
  )

  const curriculumData = useMemo(() => buildCurriculumData(studentProfile), [studentProfile])

  const handleEditClick = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
  }

  const handleSaveContact = (data: EditContactFormData) => {
    setContactOverrides({
      phone: data.phone,
      email: data.email,
      civilStatus: data.civilStatus,
      address: data.address,
    })
    setIsContactModalOpen(false)
  }

  const handleDownloadCV = async () => {
    if (!studentProfile.cvUrl) return

    // Abre la pestaña en el mismo gesto del usuario (evita bloqueador de pop-ups)
    // y luego pide una Pre-signed URL fresca al backend, garantizando que
    // el PDF sea accesible aunque la URL embebida en el perfil haya expirado.
    const viewer = window.open('', '_blank')
    if (!viewer) return
    viewer.opener = null

    try {
      const freshUrl = await getPresignedUrl(studentProfile.cvUrl)
      viewer.location.href = freshUrl
    } catch {
      viewer.close()
    }
  }

  return {
    studentProfile,
    curriculumData,
    isEditing: false,
    isContactModalOpen,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    handleEditClick,
    handleCloseContactModal,
    handleSaveContact,
    handleDownloadCV,
  }
}
