import type { HealthState, ProviderState, WordPack } from '../types/study'

interface GeneratePayload {
  topic: string
  scene: string
  difficulty: string
  wordCount: number
}

async function requestJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init)
  const rawText = await response.text()
  let payload: (T & { message?: string }) | null = null

  if (rawText) {
    try {
      payload = JSON.parse(rawText) as T & { message?: string }
    } catch {
      if (!response.ok) {
        throw new Error(rawText)
      }
      throw new Error('服务返回了非 JSON 响应')
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message || '请求失败')
  }

  if (!payload) {
    throw new Error('服务返回了空响应')
  }

  return payload
}

export function fetchHealth() {
  return requestJson<HealthState>('/api/health')
}

export function fetchProviders() {
  return requestJson<ProviderState>('/api/providers')
}

export async function generateWordPack(payload: GeneratePayload) {
  const response = await requestJson<{ pack: WordPack }>('/api/generate-word-pack', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return response.pack
}
