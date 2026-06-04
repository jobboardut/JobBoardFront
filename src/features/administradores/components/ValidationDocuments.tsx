import { FileText, ImageOff, ExternalLink } from 'lucide-react'
import { APP_ICON_SIZE, APP_ICON_STROKE_WIDTH } from '../../../config/iconConfig'
import type { ValidationDocument } from '../types/admin.types'

type ValidationDocumentsProps = {
  documentos: ValidationDocument[]
  isLoading: boolean
  isError: boolean
}

const card: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  border: '1px solid #e6e0d7',
  borderRadius: 12,
  background: '#faf9f7',
}

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: 12,
}

function ValidationDocuments({ documentos, isLoading, isError }: ValidationDocumentsProps) {
  if (isLoading) {
    return <p style={{ color: '#6b7280', fontSize: 14 }}>Cargando documentos…</p>
  }

  if (isError) {
    return <p style={{ color: '#dc2626', fontSize: 14 }}>No se pudieron cargar los documentos.</p>
  }

  const conArchivo = documentos.filter((doc) => Boolean(doc.url))
  if (conArchivo.length === 0) {
    return <p style={{ color: '#6b7280', fontSize: 14 }}>El usuario no ha cargado documentos.</p>
  }

  return (
    <div style={grid}>
      {documentos.map((doc) => (
        <div key={doc.tipo} style={card}>
          <small style={{ color: '#4a5f99', fontWeight: 600 }}>{doc.tipo}</small>

          {!doc.url ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: 13 }}>
              <ImageOff size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
              No cargado
            </span>
          ) : doc.categoria === 'imagen' ? (
            <a href={doc.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${doc.tipo} en una pestaña nueva`}>
              <img
                src={doc.url}
                alt={doc.tipo}
                loading="lazy"
                style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 8, border: '1px solid #e6e0d7' }}
              />
            </a>
          ) : (
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #009A4D',
                color: '#009A4D',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              <FileText size={APP_ICON_SIZE} strokeWidth={APP_ICON_STROKE_WIDTH} />
              Ver PDF
              <ExternalLink size={14} strokeWidth={APP_ICON_STROKE_WIDTH} />
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

export default ValidationDocuments
