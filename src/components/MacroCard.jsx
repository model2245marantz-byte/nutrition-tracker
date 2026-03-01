import './MacroCard.css'

export default function MacroCard({ label, current, target, unit, color }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const over = current > target && target > 0

  return (
    <div className={`macro-card ${over ? 'macro-over' : ''}`}>
      <div className="macro-header">
        <span className="macro-name">{label}</span>
        <span className="macro-values">
          <span className="macro-current">{Math.round(current)}</span>
          {' / '}
          <span className="macro-target">{target.toLocaleString()}</span>
          {' '}{unit}
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
