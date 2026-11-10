import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { coinReward, MAX_UPGRADE, stages, upgradeCost, type Upgrades } from './data'
import { clearLocalAdventure, heroUpgrades, loadAdventure, saveAdventure, type AdventureSave } from './storage'

// Avance de la Aventura: con sesión se guarda en la cuenta (tabla adventure_progress, 0007_aventura.sql);
// sin sesión, en el navegador como antes.

interface Row {
  hero_xp: Record<string, number>
  stars: Record<string, number>
  upgrades: Record<string, Upgrades>
  coins: number
}

const fromRow = (r: Row): AdventureSave => ({ heroXp: r.hero_xp, stars: r.stars, upgrades: r.upgrades, coins: r.coins })
const empty = (): AdventureSave => ({ heroXp: {}, stars: {}, coins: 0, upgrades: {} })
const hasData = (s: AdventureSave) => Object.keys(s.stars).length > 0 || s.coins > 0

// Recuerda el último avance leído para no esperar al pasar del mapa al combate
let cache: { userId: string; save: AdventureSave } | null = null
let pending: { userId: string; promise: Promise<AdventureSave> } | null = null

// Una sola lectura a la vez (evita importar dos veces si la pantalla se monta dos veces)
function loadOnce(userId: string) {
  if (pending?.userId !== userId) {
    const promise = loadFromAccount().finally(() => {
      if (pending?.promise === promise) pending = null
    })
    pending = { userId, promise }
  }
  return pending.promise
}

function friendly(message: string) {
  if (message.includes('monedas')) return 'No tienes monedas suficientes.'
  if (message.includes('Espera')) return 'Espera unos segundos antes de otra victoria.'
  if (message.includes('máximo')) return 'Esa mejora ya está al máximo.'
  return 'No se pudo guardar en tu cuenta. Revisa tu conexión.'
}

async function loadFromAccount(): Promise<AdventureSave> {
  if (!supabase) return loadAdventure()
  const { data, error } = await supabase.from('adventure_progress').select('hero_xp, stars, upgrades, coins').maybeSingle()
  if (error) throw error
  if (data) return fromRow(data as Row)
  // Primera vez con cuenta: se pasa el avance del navegador (el servidor pone topes)
  const local = loadAdventure()
  if (!hasData(local)) return empty()
  const { data: imported, error: importError } = await supabase.rpc('adventure_import', { p_save: local })
  if (importError) throw importError
  clearLocalAdventure()
  return fromRow(imported as Row)
}

export function useAdventure() {
  const { session, loading } = useAuth()
  const userId = session?.user.id
  const online = Boolean(supabase && userId)
  const [save, setSave] = useState<AdventureSave | null>(() => (userId && cache?.userId === userId ? cache.save : null))
  const [failed, setFailed] = useState(false)

  const update = useCallback(
    (next: AdventureSave) => {
      if (userId) cache = { userId, save: next }
      setSave(next)
    },
    [userId],
  )

  useEffect(() => {
    if (loading) return
    if (!userId) {
      setSave(loadAdventure())
      return
    }
    let alive = true
    loadOnce(userId)
      .then((s) => alive && update(s))
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [userId, loading, update])

  // Guarda una victoria; devuelve un mensaje si algo falló
  const win = useCallback(
    async (stageId: string, heroId: string, stars: number): Promise<string | null> => {
      if (online && supabase) {
        const { data, error } = await supabase.rpc('adventure_win', { p_stage: stageId, p_hero: heroId, p_stars: stars })
        if (error) return friendly(error.message)
        update(fromRow(data as Row))
        return null
      }
      const s = loadAdventure()
      const tier = stages.find((x) => x.id === stageId)?.tier ?? 1
      const next = {
        ...s,
        heroXp: { ...s.heroXp, [heroId]: (s.heroXp[heroId] ?? 0) + 15 * tier + 5 * stars },
        stars: { ...s.stars, [stageId]: Math.max(s.stars[stageId] ?? 0, stars) },
        coins: s.coins + coinReward(tier, stars),
      }
      saveAdventure(next)
      setSave(next)
      return null
    },
    [online, update],
  )

  const buy = useCallback(
    async (heroId: string, type: keyof Upgrades): Promise<string | null> => {
      if (!save) return null
      if (online && supabase) {
        const { data, error } = await supabase.rpc('adventure_buy', { p_hero: heroId, p_type: type })
        if (error) return friendly(error.message)
        update(fromRow(data as Row))
        return null
      }
      const owned = heroUpgrades(save, heroId)
      const cost = upgradeCost(owned[type])
      if (save.coins < cost || owned[type] >= MAX_UPGRADE) return 'No tienes monedas suficientes.'
      const next = { ...save, coins: save.coins - cost, upgrades: { ...save.upgrades, [heroId]: { ...owned, [type]: owned[type] + 1 } } }
      saveAdventure(next)
      setSave(next)
      return null
    },
    [online, save, update],
  )

  return { save, online, failed, win, buy }
}
