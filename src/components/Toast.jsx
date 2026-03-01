import { useApp } from '../context/AppContext'
import './Toast.css'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null

  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.message}
    </div>
  )
}
