import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import type { Quiz } from '../features/games/quiz/types'

const letters = ['A', 'B', 'C', 'D']
const XP_CORRECT = 10
const XP_WITH_HINT = 5 // si pidió pista, gana menos XP

interface QuizPageProps {
  quiz: Quiz
  exitTo?: string // a dónde vuelve al salir (por defecto, la lista de juegos)
  exitLabel?: string
  onFinish?: (score: number, total: number, xp: number) => void
}

export default function QuizPage({ quiz, exitTo = '/juegos', exitLabel = 'Volver a juegos', onFinish }: QuizPageProps) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [xp, setXp] = useState(0)
  const [hintsShown, setHintsShown] = useState(0)

  const total = quiz.questions.length

  if (current >= total) {
    const stars = score === total ? 3 : score >= total / 2 ? 2 : score > 0 ? 1 : 0
    return (
      <section className="stack narrow center result">
        <Mascot size={160} mood={stars >= 2 ? 'celebrate' : 'sad'} />
        <h1>{stars >= 2 ? '¡Excelente trabajo!' : '¡Sigue practicando!'}</h1>
        <div className="stars" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= stars ? 'star star--on' : 'star'}>★</span>
          ))}
        </div>
        <div className="result__stats">
          <div><strong>{score}/{total}</strong><span>correctas</span></div>
          <div><strong>+{xp}</strong><span>XP</span></div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setCurrent(0)
            setScore(0)
            setXp(0)
            setHintsShown(0)
            setSelected(null)
          }}
        >
          Jugar otra vez
        </button>
        <Link to={exitTo} className="btn btn--ghost">{exitLabel}</Link>
      </section>
    )
  }

  const question = quiz.questions[current]
  const answered = selected !== null
  const isCorrect = selected === question.answerIndex
  const hints = question.hints ?? []
  const earned = hintsShown > 0 ? XP_WITH_HINT : XP_CORRECT
  const mistake = selected !== null ? question.mistakes?.[selected] : undefined

  function choose(index: number) {
    if (answered) return
    setSelected(index)
    if (index === question.answerIndex) {
      setScore((s) => s + 1)
      setXp((x) => x + earned)
    }
  }

  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to={exitTo} className="quiz-close" aria-label="Salir">✕</Link>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(current / total) * 100}%` }} />
        </div>
        <span className="quiz-count">{current + 1}/{total}</span>
      </div>

      <p className="muted"><MathText text={quiz.title} /></p>
      <div className="question"><MathText text={question.question} /></div>

      <div className="options">
        {question.options.map((option, index) => {
          let state = ''
          if (answered) {
            if (index === question.answerIndex) state = 'option--correct'
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

      {!answered && hints.length > 0 && (
        <div className="hints">
          {hints.slice(0, hintsShown).map((hint, i) => (
            <p key={i} className="hint">
              <span aria-hidden="true">💡</span> <MathText text={hint} />
            </p>
          ))}
          {hintsShown < hints.length && (
            <button className="hint-btn" onClick={() => setHintsShown((n) => n + 1)}>
              {hintsShown === 0 ? `💡 Pedir una pista (ganas ${XP_WITH_HINT} XP en vez de ${XP_CORRECT})` : '💡 Otra pista'}
            </button>
          )}
        </div>
      )}

      {answered && (
        <div className={`feedback ${isCorrect ? 'feedback--ok' : 'feedback--bad'}`}>
          <Mascot size={64} mood={isCorrect ? 'celebrate' : 'sad'} />
          <div className="feedback__text">
            <strong>{isCorrect ? `¡Correcto! +${earned} XP` : 'Casi…'}</strong>
            {!isCorrect && <span>La respuesta era <MathText text={question.options[question.answerIndex]} /></span>}
          </div>
          {!isCorrect && (mistake || question.explanation) && (
            <div className="feedback__more">
              {mistake && <p><strong>¿Qué pasó?</strong> <MathText text={mistake} /></p>}
              {question.explanation && <p><strong>Solución:</strong> <MathText text={question.explanation} /></p>}
            </div>
          )}
          <button
            className={`btn ${isCorrect ? 'btn--green' : 'btn--red'}`}
            onClick={() => {
              setSelected(null)
              setHintsShown(0)
              if (current + 1 === total) onFinish?.(score, total, xp)
              setCurrent((c) => c + 1)
            }}
          >
            {current + 1 < total ? 'Siguiente' : 'Ver resultado'}
          </button>
        </div>
      )}
    </section>
  )
}
