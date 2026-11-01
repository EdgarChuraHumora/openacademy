import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import { XP_PER_ORDER } from '../features/games/catalog'
import type { OrderGame, OrderProblem } from '../features/games/order/types'
import { shuffle } from '../features/games/shuffle'

// Mezcla los pasos asegurando que no queden ya en el orden correcto
function mixed(n: number) {
  let order = shuffle(n)
  while (n > 1 && order.every((id, i) => id === i)) order = shuffle(n)
  return order
}

export default function OrderPage({ game }: { game: OrderGame }) {
  const total = game.problems.length
  const [index, setIndex] = useState(0)
  const [xp, setXp] = useState(0)
  const [firstTry, setFirstTry] = useState(0)
  const [finished, setFinished] = useState(false)

  function next(onFirstTry: boolean) {
    setXp((x) => x + (onFirstTry ? XP_PER_ORDER : XP_PER_ORDER / 2))
    if (onFirstTry) setFirstTry((n) => n + 1)
    if (index + 1 < total) setIndex(index + 1)
    else setFinished(true)
  }

  if (finished) {
    const stars = firstTry === total ? 3 : firstTry >= total / 2 ? 2 : 1
    return (
      <section className="stack narrow center result">
        <Mascot size={160} mood="celebrate" />
        <h1>{stars === 3 ? '¡Perfecto!' : '¡Bien hecho!'}</h1>
        <div className="stars" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? 'star star--on' : 'star'}>★</span>
          ))}
        </div>
        <div className="result__stats">
          <div><strong>{firstTry}/{total}</strong><span>al primer intento</span></div>
          <div><strong>+{xp}</strong><span>XP</span></div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setIndex(0)
            setXp(0)
            setFirstTry(0)
            setFinished(false)
          }}
        >
          Jugar otra vez
        </button>
        <Link to="/juegos" className="btn btn--ghost">Volver a juegos</Link>
      </section>
    )
  }

  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to="/juegos" className="quiz-close" aria-label="Salir del juego">✕</Link>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(index / total) * 100}%` }} />
        </div>
        <span className="quiz-count">{index + 1}/{total}</span>
      </div>
      <p className="muted">{game.title}</p>
      {/* key: cada problema empieza con su propio estado */}
      <ProblemView key={`${index}-${finished}`} problem={game.problems[index]} isLast={index + 1 === total} onNext={next} />
    </section>
  )
}

interface ProblemViewProps {
  problem: OrderProblem
  isLast: boolean
  onNext: (firstTry: boolean) => void
}

function ProblemView({ problem, isLast, onNext }: ProblemViewProps) {
  const n = problem.steps.length
  const [order] = useState(() => mixed(n))
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(n).fill(null))
  const [locked, setLocked] = useState<boolean[]>(() => Array(n).fill(false))
  const [tries, setTries] = useState(0)
  const [wrong, setWrong] = useState<number[]>([])
  const [note, setNote] = useState('')

  const solved = locked.every(Boolean)
  const pool = order.filter((id) => !slots.includes(id))
  const full = slots.every((s) => s !== null)

  function place(id: number) {
    const k = slots.indexOf(null)
    if (k === -1) return
    setSlots(slots.map((s, i) => (i === k ? id : s)))
    setWrong(wrong.filter((w) => w !== id))
    setNote('')
  }

  function takeBack(k: number) {
    if (locked[k]) return
    setSlots(slots.map((s, i) => (i === k ? null : s)))
    setNote('')
  }

  function check() {
    setTries(tries + 1)
    const ok = slots.map((id, k) => id === k)
    setLocked(ok)
    if (ok.every(Boolean)) return
    setWrong(slots.filter((id, k) => id !== null && id !== k) as number[])
    setSlots(slots.map((id, k) => (id === k ? id : null)))
    const good = ok.filter(Boolean).length
    setNote(`${good} de ${n} pasos están en su lugar (en verde). Vuelve a ubicar los demás.`)
  }

  return (
    <>
      <div className="frac-prompt"><MathText text={problem.prompt} /></div>

      <ol className="order-slots">
        {slots.map((id, k) => (
          <li key={k} className="order-slot">
            <span className="order-slot__num">{k + 1}</span>
            {id === null ? (
              <span className="order-slot__empty">Toca un paso de abajo</span>
            ) : (
              <button
                className={`order-step ${locked[k] ? 'order-step--ok' : ''}`}
                disabled={locked[k]}
                aria-label={locked[k] ? undefined : 'Quitar este paso'}
                onClick={() => takeBack(k)}
              >
                <MathText text={problem.steps[id]} />
              </button>
            )}
          </li>
        ))}
      </ol>

      {solved ? (
        <div className="feedback feedback--ok">
          <Mascot size={64} mood="celebrate" />
          <div className="feedback__text">
            <strong>¡Ordenado! +{tries === 1 ? XP_PER_ORDER : XP_PER_ORDER / 2} XP</strong>
            <span>{tries === 1 ? 'Al primer intento.' : `Lo lograste en ${tries} intentos.`}</span>
          </div>
          <button className="btn btn--green" onClick={() => onNext(tries === 1)}>
            {isLast ? 'Ver resultado' : 'Siguiente'}
          </button>
        </div>
      ) : (
        <>
          {note && <p className="center frac-note">{note}</p>}
          {pool.length > 0 && (
            <div className="order-pool">
              {pool.map((id) => (
                <button
                  key={id}
                  className={`order-step ${wrong.includes(id) ? 'order-step--wrong' : ''}`}
                  onClick={() => place(id)}
                >
                  <MathText text={problem.steps[id]} />
                </button>
              ))}
            </div>
          )}
          <button className="btn" disabled={!full} onClick={check}>Comprobar</button>
        </>
      )}
    </>
  )
}
