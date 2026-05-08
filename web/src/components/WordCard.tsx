import { RotateCcw } from 'lucide-react'
import type { WordCard as WordCardType } from '../types/study'

interface WordCardProps {
  card: WordCardType
  revealed: boolean
  onReveal: () => void
  onAnswer: (outcome: 'again' | 'hard' | 'good') => void
}

export function WordCard({ card, revealed, onReveal, onAnswer }: WordCardProps) {
  return (
    <section className="word-card card">
      <div className="word-card-head">
        <div>
          <p className="eyebrow">Word</p>
          <h2>{card.word}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onReveal} aria-label="切换答案显示">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="word-meta">
        <span>{card.phonetic}</span>
        <span>{card.partOfSpeech}</span>
        <span>{card.tags.join(' / ')}</span>
      </div>

      {revealed ? (
        <div className="word-answer">
          <div>
            <p className="label">中文释义</p>
            <p>{card.meaningZh}</p>
          </div>
          <div>
            <p className="label">英文例句</p>
            <p>{card.exampleEn}</p>
          </div>
          <div>
            <p className="label">中文理解</p>
            <p>{card.exampleZh}</p>
          </div>
          <div>
            <p className="label">记忆提示</p>
            <p>{card.memoryTip}</p>
          </div>
        </div>
      ) : (
        <button className="button primary reveal-button" type="button" onClick={onReveal}>
          显示答案
        </button>
      )}

      {revealed ? (
        <div className="answer-actions">
          <button className="button ghost" type="button" onClick={() => onAnswer('again')}>
            不会
          </button>
          <button className="button secondary" type="button" onClick={() => onAnswer('hard')}>
            模糊
          </button>
          <button className="button primary" type="button" onClick={() => onAnswer('good')}>
            掌握
          </button>
        </div>
      ) : null}
    </section>
  )
}
