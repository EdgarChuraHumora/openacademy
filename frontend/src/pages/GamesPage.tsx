import { useState } from 'react'
import { Link } from 'react-router-dom'
import { gameSummary, games } from '../features/games/catalog'

const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'primaria', label: 'Primaria' },
  { value: 'secundaria', label: 'Secundaria' },
] as const

type Filter = (typeof filters)[number]['value']

export default function GamesPage() {
  const [filter, setFilter] = useState<Filter>('todos')
  const visible = games.filter((g) => filter === 'todos' || g.level === filter)

  return (
    <section className="stack">
      <div className="page-head">
        <h1>Juegos</h1>
        <p className="muted">Elige un reto y gana XP.</p>
      </div>
      <Link to="/ranking" className="ranking-link">🏆 Ver el ranking de la semana</Link>
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
      <div className="grid">
        {visible.map((quiz) => (
          <Link key={quiz.id} to={`/juegos/${quiz.id}`} className="game-card">
            <span className={`game-card__cover tile--${quiz.color}`}>{quiz.icon}</span>
            <div className="game-card__body">
              <span className="badge">{quiz.level}</span>
              <h3>{quiz.title}</h3>
              <p className="muted">{gameSummary(quiz)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
