import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'

export default function HomePage() {
  return (
    <section className="stack">
      <div className="hero">
        <div className="hero__text">
          <span className="hero__eyebrow">Reto del día</span>
          <h1>¡Hola, explorador!</h1>
          <p>Resuelve 4 ecuaciones y gana tus primeros 40 XP.</p>
          <Link to="/juegos/ecuaciones" className="btn btn--yellow">¡Jugar ahora!</Link>
        </div>
        <div className="hero__mascot">
          <Mascot size={150} mood="celebrate" />
        </div>
      </div>

      <h2 className="section-title">Explora</h2>
      <div className="grid grid--3">
        <Link to="/juegos" className="module-card">
          <span className="tile tile--yellow">🎮</span>
          <div>
            <h3>Juegos</h3>
            <p>Quiz, ruletas y retos para primaria y secundaria.</p>
          </div>
        </Link>
        <Link to="/academia" className="module-card">
          <span className="tile tile--green">📚</span>
          <div>
            <h3>Academia</h3>
            <p>Cursos por unidades con videos y ejercicios.</p>
          </div>
        </Link>
        <div className="module-card module-card--epic">
          <span className="tile tile--gold">⚔️</span>
          <div>
            <h3>Aventura <span className="badge badge--gold">Pronto</span></h3>
            <p>Consigue héroes y mejóralos resolviendo ejercicios.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
