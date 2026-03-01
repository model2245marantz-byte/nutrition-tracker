import { useApp } from './context/AppContext'
import AuthScreen from './components/AuthScreen'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import MealEntry from './components/MealEntry'
import Settings from './components/Settings'
import Toast from './components/Toast'
import './App.css'

export default function App() {
  const { session, loading, currentView } = useApp()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!session) {
    return <AuthScreen />
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'log' && <MealEntry />}
        {currentView === 'settings' && <Settings />}
      </main>
      <Toast />
    </div>
  )
}
