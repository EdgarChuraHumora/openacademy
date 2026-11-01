import { useCallback } from 'react'
import { useAuth, type Profile } from './auth'
import { supabase } from './supabase'

// Devuelve una función para guardar el resultado de un juego en la cuenta del alumno.
// Si no inició sesión, no hace nada (el juego funciona igual, pero el XP no se guarda).
export function useRecordGame() {
  const { session, setProfile } = useAuth()
  return useCallback(
    async (gameId: string, score: number, total: number, xp: number) => {
      if (!supabase || !session || total < 1) return
      const { data, error } = await supabase.rpc('record_game', {
        p_game_id: gameId,
        p_score: Math.max(0, Math.min(score, total)),
        p_total: Math.min(total, 100),
        p_xp: Math.max(0, Math.min(Math.round(xp), 200)),
      })
      if (error) console.warn('No se pudo guardar el resultado', error.message)
      else if (data) setProfile(data as Profile)
    },
    [session, setProfile],
  )
}
