import type { OrderGame } from './types'

// Datos de prueba: más adelante vendrán de la base de datos (Supabase)
// Cada paso debe salir del anterior, para que solo haya un orden correcto
export const demoOrders: OrderGame[] = [
  {
    id: 'pasos-problema',
    title: 'Ordena los pasos del problema',
    level: 'primaria',
    icon: '🪜',
    color: 'yellow',
    problems: [
      {
        prompt: 'Ana compra 3 cuadernos a S/ 4 cada uno y paga con S/ 20. ¿Cuánto recibe de vuelto?',
        steps: [
          'Datos: 3 cuadernos de S/ 4 cada uno; paga con S/ 20.',
          'Condición: primero hallo cuánto cuestan los cuadernos y luego el vuelto.',
          'Operación: $3 \\times 4 = 12$ y $20 - 12 = 8$.',
          'Respuesta: Ana recibe S/ 8 de vuelto.',
        ],
      },
      {
        prompt: 'En el mercado, 1 kg de papa cuesta S/ 2,50. ¿Cuánto cuestan 4 kg?',
        steps: [
          'Datos: 1 kg cuesta S/ 2,50 y se compran 4 kg.',
          'Condición: el total es el precio de 1 kg por la cantidad de kilos.',
          'Operación: $4 \\times 2{,}50 = 10$.',
          'Respuesta: 4 kg de papa cuestan S/ 10.',
        ],
      },
      {
        prompt: 'En una helada, la temperatura bajó de 6 °C a −3 °C. ¿Cuántos grados bajó?',
        steps: [
          'Datos: empieza en 6 °C y termina en −3 °C.',
          'Condición: lo que bajó es la diferencia entre las dos temperaturas.',
          'Operación: $6 - (-3) = 6 + 3 = 9$.',
          'Respuesta: la temperatura bajó 9 °C.',
        ],
      },
    ],
  },
  {
    id: 'ordena-ecuacion',
    title: 'Ordena la resolución de la ecuación',
    level: 'secundaria',
    icon: '🪜',
    color: 'green',
    problems: [
      {
        prompt: 'Resuelve $3x + 5 = 20$',
        steps: ['$3x = 20 - 5$', '$3x = 15$', '$x = \\dfrac{15}{3}$', '$x = 5$'],
      },
      {
        prompt: 'Resuelve $2(x - 4) = 10$',
        steps: ['$2x - 8 = 10$', '$2x = 10 + 8$', '$2x = 18$', '$x = 9$'],
      },
      {
        prompt: 'Resuelve $\\dfrac{x}{2} + 3 = 7$',
        steps: ['$\\dfrac{x}{2} = 7 - 3$', '$\\dfrac{x}{2} = 4$', '$x = 4 \\cdot 2$', '$x = 8$'],
      },
    ],
  },
  {
    id: 'orden-operaciones',
    title: 'Orden de las operaciones',
    level: 'secundaria',
    icon: '🪜',
    color: 'blue',
    problems: [
      {
        prompt: 'Calcula $2 + 3 \\times (8 - 2)^2 \\div 9$',
        steps: ['$2 + 3 \\times 6^2 \\div 9$', '$2 + 3 \\times 36 \\div 9$', '$2 + 108 \\div 9$', '$2 + 12$', '$14$'],
      },
      {
        prompt: 'Calcula $20 - 4 \\times 3 + 6 \\div 2$',
        steps: ['$20 - 12 + 6 \\div 2$', '$20 - 12 + 3$', '$8 + 3$', '$11$'],
      },
    ],
  },
]
