import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { signOut, useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

const XP_PER_LEVEL = 100
const grades = ['3.º primaria', '4.º primaria', '5.º primaria', '6.º primaria', '1.º secundaria', '2.º secundaria', '3.º secundaria', '4.º secundaria', '5.º secundaria', 'Pre-universitario']

export default function ProfilePage() {
  const { session, profile, loading, refreshProfile } = useAuth()
  const [stats, setStats] = useState({ games: 0, correct: 0 })
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')

  useEffect(() => {
    if (!supabase || !session) return
    supabase
      .from('game_results')
      .select('score')
      .then(({ data }) => {
        const rows = data ?? []
        setStats({ games: rows.length, correct: rows.reduce((sum, r) => sum + r.score, 0) })
      })
  }, [session, profile?.xp])

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !session) return
    await supabase.from('profiles').update({ display_name: name.trim(), grade: grade || null }).eq('id', session.user.id)
    await refreshProfile()
    setEditing(false)
  }

  if (loading) return <p className="muted center">Cargando…</p>

  if (!session || !profile) {
    return (
      <section className="stack narrow center">
        <div className="avatar"><Mascot size={88} /></div>
        <h1>Invitado</h1>
        <p className="muted">Puedes jugar sin cuenta, pero tu XP, tu racha y tu avance solo se guardan si inicias sesión.</p>
        <Link to="/login" className="btn">Iniciar sesión o crear cuenta</Link>
      </section>
    )
  }

  const inLevel = profile.xp % XP_PER_LEVEL
  const items = [
    { label: 'Juegos jugados', value: stats.games, icon: '🎮' },
    { label: 'Respuestas correctas', value: stats.correct, icon: '✅' },
    { label: 'Días de racha', value: profile.streak, icon: '🔥' },
  ]

  return (
    <section className="stack narrow">
      <div className="profile-head">
        <div className="avatar"><Mascot size={88} mood="celebrate" /></div>
        <div>
          <h1>{profile.display_name}</h1>
          <p className="muted">{profile.grade ?? 'Sin grado'} · {session.user.email}</p>
        </div>
      </div>

      <div className="card">
        <div className="level-row">
          <strong>Nivel {profile.level}</strong>
          <span className="muted">{inLevel} / {XP_PER_LEVEL} XP</span>
        </div>
        <div className="progress"><div className="progress__bar" style={{ width: `${Math.max(4, inLevel)}%` }} /></div>
        <span className="muted">Total: {profile.xp} XP</span>
      </div>

      <div className="stats-grid">
        {items.map((s) => (
          <div key={s.label} className="stat">
            <span className="stat__icon">{s.icon}</span>
            <strong>{s.value}</strong>
            <span className="muted">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="games-links">
        <Link to="/aulas" className="ranking-link">🏫 Mis aulas</Link>
        <Link to="/ranking" className="ranking-link">🏆 Ver el ranking</Link>
        {(profile.role === 'teacher' || profile.role === 'admin') && (
          <Link to="/docente" className="ranking-link">🧑‍🏫 Panel docente</Link>
        )}
        {profile.role === 'admin' && <Link to="/admin" className="ranking-link">🛠️ Administración</Link>}
      </div>

      {editing ? (
        <form className="card" onSubmit={save}>
          <label className="field">
            Nombre o apodo
            <input required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field">
            Grado
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">Sin grado</option>
              {grades.map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
          <button className="btn" type="submit">Guardar</button>
          <button className="btn btn--ghost" type="button" onClick={() => setEditing(false)}>Cancelar</button>
        </form>
      ) : (
        <button
          className="btn btn--ghost"
          onClick={() => {
            setName(profile.display_name)
            setGrade(profile.grade ?? '')
            setEditing(true)
          }}
        >
          Editar mi perfil
        </button>
      )}
      <button className="btn btn--red" onClick={signOut}>Cerrar sesión</button>
    </section>
  )
}
