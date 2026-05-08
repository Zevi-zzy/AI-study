import { Download, FolderUp } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'
import { downloadStudyArchive, readStudyArchiveFile } from '../lib/exportImport'
import { useStudyStore } from '../store/useStudyStore'

export function ImportExportBar() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const archive = useStudyStore((state) => state.archive)
  const importArchive = useStudyStore((state) => state.importArchive)
  const markSaved = useStudyStore((state) => state.markSaved)
  const setRemoteError = useStudyStore((state) => state.setRemoteError)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const nextArchive = await readStudyArchiveFile(file)
      importArchive(nextArchive)
      markSaved()
      setRemoteError('')
    } catch (error) {
      const message = error instanceof Error ? error.message : '导入失败'
      setRemoteError(message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="import-export-bar card">
      <button className="button secondary" onClick={() => fileRef.current?.click()} type="button">
        <FolderUp size={16} />
        导入学习文件
      </button>
      <button className="button secondary" onClick={() => downloadStudyArchive(archive)} type="button">
        <Download size={16} />
        导出学习文件
      </button>
      <input ref={fileRef} hidden type="file" accept="application/json" onChange={handleFileChange} />
    </div>
  )
}
