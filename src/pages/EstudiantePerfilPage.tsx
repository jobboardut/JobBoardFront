import { PageWrapper } from '@/components/layout/PageWrapper'
import { ContactSection } from '@/features/estudiantes/components/ContactSection'
import { CurriculumSection } from '@/features/estudiantes/components/CurriculumSection'
import { ProfileHeader } from '@/features/estudiantes/components/ProfileHeader'
import { ProfileImageModal } from '@/features/estudiantes/components/ProfileImageModal'
import { ProfileHeaderBar } from '@/features/estudiantes/components/ProfileHeaderBar'
import { StatusBadge } from '@/features/estudiantes/components/StatusBadge'
import { EditContactModal } from '@/features/estudiantes/components/EditContactModal'
import { useProfile } from '@/features/estudiantes/hooks/useProfile'
import { ErrorState, LoadingState } from '@/shared/components/StateFeedback'

export const EstudiantePerfilPage = () => {
  const {
    studentProfile,
    curriculumData,
    isContactModalOpen,
    isImageModalOpen,
    isSavingImage,
    isUploadingCV,
    isLoading,
    isError,
    handleEditClick,
    handleCloseContactModal,
    handleOpenImageModal,
    handleCloseImageModal,
    handleSaveProfileImage,
    handleUploadCV,
    handleSaveContact,
    handleDownloadCV,
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
      {isImageModalOpen && (
        <ProfileImageModal
          initialUrl={studentProfile.profileImage}
          isSaving={isSavingImage}
          onClose={handleCloseImageModal}
          onSave={handleSaveProfileImage}
        />
      )}

      <PageWrapper role="Estudiante">
        <div className="flex min-h-full flex-col bg-white text-[#1d2538]">
          <ProfileHeaderBar />

        {isLoading ? (
          <div className="flex-1 p-6">
            <LoadingState title="Cargando perfil" message="Estamos consultando tu informacion." />
          </div>
        ) : isError ? (
          <div className="flex-1 p-6">
            <ErrorState title="Error al cargar el perfil" message="Intenta actualizar la pagina." />
          </div>
        ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Columna izquierda: Perfil y Contacto */}
              <div className="space-y-8 lg:col-span-3">
                {/* Tarjeta de Perfil */}
                <ProfileHeader profile={studentProfile} onEditImage={handleOpenImageModal} />

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
                <StatusBadge status={studentProfile.academicStatus ?? 'Estudiante'} />

                {/* Mi Curriculum */}
                <CurriculumSection
                  fileName={curriculumData.fileName}
                  uploadDate={curriculumData.uploadDate}
                  url={curriculumData.url}
                  onPreview={handleDownloadCV}
                  onUpload={handleUploadCV}
                  isUploading={isUploadingCV}
                />
              </div>
            </div>
          </div>
        </div>
        )}
        </div>
      </PageWrapper>
    </>
  )
}
