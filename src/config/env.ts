export const config = {
  apiUrl: (import.meta.env.VITE_API_URL as string) || 'https://utjl.runasp.net/api',
  isDev: import.meta.env.VITE_ENV === 'development',
} as const