import { useState } from 'react'
import { useAppToast } from '@/shared/components/appToastContext'
import { FILE_LIMITS, validateFile } from '@/shared/security/inputRules'
import { useActualizarArchivosEmpresa } from '../hooks/useEmpresa'
import type { EmpresaArchivos, EmpresaPerfil } from '../types/empresa.types'
import { CampoArchivo } from './CampoArchivo'

interface DocumentosEmpresaProps {
  perfil: EmpresaPerfil
}

type DocumentoKey = keyof Pick<
  EmpresaArchivos,
  'situacionFiscal' | 'docExistencia' | 'repDocCargo' | 'repFotoIne'
>

const DOCUMENTOS: { key: DocumentoKey; label: string; descripcion: string; urlField: keyof EmpresaPerfil }[] = [
  { key: 'situacionFiscal', label: 'Constancia de situacion fiscal', descripcion: 'PDF o imagen', urlField: 'situacionFiscalUrl' },
  { key: 'docExistencia', label: 'Documento de existencia legal', descripcion: 'PDF o imagen', urlField: 'docValidacionUrl' },
  { key: 'repDocCargo', label: 'Documento del representante', descripcion: 'PDF o imagen', urlField: 'repDocCargoUrl' },
  { key: 'repFotoIne', label: 'INE del representante', descripcion: 'PDF o imagen', urlField: 'repFotoIneUrl' },
]

const DOCUMENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg']

export const DocumentosEmpresa = ({ perfil }: DocumentosEmpresaProps) => {
  const toast = useAppToast()
  const { mutateAsync, isPending } = useActualizarArchivosEmpresa()
  const [activeKey, setActiveKey] = useState<DocumentoKey | null>(null)

  const handleUpload = async (key: DocumentoKey, label: string, file: File) => {
    const fileError = validateFile(file, {
      allowedTypes: DOCUMENT_TYPES,
      label: `El archivo "${label}"`,
      maxBytes: FILE_LIMITS.documentBytes,
    })

    if (fileError) {
      toast.error('Archivo no valido', fileError)
      return
    }

    setActiveKey(key)
    try {
      await mutateAsync({ [key]: file } as EmpresaArchivos)
      toast.success('Documento actualizado', `${label} se guardo correctamente.`)
    } catch {
      toast.error('No se pudo subir', 'La API rechazo el archivo. Intenta nuevamente.')
    } finally {
      setActiveKey(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-100">
      <h2 className="text-lg font-bold text-gray-800 mb-1">Documentos de la empresa</h2>
      <p className="mb-4 text-sm text-slate-500">Sube o reemplaza los documentos de validacion.</p>
      <div className="flex flex-col gap-3">
        {DOCUMENTOS.map((doc) => (
          <CampoArchivo
            key={doc.key}
            label={doc.label}
            descripcion={doc.descripcion}
            currentUrl={perfil[doc.urlField] as string | null}
            accept=".pdf,.png,.jpg,.jpeg"
            isUploading={isPending && activeKey === doc.key}
            onSelect={(file) => void handleUpload(doc.key, doc.label, file)}
          />
        ))}
      </div>
    </div>
  )
}
