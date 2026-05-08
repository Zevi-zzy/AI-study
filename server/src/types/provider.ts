export interface GenerateWordPackInput {
  topic: string
  scene: string
  difficulty: string
  wordCount: number
}

export interface GeneratedWordCard {
  id: string
  word: string
  phonetic: string
  partOfSpeech: string
  meaningZh: string
  exampleEn: string
  exampleZh: string
  memoryTip: string
  tags: string[]
}

export interface GeneratedWordPack {
  id: string
  topic: string
  scene: string
  level: string
  createdAt: string
  cards: GeneratedWordCard[]
}

export interface ProviderConfig {
  id: string
  label: string
  baseUrl: string
  apiKey: string
  model: string
  configured: boolean
}

export interface ProviderSummary {
  id: string
  label: string
  model: string
  baseUrl: string
  configured: boolean
}
