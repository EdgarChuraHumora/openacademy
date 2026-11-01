import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { games } from '../features/games/catalog'
import MatchPage from './MatchPage'
import QuizPage from './QuizPage'

// Abre cada juego con la pantalla de su plantilla
export default function GamePage() {
  const { id } = useParams()
  const game = games.find((g) => g.id === id)

  if (!game) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" />
        <p>Juego no encontrado.</p>
        <Link to="/juegos" className="btn">Volver a juegos</Link>
      </section>
    )
  }

  // key: al cambiar de juego, la pantalla empieza de cero
  return game.kind === 'quiz' ? <QuizPage key={game.id} quiz={game} /> : <MatchPage key={game.id} game={game} />
}
