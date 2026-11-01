import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import MathText from '../components/MathText'
import { findCourse } from '../features/academy/courses'
import { lessonKey, reviewKey, useProgress } from '../lib/progress'

export default function CoursePage() {
  const { courseId } = useParams()
  const course = findCourse(courseId)
  const progress = useProgress()

  if (!course) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" />
        <p>Curso no encontrado.</p>
        <Link to="/academia" className="btn">Volver a la Academia</Link>
      </section>
    )
  }

  return (
    <section className="stack narrow">
      <div className="lab-head">
        <Link to="/academia" className="quiz-close" aria-label="Volver a la Academia">✕</Link>
        <div>
          <span className="badge">{course.level}</span>
          <h1>{course.title}</h1>
        </div>
      </div>
      <p className="muted">{course.description}</p>

      {course.units.map((unit, u) => {
        const done = unit.lessons.filter((l) => progress[lessonKey(course.id, l.id)]).length
        const review = progress[reviewKey(course.id, unit.id)]
        return (
          <div key={unit.id} className="unit-card">
            <div className="unit-card__head">
              <span className="muted">Unidad {u + 1}</span>
              <h2>{unit.title}</h2>
              <p className="muted">{unit.description}</p>
              <div className="progress progress--thin">
                <div className="progress__bar" style={{ width: `${(done / unit.lessons.length) * 100}%` }} />
              </div>
            </div>

            <ol className="lesson-list">
              {unit.lessons.map((lesson, i) => {
                const result = progress[lessonKey(course.id, lesson.id)]
                return (
                  <li key={lesson.id}>
                    <Link to={`/academia/${course.id}/clase/${lesson.id}`} className={`lesson-row ${result ? 'lesson-row--done' : ''}`}>
                      <span className="lesson-row__num">{result ? '✓' : i + 1}</span>
                      <span className="lesson-row__title"><MathText text={lesson.title} /></span>
                      {result && <span className="lesson-row__score">{result.score}/{result.total}</span>}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link
                  to={`/academia/${course.id}/unidad/${unit.id}/repaso`}
                  className={`lesson-row lesson-row--review ${review ? 'lesson-row--done' : ''}`}
                >
                  <span className="lesson-row__num">{review ? '✓' : '★'}</span>
                  <span className="lesson-row__title">
                    Repaso de la unidad
                    {done < unit.lessons.length && !review && <small className="muted"> · mejor al terminar las clases</small>}
                  </span>
                  {review && <span className="lesson-row__score">{review.score}/{review.total}</span>}
                </Link>
              </li>
            </ol>
          </div>
        )
      })}
    </section>
  )
}
