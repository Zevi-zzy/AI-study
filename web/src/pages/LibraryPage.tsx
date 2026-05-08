import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { getPackStats } from '../lib/reviewQueue'
import { useStudyStore } from '../store/useStudyStore'

export function LibraryPage() {
  const archive = useStudyStore((state) => state.archive)
  const removePack = useStudyStore((state) => state.removePack)

  if (!archive.packs.length) {
    return (
      <EmptyState
        title="词单库为空"
        description="先去生成页创建你的第一份场景词单。"
        action={<Link className="button primary" to="/generate">去生成词单</Link>}
      />
    )
  }

  return (
    <div className="page-stack">
      <section className="card list-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Library</p>
            <h2>词单库</h2>
          </div>
        </div>

        <div className="pack-list">
          {archive.packs.map((pack) => {
            const stats = getPackStats(archive, pack.id)
            return (
              <article key={pack.id} className="pack-card card inset-card">
                <div className="pack-card-head">
                  <div>
                    <h3>{pack.topic}</h3>
                    <p>{pack.scene} · {pack.level}</p>
                  </div>
                  <button className="icon-button" type="button" onClick={() => removePack(pack.id)} aria-label="删除词单">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="pack-stats-row">
                  <span>{stats.total} 词</span>
                  <span>{stats.due} 待复习</span>
                  <span>{stats.masteredRate}% 已掌握</span>
                </div>
                <div className="pack-card-actions">
                  <Link className="button secondary" to={`/review?pack=${pack.id}`}>
                    继续学习
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
