export interface EditContactFormData {
  phone: string
  email: string
  civilStatus: string
  address: string
}

export interface EditContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EditContactFormData) => void
  initialData: EditContactFormData
}
