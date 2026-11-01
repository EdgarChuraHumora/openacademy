import type { RouletteGame } from './types'

// Datos de prueba: más adelante vendrán de la base de datos (Supabase)
export const demoRoulettes: RouletteGame[] = [
  {
    id: 'ruleta-operaciones',
    title: 'Ruleta de operaciones',
    level: 'primaria',
    icon: '🎡',
    color: 'green',
    sectors: [
      { label: 'Suma', question: '$348 + 275$', options: ['613', '623', '523', '633'], answerIndex: 1, explanation: '$348 + 275 = 623$.' },
      { label: 'Resta', question: '$500 - 167$', options: ['343', '433', '333', '367'], answerIndex: 2, explanation: '$500 - 167 = 333$.' },
      {
        label: 'Multiplica',
        question: '$25 \\times 12$',
        options: ['250', '310', '240', '300'],
        answerIndex: 3,
        explanation: '$25 \\times 12 = 25 \\times 10 + 25 \\times 2 = 250 + 50 = 300$.',
      },
      { label: 'Divide', question: '$144 \\div 12$', options: ['12', '14', '11', '13'], answerIndex: 0, explanation: '$12 \\times 12 = 144$.' },
      {
        label: 'Fracción',
        question: '$\\dfrac{1}{3}$ de 27',
        options: ['3', '27', '9', '6'],
        answerIndex: 2,
        explanation: 'Un tercio es dividir entre 3: $27 \\div 3 = 9$.',
      },
      { label: 'Doble', question: 'El doble de 3,5', options: ['6,5', '7', '7,5', '3,7'], answerIndex: 1, explanation: '$3{,}5 + 3{,}5 = 7$.' },
    ],
  },
  {
    id: 'ruleta-secundaria',
    title: 'Ruleta de repaso',
    level: 'secundaria',
    icon: '🎡',
    color: 'blue',
    sectors: [
      {
        label: 'Potencia',
        question: '$(-3)^3$',
        options: ['$27$', '$-9$', '$-27$', '$9$'],
        answerIndex: 2,
        explanation: '$(-3)^3 = (-3)(-3)(-3) = -27$: exponente impar, el signo se mantiene.',
      },
      { label: 'Raíz', question: '$\\sqrt{144}$', options: ['14', '12', '72', '16'], answerIndex: 1, explanation: '$12 \\times 12 = 144$.' },
      {
        label: 'Ecuación',
        question: '$4x - 7 = 13$',
        options: ['$x = 5$', '$x = 1{,}5$', '$x = 6$', '$x = 20$'],
        answerIndex: 0,
        explanation: '$4x = 20 \\Rightarrow x = 5$.',
      },
      {
        label: 'Porcentaje',
        question: 'El 20 % de 150',
        options: ['15', '20', '30', '35'],
        answerIndex: 2,
        explanation: 'El 10 % de 150 es 15, así que el 20 % es 30.',
      },
      {
        label: 'Fracciones',
        question: '$\\dfrac{2}{3} + \\dfrac{1}{6}$',
        options: ['$\\dfrac{3}{9}$', '$\\dfrac{5}{6}$', '$\\dfrac{3}{6}$', '$\\dfrac{1}{2}$'],
        answerIndex: 1,
        explanation: '$\\frac{2}{3} = \\frac{4}{6}$, y $\\frac{4}{6} + \\frac{1}{6} = \\frac{5}{6}$.',
      },
      {
        label: 'Signos',
        question: '$-8 + 3 - (-5)$',
        options: ['$-10$', '$0$', '$6$', '$-6$'],
        answerIndex: 1,
        explanation: 'Restar un negativo es sumar: $-8 + 3 + 5 = 0$.',
      },
      {
        label: 'Notación',
        question: '$3{,}2 \\times 10^3$',
        options: ['320', '3200', '32 000', '0,0032'],
        answerIndex: 1,
        explanation: 'Multiplicar por $10^3$ corre la coma 3 lugares a la derecha: 3200.',
      },
      {
        label: 'IGV',
        question: 'Un producto cuesta S/ 100 sin IGV. Con IGV (18 %), ¿cuánto cuesta?',
        options: ['S/ 118', 'S/ 82', 'S/ 18', 'S/ 100,18'],
        answerIndex: 0,
        explanation: 'El IGV es el 18 % de 100, o sea S/ 18. Total: $100 + 18 = 118$.',
      },
    ],
  },
]
