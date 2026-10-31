export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
}

export interface Quiz {
  id: string
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  questions: QuizQuestion[]
}
