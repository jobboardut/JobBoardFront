import { useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { APP_ICONS, APP_ICON_STROKE_WIDTH } from '@/config/iconConfig'
import './route-transition.css'

const TRANSITION_MS = 720

type RouteTransitionProps = {
  label?: string
}

export const RouteTransition = ({ label = 'Cargando vista' }: RouteTransitionProps) => {
  const location = useLocation()
  const rootRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)
  const isFirstRender = useRef(true)
  const LoadingIcon = APP_ICONS.loading

  const showTransition = useCallback(() => {
    const root = rootRef.current
    if (!root) return

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    root.classList.remove('is-visible')
    void root.offsetWidth
    root.classList.add('is-visible')

    timeoutRef.current = window.setTimeout(() => {
      root.classList.remove('is-visible')
    }, TRANSITION_MS)
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    showTransition()
  }, [location.hash, location.pathname, location.search, showTransition])

  useEffect(() => {
    const handleNavigationIntent = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return
      }

      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null

      if (!anchor || anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      const targetAttr = anchor.getAttribute('target')

      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (targetAttr && targetAttr !== '_self') return

      const nextUrl = new URL(href, window.location.href)
      const currentUrl = new URL(window.location.href)

      if (nextUrl.origin !== currentUrl.origin) return
      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash === currentUrl.hash
      ) {
        return
      }

      showTransition()
    }

    document.addEventListener('click', handleNavigationIntent, true)

    return () => {
      document.removeEventListener('click', handleNavigationIntent, true)
    }
  }, [showTransition])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [location.hash, location.pathname, location.search])

  return (
    <div className="route-transition" ref={rootRef} aria-hidden="true">
      <div className="route-transition__bar" />
      <div className="route-transition__pill">
        <span className="route-transition__spinner">
          <LoadingIcon size={18} strokeWidth={APP_ICON_STROKE_WIDTH} />
        </span>
        <span>{label}</span>
      </div>
    </div>
  )
}

export const RouteLoadingFallback = () => {
  const LoadingIcon = APP_ICONS.loading

  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__spinner">
        <LoadingIcon size={22} strokeWidth={APP_ICON_STROKE_WIDTH} />
      </span>
      <div>
        <strong>Cargando vista</strong>
        <p>Preparando la pantalla solicitada.</p>
      </div>
    </div>
  )
}
