import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gameSummary, games } from '../features/games/catalog'
import { useAuth } from '../lib/auth'
import { usePublishedGames, type UserGame } from '../lib/userGames'

const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'primaria', label: 'Primaria' },
  { value: 'secundaria', label: 'Secundaria' },
] as const

type Filter = (typeof filters)[number]['value']

function GameCard({ game }: { game: UserGame }) {
  return (
    <Link to={`/juegos/${game.id}`} className="game-card">
      <span className={`game-card__cover tile--${game.color}`}>{game.icon}</span>
      <div className="game-card__body">
        <span className="badge">{game.level}</span>
        <h3>{game.title}</h3>
        <p className="muted">{gameSummary(game)}</p>
        {game.author && <p className="muted game-card__author">Creado por {game.author}</p>}
      </div>
    </Link>
  )
}

export default function GamesPage() {
  const [filter, setFilter] = useState<Filter>('todos')
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const { profile } = useAuth()
  const teacherGames = usePublishedGames()
  const show = (g: UserGame) => filter === 'todos' || g.level === filter
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin'

  function join(e: FormEvent) {
    e.preventDefault()
    const clean = code.trim().toUpperCase()
    if (clean) navigate(`/juegos/${clean}`)
  }

  return (
    <section className="stack">
      <div className="page-head">
        <h1>Juegos</h1>
        <p className="muted">Elige un reto y gana XP.</p>
      </div>

      <form className="join-code" onSubmit={join}>
        <label htmlFor="join-code">¿Tu profesor te dio un código?</label>
        <div className="join-code__row">
          <input
            id="join-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="Ej. K7M2QX"
            autoCapitalize="characters"
          />
          <button className="btn btn--small" type="submit">Jugar</button>
        </div>
      </form>

      <div className="games-links">
        <Link to="/ranking" className="ranking-link">🏆 Ranking de la semana</Link>
        {isTeacher && <Link to="/docente" className="ranking-link">🧑‍🏫 Panel docente</Link>}
      </div>

      <div className="filters">
        {filters.map((f) => (
          <button
            key={f.value}
            className={`filter ${filter === f.value ? 'filter--active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {teacherGames.some(show) && (
        <>
          <h2 className="section-title">Creados por docentes</h2>
          <div className="grid">
            {teacherGames.filter(show).map((g) => <GameCard key={g.id} game={g} />)}
          </div>
          <h2 className="section-title">Juegos de OpenAcademy</h2>
        </>
      )}
      <div className="grid">
        {games.filter(show).map((g) => <GameCard key={g.id} game={g} />)}
      </div>
    </section>
  )
}
