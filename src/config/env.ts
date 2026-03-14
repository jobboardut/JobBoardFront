export const config = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  isDev: import.meta.env.VITE_ENV === 'development',
} as const