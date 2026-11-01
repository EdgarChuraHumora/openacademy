import { useSyncExternalStore } from 'react'
import { supabase } from './supabase'

// Avance del alumno en la Academia.
// Se guarda en este navegador (localStorage) y, si el alumno inició sesión, también en su cuenta (Supabase).
const KEY = 'openacademy:progress'

export interface Result {
  score: number
  total: number
}

type Progress = Record<string, Result> // clave: "curso/clase" o "curso/unidad/repaso"

const listeners = new Set<() => void>()
let cache: Progress | null = null
let userId: string | null = null

function read(): Progress {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Progress
  } catch {
    cache = {}
  }
  return cache
}

function write(next: Progress) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Sin almacenamiento (modo privado): el avance dura mientras la pestaña esté abierta
  }
  listeners.forEach((l) => l())
}

const better = (a: Result | undefined, b: Result) => !a || b.score > a.score

// Guarda el resultado si es el primero o si mejora el anterior
export function saveResult(key: string, score: number, total: number) {
  if (!better(read()[key], { score, total })) return
  write({ ...read(), [key]: { score, total } })
  if (supabase && userId) {
    supabase
      .from('lesson_progress')
      .upsert({ user_id: userId, key, score, total, updated_at: new Date().toISOString() })
      .then(({ error }) => error && console.warn('No se pudo guardar el avance en la cuenta', error.message))
  }
}

// Al iniciar sesión: junta el avance de la cuenta con el de este navegador (se queda el mejor)
export async function syncProgress(id: string | null) {
  userId = id
  if (!supabase || !id) return
  const { data } = await supabase.from('lesson_progress').select('key, score, total')
  const merged = { ...read() }
  for (const row of data ?? []) {
    if (better(merged[row.key], row)) merged[row.key] = { score: row.score, total: row.total }
  }
  write(merged)
  // Sube lo que solo estaba en este navegador
  const remote = new Map((data ?? []).map((r) => [r.key, r.score]))
  const pending = Object.entries(merged)
    .filter(([k, r]) => (remote.get(k) ?? -1) < r.score)
    .map(([k, r]) => ({ user_id: id, key: k, score: r.score, total: r.total }))
  if (pending.length) await supabase.from('lesson_progress').upsert(pending)
}

export function useProgress() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    read,
  )
}

export const lessonKey = (courseId: string, lessonId: string) => `${courseId}/${lessonId}`
export const reviewKey = (courseId: string, unitId: string) => `${courseId}/${unitId}/repaso`
