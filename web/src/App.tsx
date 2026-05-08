import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { fetchHealth, fetchProviders } from './lib/api'
import { useStudyStore } from './store/useStudyStore'

export default function App() {
  const setHealth = useStudyStore((state) => state.setHealth)
  const setProviders = useStudyStore((state) => state.setProviders)
  const setRemoteError = useStudyStore((state) => state.setRemoteError)
  const hasUnsavedChanges = useStudyStore((state) => state.hasUnsavedChanges)

  useEffect(() => {
    async function loadRemoteState() {
      try {
        const [health, providers] = await Promise.all([fetchHealth(), fetchProviders()])
        setHealth(health)
        setProviders(providers)
        setRemoteError('')
      } catch (error) {
        const message = error instanceof Error ? error.message : '无法连接到本地服务'
        setRemoteError(message)
        setHealth(null)
      }
    }

    loadRemoteState()
  }, [setHealth, setProviders, setRemoteError])

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges) {
        return
      }
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  return <RouterProvider router={router} />
}
