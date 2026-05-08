export type ReviewStatus = 'new' | 'learning' | 'mastered'
export type ReviewOutcome = 'again' | 'hard' | 'good'

export interface WordCard {
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

export interface WordPack {
  id: string
  topic: string
  scene: string
  level: string
  createdAt: string
  cards: WordCard[]
}

export interface CardProgress {
  status: ReviewStatus
  mastery: number
  reviewCount: number
  lastReviewedAt: string | null
  nextReviewAt: string | null
}

export interface StudyProfile {
  name: string
  language: string
}

export interface StudyArchive {
  version: number
  profile: StudyProfile
  packs: WordPack[]
  progress: Record<string, CardProgress>
}

export interface ProviderInfo {
  id: string
  label: string
  model: string
  baseUrl: string
  configured: boolean
}

export interface ProviderState {
  defaultProvider: string
  providers: ProviderInfo[]
}

export interface HealthState {
  status: string
  timestamp: string
  configuredProviders: number
}
