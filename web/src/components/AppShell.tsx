import { BrainCircuit, Files, House, Settings2, Sparkles } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useStudyStore } from '../store/useStudyStore'

const links = [
  { to: '/', label: '首页', icon: House },
  { to: '/generate', label: '生成词单', icon: Sparkles },
  { to: '/review', label: '开始复习', icon: BrainCircuit },
  { to: '/library', label: '词单库', icon: Files },
  { to: '/settings', label: '设置', icon: Settings2 },
]

export function AppShell() {
  const hasUnsavedChanges = useStudyStore((state) => state.hasUnsavedChanges)
  const remoteError = useStudyStore((state) => state.remoteError)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Zevi AI study</p>
          <h1>轻量化 AI 英语学习</h1>
        </div>
        <div className="topbar-status-group">
          {hasUnsavedChanges ? <span className="status-pill warm">未导出变更</span> : <span className="status-pill">本地状态已同步</span>}
          {remoteError ? <span className="status-pill danger">后端未连接</span> : <span className="status-pill success">AI 服务可用</span>}
        </div>
      </header>

      <div className="layout-grid">
        <aside className="sidebar card">
          <nav className="nav-list" aria-label="主导航">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>
          <div className="sidebar-footnote">
            <p>聚焦旅游英语与商务英语，学习记录仅保存在你自己导出的 JSON 文件里。</p>
          </div>
        </aside>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
