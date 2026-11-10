import { heroes, stages, type Hero, type Upgrades } from './data'

// Avance de la Aventura (por ahora en el navegador, como el de la Academia)
export interface AdventureSave {
  heroXp: Record<string, number>
  stars: Record<string, number> // mejor resultado por etapa (1 a 3)
  coins: number
  upgrades: Record<string, Upgrades>
}

const KEY = 'oa-aventura'

export function loadAdventure(): AdventureSave {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return { heroXp: raw.heroXp ?? {}, stars: raw.stars ?? {}, coins: raw.coins ?? 0, upgrades: raw.upgrades ?? {} }
  } catch {
    return { heroXp: {}, stars: {}, coins: 0, upgrades: {} }
  }
}

export function saveAdventure(save: AdventureSave) {
  try {
    localStorage.setItem(KEY, JSON.stringify(save))
  } catch {
    // sin almacenamiento (modo privado): el avance dura solo esta visita
  }
}

export function clearLocalAdventure() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // nada que borrar
  }
}

export const isHeroUnlocked = (hero: Hero, save: AdventureSave) => !hero.unlockAfter || (save.stars[hero.unlockAfter] ?? 0) > 0

// Una etapa se abre al ganar la anterior
export function isStageUnlocked(index: number, save: AdventureSave) {
  return index === 0 || (save.stars[stages[index - 1].id] ?? 0) > 0
}

export function unlockedHeroes(save: AdventureSave) {
  return heroes.filter((h) => isHeroUnlocked(h, save))
}

export const heroUpgrades = (save: AdventureSave, heroId: string): Upgrades => save.upgrades[heroId] ?? { attack: 0, hp: 0 }
