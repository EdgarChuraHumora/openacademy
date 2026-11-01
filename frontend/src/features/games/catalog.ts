import { demoMatches } from './match/demoMatches'
import type { MatchGame } from './match/types'
import { demoQuizzes } from './quiz/demoQuizzes'
import type { Quiz } from './quiz/types'

// Todos los juegos, de cualquier plantilla; "kind" dice cuál pantalla los abre
export type GameEntry = ({ kind: 'quiz' } & Quiz) | ({ kind: 'match' } & MatchGame)

export const games: GameEntry[] = [
  ...demoQuizzes.map((q) => ({ kind: 'quiz' as const, ...q })),
  ...demoMatches.map((m) => ({ kind: 'match' as const, ...m })),
]

export const XP_PER_PAIR = 5

export function gameSummary(game: GameEntry) {
  return game.kind === 'quiz'
    ? `Quiz · ${game.questions.length} preguntas · +${game.questions.length * 10} XP`
    : `Emparejar · ${game.pairs.length} parejas · +${game.pairs.length * XP_PER_PAIR} XP`
}
