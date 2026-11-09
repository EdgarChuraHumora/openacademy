import { useEffect, useState } from 'react'
import type { GameEntry } from '../features/games/catalog'
import { supabase } from './supabase'

// Juegos creados por docentes (tabla "games" de Supabase)
export interface DbGame {
  id: string
  kind: GameEntry['kind']
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  content: Record<string, unknown>
  status: 'draft' | 'published'
  share_code: string
  author_name: string | null
  updated_at: string
}

export type UserGame = GameEntry & { author?: string | null; shareCode?: string; status?: DbGame['status'] }

const COLUMNS = 'id, kind, title, level, icon, color, content, status, share_code, author_name, updated_at'

// Convierte la fila de la base de datos al mismo formato que los juegos de prueba
export function toEntry(row: DbGame): UserGame {
  return {
    ...(row.content as object),
    kind: row.kind,
    id: row.id,
    title: row.title,
    level: row.level,
    icon: row.icon,
    color: row.color,
    author: row.author_name,
    shareCode: row.share_code,
    status: row.status,
  } as UserGame
}

const UUID = /^[0-9a-f-]{36}$/i

// Busca un juego por su id o por su código de 6 letras
export async function fetchGame(idOrCode: string) {
  if (!supabase) return null
  const query = supabase.from('games').select(COLUMNS)
  const { data } = await (UUID.test(idOrCode)
    ? query.eq('id', idOrCode)
    : query.eq('share_code', idOrCode.toUpperCase())
  ).maybeSingle()
  return data ? toEntry(data as DbGame) : null
}

export function usePublishedGames() {
  const [games, setGames] = useState<UserGame[]>([])
  useEffect(() => {
    if (!supabase) return
    supabase
      .from('games')
      .select(COLUMNS)
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(100)
      .then(({ data }) => setGames(((data as DbGame[]) ?? []).map(toEntry)))
  }, [])
  return games
}

export async function fetchMyGames(userId: string) {
  if (!supabase) return []
  const { data } = await supabase.from('games').select(COLUMNS).eq('owner_id', userId).order('updated_at', { ascending: false })
  return (data as DbGame[]) ?? []
}

export function shareUrl(code: string) {
  return `${window.location.origin}/juegos/${code}`
}
