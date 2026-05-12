import { useState } from 'react'
import type { StudentProfile } from '../types/profile.types'
import type { EditContactFormData } from '../modals/EditContactModal'

export const useProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    id: '1',
    firstName: 'Jesus Daniel',
    lastName: 'Gonzalez Ochoa',
    email: 'jesus@uttecam.com',
    phone: '2491163536',
    career: 'Ingeniería en Desarrollo y Gestión de Software Multiplataforma',
    institutionalEmail: 'jesus.gonzalez@uttecam.edu.mx',
    birthDate: '1967-03-18',
    bio: 'Estudiante apasionado por la tecnología y el desarrollo de software',
    civilStatus: 'Soltero',
    address: 'Calle Principal 123, Apt 4B, Ciudad de México',
  })

  const curriculumData = {
    fileName: 'CV_Jesus_Daniel_Gonzalez.pdf',
    uploadDate: 'Subido hace 2 meses',
  }

  const handleEditClick = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
  }

  const handleSaveContact = (data: EditContactFormData) => {
    setStudentProfile((prev) => ({
      ...prev,
      phone: data.phone,
      email: data.email,
      civilStatus: data.civilStatus,
      address: data.address,
    }))
    setIsContactModalOpen(false)
  }

  const handleDownloadCV = () => {
    console.log('Descargando CV...')
  }

  return {
    studentProfile,
    curriculumData,
    isEditing,
    isContactModalOpen,
    handleEditClick,
    handleCloseContactModal,
    handleSaveContact,
    handleDownloadCV,
  }
}
