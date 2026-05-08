import { ArrowRight, Download, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { ImportExportBar } from '../components/ImportExportBar'
import { ProgressPanel } from '../components/ProgressPanel'
import { getArchiveStats } from '../lib/reviewQueue'
import { useStudyStore } from '../store/useStudyStore'

export function HomePage() {
  const archive = useStudyStore((state) => state.archive)
  const stats = getArchiveStats(archive)

  return (
    <div className="page-stack">
      <section className="hero card">
        <div>
          <p className="eyebrow">Minimal AI English Study</p>
          <h2>用 AI 生成场景词单，然后把学习进度保存回你自己的本地文件。</h2>
          <p className="hero-copy">
            针对旅游英语与商务英语设计。首版不做账号，不接数据库，只保留最必要的生成、记忆、复习与导入导出。
          </p>
        </div>
        <div className="hero-actions">
          <Link className="button primary" to="/generate">
            <Sparkles size={16} />
            新建词单
          </Link>
          <Link className="button secondary" to="/review">
            <ArrowRight size={16} />
            继续复习
          </Link>
        </div>
      </section>

      <ProgressPanel
        totalPacks={stats.totalPacks}
        totalCards={stats.totalCards}
        dueCount={stats.dueCount}
        masteredRate={stats.masteredRate}
      />

      <ImportExportBar />

      {archive.packs.length ? (
        <section className="card list-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest Packs</p>
              <h3>最近生成的词单</h3>
            </div>
            <Link className="text-link" to="/library">
              查看全部
            </Link>
          </div>
          <div className="pack-list compact">
            {archive.packs.slice(0, 3).map((pack) => (
              <article key={pack.id} className="pack-item">
                <div>
                  <strong>{pack.topic}</strong>
                  <p>{pack.scene} · {pack.level}</p>
                </div>
                <Link className="button ghost" to={`/review?pack=${pack.id}`}>
                  开始学习
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="还没有词单"
          description="先用 AI 生成第一份旅游英语或商务英语词单，然后随时导出成 JSON 文件保存。"
          action={
            <Link className="button primary" to="/generate">
              <Download size={16} />
              去生成第一份词单
            </Link>
          }
        />
      )}
    </div>
  )
}
