import type { HealthState, ProviderState, WordPack } from '../types/study'

interface GeneratePayload {
  topic: string
  scene: string
  difficulty: string
  wordCount: number
}

async function requestJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init)
  const payload = (await response.json()) as T & { message?: string }

  if (!response.ok) {
    throw new Error(payload.message || '请求失败')
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
