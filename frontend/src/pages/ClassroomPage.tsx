import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { useAuth } from '../lib/auth'
import {
  fetchAssigned,
  fetchClassroom,
  fetchLeaderboard,
  pctClass,
  type AssignedGame,
  type Classroom,
  type LeaderRow,
} from '../lib/classrooms'
import { supabase } from '../lib/supabase'

const medals = ['🥇', '🥈', '🥉']

// /aulas/:id: juegos asignados y ranking semanal del aula (lo ven alumnos y docente)
export default function ClassroomPage() {
  const { id = '' } = useParams()
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Classroom | null | undefined>(undefined)
  const [assigned, setAssigned] = useState<AssignedGame[]>([])
  const [ranking, setRanking] = useState<LeaderRow[]>([])
  const [best, setBest] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!session) return
    Promise.all([fetchClassroom(id), fetchAssigned(id), fetchLeaderboard(id)]).then(async ([r, a, l]) => {
      setRoom(r)
      setAssigned(a)
      setRanking(l)
      if (!supabase || a.length === 0) return
      // Mejor resultado propio en cada juego asignado
      const { data } = await supabase
        .from('game_results')
        .select('game_id, score, total')
        .eq('user_id', session.user.id)
        .in('game_id', a.map((g) => `juego:${g.game_id}`))
      const map: Record<string, number> = {}
      for (const row of data ?? []) {
        const key = row.game_id.slice('juego:'.length)
        map[key] = Math.max(map[key] ?? 0, Math.round((100 * row.score) / row.total))
      }
      setBest(map)
    })
  }, [id, session])

  if (loading) return <p className="muted center">Cargando…</p>
  if (!session) {
    return (
      <section className="stack narrow center">
        <Mascot size={100} />
        <p>Inicia sesión para ver tu aula.</p>
        <Link to="/login" className="btn">Iniciar sesión</Link>
      </section>
    )
  }
  if (room === undefined) return <p className="muted center">Cargando aula…</p>
  if (!room) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" size={100} />
        <p>No encontramos esa aula. Puede que el profesor la haya borrado o que ya no estés en ella.</p>
        <Link to="/aulas" className="btn">Ir a Mis aulas</Link>
      </section>
    )
  }

  const isOwner = room.owner_id === session.user.id
  const pending = assigned.filter((g) => best[g.game_id] === undefined).length

  async function leave() {
    if (!supabase || !session || !room) return
    if (!window.confirm(`¿Salir del aula "${room.name}"? Puedes volver a entrar con el código.`)) return
    await supabase.from('classroom_members').delete().eq('classroom_id', id).eq('student_id', session.user.id)
    navigate('/aulas')
  }

  return (
    <section className="stack narrow">
      <Link to={isOwner ? `/docente/aulas/${id}` : '/aulas'} className="back-link">
        ← {isOwner ? 'Volver al aula (docente)' : 'Mis aulas'}
      </Link>
      <div className="page-head">
        <h1>🏫 {room.name}</h1>
        {!isOwner && (
          <p className="muted">
            {assigned.length === 0
              ? 'Tu profesor aún no asignó juegos.'
              : pending === 0
                ? '¡Completaste todos los juegos asignados! Puedes repetirlos para mejorar tu resultado.'
                : `Te falta${pending === 1 ? '' : 'n'} ${pending} juego${pending === 1 ? '' : 's'} por jugar.`}
          </p>
        )}
      </div>

      {assigned.length > 0 && (
        <>
          <h2 className="section-title">Juegos asignados</h2>
          <ul className="assigned-list">
            {assigned.map((g) => (
              <li key={g.game_id}>
                <Link to={`/juegos/${g.game_id}`} className="assigned-game assigned-game--link">
                  <span aria-hidden="true">{g.icon}</span>
                  <div className="assigned-game__info">
                    <strong>{g.title}</strong>
                    {!isOwner && (
                      <span className="muted">
                        {best[g.game_id] === undefined ? (
                          'Pendiente'
                        ) : (
                          <>Tu mejor resultado: <span className={pctClass(best[g.game_id])}>{best[g.game_id]}%</span></>
                        )}
                      </span>
                    )}
                  </div>
                  <span className="assigned-game__play">Jugar ▶</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="section-title">🏆 Ranking del aula (esta semana)</h2>
      {ranking.length === 0 ? (
        <p className="muted center">Aún no hay alumnos en esta aula.</p>
      ) : (
        <ol className="ranking">
          {ranking.map((r) => (
            <li key={`${r.pos}-${r.display_name}`} className={`ranking__row ${r.is_me ? 'ranking__row--me' : ''}`}>
              <span className="ranking__pos">{r.points > 0 ? (medals[r.pos - 1] ?? r.pos) : r.pos}</span>
              <span className="ranking__name">{r.display_name}{r.is_me && ' (tú)'}</span>
              <span className="ranking__points">{r.points} XP</span>
            </li>
          ))}
        </ol>
      )}

      {!isOwner && <button className="btn btn--ghost" onClick={leave}>Salir del aula</button>}
    </section>
  )
}
