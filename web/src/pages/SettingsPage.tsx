import { RefreshCcw } from 'lucide-react'
import { fetchHealth, fetchProviders } from '../lib/api'
import { ImportExportBar } from '../components/ImportExportBar'
import { useStudyStore } from '../store/useStudyStore'

export function SettingsPage() {
  const health = useStudyStore((state) => state.health)
  const providers = useStudyStore((state) => state.providers)
  const remoteError = useStudyStore((state) => state.remoteError)
  const setHealth = useStudyStore((state) => state.setHealth)
  const setProviders = useStudyStore((state) => state.setProviders)
  const setRemoteError = useStudyStore((state) => state.setRemoteError)

  async function refreshRemoteState() {
    try {
      const [nextHealth, nextProviders] = await Promise.all([fetchHealth(), fetchProviders()])
      setHealth(nextHealth)
      setProviders(nextProviders)
      setRemoteError('')
    } catch (error) {
      setRemoteError(error instanceof Error ? error.message : '无法连接本地服务')
    }
  }

  return (
    <div className="page-stack">
      <section className="card settings-grid">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Settings</p>
            <h2>本地服务与学习文件</h2>
          </div>
          <button className="button secondary" type="button" onClick={refreshRemoteState}>
            <RefreshCcw size={16} />
            刷新状态
          </button>
        </div>

        <div className="settings-columns">
          <article className="info-block">
            <span className="label">后端状态</span>
            <strong>{health ? '运行中' : '未连接'}</strong>
            <p>{health ? `已配置 ${health.configuredProviders} 个 provider` : remoteError || '请检查 server/.env 和本地服务'}</p>
          </article>

          <article className="info-block">
            <span className="label">默认 provider</span>
            <strong>{providers.defaultProvider || 'openai-compatible'}</strong>
            <p>当前支持多 provider 架构，首版默认按 OpenAI 兼容接口运行。</p>
          </article>
        </div>

        <div className="provider-list">
          {providers.providers.map((provider) => (
            <article key={provider.id} className="provider-item">
              <div>
                <strong>{provider.label}</strong>
                <p>{provider.model}</p>
              </div>
              <span className={`status-pill ${provider.configured ? 'success' : 'danger'}`}>
                {provider.configured ? '已配置' : '未配置'}
              </span>
            </article>
          ))}
        </div>
      </section>

      <ImportExportBar />

      <section className="card helper-card">
        <p className="eyebrow">Local Data</p>
        <h3>保存方式说明</h3>
        <p>Zevi AI study 不会把学习进度存到数据库。你每次完成学习后，请记得导出 JSON 文件，后续可重新导入恢复进度。</p>
      </section>
    </div>
  )
}
