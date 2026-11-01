export interface RouletteSector {
  label: string // texto corto que se ve en la ruleta
  question: string
  options: string[]
  answerIndex: number
  explanation?: string
}

export interface RouletteGame {
  id: string
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  sectors: RouletteSector[] // entre 4 y 8 se ven bien
}
