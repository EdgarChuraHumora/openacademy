import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { demoQuizzes } from '../features/games/quiz/demoQuizzes'

const letters = ['A', 'B', 'C', 'D']

export default function QuizPage() {
  const { id } = useParams()
  const quiz = demoQuizzes.find((q) => q.id === id)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  if (!quiz) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" />
        <p>Juego no encontrado.</p>
        <Link to="/juegos" className="btn">Volver a juegos</Link>
      </section>
    )
  }

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
          <div><strong>+{score * 10}</strong><span>XP</span></div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setCurrent(0)
            setScore(0)
            setSelected(null)
          }}
        >
          Jugar otra vez
        </button>
        <Link to="/juegos" className="btn btn--ghost">Volver a juegos</Link>
      </section>
    )
  }

  const question = quiz.questions[current]
  const answered = selected !== null
  const isCorrect = selected === question.answerIndex

  function choose(index: number) {
    if (answered) return
    setSelected(index)
    if (index === question.answerIndex) setScore((s) => s + 1)
  }

  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to="/juegos" className="quiz-close" aria-label="Salir del juego">✕</Link>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(current / total) * 100}%` }} />
        </div>
        <span className="quiz-count">{current + 1}/{total}</span>
      </div>

      <p className="muted">{quiz.title}</p>
      <div className="question">{question.question}</div>

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
              {option}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`feedback ${isCorrect ? 'feedback--ok' : 'feedback--bad'}`}>
          <Mascot size={64} mood={isCorrect ? 'celebrate' : 'sad'} />
          <div className="feedback__text">
            <strong>{isCorrect ? '¡Correcto! +10 XP' : 'Casi…'}</strong>
            {!isCorrect && <span>La respuesta era {question.options[question.answerIndex]}</span>}
          </div>
          <button
            className={`btn ${isCorrect ? 'btn--green' : 'btn--red'}`}
            onClick={() => {
              setSelected(null)
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
