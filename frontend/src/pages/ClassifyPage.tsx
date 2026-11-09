import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import { XP_PER_CLASSIFY, type OnFinish } from '../features/games/catalog'
import type { ClassifyGame } from '../features/games/classify/types'
import { shuffle } from '../features/games/shuffle'

export default function ClassifyPage({ game, onFinish }: { game: ClassifyGame; onFinish?: OnFinish }) {
  const total = game.items.length
  const [deck, setDeck] = useState(() => shuffle(total)) // tarjetas por ubicar; la primera es la actual
  const [placed, setPlaced] = useState<(number | null)[]>(() => Array(total).fill(null)) // grupo elegido por tarjeta
  const [locked, setLocked] = useState<boolean[]>(() => Array(total).fill(false))
  const [checks, setChecks] = useState(0)
  const [firstOk, setFirstOk] = useState(0)
  const [wrong, setWrong] = useState<number[]>([])

  const done = locked.every(Boolean)
  const current = deck[0]

  function place(group: number) {
    if (current === undefined) return
    setPlaced(placed.map((g, id) => (id === current ? group : g)))
    setDeck(deck.slice(1))
  }

  function takeBack(id: number) {
    if (locked[id]) return
    setPlaced(placed.map((g, i) => (i === id ? null : g)))
    setDeck([id, ...deck])
  }

  function check() {
    const ok = placed.map((g, id) => g === game.items[id].group)
    const bad = ok.flatMap((good, id) => (good ? [] : [id]))
    const first = checks === 0 ? ok.filter(Boolean).length : firstOk
    setFirstOk(first)
    if (ok.every(Boolean)) onFinish?.(first, total, first * XP_PER_CLASSIFY + (total - first))
    setChecks(checks + 1)
    setLocked(ok)
    setWrong(bad)
    setPlaced(placed.map((g, id) => (ok[id] ? g : null)))
    setDeck(shuffle(bad.length).map((i) => bad[i]))
  }

  function restart() {
    setDeck(shuffle(total))
    setPlaced(Array(total).fill(null))
    setLocked(Array(total).fill(false))
    setChecks(0)
    setFirstOk(0)
    setWrong([])
  }

  if (done) {
    const stars = checks === 1 ? 3 : checks === 2 ? 2 : 1
    const xp = firstOk * XP_PER_CLASSIFY + (total - firstOk)
    return (
      <section className="stack narrow center result">
        <Mascot size={160} mood="celebrate" />
        <h1>{stars === 3 ? '¡Perfecto!' : '¡Todo clasificado!'}</h1>
        <div className="stars" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? 'star star--on' : 'star'}>★</span>
          ))}
        </div>
        <div className="result__stats">
          <div><strong>{firstOk}/{total}</strong><span>bien a la primera</span></div>
          <div><strong>+{xp}</strong><span>XP</span></div>
        </div>
        <button className="btn" onClick={restart}>Jugar otra vez</button>
        <Link to={`/ranking?juego=${game.id}`} className="ranking-link">🏆 Ver el ranking de este juego</Link>
        <Link to="/juegos" className="btn btn--ghost">Volver a juegos</Link>
      </section>
    )
  }

  const placedCount = placed.filter((g) => g !== null).length
  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to="/juegos" className="quiz-close" aria-label="Salir del juego">✕</Link>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(locked.filter(Boolean).length / total) * 100}%` }} />
        </div>
        <span className="quiz-count">{placedCount}/{total}</span>
      </div>
      <p className="muted">{game.title}</p>

      {current !== undefined ? (
        <>
          <div className={`classify-card ${wrong.includes(current) ? 'classify-card--wrong' : ''}`} key={current}>
            <MathText text={game.items[current].text} />
          </div>
          <p className="center muted">¿En qué grupo va? Toca el grupo.</p>
        </>
      ) : (
        <p className="center classify-ready">¡Ubicaste todas las tarjetas! Revisa y pulsa Comprobar.</p>
      )}

      {checks > 0 && wrong.length > 0 && current !== undefined && (
        <p className="center frac-note">
          Las tarjetas en verde están bien. Vuelve a ubicar {deck.length === 1 ? 'la que falta' : `las ${deck.length} que faltan`}.
        </p>
      )}

      <div className={`classify-groups classify-groups--${game.groups.length}`}>
        {game.groups.map((name, g) => (
          <div key={g} className="classify-group">
            <button className="classify-group__head" disabled={current === undefined} onClick={() => place(g)}>
              <MathText text={name} />
            </button>
            <div className="classify-group__items">
              {placed.map((pg, id) =>
                pg === g ? (
                  <button
                    key={id}
                    className={`classify-chip ${locked[id] ? 'classify-chip--ok' : ''}`}
                    disabled={locked[id]}
                    aria-label={locked[id] ? undefined : 'Sacar esta tarjeta del grupo'}
                    onClick={() => takeBack(id)}
                  >
                    <MathText text={game.items[id].text} />
                  </button>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>

      {current === undefined && (
        <button className="btn" onClick={check}>Comprobar</button>
      )}
    </section>
  )
}
