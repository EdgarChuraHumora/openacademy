export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
  hints?: string[] // de menos a más ayuda; se muestran una por una antes de responder
  explanation?: string // cómo se resuelve
  mistakes?: Partial<Record<number, string>> // por qué alguien elegiría esa opción incorrecta
}

export interface Quiz {
  id: string
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  questions: QuizQuestion[]
}
