import type { DominoGame } from './types'

// Datos de prueba: más adelante vendrán de la base de datos (Supabase)
export const demoDominoes: DominoGame[] = [
  {
    id: 'domino-tablas',
    title: 'Dominó de multiplicaciones',
    level: 'primaria',
    icon: '🧩',
    color: 'yellow',
    pairs: [
      { question: '$6 \\times 7$', answer: '42' },
      { question: '$8 \\times 4$', answer: '32' },
      { question: '$9 \\times 9$', answer: '81' },
      { question: '$7 \\times 7$', answer: '49' },
      { question: '$12 \\times 5$', answer: '60' },
      { question: '$3 \\times 8$', answer: '24' },
      { question: '$5 \\times 9$', answer: '45' },
    ],
  },
  {
    id: 'domino-mitad-doble',
    title: 'Dominó: mitad, doble y partes',
    level: 'primaria',
    icon: '🧩',
    color: 'pink',
    pairs: [
      { question: 'La mitad de 18', answer: '9' },
      { question: 'El doble de 7', answer: '14' },
      { question: 'Un tercio de 12', answer: '4' },
      { question: 'La cuarta parte de 20', answer: '5' },
      { question: 'El triple de 6', answer: '18' },
      { question: '$\\dfrac{3}{4}$ de 8', answer: '6' },
    ],
  },
  {
    id: 'domino-potencias',
    title: 'Dominó de potencias de 2',
    level: 'secundaria',
    icon: '🧩',
    color: 'blue',
    pairs: [
      { question: '$2^3 \\cdot 2^2$', answer: '$2^5$' },
      { question: '$(2^2)^3$', answer: '$2^6$' },
      { question: '$\\dfrac{2^7}{2^3}$', answer: '$2^4$' },
      { question: '$2^0$', answer: '$1$' },
      { question: '$2^{-1}$', answer: '$\\dfrac{1}{2}$' },
      { question: '$2^2 \\cdot 2^5$', answer: '$2^7$' },
    ],
  },
]
