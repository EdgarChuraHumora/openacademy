import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { games } from '../features/games/catalog'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

interface Row {
  pos: number
  display_name: string
  points: number
  is_me: boolean
}

const medals = ['🥇', '🥈', '🥉']

export default function RankingPage() {
  const { session, loading } = useAuth()
  const [params, setParams] = useSearchParams()
  const gameId = params.get('juego') ?? ''
  const [rows, setRows] = useState<Row[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!supabase || !session) return
    setRows(null)
    setFailed(false)
    supabase
      .rpc('leaderboard', { p_game_id: gameId ? `juego:${gameId}` : null })
      .then(({ data, error }) => {
        if (error) setFailed(true)
        else setRows((data as Row[]) ?? [])
      })
  }, [session, gameId])

  const game = games.find((g) => g.id === gameId)
  const unit = game ? (game.kind === 'quiz' || game.kind === 'roulette' ? 'aciertos' : 'puntos') : 'XP'

  return (
    <section className="stack narrow">
      <div className="page-head">
        <h1>🏆 Ranking</h1>
        <p className="muted">
          {game ? 'Mejor resultado de cada jugador en este juego.' : 'XP ganado en todos los juegos durante los últimos 7 días.'}
        </p>
      </div>

      <label className="field">
        Ver ranking de
        <select value={gameId} onChange={(e) => setParams(e.target.value ? { juego: e.target.value } : {})}>
          <option value="">Todos los juegos (esta semana)</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>{g.icon} {g.title}</option>
          ))}
        </select>
      </label>

      {loading ? (
        <p className="muted center">Cargando…</p>
      ) : !session ? (
        <div className="card center">
          <Mascot size={80} />
          <p>Inicia sesión para ver el ranking y aparecer en él.</p>
          <Link to="/login" className="btn">Iniciar sesión</Link>
        </div>
      ) : failed ? (
        <p className="auth__error">No se pudo cargar el ranking. Inténtalo más tarde.</p>
      ) : rows === null ? (
        <p className="muted center">Cargando…</p>
      ) : rows.length === 0 ? (
        <div className="card center">
          <Mascot size={80} />
          <p>Aún nadie tiene puntos aquí. ¡Juega y sé el primero!</p>
          <Link to={game ? `/juegos/${game.id}` : '/juegos'} className="btn btn--green">Jugar</Link>
        </div>
      ) : (
        <ol className="ranking">
          {rows.map((r) => (
            <li key={`${r.pos}-${r.display_name}`} className={`ranking__row ${r.is_me ? 'ranking__row--me' : ''}`}>
              <span className="ranking__pos">{medals[r.pos - 1] ?? r.pos}</span>
              <span className="ranking__name">{r.display_name}{r.is_me && ' (tú)'}</span>
              <span className="ranking__points">{r.points} {unit}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
