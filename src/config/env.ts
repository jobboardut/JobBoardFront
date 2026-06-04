export const config = {
  // En dev se usa la ruta relativa '/api', que el proxy de Vite reenvía al
  // backend (http://localhost:5269). En producción se define VITE_API_URL.
  apiUrl: (import.meta.env.VITE_API_URL as string) || '/api',
  isDev: import.meta.env.VITE_ENV === 'development',
} as const