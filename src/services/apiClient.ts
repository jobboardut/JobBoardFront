export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function buildApiUrl(path: string): string {
  // Permite usar rutas relativas en desarrollo sin backend configurado.
  if (!API_BASE_URL) {
    return path
  }

  return `${API_BASE_URL.replace(/\/$/, '')}${path}`
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  // Punto central para headers y manejo base de errores HTTP.
  const response = await fetch(buildApiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
