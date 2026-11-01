import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { findCourse, findLesson } from '../features/academy/courses'
import { lessonKey, reviewKey, saveResult } from '../lib/progress'
import { useRecordGame } from '../lib/results'
import QuizPage from './QuizPage'

// Ejercicios de una clase o repaso de una unidad, con la misma pantalla del quiz
export default function AcademyPracticePage({ kind }: { kind: 'lesson' | 'review' }) {
  const { courseId, lessonId, unitId } = useParams()
  const course = findCourse(courseId)
  const record = useRecordGame()

  let target = null
  if (course && kind === 'lesson') {
    const found = findLesson(course, lessonId)
    if (found) {
      target = {
        key: lessonKey(course.id, found.lesson.id),
        title: found.lesson.title,
        questions: found.lesson.exercises,
        exitTo: `/academia/${course.id}/clase/${found.lesson.id}`,
        exitLabel: 'Volver a la clase',
      }
    }
  } else if (course) {
    const unit = course.units.find((u) => u.id === unitId)
    if (unit) {
      target = {
        key: reviewKey(course.id, unit.id),
        title: `Repaso: ${unit.title}`,
        questions: unit.review,
        exitTo: `/academia/${course.id}`,
        exitLabel: 'Volver al curso',
      }
    }
  }

  if (!course || !target) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" />
        <p>Práctica no encontrada.</p>
        <Link to="/academia" className="btn">Volver a la Academia</Link>
      </section>
    )
  }

  const { key, title, questions, exitTo, exitLabel } = target
  return (
    <QuizPage
      key={key}
      quiz={{ id: key, title, level: 'secundaria', icon: '📚', color: course.color, questions }}
      exitTo={exitTo}
      exitLabel={exitLabel}
      onFinish={(score, total, xp) => {
        saveResult(key, score, total)
        record(`academia:${key}`, score, total, xp)
      }}
    />
  )
}
