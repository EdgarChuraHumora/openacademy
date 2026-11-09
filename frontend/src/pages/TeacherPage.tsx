import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { fetchMyGames, shareUrl, type DbGame } from '../lib/userGames'

export function useIsTeacher() {
  const { profile } = useAuth()
  return profile?.role === 'teacher' || profile?.role === 'admin'
}

// Pantalla para quien no es docente (o no inició sesión)
export function TeacherGate() {
  const { session, profile, loading, refreshProfile } = useAuth()
  const [busy, setBusy] = useState(false)
  if (loading) return <p className="muted center">Cargando…</p>

  async function request() {
    if (!supabase) return
    setBusy(true)
    await supabase.rpc('request_teacher')
    await refreshProfile()
    setBusy(false)
  }

  return (
    <section className="stack narrow center">
      <Mascot size={110} />
      <h1>Panel docente</h1>
      {!session ? (
        <>
          <p className="muted">Inicia sesión con tu cuenta de docente para crear juegos para tus alumnos.</p>
          <Link to="/login" className="btn">Iniciar sesión</Link>
        </>
      ) : profile?.teacher_requested_at ? (
        <p className="auth__notice">
          Tu solicitud se envió el {new Date(profile.teacher_requested_at).toLocaleDateString('es-PE')}. Te avisaremos cuando
          activen tu cuenta de docente.
        </p>
      ) : (
        <>
          <p className="muted">Tu cuenta es de alumno. Si eres profesor, pide que activen tu cuenta de docente.</p>
          <button className="btn" disabled={busy} onClick={request}>
            {busy ? 'Enviando…' : 'Soy docente: pedir acceso'}
          </button>
        </>
      )}
    </section>
  )
}

const kindLabel: Record<DbGame['kind'], string> = {
  quiz: 'Quiz',
  match: 'Emparejar',
  order: 'Ordenar',
  truefalse: 'V o F',
  classify: 'Clasificar',
  domino: 'Dominó',
  roulette: 'Ruleta',
}

export default function TeacherPage() {
  const { session } = useAuth()
  const isTeacher = useIsTeacher()
  const [games, setGames] = useState<DbGame[] | null>(null)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    if (session && isTeacher) fetchMyGames(session.user.id).then(setGames)
  }, [session, isTeacher])

  if (!isTeacher) return <TeacherGate />

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(shareUrl(code))
      setCopied(code)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      setCopied('')
    }
  }

  async function remove(game: DbGame) {
    if (!supabase || !window.confirm(`¿Borrar "${game.title}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('games').delete().eq('id', game.id)
    if (!error) setGames((list) => list?.filter((g) => g.id !== game.id) ?? null)
  }

  return (
    <section className="stack narrow">
      <div className="page-head">
        <h1>🧑‍🏫 Panel docente</h1>
        <p className="muted">Crea juegos para tus alumnos y compártelos con un enlace o un código.</p>
      </div>

      <div className="create-grid">
        <Link to="/docente/nuevo?tipo=quiz" className="create-card">
          <span aria-hidden="true">❓</span>
          <strong>Quiz</strong>
          <small className="muted">Preguntas con 4 opciones, pistas y solución</small>
        </Link>
        <Link to="/docente/nuevo?tipo=match" className="create-card">
          <span aria-hidden="true">🔗</span>
          <strong>Emparejar</strong>
          <small className="muted">Unir cada expresión con su resultado</small>
        </Link>
        <Link to="/docente/nuevo?tipo=truefalse" className="create-card">
          <span aria-hidden="true">⏱️</span>
          <strong>Verdadero o falso</strong>
          <small className="muted">Afirmaciones contra el reloj</small>
        </Link>
      </div>

      {games === null ? (
        <p className="muted center">Cargando tus juegos…</p>
      ) : games.length === 0 ? (
        <div className="card center">
          <p>Aún no has creado juegos. Elige un tipo de juego arriba, escribe el contenido y publícalo.</p>
        </div>
      ) : (
        <ul className="teacher-list">
          {games.map((g) => (
            <li key={g.id} className="teacher-game">
              <div className="teacher-game__head">
                <span className={`tile tile--${g.color}`}>{g.icon}</span>
                <div>
                  <strong>{g.title}</strong>
                  <p className="muted">
                    {kindLabel[g.kind]} · {g.level} ·{' '}
                    <span className={g.status === 'published' ? 'status status--ok' : 'status'}>
                      {g.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </p>
                </div>
              </div>
              {g.status === 'published' && (
                <p className="teacher-game__code">
                  Código: <strong>{g.share_code}</strong>
                  <button className="link-btn" onClick={() => copy(g.share_code)}>
                    {copied === g.share_code ? '¡Enlace copiado!' : 'Copiar enlace'}
                  </button>
                </p>
              )}
              <div className="teacher-game__actions">
                <Link to={`/juegos/${g.id}`} className="btn btn--ghost btn--small">Probar</Link>
                {(g.kind === 'quiz' || g.kind === 'match' || g.kind === 'truefalse') && <Link to={`/docente/editar/${g.id}`} className="btn btn--ghost btn--small">Editar</Link>}
                <button className="btn btn--ghost btn--small teacher-game__delete" onClick={() => remove(g)}>Borrar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
