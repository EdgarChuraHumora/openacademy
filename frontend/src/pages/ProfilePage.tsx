import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'

const stats = [
  { label: 'Juegos jugados', value: 0, icon: '🎮' },
  { label: 'Respuestas correctas', value: 0, icon: '✅' },
  { label: 'Días de racha', value: 0, icon: '🔥' },
]

export default function ProfilePage() {
  return (
    <section className="stack narrow">
      <div className="profile-head">
        <div className="avatar"><Mascot size={88} /></div>
        <div>
          <h1>Invitado</h1>
          <p className="muted">Inicia sesión para guardar tu progreso.</p>
        </div>
      </div>

      <div className="card">
        <div className="level-row">
          <strong>Nivel 1</strong>
          <span className="muted">0 / 100 XP</span>
        </div>
        <div className="progress"><div className="progress__bar" style={{ width: '4%' }} /></div>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <span className="stat__icon">{s.icon}</span>
            <strong>{s.value}</strong>
            <span className="muted">{s.label}</span>
          </div>
        ))}
      </div>

      <Link to="/login" className="btn">Iniciar sesión</Link>
    </section>
  )
}
