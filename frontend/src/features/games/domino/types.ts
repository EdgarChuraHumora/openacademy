export interface DominoPair {
  question: string // por ejemplo "$6 \times 7$"
  answer: string // "42"; cada respuesta debe ser distinta
}

// Con las parejas en orden se arman las fichas en cadena circular:
// ficha k = [respuesta de la pareja k-1 | pregunta de la pareja k]
export interface DominoGame {
  id: string
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  pairs: DominoPair[]
}
