import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function readEnvLocalValue(key) {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) {
    return undefined
  }

  const content = readFileSync(envPath, 'utf8')
  const lines = content.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const envKey = trimmed.slice(0, separatorIndex).trim()
    if (envKey !== key) {
      continue
    }

    return trimmed.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, '')
  }

  return undefined
}

function compactJsonPreview(value) {
  const json = JSON.stringify(value)
  if (!json) {
    return ''
  }

  return json.length > 240 ? `${json.slice(0, 240)}...` : json
}

async function testEndpoint(baseUrl, endpoint, token) {
  const normalizedBase = baseUrl.replace(/\/$/, '')
  const url = `${normalizedBase}${endpoint}`

  const headers = {
    Accept: 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, { method: 'GET', headers })

    const text = await response.text()
    let payload = text

    try {
      payload = text ? JSON.parse(text) : ''
    } catch {
      // Leave raw text when response is not JSON.
    }

    return {
      endpoint,
      status: response.status,
      ok: response.ok,
      preview: typeof payload === 'string' ? payload.slice(0, 240) : compactJsonPreview(payload),
    }
  } catch (error) {
    return {
      endpoint,
      status: null,
      ok: false,
      preview: error instanceof Error ? error.message : String(error),
    }
  }
}

async function main() {
  const baseUrl =
    process.env.API_URL ||
    process.env.VITE_API_URL ||
    readEnvLocalValue('VITE_API_URL')

  if (!baseUrl) {
    console.error('No se encontro API_URL o VITE_API_URL (.env.local).')
    process.exit(1)
  }

  const token = process.env.DASHBOARD_TOKEN || process.env.TOKEN || ''
  const endpoints = [
    '/dashboard/metrics',
    '/dashboard/activity-columns',
    '/dashboard/search-publications',
    '/dashboard/overview',
    '/admin/estadisticas/usuarios',
  ]

  console.log(`Base URL: ${baseUrl}`)
  console.log(`Token: ${token ? 'SI (Bearer oculto)' : 'NO'}`)
  console.log('')

  let hasFailures = false

  for (const endpoint of endpoints) {
    const result = await testEndpoint(baseUrl, endpoint, token)
    const flag = result.ok ? 'OK' : 'FAIL'

    console.log(`${flag} ${endpoint} -> ${result.status ?? 'N/A'}`)
    if (result.preview) {
      console.log(`Preview: ${result.preview}`)
    }
    console.log('')

    if (!result.ok) {
      hasFailures = true
    }
  }

  if (hasFailures) {
    process.exitCode = 1
  }
}

void main()
