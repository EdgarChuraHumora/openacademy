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
  const { session, loading } = useAuth()
  if (loading) return <p className="muted center">Cargando…</p>
  return (
    <section className="stack narrow center">
      <Mascot size={110} />
      <h1>Panel docente</h1>
      {!session ? (
        <>
          <p className="muted">Inicia sesión con tu cuenta de docente para crear juegos para tus alumnos.</p>
          <Link to="/login" className="btn">Iniciar sesión</Link>
        </>
      ) : (
        <p className="muted">
          Tu cuenta es de alumno. Si eres profesor, escribe a OpenAcademy para que activen tu cuenta de docente.
        </p>
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

      <Link to="/docente/nuevo" className="btn btn--green">+ Crear un quiz</Link>

      {games === null ? (
        <p className="muted center">Cargando tus juegos…</p>
      ) : games.length === 0 ? (
        <div className="card center">
          <p>Aún no has creado juegos. Empieza con un quiz: escribe tus preguntas y publícalo.</p>
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
                {g.kind === 'quiz' && <Link to={`/docente/editar/${g.id}`} className="btn btn--ghost btn--small">Editar</Link>}
                <button className="btn btn--ghost btn--small teacher-game__delete" onClick={() => remove(g)}>Borrar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
