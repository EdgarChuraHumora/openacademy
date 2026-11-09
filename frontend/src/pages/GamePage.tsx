import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { games } from '../features/games/catalog'
import { useRecordGame } from '../lib/results'
import { fetchGame, type UserGame } from '../lib/userGames'
import ClassifyPage from './ClassifyPage'
import DominoPage from './DominoPage'
import MatchPage from './MatchPage'
import OrderPage from './OrderPage'
import QuizPage from './QuizPage'
import RoulettePage from './RoulettePage'
import TrueFalsePage from './TrueFalsePage'

// Abre cada juego con la pantalla de su plantilla.
// Primero busca entre los juegos de OpenAcademy y, si no está, entre los creados por docentes
// (por su id o por su código de 6 letras).
export default function GamePage() {
  const { id = '' } = useParams()
  const builtIn = games.find((g) => g.id === id)
  const [found, setFound] = useState<{ id: string; game: UserGame | null } | null>(null)
  const record = useRecordGame()

  useEffect(() => {
    if (builtIn) return
    let active = true
    fetchGame(id).then((game) => active && setFound({ id, game }))
    return () => {
      active = false
    }
  }, [id, builtIn])

  const game: UserGame | null | undefined = builtIn ?? (found?.id === id ? found.game : undefined)

  if (game === undefined) return <p className="muted center">Cargando juego…</p>

  if (!game) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" />
        <p>Juego no encontrado. Revisa que el código esté bien escrito.</p>
        <Link to="/juegos" className="btn">Volver a juegos</Link>
      </section>
    )
  }

  const onFinish = (score: number, total: number, xp: number) => record(`juego:${game.id}`, score, total, xp)

  return (
    <>
      {game.status === 'draft' && <p className="draft-banner">Borrador: solo tú puedes verlo. Publícalo desde el panel docente.</p>}
      {/* key: al cambiar de juego, la pantalla empieza de cero */}
      {game.kind === 'quiz' && <QuizPage key={game.id} quiz={game} onFinish={onFinish} />}
      {game.kind === 'match' && <MatchPage key={game.id} game={game} onFinish={onFinish} />}
      {game.kind === 'order' && <OrderPage key={game.id} game={game} onFinish={onFinish} />}
      {game.kind === 'truefalse' && <TrueFalsePage key={game.id} game={game} onFinish={onFinish} />}
      {game.kind === 'classify' && <ClassifyPage key={game.id} game={game} onFinish={onFinish} />}
      {game.kind === 'domino' && <DominoPage key={game.id} game={game} onFinish={onFinish} />}
      {game.kind === 'roulette' && <RoulettePage key={game.id} game={game} onFinish={onFinish} />}
    </>
  )
}
