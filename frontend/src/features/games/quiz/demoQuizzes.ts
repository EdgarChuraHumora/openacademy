import type { Quiz } from './types'

// Datos de prueba: más adelante vendrán de la base de datos (Supabase)
export const demoQuizzes: Quiz[] = [
  {
    id: 'tablas',
    title: 'Tablas de multiplicar',
    level: 'primaria',
    icon: '✖️',
    color: 'yellow',
    questions: [
      { question: '7 × 8', options: ['54', '56', '63', '48'], answerIndex: 1 },
      { question: '9 × 6', options: ['54', '45', '56', '63'], answerIndex: 0 },
      { question: '12 × 4', options: ['44', '46', '48', '52'], answerIndex: 2 },
      { question: '6 × 7', options: ['36', '48', '40', '42'], answerIndex: 3 },
    ],
  },
  {
    id: 'fracciones',
    title: 'Fracciones básicas',
    level: 'primaria',
    icon: '🍕',
    color: 'pink',
    questions: [
      { question: '1/2 + 1/2', options: ['1', '2/4', '1/4', '2'], answerIndex: 0 },
      { question: 'La mitad de 3/4', options: ['3/2', '3/8', '1/4', '6/4'], answerIndex: 1 },
      { question: '2/5 + 1/5', options: ['3/10', '2/5', '3/5', '1/5'], answerIndex: 2 },
      { question: '¿Cuál es mayor?', options: ['1/3', '1/4', '1/5', '1/2'], answerIndex: 3 },
    ],
  },
  {
    id: 'ecuaciones',
    title: 'Ecuaciones de primer grado',
    level: 'secundaria',
    icon: '🧮',
    color: 'green',
    questions: [
      { question: '2x + 3 = 11', options: ['x = 3', 'x = 4', 'x = 5', 'x = 7'], answerIndex: 1 },
      { question: '5x − 10 = 0', options: ['x = 2', 'x = −2', 'x = 5', 'x = 10'], answerIndex: 0 },
      { question: 'x / 3 = 6', options: ['x = 2', 'x = 9', 'x = 18', 'x = 3'], answerIndex: 2 },
      { question: '3(x − 1) = 12', options: ['x = 3', 'x = 4', 'x = 13', 'x = 5'], answerIndex: 3 },
    ],
  },
  {
    id: 'potencias',
    title: 'Potencias y raíces',
    level: 'secundaria',
    icon: '⚡',
    color: 'blue',
    questions: [
      { question: '2⁵', options: ['10', '25', '32', '64'], answerIndex: 2 },
      { question: '√81', options: ['9', '8', '18', '40.5'], answerIndex: 0 },
      { question: '3² × 3³', options: ['3⁶', '3⁵', '9⁵', '6⁵'], answerIndex: 1 },
      { question: '(−2)³', options: ['6', '−6', '8', '−8'], answerIndex: 3 },
    ],
  },
]
