import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import { findCourse, findLesson } from '../features/academy/courses'
import { lessonKey, useProgress } from '../lib/progress'

// key: al pasar a otra clase, el ejemplo resuelto vuelve a empezar desde el primer paso
export default function LessonPage() {
  const { lessonId } = useParams()
  return <LessonView key={lessonId} />
}

function LessonView() {
  const { courseId, lessonId } = useParams()
  const course = findCourse(courseId)
  const found = course ? findLesson(course, lessonId) : null
  const progress = useProgress()
  const [stepsShown, setStepsShown] = useState(1)

  if (!course || !found) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" />
        <p>Clase no encontrada.</p>
        <Link to="/academia" className="btn">Volver a la Academia</Link>
      </section>
    )
  }

  const { unit, lesson, prev, next } = found
  const base = `/academia/${course.id}`
  const result = progress[lessonKey(course.id, lesson.id)]
  const steps = lesson.example.steps

  return (
    <section className="stack narrow">
      <div className="lab-head">
        <Link to={base} className="quiz-close" aria-label="Volver al curso">✕</Link>
        <div>
          <span className="muted">{course.title} · {unit.title}</span>
          <h1><MathText text={lesson.title} /></h1>
        </div>
      </div>

      {lesson.videoId ? (
        <div className="video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}`}
            title={`Video: ${lesson.title}`}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="video video--soon">
          <span aria-hidden="true">🎬</span>
          <p>Video de la clase: próximamente</p>
        </div>
      )}

      <div className="card lesson-section">
        <h2>📖 Teoría</h2>
        {lesson.theory.map((block, i) =>
          block.type === 'formula' ? (
            <div key={i} className="theory-formula"><MathText text={block.text} /></div>
          ) : block.type === 'tip' ? (
            <p key={i} className="theory-tip"><span aria-hidden="true">💡</span> <MathText text={block.text} /></p>
          ) : (
            <p key={i}><MathText text={block.text} /></p>
          ),
        )}
      </div>

      <div className="card lesson-section">
        <h2>✍️ Ejemplo resuelto</h2>
        <p className="solved-problem"><MathText text={lesson.example.problem} /></p>
        <ol className="solved-steps">
          {steps.slice(0, stepsShown).map((step) => (
            <li key={step.stage} className={`solved-step solved-step--${step.stage.toLowerCase()}`}>
              <span className="solved-step__stage">{step.stage}</span>
              <span><MathText text={step.text} /></span>
            </li>
          ))}
        </ol>
        {stepsShown < steps.length ? (
          <button className="btn btn--ghost" onClick={() => setStepsShown(stepsShown + 1)}>
            Siguiente paso: {steps[stepsShown].stage}
          </button>
        ) : (
          <p className="muted center">¡Así se resuelve! Ahora te toca a ti.</p>
        )}
      </div>

      {lesson.lab && (
        <Link to={lesson.lab.to} className="lab-link">
          <span className="tile tile--pink">🧪</span>
          <span>
            <strong>Pruébalo en el Laboratorio</strong>
            <span className="muted"><MathText text={lesson.lab.label} /></span>
          </span>
        </Link>
      )}

      <div className="card lesson-section center">
        <h2>🎯 Practica</h2>
        <p className="muted">
          {lesson.exercises.length} ejercicios con pistas.{' '}
          {result ? `Tu mejor resultado: ${result.score}/${result.total}.` : 'Al terminarlos, la clase queda completada.'}
        </p>
        <Link to={`${base}/clase/${lesson.id}/practica`} className="btn btn--green">
          {result ? 'Practicar otra vez' : 'Empezar ejercicios'}
        </Link>
      </div>

      <div className="lesson-nav">
        {prev ? (
          <Link to={`${base}/clase/${prev.id}`} className="btn btn--ghost">← Anterior</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`${base}/clase/${next.id}`} className="btn btn--ghost">Siguiente →</Link>
        ) : (
          <Link to={`${base}/unidad/${unit.id}/repaso`} className="btn btn--ghost">Repaso →</Link>
        )}
      </div>
    </section>
  )
}
