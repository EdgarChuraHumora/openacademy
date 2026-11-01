import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { games } from '../features/games/catalog'
import { useRecordGame } from '../lib/results'
import ClassifyPage from './ClassifyPage'
import DominoPage from './DominoPage'
import MatchPage from './MatchPage'
import OrderPage from './OrderPage'
import QuizPage from './QuizPage'
import RoulettePage from './RoulettePage'
import TrueFalsePage from './TrueFalsePage'

// Abre cada juego con la pantalla de su plantilla
export default function GamePage() {
  const { id } = useParams()
  const game = games.find((g) => g.id === id)
  const record = useRecordGame()

  if (!game) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" />
        <p>Juego no encontrado.</p>
        <Link to="/juegos" className="btn">Volver a juegos</Link>
      </section>
    )
  }

  const onFinish = (score: number, total: number, xp: number) => record(`juego:${game.id}`, score, total, xp)

  // key: al cambiar de juego, la pantalla empieza de cero
  switch (game.kind) {
    case 'quiz':
      return <QuizPage key={game.id} quiz={game} onFinish={onFinish} />
    case 'match':
      return <MatchPage key={game.id} game={game} onFinish={onFinish} />
    case 'order':
      return <OrderPage key={game.id} game={game} onFinish={onFinish} />
    case 'truefalse':
      return <TrueFalsePage key={game.id} game={game} onFinish={onFinish} />
    case 'classify':
      return <ClassifyPage key={game.id} game={game} onFinish={onFinish} />
    case 'domino':
      return <DominoPage key={game.id} game={game} onFinish={onFinish} />
    case 'roulette':
      return <RoulettePage key={game.id} game={game} onFinish={onFinish} />
  }
}
