import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { parseMeal } from '../lib/claude'
import MealPreview from './MealPreview'
import './MealEntry.css'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

export default function MealEntry() {
  const { addMeal, showToast, setView } = useApp()
  const [description, setDescription] = useState('')
  const [mealType, setMealType] = useState('breakfast')
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [logging, setLogging] = useState(false)

  async function handleAnalyze() {
    if (!description.trim()) return

    setAnalyzing(true)
    setPreview(null)
    try {
      const result = await parseMeal(description.trim())
      setPreview(result)
    } catch (err) {
      showToast(err.message || 'Failed to analyze meal', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleLog() {
    if (!preview) return

    setLogging(true)
    try {
      await addMeal({
        type: mealType,
        description: description.trim(),
        items: preview.items,
        totals: preview.totals,
      })
      showToast('Meal logged!')
      setDescription('')
      setPreview(null)
      setView('dashboard')
    } catch (err) {
      showToast(err.message || 'Failed to log meal', 'error')
    } finally {
      setLogging(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (preview) {
        handleLog()
      } else {
        handleAnalyze()
      }
    }
  }

  return (
    <section className="meal-entry-view">
      <h2 className="section-title">Log a Meal</h2>

      <div className="meal-type-selector">
        {MEAL_TYPES.map(type => (
          <button
            key={type}
            className={`meal-type-btn ${mealType === type ? 'active' : ''}`}
            onClick={() => setMealType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="meal-input-group">
        <textarea
          className="meal-input"
          placeholder='Describe your meal... e.g. "two scrambled eggs and a slice of toast with butter"'
          rows={3}
          value={description}
          onChange={e => { setDescription(e.target.value); setPreview(null) }}
          onKeyDown={handleKeyDown}
        />
        <p className="input-hint">Press Enter or tap Analyze to estimate macros.</p>
      </div>

      {preview && <MealPreview data={preview} />}

      <div className="meal-actions">
        <button
          className="btn btn-secondary"
          onClick={handleAnalyze}
          disabled={!description.trim() || analyzing}
        >
          {analyzing ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          className="btn btn-primary"
          onClick={handleLog}
          disabled={!preview || logging}
        >
          {logging ? 'Logging...' : 'Log Meal'}
        </button>
      </div>
    </section>
  )
}
