import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
      fileName: 'CV no disponible',
      uploadDate: 'Sin archivo cargado',
    }
  }

  const fileName = decodeURIComponent(profile.cvUrl.split('/').pop() || 'Curriculum del estudiante')

  return {
    fileName,
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

  const handleDownloadCV = () => {
    if (curriculumData.url) {
      window.open(curriculumData.url, '_blank', 'noopener,noreferrer')
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
