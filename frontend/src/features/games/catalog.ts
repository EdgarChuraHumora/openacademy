import { demoClassify } from './classify/demoClassify'
import type { ClassifyGame } from './classify/types'
import { demoDominoes } from './domino/demoDominoes'
import type { DominoGame } from './domino/types'
import { demoMatches } from './match/demoMatches'
import type { MatchGame } from './match/types'
import { demoOrders } from './order/demoOrders'
import type { OrderGame } from './order/types'
import { demoQuizzes } from './quiz/demoQuizzes'
import type { Quiz } from './quiz/types'
import { demoTrueFalse } from './truefalse/demoTrueFalse'
import type { TrueFalseGame } from './truefalse/types'

// Todos los juegos, de cualquier plantilla; "kind" dice cuál pantalla los abre
export type GameEntry =
  | ({ kind: 'quiz' } & Quiz)
  | ({ kind: 'match' } & MatchGame)
  | ({ kind: 'order' } & OrderGame)
  | ({ kind: 'truefalse' } & TrueFalseGame)
  | ({ kind: 'classify' } & ClassifyGame)
  | ({ kind: 'domino' } & DominoGame)

export const games: GameEntry[] = [
  ...demoQuizzes.map((q) => ({ kind: 'quiz' as const, ...q })),
  ...demoMatches.map((m) => ({ kind: 'match' as const, ...m })),
  ...demoOrders.map((o) => ({ kind: 'order' as const, ...o })),
  ...demoTrueFalse.map((t) => ({ kind: 'truefalse' as const, ...t })),
  ...demoClassify.map((c) => ({ kind: 'classify' as const, ...c })),
  ...demoDominoes.map((d) => ({ kind: 'domino' as const, ...d })),
]

export const XP_PER_PAIR = 5
export const XP_PER_ORDER = 10 // si lo ordena bien al primer intento; si no, la mitad
export const XP_PER_TRUE_FALSE = 3
export const XP_PER_CLASSIFY = 2 // por tarjeta bien ubicada a la primera; si no, 1
export const XP_PER_DOMINO = 3 // por ficha colocada

export function gameSummary(game: GameEntry) {
  switch (game.kind) {
    case 'quiz':
      return `Quiz · ${game.questions.length} preguntas · +${game.questions.length * 10} XP`
    case 'match':
      return `Emparejar · ${game.pairs.length} parejas · +${game.pairs.length * XP_PER_PAIR} XP`
    case 'order':
      return `Ordenar · ${game.problems.length} problemas · +${game.problems.length * XP_PER_ORDER} XP`
    case 'truefalse':
      return `V o F · ${game.statements.length} afirmaciones en ${game.seconds} s · hasta +${game.statements.length * XP_PER_TRUE_FALSE} XP`
    case 'classify':
      return `Clasificar · ${game.items.length} tarjetas · +${game.items.length * XP_PER_CLASSIFY} XP`
    case 'domino':
      return `Dominó · ${game.pairs.length} fichas · +${(game.pairs.length - 1) * XP_PER_DOMINO} XP`
  }
}
