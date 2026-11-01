export interface OrderProblem {
  prompt: string
  steps: string[] // en el orden correcto; el juego los muestra mezclados
}

export interface OrderGame {
  id: string
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  problems: OrderProblem[]
}
