import type { Quiz } from './types'

// Datos de prueba: más adelante vendrán de la base de datos (Supabase)
// Las fórmulas van entre signos $ y se escriben en LaTeX: $\frac{1}{2}$, $2^5$, $\sqrt{81}$
export const demoQuizzes: Quiz[] = [
  {
    id: 'tablas',
    title: 'Tablas de multiplicar',
    level: 'primaria',
    icon: '✖️',
    color: 'yellow',
    questions: [
      {
        question: '$7 \\times 8$',
        options: ['54', '56', '63', '48'],
        answerIndex: 1,
        hints: ['Piensa en $7 \\times 8$ como $7 \\times 4 \\times 2$.', '$7 \\times 4 = 28$. Ahora duplica 28.'],
        explanation: '$7 \\times 8 = 56$, porque $7 \\times 4 = 28$ y $28 + 28 = 56$.',
        mistakes: {
          0: '54 es $6 \\times 9$. Revisa la tabla del 7.',
          2: '63 es $7 \\times 9$: sumaste un 7 de más.',
          3: '48 es $6 \\times 8$: te faltó sumar un 8.',
        },
      },
      {
        question: '$9 \\times 6$',
        options: ['54', '45', '56', '63'],
        answerIndex: 0,
        hints: ['Truco del 9: $9 \\times 6$ es lo mismo que $10 \\times 6 - 6$.', '$60 - 6 = \\,?$'],
        explanation: '$9 \\times 6 = 60 - 6 = 54$.',
        mistakes: {
          1: '45 es $9 \\times 5$: te faltó un 9.',
          2: '56 es $7 \\times 8$. ¡Ojo con confundir tablas!',
          3: '63 es $9 \\times 7$: sumaste un 9 de más.',
        },
      },
      {
        question: '$12 \\times 4$',
        options: ['44', '46', '48', '52'],
        answerIndex: 2,
        hints: ['Separa el 12 en $10 + 2$.', '$10 \\times 4 = 40$ y $2 \\times 4 = 8$.'],
        explanation: '$12 \\times 4 = 10 \\times 4 + 2 \\times 4 = 40 + 8 = 48$.',
        mistakes: {
          0: '44 es $11 \\times 4$: te faltó un 4.',
          3: '52 es $13 \\times 4$: sumaste un 4 de más.',
        },
      },
      {
        question: '$6 \\times 7$',
        options: ['36', '48', '40', '42'],
        answerIndex: 3,
        hints: ['$6 \\times 7$ da lo mismo que $7 \\times 6$.', '$6 \\times 6 = 36$. Súmale un 6 más.'],
        explanation: '$6 \\times 7 = 36 + 6 = 42$.',
        mistakes: {
          0: '36 es $6 \\times 6$: te faltó un 6.',
          1: '48 es $6 \\times 8$: sumaste un 6 de más.',
        },
      },
    ],
  },
  {
    id: 'fracciones',
    title: 'Fracciones básicas',
    level: 'primaria',
    icon: '🍕',
    color: 'pink',
    questions: [
      {
        question: '$\\dfrac{1}{2} + \\dfrac{1}{2}$',
        options: ['$1$', '$\\dfrac{2}{4}$', '$\\dfrac{1}{4}$', '$2$'],
        answerIndex: 0,
        hints: [
          'Dos mitades de una pizza, ¿cuánto forman?',
          'Con el mismo denominador, suma solo los numeradores: $1 + 1 = 2$, o sea $\\frac{2}{2}$.',
        ],
        explanation: '$\\frac{1}{2} + \\frac{1}{2} = \\frac{2}{2} = 1$ entero.',
        mistakes: {
          1: 'Sumaste también los denominadores ($2 + 2$). Cuando son iguales, el denominador se mantiene.',
          2: '$\\frac{1}{4}$ es la mitad de $\\frac{1}{2}$, no la suma.',
          3: '2 serían dos pizzas enteras; aquí son dos mitades.',
        },
      },
      {
        question: 'La mitad de $\\dfrac{3}{4}$',
        options: ['$\\dfrac{3}{2}$', '$\\dfrac{3}{8}$', '$\\dfrac{1}{4}$', '$\\dfrac{6}{4}$'],
        answerIndex: 1,
        hints: [
          'Sacar la mitad es multiplicar por $\\frac{1}{2}$.',
          '$\\frac{3}{4} \\times \\frac{1}{2}$: multiplica numerador con numerador y denominador con denominador.',
        ],
        explanation: '$\\frac{3}{4} \\times \\frac{1}{2} = \\frac{3}{8}$. Cada cuarto se parte en dos octavos, y nos quedamos con la mitad.',
        mistakes: {
          0: '$\\frac{3}{2}$ es el doble de $\\frac{3}{4}$. La mitad hace las partes más pequeñas, no más grandes.',
          2: '$\\frac{1}{4}$ es lo que le falta a $\\frac{3}{4}$ para ser un entero, no su mitad.',
          3: '$\\frac{6}{4}$ es el doble de $\\frac{3}{4}$: multiplicaste el numerador por 2.',
        },
      },
      {
        question: '$\\dfrac{2}{5} + \\dfrac{1}{5}$',
        options: ['$\\dfrac{3}{10}$', '$\\dfrac{2}{5}$', '$\\dfrac{3}{5}$', '$\\dfrac{1}{5}$'],
        answerIndex: 2,
        hints: ['Los dos denominadores son iguales.', 'Suma solo los numeradores: $2 + 1$.'],
        explanation: '$\\frac{2}{5} + \\frac{1}{5} = \\frac{3}{5}$. El denominador dice el tamaño de las partes y no cambia.',
        mistakes: {
          0: 'Sumaste los denominadores ($5 + 5$). Cuando son iguales, el 5 se mantiene.',
          1: '$\\frac{2}{5}$ es solo el primer sumando; falta agregar $\\frac{1}{5}$.',
          3: '$\\frac{1}{5}$ es solo el segundo sumando; falta agregar $\\frac{2}{5}$.',
        },
      },
      {
        question: '¿Cuál es mayor?',
        options: ['$\\dfrac{1}{3}$', '$\\dfrac{1}{4}$', '$\\dfrac{1}{5}$', '$\\dfrac{1}{2}$'],
        answerIndex: 3,
        hints: [
          'Todas tienen numerador 1. Fíjate en cuántas partes se divide el entero.',
          'Mientras menos partes, más grande es cada parte.',
        ],
        explanation: '$\\frac{1}{2}$ es la mayor: el entero se divide en solo 2 partes. Compruébalo con las tiras de fracciones del Laboratorio.',
        mistakes: {
          0: '$\\frac{1}{3}$ es menor que $\\frac{1}{2}$: dividir en 3 partes da partes más pequeñas que dividir en 2.',
          2: '$\\frac{1}{5}$ tiene el denominador mayor, pero eso hace las partes más pequeñas.',
        },
      },
    ],
  },
  {
    id: 'ecuaciones',
    title: 'Ecuaciones de primer grado',
    level: 'secundaria',
    icon: '🧮',
    color: 'green',
    questions: [
      {
        question: '$2x + 3 = 11$',
        options: ['$x = 3$', '$x = 4$', '$x = 5$', '$x = 7$'],
        answerIndex: 1,
        hints: ['Primero quita el 3 de ambos lados.', 'Te queda $2x = 8$. ¿Qué número por 2 da 8?'],
        explanation: '$2x + 3 = 11 \\Rightarrow 2x = 8 \\Rightarrow x = 4$. Comprueba: $2 \\cdot 4 + 3 = 11$.',
        mistakes: {
          0: 'Comprueba: $2 \\cdot 3 + 3 = 9$, no 11.',
          2: 'Comprueba: $2 \\cdot 5 + 3 = 13$, no 11.',
          3: 'Sumaste el 3 en lugar de restarlo: $(11 + 3) \\div 2 = 7$. Hay que quitarlo: $11 - 3$.',
        },
      },
      {
        question: '$5x - 10 = 0$',
        options: ['$x = 2$', '$x = -2$', '$x = 5$', '$x = 10$'],
        answerIndex: 0,
        hints: ['Suma 10 en ambos lados.', 'Te queda $5x = 10$. Divide entre 5.'],
        explanation: '$5x - 10 = 0 \\Rightarrow 5x = 10 \\Rightarrow x = 2$.',
        mistakes: {
          1: 'Al sumar 10 en ambos lados queda $5x = +10$, así que $x$ es positivo.',
          2: 'Comprueba: $5 \\cdot 5 - 10 = 15$, no 0.',
          3: '$5x = 10$ no significa $x = 10$: falta dividir entre 5.',
        },
      },
      {
        question: '$\\dfrac{x}{3} = 6$',
        options: ['$x = 2$', '$x = 9$', '$x = 18$', '$x = 3$'],
        answerIndex: 2,
        hints: ['Lo contrario de dividir entre 3 es multiplicar por 3.', 'Multiplica ambos lados por 3.'],
        explanation: '$\\frac{x}{3} = 6 \\Rightarrow x = 6 \\cdot 3 = 18$. Comprueba: $18 \\div 3 = 6$.',
        mistakes: {
          0: 'Dividiste 6 entre 3, pero para deshacer una división hay que multiplicar.',
          1: 'Sumaste $6 + 3$; la operación contraria de dividir es multiplicar.',
          3: 'Comprueba: $3 \\div 3 = 1$, no 6.',
        },
      },
      {
        question: '$3(x - 1) = 12$',
        options: ['$x = 3$', '$x = 4$', '$x = 13$', '$x = 5$'],
        answerIndex: 3,
        hints: ['Primero divide ambos lados entre 3.', 'Te queda $x - 1 = 4$. ¿Cuánto vale $x$?'],
        explanation: '$3(x - 1) = 12 \\Rightarrow x - 1 = 4 \\Rightarrow x = 5$. Comprueba: $3 \\cdot (5 - 1) = 12$.',
        mistakes: {
          0: 'Comprueba: $3 \\cdot (3 - 1) = 6$, no 12.',
          1: '4 es el valor de $x - 1$. Te faltó sumar 1.',
          2: 'Olvidaste el 3 que multiplica al paréntesis: primero divide 12 entre 3.',
        },
      },
    ],
  },
  {
    id: 'potencias',
    title: 'Potencias y raíces',
    level: 'secundaria',
    icon: '⚡',
    color: 'blue',
    questions: [
      {
        question: '$2^5$',
        options: ['10', '25', '32', '64'],
        answerIndex: 2,
        hints: [
          '$2^5$ significa multiplicar el 2 cinco veces: $2 \\times 2 \\times 2 \\times 2 \\times 2$.',
          'Ve duplicando: 2, 4, 8, 16…',
        ],
        explanation: '$2^5 = 2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2 = 32$.',
        mistakes: {
          0: '10 es $2 \\times 5$. Una potencia no es multiplicar la base por el exponente.',
          1: '25 es $5^2$. Cuidado con cambiar la base por el exponente.',
          3: '64 es $2^6$: multiplicaste una vez de más.',
        },
      },
      {
        question: '$\\sqrt{81}$',
        options: ['9', '8', '18', '40,5'],
        answerIndex: 0,
        hints: [
          'Busca un número que multiplicado por sí mismo dé 81.',
          '$8 \\times 8 = 64$ y $10 \\times 10 = 100$. Está entre los dos.',
        ],
        explanation: '$\\sqrt{81} = 9$, porque $9 \\times 9 = 81$.',
        mistakes: {
          1: '$8 \\times 8 = 64$, no 81.',
          2: '18 es $9 \\times 2$. La raíz es el número que se multiplica por sí mismo.',
          3: '40,5 es $81 \\div 2$. La raíz cuadrada no es la mitad.',
        },
      },
      {
        question: '$3^2 \\times 3^3$',
        options: ['$3^6$', '$3^5$', '$9^5$', '$6^5$'],
        answerIndex: 1,
        hints: ['Las dos potencias tienen la misma base: 3.', 'Con la misma base, los exponentes se suman: $2 + 3$.'],
        explanation: '$3^2 \\times 3^3 = (3 \\cdot 3) \\cdot (3 \\cdot 3 \\cdot 3) = 3^5$.',
        mistakes: {
          0: 'Multiplicaste los exponentes ($2 \\times 3$). Con la misma base se suman.',
          2: 'Multiplicaste las bases ($3 \\times 3 = 9$). La base se mantiene.',
          3: 'Sumaste las bases ($3 + 3 = 6$). La base se mantiene.',
        },
      },
      {
        question: '$(-2)^3$',
        options: ['$6$', '$-6$', '$8$', '$-8$'],
        answerIndex: 3,
        hints: ['$(-2)^3 = (-2) \\cdot (-2) \\cdot (-2)$.', 'Base negativa con exponente impar: el resultado es negativo.'],
        explanation: '$(-2)^3 = (-2) \\cdot (-2) \\cdot (-2) = 4 \\cdot (-2) = -8$.',
        mistakes: {
          0: '6 es $2 \\times 3$. Una potencia no es multiplicar la base por el exponente.',
          1: '$-6$ es $(-2) \\times 3$. Hay que multiplicar la base por sí misma 3 veces.',
          2: 'El valor es 8, pero con exponente impar el signo negativo se mantiene.',
        },
      },
    ],
  },
]
