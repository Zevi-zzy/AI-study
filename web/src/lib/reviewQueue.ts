import type { CardProgress, ReviewOutcome, StudyArchive, WordPack } from '../types/study'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function isoAfter(offset: number) {
  return new Date(Date.now() + offset).toISOString()
}

export function createEmptyArchive(): StudyArchive {
  return {
    version: 1,
    profile: {
      name: 'Guest',
      language: 'zh-CN',
    },
    packs: [],
    progress: {},
  }
}

export function createInitialProgress(): CardProgress {
  return {
    status: 'new',
    mastery: 0,
    reviewCount: 0,
    lastReviewedAt: null,
    nextReviewAt: null,
  }
}

export function ensurePackProgress(archive: StudyArchive, pack: WordPack) {
  const nextProgress = { ...archive.progress }
  pack.cards.forEach((card) => {
    if (!nextProgress[card.id]) {
      nextProgress[card.id] = createInitialProgress()
    }
  })
  return nextProgress
}

export function applyReviewOutcome(progress: CardProgress, outcome: ReviewOutcome): CardProgress {
  const reviewCount = progress.reviewCount + 1
  const lastReviewedAt = new Date().toISOString()

  if (outcome === 'again') {
    return {
      status: 'learning',
      mastery: Math.max(0, progress.mastery - 1),
      reviewCount,
      lastReviewedAt,
      nextReviewAt: isoAfter(5 * MINUTE),
    }
  }

  if (outcome === 'hard') {
    const mastery = Math.min(5, progress.mastery + 1)
    const offset = mastery <= 2 ? 20 * MINUTE : 2 * HOUR
    return {
      status: mastery >= 4 ? 'mastered' : 'learning',
      mastery,
      reviewCount,
      lastReviewedAt,
      nextReviewAt: isoAfter(offset),
    }
  }

  const mastery = Math.min(5, progress.mastery + 2)
  const offsets = [DAY, 2 * DAY, 4 * DAY, 7 * DAY, 14 * DAY, 21 * DAY]
  return {
    status: mastery >= 4 ? 'mastered' : 'learning',
    mastery,
    reviewCount,
    lastReviewedAt,
    nextReviewAt: isoAfter(offsets[mastery] || 21 * DAY),
  }
}

export function isDue(progress: CardProgress) {
  if (!progress.nextReviewAt) {
    return true
  }
  return new Date(progress.nextReviewAt).getTime() <= Date.now()
}

export function getReviewCards(archive: StudyArchive, packId?: string) {
  const packs = packId ? archive.packs.filter((pack) => pack.id === packId) : archive.packs
  return packs
    .flatMap((pack) =>
      pack.cards.map((card) => ({
        pack,
        card,
        progress: archive.progress[card.id] || createInitialProgress(),
      }))
    )
    .filter((entry) => isDue(entry.progress))
    .sort((left, right) => {
      if (left.progress.mastery === right.progress.mastery) {
        return new Date(left.pack.createdAt).getTime() - new Date(right.pack.createdAt).getTime()
      }
      return left.progress.mastery - right.progress.mastery
    })
}

export function getArchiveStats(archive: StudyArchive) {
  const allCards = archive.packs.flatMap((pack) => pack.cards)
  const dueCount = allCards.filter((card) => isDue(archive.progress[card.id] || createInitialProgress())).length
  const masteredCount = allCards.filter((card) => (archive.progress[card.id] || createInitialProgress()).status === 'mastered').length

  return {
    totalPacks: archive.packs.length,
    totalCards: allCards.length,
    dueCount,
    masteredCount,
    masteredRate: allCards.length ? Math.round((masteredCount / allCards.length) * 100) : 0,
  }
}

export function getPackStats(archive: StudyArchive, packId: string) {
  const pack = archive.packs.find((item) => item.id === packId)
  if (!pack) {
    return {
      total: 0,
      due: 0,
      mastered: 0,
      masteredRate: 0,
    }
  }

  const total = pack.cards.length
  const due = pack.cards.filter((card) => isDue(archive.progress[card.id] || createInitialProgress())).length
  const mastered = pack.cards.filter((card) => (archive.progress[card.id] || createInitialProgress()).status === 'mastered').length

  return {
    total,
    due,
    mastered,
    masteredRate: total ? Math.round((mastered / total) * 100) : 0,
  }
}
