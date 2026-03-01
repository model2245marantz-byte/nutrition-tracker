import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { MACRO_CONFIG } from '../lib/utils'
import './Settings.css'

export default function Settings() {
  const { profile, updateProfile, showToast } = useApp()
  const [values, setValues] = useState(() => {
    const v = {}
    for (const m of MACRO_CONFIG) {
      v[m.targetKey] = profile?.[m.targetKey] ?? 0
    }
    return v
  })
  const [saving, setSaving] = useState(false)

  function handleChange(key, val) {
    setValues(prev => ({ ...prev, [key]: val === '' ? '' : Number(val) }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const cleaned = {}
      for (const [k, v] of Object.entries(values)) {
        cleaned[k] = Math.max(0, Math.round(Number(v) || 0))
      }
      await updateProfile(cleaned)
      showToast('Targets updated')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="settings-view">
      <h2 className="section-title">Daily Targets</h2>
      <p className="section-desc">Set your personal daily macro goals.</p>

      <form className="settings-form" onSubmit={handleSave}>
        {MACRO_CONFIG.map(m => (
          <div className="settings-field" key={m.key}>
            <label htmlFor={`target-${m.key}`}>
              <span className="settings-dot" style={{ background: m.color }} />
              {m.label} ({m.unit})
            </label>
            <input
              id={`target-${m.key}`}
              type="number"
              min="0"
              value={values[m.targetKey]}
              onChange={e => handleChange(m.targetKey, e.target.value)}
            />
          </div>
        ))}

        <button type="submit" className="btn btn-primary settings-save" disabled={saving}>
          {saving ? 'Saving...' : 'Save Targets'}
        </button>
      </form>
    </section>
  )
}
