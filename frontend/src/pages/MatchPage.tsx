import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import { XP_PER_PAIR } from '../features/games/catalog'
import type { MatchGame } from '../features/games/match/types'
import { shuffle } from '../features/games/shuffle'

type Side = 'left' | 'right'

function newRound(n: number) {
  return { left: shuffle(n), right: shuffle(n), start: Date.now() }
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function MatchPage({ game }: { game: MatchGame }) {
  const total = game.pairs.length
  const [round, setRound] = useState(() => newRound(total))
  const [matched, setMatched] = useState<number[]>([])
  const [selected, setSelected] = useState<{ side: Side; id: number } | null>(null)
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null)
  const [errors, setErrors] = useState(0)
  const [endedAt, setEndedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  // Reloj: avanza cada segundo mientras se juega
  useEffect(() => {
    if (endedAt) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [endedAt])

  function pick(side: Side, id: number) {
    if (wrong || matched.includes(id)) return
    if (!selected || selected.side === side) {
      setSelected(selected?.side === side && selected.id === id ? null : { side, id })
      return
    }
    const left = side === 'left' ? id : selected.id
    const right = side === 'right' ? id : selected.id
    setSelected(null)
    if (left === right) {
      const next = [...matched, id]
      setMatched(next)
      if (next.length === total) setEndedAt(Date.now())
    } else {
      setErrors((e) => e + 1)
      setWrong({ left, right })
      setTimeout(() => setWrong(null), 700)
    }
  }

  function restart() {
    setRound(newRound(total))
    setMatched([])
    setSelected(null)
    setErrors(0)
    setEndedAt(null)
    setNow(Date.now())
  }

  if (endedAt) {
    const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1
    return (
      <section className="stack narrow center result">
        <Mascot size={160} mood="celebrate" />
        <h1>{stars === 3 ? '¡Perfecto!' : '¡Lo lograste!'}</h1>
        <div className="stars" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? 'star star--on' : 'star'}>★</span>
          ))}
        </div>
        <div className="result__stats">
          <div><strong>{formatTime(endedAt - round.start)}</strong><span>tiempo</span></div>
          <div><strong>{errors}</strong><span>{errors === 1 ? 'error' : 'errores'}</span></div>
          <div><strong>+{total * XP_PER_PAIR}</strong><span>XP</span></div>
        </div>
        <button className="btn" onClick={restart}>Jugar otra vez</button>
        <Link to="/juegos" className="btn btn--ghost">Volver a juegos</Link>
      </section>
    )
  }

  function card(side: Side, id: number) {
    const done = matched.includes(id)
    const isSelected = selected?.side === side && selected.id === id
    const isWrong = wrong !== null && wrong[side] === id
    const state = done ? 'match-card--done' : isWrong ? 'match-card--wrong' : isSelected ? 'match-card--selected' : ''
    return (
      <button
        key={`${side}-${id}`}
        className={`match-card ${state}`}
        aria-pressed={isSelected}
        disabled={done}
        onClick={() => pick(side, id)}
      >
        <MathText text={game.pairs[id][side]} />
      </button>
    )
  }

  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to="/juegos" className="quiz-close" aria-label="Salir del juego">✕</Link>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(matched.length / total) * 100}%` }} />
        </div>
        <span className="quiz-count">{matched.length}/{total}</span>
      </div>

      <div className="match-head">
        <p className="muted">{game.title}</p>
        <span className="chip">⏱ {formatTime(now - round.start)}</span>
      </div>
      <p className="center muted">Toca una tarjeta y luego su pareja del otro lado.</p>

      <div className="match-board">
        <div className="match-col">{round.left.map((id) => card('left', id))}</div>
        <div className="match-col">{round.right.map((id) => card('right', id))}</div>
      </div>
    </section>
  )
}
