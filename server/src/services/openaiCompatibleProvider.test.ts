import { describe, expect, it } from 'vitest'
import { buildGenerationAttempts, extractJsonBlock, normalizeGeneratedPack } from './openaiCompatibleProvider.js'

describe('extractJsonBlock', () => {
  it('可以从 fenced code block 中提取 JSON', () => {
    const result = extractJsonBlock('```json\n{"topic":"travel","cards":[]}\n```')
    expect(result).toContain('"topic":"travel"')
  })

  it('可以从普通文本中提取 JSON 主体', () => {
    const result = extractJsonBlock('以下是结果 {"topic":"business","cards":[]}')
    expect(result).toBe('{"topic":"business","cards":[]}')
  })
})

describe('normalizeGeneratedPack', () => {
  it('会将原始返回格式标准化为词单结构', () => {
    const pack = normalizeGeneratedPack(
      {
        topic: '商务会议',
        scene: '商务英语',
        level: 'B1',
        cards: [
          {
            word: 'agenda',
            phonetic: '/əˈdʒendə/',
            partOfSpeech: 'noun',
            meaningZh: '议程',
            exampleEn: 'Let us review the agenda before the meeting starts.',
            exampleZh: '让我们在会议开始前先看一下议程。',
            memoryTip: '会议开始前总要看 agenda。',
            tags: ['business'],
          },
        ],
      },
      {
        topic: '商务会议',
        scene: '商务英语',
        difficulty: 'B1',
        wordCount: 10,
      }
    )

    expect(pack.cards).toHaveLength(1)
    expect(pack.cards[0].word).toBe('agenda')
    expect(pack.scene).toBe('商务英语')
  })

  it('在缺失可选字段时会回填默认值', () => {
    const pack = normalizeGeneratedPack(
      {
        cards: [
          {
            word: 'boarding pass',
          },
        ],
      },
      {
        topic: '机场出行',
        scene: '旅游英语',
        difficulty: 'A2',
        wordCount: 8,
      }
    )

    expect(pack.topic).toBe('机场出行')
    expect(pack.cards[0].meaningZh).toBe('暂无释义')
    expect(pack.cards[0].tags).toEqual(['旅游英语'])
  })
})

describe('buildGenerationAttempts', () => {
  it('当词数大于 8 时会追加一个 8 词降级重试', () => {
    const attempts = buildGenerationAttempts({
      topic: '酒店入住',
      scene: '旅游英语',
      difficulty: 'A2',
      wordCount: 10,
    })

    expect(attempts).toHaveLength(3)
    expect(attempts[2].input.wordCount).toBe(8)
    expect(attempts[2].retryMode).toBe(true)
  })

  it('当词数本来就是 8 时不会重复追加降级尝试', () => {
    const attempts = buildGenerationAttempts({
      topic: '酒店入住',
      scene: '旅游英语',
      difficulty: 'A2',
      wordCount: 8,
    })

    expect(attempts).toHaveLength(2)
  })
})
