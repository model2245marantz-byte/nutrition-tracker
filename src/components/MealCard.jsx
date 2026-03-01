import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './MealCard.css'

export default function MealCard({ meal }) {
  const { deleteMeal, showToast } = useApp()
  const [confirming, setConfirming] = useState(false)

  const t = meal.totals || {}
  const typeLabel = meal.type ? meal.type.charAt(0).toUpperCase() + meal.type.slice(1) : 'Meal'
  const time = meal.timestamp
    ? new Date(meal.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : ''

  async function handleDelete() {
    try {
      await deleteMeal(meal.id)
      showToast('Meal deleted')
    } catch (err) {
      showToast(err.message, 'error')
    }
    setConfirming(false)
  }

  return (
    <div className="meal-card">
      <div className="meal-card-top">
        <div>
          <span className="meal-type-badge">{typeLabel}</span>
          {time && <span className="meal-time">{time}</span>}
        </div>
        {!confirming ? (
          <button className="meal-delete-btn" onClick={() => setConfirming(true)} aria-label="Delete meal">
            &times;
          </button>
        ) : (
          <div className="meal-confirm">
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setConfirming(false)}>Cancel</button>
          </div>
        )}
      </div>

      <p className="meal-description">{meal.description}</p>

      {meal.items && meal.items.length > 0 && (
        <ul className="meal-items">
          {meal.items.map((item, i) => (
            <li key={i}>
              <span className="item-name">{item.name}</span>
              <span className="item-cals">{Math.round(item.calories || 0)} kcal</span>
            </li>
          ))}
        </ul>
      )}

      <div className="meal-macros">
        <span className="macro-pill cal">{Math.round(t.calories || 0)} cal</span>
        <span className="macro-pill pro">{Math.round(t.protein || 0)}g P</span>
        <span className="macro-pill carb">{Math.round(t.carbs || 0)}g C</span>
        <span className="macro-pill fat">{Math.round(t.fat || 0)}g F</span>
      </div>
    </div>
  )
}
