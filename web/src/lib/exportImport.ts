import type { StudyArchive } from '../types/study'
import { createEmptyArchive } from './reviewQueue'

export function serializeStudyArchive(archive: StudyArchive) {
  return JSON.stringify(archive, null, 2)
}

export function parseStudyArchive(content: string): StudyArchive {
  const parsed = JSON.parse(content) as Partial<StudyArchive>
  if (parsed.version !== 1) {
    throw new Error('当前仅支持 version=1 的学习文件')
  }
  if (!parsed.profile || !parsed.packs || !parsed.progress) {
    throw new Error('学习文件格式不完整')
  }
  return parsed as StudyArchive
}

export function createDownloadFile(archive: StudyArchive) {
  const fileName = `zevi-study-${new Date().toISOString().slice(0, 10)}.json`
  return {
    fileName,
    content: serializeStudyArchive(archive),
  }
}

export function downloadStudyArchive(archive: StudyArchive) {
  const file = createDownloadFile(archive)
  const blob = new Blob([file.content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = file.fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function readStudyArchiveFile(file: File) {
  const content = await file.text()
  return parseStudyArchive(content)
}

export function getExampleArchive() {
  return createEmptyArchive()
}
