const courses = [
  { title: 'Aritmética', level: 'Secundaria', icon: '➗', color: 'yellow', units: 8 },
  { title: 'Álgebra', level: 'Secundaria', icon: '𝑥', color: 'green', units: 10 },
  { title: 'Geometría', level: 'Secundaria', icon: '📐', color: 'pink', units: 9 },
  { title: 'Trigonometría', level: 'Pre-universitario', icon: '📈', color: 'blue', units: 7 },
]

export default function AcademyPage() {
  return (
    <section className="stack">
      <div className="page-head">
        <h1>Academia</h1>
        <p className="muted">Cursos completos con videos, teoría y ejercicios resueltos.</p>
      </div>
      <div className="grid">
        {courses.map((course) => (
          <div key={course.title} className="course-card">
            <span className={`tile tile--${course.color}`}>{course.icon}</span>
            <div className="course-card__body">
              <span className="badge">{course.level}</span>
              <h3>{course.title}</h3>
              <p className="muted">{course.units} unidades</p>
              <div className="progress progress--thin"><div className="progress__bar" style={{ width: '0%' }} /></div>
            </div>
            <span className="lock" title="Próximamente">🔒</span>
          </div>
        ))}
      </div>
    </section>
  )
}
