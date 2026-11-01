import type { Course } from './types'

// Contenido de prueba: más adelante vendrá de la base de datos (Supabase)
export const courses: Course[] = [
  {
    id: 'algebra',
    title: 'Álgebra',
    level: '1.º de secundaria',
    icon: '𝑥',
    color: 'green',
    description: 'Aprende a resolver ecuaciones paso a paso, con la balanza como aliada.',
    units: [
      {
        id: 'ecuaciones-primer-grado',
        title: 'Ecuaciones de primer grado',
        description: 'Desde la idea de igualdad hasta ecuaciones con paréntesis.',
        lessons: [
          {
            id: 'que-es-una-ecuacion',
            title: '¿Qué es una ecuación?',
            theory: [
              { type: 'p', text: 'Una ecuación es una igualdad con un valor desconocido, la incógnita, que casi siempre llamamos $x$.' },
              { type: 'p', text: 'Es como una balanza en equilibrio: lo que hay a la izquierda pesa lo mismo que lo que hay a la derecha.' },
              { type: 'formula', text: '$x + 3 = 7$' },
              { type: 'p', text: 'Resolver la ecuación es encontrar el valor de $x$ que hace verdadera la igualdad. Aquí $x = 4$, porque $4 + 3 = 7$.' },
              { type: 'tip', text: 'Regla de oro: lo que hagas en un lado, hazlo también en el otro, y la balanza seguirá en equilibrio.' },
            ],
            example: {
              problem: 'Halla $x$ en $x + 5 = 12$.',
              steps: [
                { stage: 'Comprender', text: 'Busco un número que, sumado con 5, dé 12.' },
                { stage: 'Planificar', text: 'Quito 5 en ambos lados para dejar sola a la $x$.' },
                { stage: 'Resolver', text: '$x + 5 - 5 = 12 - 5 \\;\\Rightarrow\\; x = 7$' },
                { stage: 'Comprobar', text: '$7 + 5 = 12$ ✓' },
              ],
            },
            lab: { to: '/laboratorio/balanza', label: 'Resuelve ecuaciones quitando pesas en la balanza' },
            exercises: [
              {
                question: '¿Cuál de estas es una ecuación?',
                options: ['$3 + 4 = 7$', '$x - 2 = 9$', '$5 \\times 2$', '$x + 1$'],
                answerIndex: 1,
                hints: ['Una ecuación necesita un signo $=$.', 'Además, debe tener una incógnita.'],
                explanation: '$x - 2 = 9$ tiene una igualdad y una incógnita.',
                mistakes: {
                  0: 'Es una igualdad, pero no tiene incógnita.',
                  2: 'Es una operación: no tiene signo $=$.',
                  3: 'Es una expresión: le falta el signo $=$.',
                },
              },
              {
                question: '$x + 6 = 10$',
                options: ['$x = 4$', '$x = 16$', '$x = 6$', '$x = 10$'],
                answerIndex: 0,
                hints: ['Quita 6 en ambos lados.'],
                explanation: '$x = 10 - 6 = 4$. Comprueba: $4 + 6 = 10$.',
                mistakes: { 1: 'Sumaste $10 + 6$; hay que quitar el 6.', 2: 'Comprueba: $6 + 6 = 12$, no 10.' },
              },
              {
                question: '$x - 4 = 9$',
                options: ['$x = 5$', '$x = 13$', '$x = -5$', '$x = 36$'],
                answerIndex: 1,
                hints: ['Lo contrario de restar 4 es sumar 4.', 'Suma 4 en ambos lados.'],
                explanation: '$x = 9 + 4 = 13$. Comprueba: $13 - 4 = 9$.',
                mistakes: { 0: 'Restaste $9 - 4$; hay que sumar 4 en ambos lados.', 3: 'Multiplicaste $9 \\times 4$; la operación contraria de restar es sumar.' },
              },
            ],
          },
          {
            id: 'ecuaciones-ax-b',
            title: 'Ecuaciones del tipo $ax + b = c$',
            theory: [
              { type: 'p', text: 'En $3x + 2 = 14$, el 3 multiplica a la $x$ y el 2 se le suma.' },
              { type: 'p', text: 'Para despejar $x$ deshacemos las operaciones en orden inverso: primero la suma o la resta, y al final la multiplicación.' },
              { type: 'formula', text: '$3x + 2 = 14 \\;\\Rightarrow\\; 3x = 12 \\;\\Rightarrow\\; x = 4$' },
              { type: 'tip', text: 'Primero quita lo que suma o resta; después divide entre el número que multiplica a la $x$.' },
            ],
            example: {
              problem: 'Resuelve $5x - 3 = 22$.',
              steps: [
                { stage: 'Comprender', text: 'Cinco veces un número, menos 3, da 22.' },
                { stage: 'Planificar', text: 'Sumo 3 en ambos lados y luego divido entre 5.' },
                { stage: 'Resolver', text: '$5x = 25 \\;\\Rightarrow\\; x = \\dfrac{25}{5} = 5$' },
                { stage: 'Comprobar', text: '$5 \\cdot 5 - 3 = 22$ ✓' },
              ],
            },
            lab: { to: '/laboratorio/balanza', label: 'Practica en la balanza con $2x + 3 = 11$' },
            exercises: [
              {
                question: '$2x + 5 = 17$',
                options: ['$x = 6$', '$x = 11$', '$x = 7$', '$x = 12$'],
                answerIndex: 0,
                hints: ['Quita 5 en ambos lados.', 'Te queda $2x = 12$. Divide entre 2.'],
                explanation: '$2x = 12 \\Rightarrow x = 6$. Comprueba: $2 \\cdot 6 + 5 = 17$.',
                mistakes: {
                  1: '$11$ sale de $(17 + 5) \\div 2$: sumaste el 5 en lugar de restarlo.',
                  2: 'Comprueba: $2 \\cdot 7 + 5 = 19$, no 17.',
                  3: '$2x = 12$ no es $x = 12$: falta dividir entre 2.',
                },
              },
              {
                question: '$4x - 1 = 19$',
                options: ['$x = 4{,}5$', '$x = 5$', '$x = 20$', '$x = 18$'],
                answerIndex: 1,
                hints: ['Suma 1 en ambos lados.', 'Te queda $4x = 20$.'],
                explanation: '$4x = 20 \\Rightarrow x = 5$. Comprueba: $4 \\cdot 5 - 1 = 19$.',
                mistakes: { 0: 'Restaste el 1 en lugar de sumarlo: $(19 - 1) \\div 4 = 4{,}5$.', 2: '$4x = 20$ no es $x = 20$: falta dividir entre 4.' },
              },
              {
                question: 'Juan compra 3 cuadernos iguales y un lápiz de S/ 2. Paga S/ 17 en total. ¿Cuánto cuesta cada cuaderno?',
                options: ['S/ 5', 'S/ 6,33', 'S/ 15', 'S/ 3'],
                answerIndex: 0,
                hints: ['Si cada cuaderno cuesta $x$, la ecuación es $3x + 2 = 17$.'],
                explanation: '$3x + 2 = 17 \\Rightarrow 3x = 15 \\Rightarrow x = 5$. Cada cuaderno cuesta S/ 5.',
                mistakes: { 1: 'Sumaste el 2: $(17 + 2) \\div 3$. El lápiz se resta del total.', 2: 'S/ 15 es lo que cuestan los 3 cuadernos juntos; falta dividir entre 3.' },
              },
            ],
          },
          {
            id: 'x-en-ambos-lados',
            title: 'Ecuaciones con $x$ en ambos lados',
            theory: [
              { type: 'p', text: 'A veces la incógnita aparece en los dos lados, como en $5x + 2 = 2x + 11$.' },
              { type: 'p', text: 'Primero juntamos las $x$ en un solo lado (restando $2x$ en ambos lados) y los números en el otro.' },
              { type: 'formula', text: '$5x - 2x = 11 - 2 \\;\\Rightarrow\\; 3x = 9 \\;\\Rightarrow\\; x = 3$' },
              { type: 'tip', text: 'Conviene juntar las $x$ en el lado donde hay más; así el número que acompaña a la $x$ queda positivo.' },
            ],
            example: {
              problem: 'Resuelve $7x - 4 = 3x + 8$.',
              steps: [
                { stage: 'Comprender', text: 'Hay $x$ en ambos lados; hay más a la izquierda.' },
                { stage: 'Planificar', text: 'Resto $3x$ en ambos lados, luego sumo 4 y al final divido.' },
                { stage: 'Resolver', text: '$4x - 4 = 8 \\;\\Rightarrow\\; 4x = 12 \\;\\Rightarrow\\; x = 3$' },
                { stage: 'Comprobar', text: 'Izquierda: $7 \\cdot 3 - 4 = 17$. Derecha: $3 \\cdot 3 + 8 = 17$ ✓' },
              ],
            },
            lab: { to: '/laboratorio/balanza', label: 'En la balanza: $3x + 2 = x + 8$ y $5x = 2x + 12$' },
            exercises: [
              {
                question: '$3x + 4 = x + 10$',
                options: ['$x = 3$', '$x = 7$', '$x = 2$', '$x = 3{,}5$'],
                answerIndex: 0,
                hints: ['Resta $x$ en ambos lados.', 'Te queda $2x + 4 = 10$.'],
                explanation: '$2x + 4 = 10 \\Rightarrow 2x = 6 \\Rightarrow x = 3$.',
                mistakes: { 3: 'Sumaste las $x$ ($3x + x = 4x$). Hay que restar $x$ en ambos lados.', 1: 'Comprueba: $3 \\cdot 7 + 4 = 25$ y $7 + 10 = 17$.' },
              },
              {
                question: '$6x - 5 = 2x + 7$',
                options: ['$x = \\frac{1}{2}$', '$x = 3$', '$x = 12$', '$x = -3$'],
                answerIndex: 1,
                hints: ['Resta $2x$ en ambos lados.', 'Te queda $4x - 5 = 7$. Suma 5.'],
                explanation: '$4x = 12 \\Rightarrow x = 3$. Comprueba: $6 \\cdot 3 - 5 = 13$ y $2 \\cdot 3 + 7 = 13$.',
                mistakes: {
                  0: 'Hiciste $7 - 5$. El $-5$ se elimina sumando 5: $7 + 5 = 12$.',
                  2: '$4x = 12$ no es $x = 12$: falta dividir entre 4.',
                  3: 'Revisa los signos: al sumar 5 en ambos lados queda $4x = 12$, positivo.',
                },
              },
              {
                question: '$9 - x = x + 1$',
                options: ['$x = 4$', '$x = 5$', '$x = -4$', '$x = 8$'],
                answerIndex: 0,
                hints: ['Suma $x$ en ambos lados para que las $x$ queden positivas.', 'Te queda $9 = 2x + 1$.'],
                explanation: '$9 = 2x + 1 \\Rightarrow 8 = 2x \\Rightarrow x = 4$. Comprueba: $9 - 4 = 5$ y $4 + 1 = 5$.',
                mistakes: { 3: '$2x = 8$ no es $x = 8$: falta dividir entre 2.', 1: 'Comprueba: $9 - 5 = 4$ y $5 + 1 = 6$.' },
              },
            ],
          },
          {
            id: 'ecuaciones-con-parentesis',
            title: 'Ecuaciones con paréntesis',
            theory: [
              { type: 'p', text: 'Si hay paréntesis, primero aplicamos la propiedad distributiva: el número de afuera multiplica a cada término de adentro.' },
              { type: 'formula', text: '$3(x + 2) = 3x + 6$' },
              { type: 'p', text: 'Después se resuelve como ya sabes. Si el número de afuera divide exacto al otro lado, también puedes dividir primero.' },
              { type: 'tip', text: 'Error frecuente: multiplicar solo el primer término. $2(x + 5)$ es $2x + 10$, no $2x + 5$.' },
            ],
            example: {
              problem: 'Resuelve $2(x + 5) = 18$.',
              steps: [
                { stage: 'Comprender', text: 'El doble de $(x + 5)$ es 18.' },
                { stage: 'Planificar', text: 'Como 18 se divide exacto entre 2, divido ambos lados entre 2 y luego quito 5.' },
                { stage: 'Resolver', text: '$x + 5 = 9 \\;\\Rightarrow\\; x = 4$' },
                { stage: 'Comprobar', text: '$2(4 + 5) = 2 \\cdot 9 = 18$ ✓' },
              ],
            },
            exercises: [
              {
                question: '$3(x - 2) = 15$',
                options: ['$x = 7$', '$x = 5$', '$x = 3$', '$x = 13$'],
                answerIndex: 0,
                hints: ['Divide ambos lados entre 3.', 'Te queda $x - 2 = 5$.'],
                explanation: '$x - 2 = 5 \\Rightarrow x = 7$. Comprueba: $3(7 - 2) = 15$.',
                mistakes: { 1: '5 es el valor de $x - 2$. Falta sumar 2.', 3: 'Olvidaste el 3 que multiplica: hiciste $15 - 2$ sin dividir.' },
              },
              {
                question: '$4(x + 1) = 2x + 10$',
                options: ['$x = 3$', '$x = 6$', '$x = 4{,}5$', '$x = 1{,}5$'],
                answerIndex: 0,
                hints: ['Aplica la distributiva: $4x + 4 = 2x + 10$.', 'Resta $2x$ y resta 4 en ambos lados.'],
                explanation: '$4x + 4 = 2x + 10 \\Rightarrow 2x = 6 \\Rightarrow x = 3$.',
                mistakes: {
                  1: '$2x = 6$ no es $x = 6$: falta dividir entre 2.',
                  2: 'Multiplicaste solo la $x$: $4x + 1$. El 4 también multiplica al 1: $4x + 4$.',
                },
              },
              {
                question: '$5(2x - 1) = 25$',
                options: ['$x = 2$', '$x = 3$', '$x = 3{,}5$', '$x = 30$'],
                answerIndex: 1,
                hints: ['Divide ambos lados entre 5.', 'Te queda $2x - 1 = 5$.'],
                explanation: '$2x - 1 = 5 \\Rightarrow 2x = 6 \\Rightarrow x = 3$. Comprueba: $5(6 - 1) = 25$.',
                mistakes: { 0: 'En $2x - 1 = 5$ hay que sumar 1: $2x = 6$, no 4.', 3: '$10x = 30$ no es $x = 30$: falta dividir entre 10.' },
              },
            ],
          },
        ],
        review: [
          {
            question: '$x + 8 = 15$',
            options: ['$x = 23$', '$x = 7$', '$x = 8$', '$x = -7$'],
            answerIndex: 1,
            hints: ['Quita 8 en ambos lados.'],
            explanation: '$x = 15 - 8 = 7$.',
            mistakes: { 0: 'Sumaste $15 + 8$; hay que quitar el 8.' },
          },
          {
            question: '$3x - 4 = 11$',
            options: ['$x = 5$', '$x = \\frac{7}{3}$', '$x = 15$', '$x = 4$'],
            answerIndex: 0,
            hints: ['Suma 4 en ambos lados.', 'Te queda $3x = 15$.'],
            explanation: '$3x = 15 \\Rightarrow x = 5$.',
            mistakes: { 1: 'Restaste el 4: $(11 - 4) \\div 3$. Hay que sumarlo.', 2: '$3x = 15$ no es $x = 15$: falta dividir entre 3.' },
          },
          {
            question: '$5x + 1 = 2x + 13$',
            options: ['$x = 2$', '$x = 4$', '$x = 12$', '$x = \\frac{14}{7}$'],
            answerIndex: 1,
            hints: ['Resta $2x$ y resta 1 en ambos lados.', 'Te queda $3x = 12$.'],
            explanation: '$3x = 12 \\Rightarrow x = 4$. Comprueba: $5 \\cdot 4 + 1 = 21$ y $2 \\cdot 4 + 13 = 21$.',
            mistakes: { 2: '$3x = 12$ no es $x = 12$: falta dividir entre 3.', 3: 'Sumaste las $x$ ($5x + 2x$); hay que restarlas.' },
          },
          {
            question: '$2(x - 3) = 10$',
            options: ['$x = 2$', '$x = 5$', '$x = 8$', '$x = 6{,}5$'],
            answerIndex: 2,
            hints: ['Divide ambos lados entre 2.', 'Te queda $x - 3 = 5$.'],
            explanation: '$x - 3 = 5 \\Rightarrow x = 8$. Comprueba: $2(8 - 3) = 10$.',
            mistakes: { 1: '5 es el valor de $x - 3$. Falta sumar 3.', 3: 'Multiplicaste solo la $x$: $2x - 3 = 10$. El 2 también multiplica al 3.' },
          },
          {
            question: 'El triple de un número, aumentado en 5, es 26. ¿Cuál es el número?',
            options: ['7', '10,3', '21', '9'],
            answerIndex: 0,
            hints: ['Si el número es $x$, la ecuación es $3x + 5 = 26$.'],
            explanation: '$3x + 5 = 26 \\Rightarrow 3x = 21 \\Rightarrow x = 7$.',
            mistakes: { 1: 'Sumaste el 5: $(26 + 5) \\div 3$. "Aumentado en 5" se quita restando.', 2: '21 es el triple del número; falta dividir entre 3.' },
          },
        ],
      },
    ],
  },
]

export function findCourse(courseId?: string) {
  return courses.find((c) => c.id === courseId)
}

// Busca una clase y devuelve también su unidad y su posición en el curso
export function findLesson(course: Course, lessonId?: string) {
  const all = course.units.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })))
  const index = all.findIndex((x) => x.lesson.id === lessonId)
  if (index === -1) return null
  return { ...all[index], prev: all[index - 1]?.lesson, next: all[index + 1]?.lesson }
}
