// Aventura: héroes, etapas y enemigos (personajes propios de OpenAcademy)

export type Area = 'aritmetica' | 'algebra' | 'geometria' | 'estadistica'
export type Tier = 1 | 2 | 3

export const areaLabel: Record<Area, string> = {
  aritmetica: 'Aritmética',
  algebra: 'Álgebra',
  geometria: 'Geometría',
  estadistica: 'Estadística y Probabilidad',
}

export interface Hero {
  id: string
  name: string
  title: string
  icon: string
  area: Area
  hp: number
  attack: number
  special: { name: string; description: string; kind: 'shield' | 'blast' | 'heal' | 'luck' }
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
  {
    id: 'azaria',
    name: 'Azaria',
    title: 'Exploradora del azar',
    icon: '🎲',
    area: 'estadistica',
    hp: 100,
    attack: 21,
    special: { name: 'Tiro de suerte', description: 'Lanza los dados: hace entre el doble y el cuádruple de daño.', kind: 'luck' },
    unlockAfter: 'valle',
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
  { id: 'jardin', name: 'Jardín de los Perímetros', area: 'geometria', tier: 1, enemy: { name: 'Caracol Contorno', icon: '🐌', hp: 120, attack: 16 } },
  { id: 'valle', name: 'Valle de las Figuras', area: 'geometria', tier: 2, enemy: { name: 'Escorpión Ángulo', icon: '🦂', hp: 140, attack: 18 } },
  { id: 'mercado', name: 'Mercado de la Moda', area: 'estadistica', tier: 1, enemy: { name: 'Loro Promedio', icon: '🦜', hp: 150, attack: 18 } },
  { id: 'feria', name: 'Feria del Azar', area: 'estadistica', tier: 2, enemy: { name: 'Búho Probable', icon: '🦉', hp: 165, attack: 19 } },
  { id: 'castillo', name: 'Castillo del Error', area: 'mixta', tier: 3, enemy: { name: 'Dragón del Error', icon: '🐉', hp: 220, attack: 22 }, boss: true },
]

// Cada 50 XP de héroe sube un nivel; cada nivel da +10 % de vida y ataque
export const HERO_XP_PER_LEVEL = 50
export const heroLevel = (xp: number) => 1 + Math.floor(xp / HERO_XP_PER_LEVEL)

// Mejoras compradas con monedas en la tienda: cada una da +6 % (máximo 5 por tipo)
export interface Upgrades {
  attack: number
  hp: number
}
export const MAX_UPGRADE = 5
export const UPGRADE_BONUS = 0.06
export const upgradeCost = (owned: number) => 30 + 20 * owned

export function heroStats(hero: Hero, xp: number, upgrades: Upgrades = { attack: 0, hp: 0 }) {
  const bonus = 0.1 * (heroLevel(xp) - 1)
  return {
    hp: Math.round(hero.hp * (1 + bonus + UPGRADE_BONUS * upgrades.hp)),
    attack: Math.round(hero.attack * (1 + bonus + UPGRADE_BONUS * upgrades.attack)),
  }
}

// Monedas que da una victoria
export const coinReward = (tier: number, stars: number) => 10 * tier + 5 * stars
