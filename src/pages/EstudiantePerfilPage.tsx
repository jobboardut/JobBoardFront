import { PageWrapper } from '@/components/layout/PageWrapper'
import {
  ContactSection,
  CurriculumSection,
  ProfileHeader,
  ProfileHeaderBar,
  StatusBadge,
} from '@/features/profile/components'
import { EditContactModal } from '@/features/profile/modals/EditContactModal'
import { useProfile } from '@/features/profile/hooks'

export const EstudiantePerfilPage = () => {
  const {
    studentProfile,
    curriculumData,
    isContactModalOpen,
    handleEditClick,
    handleCloseContactModal,
    handleSaveContact,
  } = useProfile()

  return (
    <>
      <EditContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        onSave={handleSaveContact}
        initialData={{
          phone: studentProfile.phone,
          email: studentProfile.email,
          civilStatus: studentProfile.civilStatus || '',
          address: studentProfile.address || '',
        }}
      />

      <PageWrapper role="estudiante">
      <div className="flex h-screen flex-col overflow-hidden bg-[#f6f5f3] text-[#1d2538]">
        <ProfileHeaderBar />

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Columna izquierda: Perfil y Contacto */}
              <div className="space-y-8 lg:col-span-3">
                {/* Tarjeta de Perfil */}
                <ProfileHeader profile={studentProfile} />

                {/* Tarjeta de Contacto */}
                <ContactSection
                  email={studentProfile.email}
                  phone={studentProfile.phone}
                  civilStatus={studentProfile.civilStatus}
                  address={studentProfile.address}
                  onEditClick={handleEditClick}
                />
              </div>

              {/* Columna derecha */}
              <div className="space-y-8 lg:col-span-2">
                {/* Estado */}
                <StatusBadge status="Estudiante" />

                {/* Mi Curriculum */}
                <CurriculumSection
                  fileName={curriculumData.fileName}
                  uploadDate={curriculumData.uploadDate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </PageWrapper>
    </>
  )
}
