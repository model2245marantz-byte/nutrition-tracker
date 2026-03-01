import { useApp } from '../context/AppContext'
import './Header.css'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'log', label: 'Log Meal' },
  { key: 'settings', label: 'Settings' },
]

export default function Header() {
  const { currentView, setView, signOut } = useApp()

  return (
    <header className="app-header">
      <div className="header-row">
        <h1 className="header-title">NutriTrack</h1>
        <button className="btn btn-secondary btn-sm" onClick={signOut}>Sign Out</button>
      </div>
      <nav className="header-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            className={`nav-btn ${currentView === item.key ? 'active' : ''}`}
            onClick={() => setView(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
