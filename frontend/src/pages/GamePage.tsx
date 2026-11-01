import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { games } from '../features/games/catalog'
import ClassifyPage from './ClassifyPage'
import MatchPage from './MatchPage'
import OrderPage from './OrderPage'
import QuizPage from './QuizPage'
import TrueFalsePage from './TrueFalsePage'

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
  switch (game.kind) {
    case 'quiz':
      return <QuizPage key={game.id} quiz={game} />
    case 'match':
      return <MatchPage key={game.id} game={game} />
    case 'order':
      return <OrderPage key={game.id} game={game} />
    case 'truefalse':
      return <TrueFalsePage key={game.id} game={game} />
    case 'classify':
      return <ClassifyPage key={game.id} game={game} />
  }
}
