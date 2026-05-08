import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="empty-state card">
      <p className="eyebrow">Empty</p>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </section>
  )
}
