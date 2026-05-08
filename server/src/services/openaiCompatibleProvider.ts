import { randomUUID } from 'node:crypto'
import { buildUserPrompt, systemPrompt } from '../prompts/generateWordPack.js'
import type {
  GenerateWordPackInput,
  GeneratedWordCard,
  GeneratedWordPack,
  ProviderConfig,
} from '../types/provider.js'

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

interface CompletionOptions {
  retryMode?: boolean
}

function ensureString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function ensureStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const items = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  return items.length ? items : fallback
}

export function extractJsonBlock(input: string) {
  const trimmed = input.trim()
  if (!trimmed) {
    throw new Error('模型没有返回内容')
  }

  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/```\s*([\s\S]*?)```/i)
  if (fenced?.[1]) {
    return fenced[1].trim()
  }

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1)
  }

  throw new Error('无法从模型响应中提取 JSON')
}

export function normalizeGeneratedPack(raw: unknown, input: GenerateWordPackInput): GeneratedWordPack {
  if (!raw || typeof raw !== 'object') {
    throw new Error('模型返回的数据结构无效')
  }

  const source = raw as Record<string, unknown>
  const cardsRaw = Array.isArray(source.cards) ? source.cards : []

  if (!cardsRaw.length) {
    throw new Error('模型没有生成任何单词卡片')
  }

  const cards: GeneratedWordCard[] = cardsRaw.map((item, index) => {
    const card = item as Record<string, unknown>
    const word = ensureString(card.word, '')
    if (!word) {
      throw new Error(`第 ${index + 1} 个单词缺少 word 字段`)
    }

    return {
      id: randomUUID(),
      word,
      phonetic: ensureString(card.phonetic, '/-/'),
      partOfSpeech: ensureString(card.partOfSpeech, 'unknown'),
      meaningZh: ensureString(card.meaningZh, '暂无释义'),
      exampleEn: ensureString(card.exampleEn, `${word} is used in a practical sentence.`),
      exampleZh: ensureString(card.exampleZh, `${word} 的中文例句解释暂未提供。`),
      memoryTip: ensureString(card.memoryTip, `将 ${word} 放进真实场景里记忆。`),
      tags: ensureStringArray(card.tags, [input.scene.toLowerCase()]),
    }
  })

  return {
    id: randomUUID(),
    topic: ensureString(source.topic, input.topic),
    scene: ensureString(source.scene, input.scene),
    level: ensureString(source.level, input.difficulty),
    createdAt: new Date().toISOString(),
    cards,
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '未知模型错误'
}

function isTimeoutError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes('timeout') ||
    message.includes('timed out') ||
    message.includes('upstream request timeout') ||
    message.includes('504')
  )
}

async function requestCompletion(config: ProviderConfig, messages: OpenAIMessage[], options: CompletionOptions = {}) {
  const controller = new AbortController()
  const timeoutMs = options.retryMode ? 90000 : 70000
  const timer = setTimeout(() => controller.abort(new Error('模型请求超时')), timeoutMs)
  let response: Response

  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: options.retryMode ? 0.2 : 0.4,
        max_tokens: options.retryMode ? 900 : 1200,
        response_format: { type: 'json_object' },
        messages,
      }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`模型请求失败：${response.status} ${text}`)
  }

  return response.json() as Promise<OpenAIResponse>
}

export class OpenAICompatibleProvider {
  constructor(private readonly config: ProviderConfig) {}

  async generateWordPack(input: GenerateWordPackInput) {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: buildUserPrompt(input) },
    ]

    let lastError: unknown = null

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const payload = await requestCompletion(this.config, messages, {
          retryMode: attempt > 0,
        })
        const content = payload.choices?.[0]?.message?.content || ''
        const extracted = extractJsonBlock(content)
        const parsed = JSON.parse(extracted) as unknown
        return normalizeGeneratedPack(parsed, input)
      } catch (error) {
        lastError = error
        if (!isTimeoutError(error)) {
          break
        }
      }
    }

    const message = getErrorMessage(lastError)
    if (isTimeoutError(lastError)) {
      throw new Error('上游模型响应超时，请稍后重试，或把词数调到 8 个再试一次')
    }
    throw new Error(message)
  }
}
