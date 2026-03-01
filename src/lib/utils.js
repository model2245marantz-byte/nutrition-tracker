export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function todayStr() {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function sumMacros(meals) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
  for (const meal of meals) {
    const t = meal.totals || {}
    totals.calories += t.calories || 0
    totals.protein += t.protein || 0
    totals.carbs += t.carbs || 0
    totals.fat += t.fat || 0
    totals.fiber += t.fiber || 0
    totals.sodium += t.sodium || 0
  }
  return totals
}

export const DEFAULT_TARGETS = {
  daily_calories: 2000,
  daily_protein: 150,
  daily_carbs: 250,
  daily_fat: 65,
  daily_fiber: 30,
  daily_sodium: 2300,
}

export const MACRO_CONFIG = [
  { key: 'calories', label: 'Calories', unit: 'kcal', color: 'var(--calories-color)', targetKey: 'daily_calories' },
  { key: 'protein', label: 'Protein', unit: 'g', color: 'var(--protein-color)', targetKey: 'daily_protein' },
  { key: 'carbs', label: 'Carbs', unit: 'g', color: 'var(--carbs-color)', targetKey: 'daily_carbs' },
  { key: 'fat', label: 'Fat', unit: 'g', color: 'var(--fat-color)', targetKey: 'daily_fat' },
  { key: 'fiber', label: 'Fiber', unit: 'g', color: 'var(--fiber-color)', targetKey: 'daily_fiber' },
  { key: 'sodium', label: 'Sodium', unit: 'mg', color: 'var(--sodium-color)', targetKey: 'daily_sodium' },
]
