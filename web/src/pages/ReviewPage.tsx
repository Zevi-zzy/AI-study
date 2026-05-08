import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { WordCard } from '../components/WordCard'
import { getReviewCards } from '../lib/reviewQueue'
import { useStudyStore } from '../store/useStudyStore'

export function ReviewPage() {
  const [searchParams] = useSearchParams()
  const packId = searchParams.get('pack') || undefined
  const archive = useStudyStore((state) => state.archive)
  const reviewCard = useStudyStore((state) => state.reviewCard)
  const [revealed, setRevealed] = useState(false)

  const queue = useMemo(() => getReviewCards(archive, packId), [archive, packId])
  const current = queue[0]

  useEffect(() => {
    setRevealed(false)
  }, [current?.card.id])

  if (!current) {
    return (
      <EmptyState
        title="当前没有待复习内容"
        description="你已经完成当前队列，或者还没有生成词单。可以先去新建一份旅游英语或商务英语词单。"
      />
    )
  }

  return (
    <div className="page-stack">
      <section className="card review-header">
        <div>
          <p className="eyebrow">Review</p>
          <h2>{current.pack.topic}</h2>
          <p>{current.pack.scene} · {current.pack.level}</p>
        </div>
        <div className="review-summary">
          <span>当前队列 {queue.length}</span>
          <span>掌握度 {current.progress.mastery}/5</span>
        </div>
      </section>

      <WordCard
        card={current.card}
        revealed={revealed}
        onReveal={() => setRevealed((value) => !value)}
        onAnswer={(outcome) => reviewCard(current.card.id, outcome)}
      />
    </div>
  )
}
