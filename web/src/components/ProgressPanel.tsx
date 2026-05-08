interface ProgressPanelProps {
  totalPacks: number
  totalCards: number
  dueCount: number
  masteredRate: number
}

export function ProgressPanel({ totalPacks, totalCards, dueCount, masteredRate }: ProgressPanelProps) {
  const items = [
    { label: '词单数量', value: totalPacks },
    { label: '已学习单词', value: totalCards },
    { label: '今日待复习', value: dueCount },
    { label: '掌握比例', value: `${masteredRate}%` },
  ]

  return (
    <section className="card stats-grid">
      {items.map((item) => (
        <article key={item.label} className="stat-card">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  )
}
