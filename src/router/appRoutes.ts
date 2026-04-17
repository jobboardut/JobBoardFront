export type AppRoute = 'dashboard' | 'validation' | 'management' | 'publications' | 'tracking' | 'settings'

const hashToRoute: Record<string, AppRoute> = {
  '#dashboard': 'dashboard',
  '#validacion': 'validation',
  '#gestion': 'management',
  '#publicaciones': 'publications',
  '#tracking': 'tracking',
  '#configuracion': 'settings',
}

export function resolveRouteFromHash(hash: string): AppRoute {
  // Fallback seguro para hashes desconocidos.
  return hashToRoute[hash] ?? 'dashboard'
}

export function routeToHash(route: AppRoute): string {
  if (route === 'management') {
    return '#gestion'
  }

  if (route === 'settings') {
    return '#configuracion'
  }

  if (route === 'publications') {
    return '#publicaciones'
  }

  if (route === 'tracking') {
    return '#tracking'
  }

  if (route === 'validation') {
    return '#validacion'
  }

  return '#dashboard'
}