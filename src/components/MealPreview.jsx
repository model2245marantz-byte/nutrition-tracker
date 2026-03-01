import './MealPreview.css'

export default function MealPreview({ data }) {
  if (!data) return null

  const { items, totals } = data

  return (
    <div className="meal-preview">
      <h3 className="preview-title">Estimated Nutrition</h3>

      {items && items.length > 0 && (
        <div className="preview-items">
          {items.map((item, i) => (
            <div className="preview-item" key={i}>
              <div className="preview-item-header">
                <span className="preview-item-name">{item.name}</span>
                {item.quantity && <span className="preview-item-qty">{item.quantity}</span>}
              </div>
              <div className="preview-item-macros">
                <span>{Math.round(item.calories)} cal</span>
                <span>{Math.round(item.protein)}g P</span>
                <span>{Math.round(item.carbs)}g C</span>
                <span>{Math.round(item.fat)}g F</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {totals && (
        <div className="preview-totals">
          <span className="preview-totals-label">Total</span>
          <div className="preview-totals-macros">
            <span className="total-pill cal">{Math.round(totals.calories)} cal</span>
            <span className="total-pill pro">{Math.round(totals.protein)}g P</span>
            <span className="total-pill carb">{Math.round(totals.carbs)}g C</span>
            <span className="total-pill fat">{Math.round(totals.fat)}g F</span>
            <span className="total-pill fiber">{Math.round(totals.fiber || 0)}g Fiber</span>
            <span className="total-pill sodium">{Math.round(totals.sodium || 0)}mg Na</span>
          </div>
        </div>
      )}
    </div>
  )
}
