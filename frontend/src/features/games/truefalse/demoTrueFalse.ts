import type { TrueFalseGame } from './types'

// Datos de prueba: más adelante vendrán de la base de datos (Supabase)
export const demoTrueFalse: TrueFalseGame[] = [
  {
    id: 'vf-numeros',
    title: '¿Verdadero o falso? Números',
    level: 'primaria',
    icon: '⏱️',
    color: 'yellow',
    seconds: 60,
    statements: [
      { text: '$7 \\times 8 = 56$', answer: true },
      { text: '$\\dfrac{1}{2} > \\dfrac{1}{3}$', answer: true },
      { text: '$0{,}5 = \\dfrac{1}{2}$', answer: true },
      { text: '$9 \\times 6 = 56$', answer: false, why: '$9 \\times 6 = 54$.' },
      { text: '$\\dfrac{2}{4} = \\dfrac{1}{2}$', answer: true },
      { text: 'Todo número par es divisible entre 4', answer: false, why: '6 es par, pero no es divisible entre 4.' },
      { text: 'El 25 % de 80 es 20', answer: true },
      {
        text: '$\\dfrac{1}{4} + \\dfrac{1}{4} = \\dfrac{2}{8}$',
        answer: false,
        why: 'Con el mismo denominador se suman solo los numeradores: $\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4} = \\frac{1}{2}$.',
      },
      { text: '1 kg = 100 g', answer: false, why: '1 kg = 1000 g.' },
      { text: '−3 °C es más frío que 2 °C', answer: true },
      {
        text: 'Un triángulo puede tener dos ángulos rectos',
        answer: false,
        why: 'Sus ángulos suman 180°; dos ángulos rectos ya suman 180° y no queda nada para el tercero.',
      },
      { text: '$0{,}25 = 25\\,\\%$', answer: true },
    ],
  },
  {
    id: 'vf-algebra',
    title: '¿Verdadero o falso? Álgebra y potencias',
    level: 'secundaria',
    icon: '⏱️',
    color: 'pink',
    seconds: 60,
    statements: [
      { text: '$2^3 = 6$', answer: false, why: '$2^3 = 2 \\cdot 2 \\cdot 2 = 8$.' },
      { text: '$(-1)^{10} = 1$', answer: true },
      { text: '$\\sqrt{49} = 7$', answer: true },
      { text: '$a^2 \\cdot a^3 = a^6$', answer: false, why: 'Con la misma base se suman los exponentes: $a^2 \\cdot a^3 = a^5$.' },
      { text: '$x = 3$ es solución de $2x + 1 = 7$', answer: true },
      { text: '$(a + b)^2 = a^2 + b^2$', answer: false, why: '$(a + b)^2 = a^2 + 2ab + b^2$. Falta el doble producto.' },
      { text: '$5^0 = 1$', answer: true },
      { text: '$-3^2 = 9$', answer: false, why: 'Primero va la potencia: $-3^2 = -(3^2) = -9$. En cambio, $(-3)^2 = 9$.' },
      { text: '$3x + 2x = 5x$', answer: true },
      { text: '$\\sqrt{16 + 9} = 4 + 3$', answer: false, why: '$\\sqrt{25} = 5$, no 7. La raíz no se reparte en una suma.' },
      { text: '$\\dfrac{6}{9} = \\dfrac{2}{3}$', answer: true },
      { text: '$2(x + 3) = 2x + 3$', answer: false, why: 'El 2 multiplica a los dos términos: $2(x + 3) = 2x + 6$.' },
    ],
  },
]
