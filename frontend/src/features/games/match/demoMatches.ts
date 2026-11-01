import type { MatchGame } from './types'

// Datos de prueba: más adelante vendrán de la base de datos (Supabase)
export const demoMatches: MatchGame[] = [
  {
    id: 'fracciones-equivalentes',
    title: 'Fracciones equivalentes',
    level: 'primaria',
    icon: '🔗',
    color: 'pink',
    pairs: [
      { left: '$\\dfrac{1}{2}$', right: '$\\dfrac{3}{6}$' },
      { left: '$\\dfrac{1}{3}$', right: '$\\dfrac{2}{6}$' },
      { left: '$\\dfrac{3}{4}$', right: '$\\dfrac{6}{8}$' },
      { left: '$\\dfrac{2}{5}$', right: '$\\dfrac{4}{10}$' },
      { left: '$\\dfrac{1}{4}$', right: '$\\dfrac{3}{12}$' },
      { left: '$\\dfrac{2}{3}$', right: '$\\dfrac{8}{12}$' },
    ],
  },
  {
    id: 'potencias-emparejar',
    title: 'Empareja la potencia',
    level: 'secundaria',
    icon: '🔗',
    color: 'blue',
    pairs: [
      { left: '$2^3$', right: '$8$' },
      { left: '$3^2$', right: '$9$' },
      { left: '$5^2$', right: '$25$' },
      { left: '$2^5$', right: '$32$' },
      { left: '$10^3$', right: '$1000$' },
      { left: '$4^0$', right: '$1$' },
    ],
  },
  {
    id: 'propiedades-potencias',
    title: 'Propiedades de las potencias',
    level: 'secundaria',
    icon: '🔗',
    color: 'green',
    pairs: [
      { left: '$a^m \\cdot a^n$', right: '$a^{m+n}$' },
      { left: '$\\dfrac{a^m}{a^n}$', right: '$a^{m-n}$' },
      { left: '$(a^m)^n$', right: '$a^{m \\cdot n}$' },
      { left: '$a^0$', right: '$1$' },
      { left: '$a^{-n}$', right: '$\\dfrac{1}{a^n}$' },
      { left: '$(a \\cdot b)^n$', right: '$a^n \\cdot b^n$' },
    ],
  },
]
