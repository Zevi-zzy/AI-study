import { describe, expect, it } from 'vitest'
import { createDownloadFile, parseStudyArchive, serializeStudyArchive } from './exportImport'
import { createEmptyArchive } from './reviewQueue'

describe('exportImport', () => {
  it('可以序列化并恢复学习档案', () => {
    const archive = createEmptyArchive()
    archive.packs.push({
      id: 'pack-1',
      topic: '机场出行',
      scene: '旅游英语',
      level: 'A2',
      createdAt: '2026-05-08T00:00:00.000Z',
      cards: [],
    })

    const text = serializeStudyArchive(archive)
    const parsed = parseStudyArchive(text)

    expect(parsed.packs[0].topic).toBe('机场出行')
    expect(parsed.version).toBe(1)
  })

  it('会生成可导出的文件名', () => {
    const file = createDownloadFile(createEmptyArchive())
    expect(file.fileName.endsWith('.json')).toBe(true)
  })

  it('在版本不匹配时抛出错误', () => {
    expect(() => parseStudyArchive('{"version":2,"profile":{},"packs":[],"progress":{}}')).toThrow('version=1')
  })
})
