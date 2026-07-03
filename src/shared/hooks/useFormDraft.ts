import { useCallback, useEffect, useRef } from 'react'

const DRAFT_TTL_MS = 60 * 60 * 1000

type DraftEnvelope<T> = { data: T; savedAt: number }

function readDraft<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const envelope = JSON.parse(raw) as DraftEnvelope<T>
    if (Date.now() - envelope.savedAt > DRAFT_TTL_MS) {
      localStorage.removeItem(key)
      return null
    }
    return envelope.data
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

function writeDraft<T>(key: string, data: T) {
  const envelope: DraftEnvelope<T> = { data, savedAt: Date.now() }
  localStorage.setItem(key, JSON.stringify(envelope))
}

type UseFormDraftOptions<T> = {
  key: string
  exclude?: (keyof T)[]
  debounceMs?: number
}

export function useFormDraft<T extends Record<string, unknown>>({
  key,
  exclude = [],
  debounceMs = 800,
}: UseFormDraftOptions<T>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const storageKey = `form-draft:${key}`

  const restoreDraft = useCallback((): Partial<T> | null => {
    return readDraft<Partial<T>>(storageKey)
  }, [storageKey])

  const saveDraft = useCallback(
    (values: T) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        const safe = { ...values }
        for (const field of exclude) {
          delete safe[field]
        }
        writeDraft(storageKey, safe)
      }, debounceMs)
    },
    [storageKey, exclude, debounceMs],
  )

  const clearDraft = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    localStorage.removeItem(storageKey)
  }, [storageKey])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { restoreDraft, saveDraft, clearDraft }
}
