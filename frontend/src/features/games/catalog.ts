import { demoMatches } from './match/demoMatches'
import type { MatchGame } from './match/types'
import { demoOrders } from './order/demoOrders'
import type { OrderGame } from './order/types'
import { demoQuizzes } from './quiz/demoQuizzes'
import type { Quiz } from './quiz/types'

// Todos los juegos, de cualquier plantilla; "kind" dice cuál pantalla los abre
export type GameEntry =
  | ({ kind: 'quiz' } & Quiz)
  | ({ kind: 'match' } & MatchGame)
  | ({ kind: 'order' } & OrderGame)

export const games: GameEntry[] = [
  ...demoQuizzes.map((q) => ({ kind: 'quiz' as const, ...q })),
  ...demoMatches.map((m) => ({ kind: 'match' as const, ...m })),
  ...demoOrders.map((o) => ({ kind: 'order' as const, ...o })),
]

export const XP_PER_PAIR = 5
export const XP_PER_ORDER = 10 // si lo ordena bien al primer intento; si no, la mitad

export function gameSummary(game: GameEntry) {
  switch (game.kind) {
    case 'quiz':
      return `Quiz · ${game.questions.length} preguntas · +${game.questions.length * 10} XP`
    case 'match':
      return `Emparejar · ${game.pairs.length} parejas · +${game.pairs.length * XP_PER_PAIR} XP`
    case 'order':
      return `Ordenar · ${game.problems.length} problemas · +${game.problems.length * XP_PER_ORDER} XP`
  }
}
