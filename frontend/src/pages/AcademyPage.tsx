import { Link } from 'react-router-dom'
import { courses } from '../features/academy/courses'
import { lessonKey, useProgress } from '../lib/progress'

// Cursos que aún no tienen contenido
const upcoming = [
  { title: 'Aritmética', level: 'Secundaria', icon: '➗', color: 'yellow' },
  { title: 'Geometría', level: 'Secundaria', icon: '📐', color: 'pink' },
  { title: 'Trigonometría', level: 'Pre-universitario', icon: '📈', color: 'blue' },
]

export default function AcademyPage() {
  const progress = useProgress()

  return (
    <section className="stack">
      <div className="page-head">
        <h1>Academia</h1>
        <p className="muted">Cursos completos con videos, teoría y ejercicios resueltos.</p>
      </div>
      <div className="grid">
        {courses.map((course) => {
          const lessons = course.units.flatMap((u) => u.lessons)
          const done = lessons.filter((l) => progress[lessonKey(course.id, l.id)]).length
          return (
            <Link key={course.id} to={`/academia/${course.id}`} className="course-card course-card--open">
              <span className={`tile tile--${course.color}`}>{course.icon}</span>
              <div className="course-card__body">
                <span className="badge">{course.level}</span>
                <h3>{course.title}</h3>
                <p className="muted">
                  {course.units.length} {course.units.length === 1 ? 'unidad' : 'unidades'} · {done}/{lessons.length} clases
                </p>
                <div className="progress progress--thin">
                  <div className="progress__bar" style={{ width: `${(done / lessons.length) * 100}%` }} />
                </div>
              </div>
            </Link>
          )
        })}
        {upcoming.map((course) => (
          <div key={course.title} className="course-card">
            <span className={`tile tile--${course.color}`}>{course.icon}</span>
            <div className="course-card__body">
              <span className="badge">{course.level}</span>
              <h3>{course.title}</h3>
              <p className="muted">Próximamente</p>
            </div>
            <span className="lock" title="Próximamente">🔒</span>
          </div>
        ))}
      </div>
    </section>
  )
}
