import { useApp } from '../context/AppContext'
import { sumMacros, MACRO_CONFIG } from '../lib/utils'
import MacroCard from './MacroCard'
import MealCard from './MealCard'
import './Dashboard.css'

export default function Dashboard() {
  const { meals, profile, setView } = useApp()
  const totals = sumMacros(meals)

  return (
    <section className="dashboard-view">
      <h2 className="section-title">Today's Nutrition</h2>

      <div className="macro-grid">
        {MACRO_CONFIG.map(m => (
          <MacroCard
            key={m.key}
            label={m.label}
            current={totals[m.key]}
            target={profile?.[m.targetKey] ?? 0}
            unit={m.unit}
            color={m.color}
          />
        ))}
      </div>

      <div className="dashboard-meals">
        <h3 className="dashboard-meals-title">Today's Meals</h3>
        {meals.length === 0 ? (
          <p className="empty-state">
            No meals logged today.{' '}
            <button className="link-btn" onClick={() => setView('log')}>Log your first meal</button>
          </p>
        ) : (
          <div className="meal-list">
            {meals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
