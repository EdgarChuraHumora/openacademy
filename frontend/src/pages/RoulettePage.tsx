import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import { XP_PER_ROULETTE } from '../features/games/catalog'
import Wheel from '../features/games/roulette/Wheel'
import type { RouletteGame } from '../features/games/roulette/types'

const letters = ['A', 'B', 'C', 'D']

// Si el sistema pide menos animación, la ruleta gira casi al instante
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const SPIN_MS = reduceMotion ? 300 : 3200

export default function RoulettePage({ game }: { game: RouletteGame }) {
  const n = game.sectors.length
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [current, setCurrent] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [results, setResults] = useState<(boolean | undefined)[]>(() => Array(n).fill(undefined))
  const [finished, setFinished] = useState(false)
  const spinTimer = useRef(0)

  useEffect(() => () => clearTimeout(spinTimer.current), [])

  const remaining = results.flatMap((r, i) => (r === undefined ? [i] : []))

  function spin() {
    if (spinning || remaining.length === 0) return
    const target = remaining[Math.floor(Math.random() * remaining.length)]
    const center = (target + 0.5) * (360 / n)
    // Gira 5 vueltas y se detiene con el sector elegido bajo el puntero (arriba)
    const delta = (((-center - rotation) % 360) + 360) % 360
    setRotation(rotation + 5 * 360 + delta)
    setSpinning(true)
    setSelected(null)
    spinTimer.current = window.setTimeout(() => {
      setSpinning(false)
      setCurrent(target)
    }, SPIN_MS)
  }

  function choose(index: number) {
    if (current === null || selected !== null) return
    setSelected(index)
    setResults(results.map((r, i) => (i === current ? index === game.sectors[current].answerIndex : r)))
  }

  function next() {
    setCurrent(null)
    setSelected(null)
    if (remaining.length === 0) setFinished(true)
  }

  function restart() {
    setResults(Array(n).fill(undefined))
    setCurrent(null)
    setSelected(null)
    setFinished(false)
  }

  if (finished) {
    const correct = results.filter(Boolean).length
    const stars = correct === n ? 3 : correct >= n / 2 ? 2 : correct > 0 ? 1 : 0
    return (
      <section className="stack narrow center result">
        <Mascot size={150} mood={stars >= 2 ? 'celebrate' : 'sad'} />
        <h1>{stars === 3 ? '¡Ruleta completa!' : '¡Terminaste la ruleta!'}</h1>
        <div className="stars" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((s) => (
            <span key={s} className={s <= stars ? 'star star--on' : 'star'}>★</span>
          ))}
        </div>
        <div className="result__stats">
          <div><strong>{correct}/{n}</strong><span>correctas</span></div>
          <div><strong>+{correct * XP_PER_ROULETTE}</strong><span>XP</span></div>
        </div>
        <button className="btn" onClick={restart}>Jugar otra vez</button>
        <Link to="/juegos" className="btn btn--ghost">Volver a juegos</Link>
      </section>
    )
  }

  const sector = current !== null ? game.sectors[current] : null
  const answered = selected !== null
  const isCorrect = sector !== null && selected === sector.answerIndex

  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to="/juegos" className="quiz-close" aria-label="Salir del juego">✕</Link>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${((n - remaining.length) / n) * 100}%` }} />
        </div>
        <span className="quiz-count">{n - remaining.length}/{n}</span>
      </div>
      <p className="muted">{game.title}</p>

      {sector === null ? (
        <>
          <div className="wheel-box">
            <Wheel labels={game.sectors.map((s) => s.label)} rotation={rotation} results={results} spinMs={SPIN_MS} />
          </div>
          <button className="btn btn--yellow" disabled={spinning} onClick={spin}>
            {spinning ? 'Girando…' : '🎡 ¡Girar la ruleta!'}
          </button>
        </>
      ) : (
        <>
          <span className="badge">{sector.label}</span>
          <div className="question"><MathText text={sector.question} /></div>
          <div className="options">
            {sector.options.map((option, index) => {
              let state = ''
              if (answered) {
                if (index === sector.answerIndex) state = 'option--correct'
                else if (index === selected) state = 'option--wrong'
                else state = 'option--dim'
              }
              return (
                <button key={option} className={`option ${state}`} onClick={() => choose(index)}>
                  <span className="option__letter">{letters[index]}</span>
                  <MathText text={option} />
                </button>
              )
            })}
          </div>
          {answered && (
            <div className={`feedback ${isCorrect ? 'feedback--ok' : 'feedback--bad'}`}>
              <Mascot size={64} mood={isCorrect ? 'celebrate' : 'sad'} />
              <div className="feedback__text">
                <strong>{isCorrect ? `¡Correcto! +${XP_PER_ROULETTE} XP` : 'Casi…'}</strong>
                {!isCorrect && <span>La respuesta era <MathText text={sector.options[sector.answerIndex]} /></span>}
              </div>
              {sector.explanation && (
                <div className="feedback__more">
                  <p><strong>Solución:</strong> <MathText text={sector.explanation} /></p>
                </div>
              )}
              <button className={`btn ${isCorrect ? 'btn--green' : 'btn--red'}`} onClick={next}>
                {remaining.length > 0 ? 'Volver a la ruleta' : 'Ver resultado'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
