import { useSyncExternalStore } from 'react'

// Avance del alumno en la Academia.
// Por ahora se guarda solo en este navegador (localStorage); cuando conectemos Supabase
// se guardará en la cuenta del alumno.
const KEY = 'openacademy:progress'

export interface Result {
  score: number
  total: number
}

type Progress = Record<string, Result> // clave: "curso/clase" o "curso/unidad/repaso"

const listeners = new Set<() => void>()
let cache: Progress | null = null

function read(): Progress {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Progress
  } catch {
    cache = {}
  }
  return cache
}

// Guarda el resultado si es el primero o si mejora el anterior
export function saveResult(key: string, score: number, total: number) {
  const current = read()
  const prev = current[key]
  if (prev && prev.score >= score) return
  cache = { ...current, [key]: { score, total } }
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    // Sin almacenamiento (modo privado): el avance dura mientras la pestaña esté abierta
  }
  listeners.forEach((l) => l())
}

export function useProgress() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    read,
  )
}

export const lessonKey = (courseId: string, lessonId: string) => `${courseId}/${lessonId}`
export const reviewKey = (courseId: string, unitId: string) => `${courseId}/${unitId}/repaso`
