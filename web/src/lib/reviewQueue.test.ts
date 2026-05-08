import { describe, expect, it } from 'vitest'
import { applyReviewOutcome, createEmptyArchive, createInitialProgress, ensurePackProgress, getArchiveStats } from './reviewQueue'

describe('reviewQueue', () => {
  it('添加词单时会补齐默认进度', () => {
    const archive = createEmptyArchive()
    const nextProgress = ensurePackProgress(archive, {
      id: 'pack-1',
      topic: '酒店入住',
      scene: '旅游英语',
      level: 'A2',
      createdAt: '2026-05-08T00:00:00.000Z',
      cards: [
        {
          id: 'card-1',
          word: 'reservation',
          phonetic: '/ˌrezərˈveɪʃn/',
          partOfSpeech: 'noun',
          meaningZh: '预订',
          exampleEn: 'I have a reservation for tonight.',
          exampleZh: '我预订了今晚的房间。',
          memoryTip: '和 reserve 一起记。',
          tags: ['travel'],
        },
      ],
    })

    expect(nextProgress['card-1']).toBeDefined()
    expect(nextProgress['card-1'].status).toBe('new')
  })

  it('复习结果会更新掌握度和下次时间', () => {
    const progress = applyReviewOutcome(createInitialProgress(), 'good')
    expect(progress.mastery).toBeGreaterThan(0)
    expect(progress.nextReviewAt).not.toBeNull()
  })

  it('可以汇总档案统计数据', () => {
    const archive = createEmptyArchive()
    archive.packs.push({
      id: 'pack-1',
      topic: '商务会议',
      scene: '商务英语',
      level: 'B1',
      createdAt: '2026-05-08T00:00:00.000Z',
      cards: [
        {
          id: 'card-1',
          word: 'agenda',
          phonetic: '/əˈdʒendə/',
          partOfSpeech: 'noun',
          meaningZh: '议程',
          exampleEn: 'The agenda is ready.',
          exampleZh: '议程已经准备好了。',
          memoryTip: '会议一开始先看 agenda。',
          tags: ['business'],
        },
      ],
    })
    archive.progress['card-1'] = createInitialProgress()

    const stats = getArchiveStats(archive)
    expect(stats.totalCards).toBe(1)
    expect(stats.dueCount).toBe(1)
  })
})
