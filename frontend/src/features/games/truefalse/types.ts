export interface TrueFalseStatement {
  text: string
  answer: boolean
  why?: string // se muestra en el repaso final si el alumno falló
}

export interface TrueFalseGame {
  id: string
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  seconds: number // tiempo total para responder todas las que pueda
  statements: TrueFalseStatement[]
}
