export interface MatchPair {
  left: string // por ejemplo una expresión: "$2^3$"
  right: string // su pareja: "$8$"
}

export interface MatchGame {
  id: string
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  pairs: MatchPair[] // cada derecha debe corresponder a una sola izquierda
}
