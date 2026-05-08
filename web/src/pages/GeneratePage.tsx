import { LoaderCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { generateWordPack } from '../lib/api'
import type { WordPack } from '../types/study'
import { useStudyStore } from '../store/useStudyStore'

const sceneOptions = ['旅游英语', '商务英语']
const difficultyOptions = ['A2', 'B1', 'B2']

export function GeneratePage() {
  const addPack = useStudyStore((state) => state.addPack)
  const [topic, setTopic] = useState('机场出行')
  const [scene, setScene] = useState('旅游英语')
  const [difficulty, setDifficulty] = useState('A2')
  const [wordCount, setWordCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedPack, setGeneratedPack] = useState<WordPack | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const pack = await generateWordPack({
        topic,
        scene,
        difficulty,
        wordCount,
      })
      addPack(pack)
      setGeneratedPack(pack)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-stack page-split">
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Generate</p>
            <h2>让 AI 生成一份词单</h2>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>主题</span>
            <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="如：酒店入住、商务会议、客户拜访" />
          </label>
          <label>
            <span>场景</span>
            <select value={scene} onChange={(event) => setScene(event.target.value)}>
              {sceneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>难度</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              {difficultyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>词数</span>
            <input
              type="number"
              min={8}
              max={15}
              value={wordCount}
              onChange={(event) => setWordCount(Number(event.target.value))}
            />
          </label>
          <button className="button primary" disabled={loading} type="submit">
            {loading ? <LoaderCircle size={16} className="spin" /> : <Sparkles size={16} />}
            {loading ? '正在生成词单...' : '生成词单'}
          </button>
        </form>

        {error ? <p className="inline-error">{error}</p> : null}
      </section>

      <section className="card preview-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Preview</p>
            <h2>生成结果预览</h2>
          </div>
          {generatedPack ? (
            <Link className="button secondary" to={`/review?pack=${generatedPack.id}`}>
              立即复习
            </Link>
          ) : null}
        </div>

        {generatedPack ? (
          <div className="generated-preview">
            <div className="preview-meta">
              <strong>{generatedPack.topic}</strong>
              <p>{generatedPack.scene} · {generatedPack.level} · {generatedPack.cards.length} 词</p>
            </div>
            <div className="preview-list">
              {generatedPack.cards.map((card) => (
                <article key={card.id} className="preview-item">
                  <div>
                    <strong>{card.word}</strong>
                    <p>{card.meaningZh}</p>
                  </div>
                  <span>{card.partOfSpeech}</span>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="placeholder-note">
            <p>生成后会在这里展示整份词单，并自动写入当前学习档案。</p>
          </div>
        )}
      </section>
    </div>
  )
}
