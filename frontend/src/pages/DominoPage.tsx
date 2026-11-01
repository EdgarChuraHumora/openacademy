import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import { XP_PER_DOMINO } from '../features/games/catalog'
import type { DominoGame } from '../features/games/domino/types'
import { shuffle } from '../features/games/shuffle'

// Las fichas de la mano (todas menos la primera, que ya está en la mesa), mezcladas
function newHand(n: number) {
  return shuffle(n - 1).map((i) => i + 1)
}

export default function DominoPage({ game }: { game: DominoGame }) {
  const n = game.pairs.length
  const [chain, setChain] = useState(1) // fichas 0..chain-1 ya están en la mesa
  const [hand, setHand] = useState(() => newHand(n))
  const [errors, setErrors] = useState(0)
  const [wrong, setWrong] = useState<number | null>(null)
  const wrongTimer = useRef(0)

  // Ficha k: a la izquierda la respuesta de la pareja anterior, a la derecha la pregunta k
  const left = (k: number) => game.pairs[(k - 1 + n) % n].answer
  const right = (k: number) => game.pairs[k].question

  function play(k: number) {
    if (wrong !== null) return
    if (k === chain) {
      setChain(chain + 1)
      setHand(hand.filter((h) => h !== k))
    } else {
      setErrors(errors + 1)
      setWrong(k)
      clearTimeout(wrongTimer.current)
      wrongTimer.current = window.setTimeout(() => setWrong(null), 600)
    }
  }

  function restart() {
    setChain(1)
    setHand(newHand(n))
    setErrors(0)
    setWrong(null)
  }

  function tile(k: number) {
    return (
      <>
        <span className="domino__half"><MathText text={left(k)} /></span>
        <span className="domino__half"><MathText text={right(k)} /></span>
      </>
    )
  }

  if (chain === n) {
    const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1
    return (
      <section className="stack narrow center result">
        <Mascot size={150} mood="celebrate" />
        <h1>¡Cerraste el dominó!</h1>
        <p className="muted">
          La última ficha vuelve a la primera: <MathText text={right(n - 1)} /> = <MathText text={left(0)} />
        </p>
        <div className="stars" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((s) => (
            <span key={s} className={s <= stars ? 'star star--on' : 'star'}>★</span>
          ))}
        </div>
        <div className="result__stats">
          <div><strong>{errors}</strong><span>{errors === 1 ? 'error' : 'errores'}</span></div>
          <div><strong>+{(n - 1) * XP_PER_DOMINO}</strong><span>XP</span></div>
        </div>
        <button className="btn" onClick={restart}>Jugar otra vez</button>
        <Link to="/juegos" className="btn btn--ghost">Volver a juegos</Link>
      </section>
    )
  }

  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to="/juegos" className="quiz-close" aria-label="Salir del juego">✕</Link>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(chain / n) * 100}%` }} />
        </div>
        <span className="quiz-count">{chain}/{n}</span>
      </div>
      <p className="muted">{game.title}</p>

      <ol className="domino-chain" aria-label="Fichas en la mesa">
        {Array.from({ length: chain }, (_, k) => (
          <li key={k} className={`domino domino--placed ${k === chain - 1 ? 'domino--last' : ''}`}>
            {tile(k)}
          </li>
        ))}
      </ol>

      <p className="domino-hint">
        Busca la ficha que empieza con el resultado de <MathText text={right(chain - 1)} />
      </p>

      <div className="domino-hand">
        {hand.map((k) => (
          <button
            key={k}
            className={`domino domino--hand ${wrong === k ? 'domino--wrong' : ''}`}
            onClick={() => play(k)}
          >
            {tile(k)}
          </button>
        ))}
      </div>
    </section>
  )
}
