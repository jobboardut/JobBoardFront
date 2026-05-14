import { PageWrapper } from '@/components/layout/PageWrapper'
import { ContactSection } from '@/features/estudiantes/components/ContactSection'
import { CurriculumSection } from '@/features/estudiantes/components/CurriculumSection'
import { ProfileHeader } from '@/features/estudiantes/components/ProfileHeader'
import { ProfileHeaderBar } from '@/features/estudiantes/components/ProfileHeaderBar'
import { StatusBadge } from '@/features/estudiantes/components/StatusBadge'
import { EditContactModal } from '@/features/estudiantes/components/EditContactModal'
import { useProfile } from '@/features/estudiantes/hooks/useProfile'

export const EstudiantePerfilPage = () => {
  const {
    studentProfile,
    curriculumData,
    isContactModalOpen,
    isLoading,
    isError,
    handleEditClick,
    handleCloseContactModal,
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

      <PageWrapper role="Estudiante">
        <div className="flex h-screen flex-col overflow-hidden bg-white text-[#1d2538]">
          <ProfileHeaderBar />

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-400">Cargando perfil...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-red-400">Error al cargar el perfil. Intenta de nuevo.</p>
          </div>
        ) : (
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
                <StatusBadge status={studentProfile.academicStatus ?? 'Estudiante'} />

                {/* Mi Curriculum */}
                <CurriculumSection
                  fileName={curriculumData.fileName}
                  uploadDate={curriculumData.uploadDate}
                  url={curriculumData.url}
                  onPreview={handleDownloadCV}
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
