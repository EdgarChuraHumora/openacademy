import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import { XP_PER_TRUE_FALSE, type OnFinish } from '../features/games/catalog'
import { shuffle } from '../features/games/shuffle'
import type { TrueFalseGame } from '../features/games/truefalse/types'

type Phase = 'ready' | 'playing' | 'done'

interface Answer {
  id: number
  ok: boolean
}

export default function TrueFalsePage({ game, onFinish }: { game: TrueFalseGame; onFinish?: OnFinish }) {
  const total = game.statements.length
  const limit = game.seconds * 1000
  const [phase, setPhase] = useState<Phase>('ready')
  const [order, setOrder] = useState<number[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null)
  const [startedAt, setStartedAt] = useState(0)
  const [now, setNow] = useState(0)
  const flashTimer = useRef<number>(0)

  const left = Math.max(0, limit - (now - startedAt))
  const current = order[answers.length]
  // Termina por tiempo (phase) o al responder todas
  const over = phase === 'done' || (phase === 'playing' && answers.length >= total)

  // Reloj: se actualiza 10 veces por segundo; al llegar a 0 termina el juego
  useEffect(() => {
    if (phase !== 'playing' || over) return
    const timer = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t - startedAt >= limit) setPhase('done')
    }, 100)
    return () => clearInterval(timer)
  }, [phase, over, startedAt, limit])

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  // Avisa una sola vez por partida cuando termina (por tiempo o al responder todas)
  const reported = useRef(false)
  useEffect(() => {
    if (!over || reported.current) return
    reported.current = true
    const correct = answers.filter((a) => a.ok).length
    onFinish?.(correct, total, correct * XP_PER_TRUE_FALSE)
  }, [over, answers, total, onFinish])

  function start() {
    const t = Date.now()
    setOrder(shuffle(total))
    setAnswers([])
    setFlash(null)
    setStartedAt(t)
    setNow(t)
    setPhase('playing')
    reported.current = false
  }

  function answer(value: boolean) {
    if (phase !== 'playing' || over || flash) return
    const ok = game.statements[current].answer === value
    setFlash(ok ? 'ok' : 'bad')
    flashTimer.current = window.setTimeout(() => {
      setFlash(null)
      setAnswers((a) => [...a, { id: current, ok }])
    }, 450)
  }

  // En computadora también se puede responder con las teclas V y F
  useEffect(() => {
    if (phase !== 'playing' || over) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'v' || e.key === 'V') answer(true)
      if (e.key === 'f' || e.key === 'F') answer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (phase === 'ready') {
    return (
      <section className="stack narrow center result">
        <Mascot size={140} />
        <h1>{game.title}</h1>
        <p className="muted">
          Tienes <b>{game.seconds} segundos</b> para responder las {total} afirmaciones. ¡Responde rápido, pero piensa bien!
        </p>
        <button className="btn btn--green" onClick={start}>¡Empezar!</button>
        <Link to="/juegos" className="btn btn--ghost">Volver a juegos</Link>
      </section>
    )
  }

  if (over) {
    const correct = answers.filter((a) => a.ok).length
    const wrong = answers.filter((a) => !a.ok)
    const stars = correct >= total * 0.8 ? 3 : correct >= total * 0.5 ? 2 : correct > 0 ? 1 : 0
    return (
      <section className="stack narrow center result">
        <Mascot size={140} mood={stars >= 2 ? 'celebrate' : 'sad'} />
        <h1>{answers.length < total ? '¡Se acabó el tiempo!' : stars === 3 ? '¡Excelente!' : '¡Terminaste!'}</h1>
        <div className="stars" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? 'star star--on' : 'star'}>★</span>
          ))}
        </div>
        <div className="result__stats">
          <div><strong>{correct}/{total}</strong><span>correctas</span></div>
          <div><strong>+{correct * XP_PER_TRUE_FALSE}</strong><span>XP</span></div>
        </div>

        {wrong.length > 0 && (
          <div className="card tf-review">
            <strong>Repasa las que fallaste</strong>
            {wrong.map(({ id }) => {
              const s = game.statements[id]
              return (
                <div key={id} className="tf-review__item">
                  <p><MathText text={s.text} /></p>
                  <p className={s.answer ? 'tf-true' : 'tf-false'}>Es {s.answer ? 'verdadero' : 'falso'}.</p>
                  {s.why && <p className="muted"><MathText text={s.why} /></p>}
                </div>
              )
            })}
          </div>
        )}

        <button className="btn" onClick={start}>Jugar otra vez</button>
        <Link to="/juegos" className="btn btn--ghost">Volver a juegos</Link>
      </section>
    )
  }

  const seconds = Math.ceil(left / 1000)
  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to="/juegos" className="quiz-close" aria-label="Salir del juego">✕</Link>
        <div className="progress">
          <div
            className={`progress__bar ${seconds <= 10 ? 'progress__bar--danger' : 'progress__bar--time'}`}
            style={{ width: `${(left / limit) * 100}%` }}
          />
        </div>
        <span className="quiz-count">⏱ {seconds}s</span>
      </div>
      <p className="muted">
        {game.title} · {answers.length + 1}/{total}
      </p>

      <div className={`question tf-statement ${flash ? `tf-statement--${flash}` : ''}`}>
        <MathText text={game.statements[current].text} />
      </div>

      <div className="tf-buttons">
        <button className="btn btn--green" onClick={() => answer(true)}>✓ Verdadero</button>
        <button className="btn btn--red" onClick={() => answer(false)}>✗ Falso</button>
      </div>
      <p className="muted center tf-keys">En computadora puedes usar las teclas V y F.</p>
    </section>
  )
}
