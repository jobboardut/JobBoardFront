export interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  career: string
  institutionalEmail: string
  birthDate: string
  profileImage?: string
  bio?: string
  civilStatus?: string
  address?: string
}

export interface ContactInfo {
  type: 'email' | 'phone' | 'website'
  value: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}

export interface CurriculumData {
  fileName: string
  uploadDate: string
  url?: string
}
