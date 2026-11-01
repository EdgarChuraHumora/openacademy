import type { QuizQuestion } from '../games/quiz/types'

// Bloques de teoría; el texto admite fórmulas entre signos $
export type TheoryBlock =
  | { type: 'p'; text: string }
  | { type: 'formula'; text: string }
  | { type: 'tip'; text: string }

// Ejemplo resuelto con el método de 4 etapas
export interface SolvedStep {
  stage: 'Comprender' | 'Planificar' | 'Resolver' | 'Comprobar'
  text: string
}

export interface Lesson {
  id: string
  title: string
  videoId?: string // id de un video de YouTube (no listado); si falta se muestra "próximamente"
  theory: TheoryBlock[]
  example: { problem: string; steps: SolvedStep[] }
  lab?: { to: string; label: string } // material del Laboratorio relacionado
  exercises: QuizQuestion[]
}

export interface Unit {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  review: QuizQuestion[] // práctica de repaso al final de la unidad
}

export interface Course {
  id: string
  title: string
  level: string
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  description: string
  units: Unit[]
}
