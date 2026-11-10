// Aventura: héroes, etapas y enemigos (personajes propios de OpenAcademy)

export type Area = 'aritmetica' | 'algebra' | 'geometria'
export type Tier = 1 | 2 | 3

export const areaLabel: Record<Area, string> = {
  aritmetica: 'Aritmética',
  algebra: 'Álgebra',
  geometria: 'Geometría',
}

export interface Hero {
  id: string
  name: string
  title: string
  icon: string
  area: Area
  hp: number
  attack: number
  special: { name: string; description: string; kind: 'shield' | 'blast' | 'heal' }
  unlockAfter?: string // id de la etapa que hay que ganar para conseguirlo
}

export const heroes: Hero[] = [
  {
    id: 'numeron',
    name: 'Numerón',
    title: 'Guardián de los números',
    icon: '🛡️',
    area: 'aritmetica',
    hp: 120,
    attack: 18,
    special: { name: 'Muro exacto', description: 'Golpea y bloquea el siguiente ataque enemigo.', kind: 'shield' },
  },
  {
    id: 'incognita',
    name: 'Incógnita',
    title: 'Maga del álgebra',
    icon: '🔮',
    area: 'algebra',
    hp: 95,
    attack: 24,
    special: { name: 'Gran despeje', description: 'Un hechizo que hace el triple de daño.', kind: 'blast' },
    unlockAfter: 'cueva',
  },
  {
    id: 'compasia',
    name: 'Compasia',
    title: 'Arquera de la geometría',
    icon: '🏹',
    area: 'geometria',
    hp: 105,
    attack: 20,
    special: { name: 'Flecha bisectriz', description: 'Golpea y recupera un tercio de la vida.', kind: 'heal' },
    unlockAfter: 'torre',
  },
]

export interface Stage {
  id: string
  name: string
  area: Area | 'mixta'
  tier: Tier
  enemy: { name: string; icon: string; hp: number; attack: number }
  boss?: boolean
}

export const stages: Stage[] = [
  { id: 'pradera', name: 'Pradera de las Sumas', area: 'aritmetica', tier: 1, enemy: { name: 'Restón', icon: '🐛', hp: 80, attack: 12 } },
  { id: 'cueva', name: 'Cueva de las Tablas', area: 'aritmetica', tier: 2, enemy: { name: 'Murciélago Divisor', icon: '🦇', hp: 100, attack: 14 } },
  { id: 'pantano', name: 'Pantano de la Incógnita', area: 'algebra', tier: 1, enemy: { name: 'Sapo Equis', icon: '🐸', hp: 110, attack: 15 } },
  { id: 'torre', name: 'Torre del Despeje', area: 'algebra', tier: 2, enemy: { name: 'Gólem Balanza', icon: '🗿', hp: 130, attack: 17 } },
  { id: 'valle', name: 'Valle de las Figuras', area: 'geometria', tier: 2, enemy: { name: 'Escorpión Ángulo', icon: '🦂', hp: 140, attack: 18 } },
  { id: 'castillo', name: 'Castillo del Error', area: 'mixta', tier: 3, enemy: { name: 'Dragón del Error', icon: '🐉', hp: 200, attack: 21 }, boss: true },
]

// Cada 50 XP de héroe sube un nivel; cada nivel da +10 % de vida y ataque
export const HERO_XP_PER_LEVEL = 50
export const heroLevel = (xp: number) => 1 + Math.floor(xp / HERO_XP_PER_LEVEL)

export function heroStats(hero: Hero, xp: number) {
  const bonus = 1 + 0.1 * (heroLevel(xp) - 1)
  return { hp: Math.round(hero.hp * bonus), attack: Math.round(hero.attack * bonus) }
}
