import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { GeneratePage } from './pages/GeneratePage'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { ReviewPage } from './pages/ReviewPage'
import { SettingsPage } from './pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'generate', element: <GeneratePage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
