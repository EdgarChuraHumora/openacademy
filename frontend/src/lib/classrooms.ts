import { courses } from '../features/academy/courses'
import { supabase } from './supabase'

// Aulas: el docente las crea, los alumnos entran con un código (tablas en 0005_aulas.sql)
export interface Classroom {
  id: string
  owner_id: string
  name: string
  join_code: string
  created_at: string
}

export interface AssignedGame {
  classroom_id: string
  game_id: string
  title: string
  icon: string
  assigned_at: string
  due_date: string | null // "2026-11-14": vence al terminar ese día (hora de Perú)
  kind: 'game' | 'lesson' // juego, o clase / repaso de la Academia
}

export interface ClassStudent {
  student_id: string
  display_name: string
  grade: string | null
  xp: number
  week_xp: number
  joined_at: string
}

export interface ReportCell {
  student_id: string
  game_id: string
  best_pct: number
  attempts: number
  last_played: string
  on_time: boolean | null // null = el juego no tiene fecha límite
}

export interface LeaderRow {
  pos: number
  display_name: string
  points: number
  is_me: boolean
}

export function joinUrl(code: string) {
  return `${window.location.origin}/aulas/unirse/${code}`
}

export async function fetchClassroom(id: string) {
  if (!supabase) return null
  const { data } = await supabase.from('classrooms').select('*').eq('id', id).maybeSingle()
  return (data as Classroom | null) ?? null
}

export async function fetchAssigned(classroomId: string) {
  if (!supabase) return []
  const { data } = await supabase
    .from('classroom_games')
    .select('*')
    .eq('classroom_id', classroomId)
    .order('assigned_at', { ascending: false })
  return (data as AssignedGame[]) ?? []
}

export async function fetchLeaderboard(classroomId: string) {
  if (!supabase) return []
  const { data } = await supabase.rpc('classroom_leaderboard', { p_classroom: classroomId })
  return (data as LeaderRow[]) ?? []
}

// Color según el porcentaje de aciertos (verde, amarillo o rojo)
export function pctClass(pct: number) {
  return pct >= 80 ? 'pct pct--ok' : pct >= 50 ? 'pct pct--mid' : 'pct pct--low'
}

// Fecha de hoy en Perú como "AAAA-MM-DD"
export function todayLima() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

// Días que faltan para la fecha límite (0 = vence hoy, negativo = ya venció)
export function daysLeft(due: string) {
  return Math.round((Date.parse(due) - Date.parse(todayLima())) / 86_400_000)
}

export function formatDue(due: string) {
  return new Date(`${due}T12:00:00`).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })
}

// Texto y color del aviso de fecha límite
export function dueLabel(due: string) {
  const d = daysLeft(due)
  if (d < 0) return { text: `Venció el ${formatDue(due)}`, className: 'due due--late' }
  if (d === 0) return { text: 'Vence hoy', className: 'due due--soon' }
  if (d === 1) return { text: 'Vence mañana', className: 'due due--soon' }
  return { text: `Vence en ${d} días (${formatDue(due)})`, className: 'due' }
}

// ¿Este momento (ISO) cuenta como a tiempo para la fecha límite?
export function isOnTime(playedAt: string, due: string) {
  const playedDay = new Date(playedAt).toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
  return playedDay <= due
}

// Orden: primero los que tienen fecha más cercana, al final los que no tienen fecha
export function byDue(a: AssignedGame, b: AssignedGame) {
  if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date)
  if (a.due_date) return -1
  if (b.due_date) return 1
  return b.assigned_at.localeCompare(a.assigned_at)
}

// Clave con la que se guardan los resultados ("juego:tablas" o "academia:algebra/problemas-edades")
export const resultKey = (g: Pick<AssignedGame, 'kind' | 'game_id'>) =>
  `${g.kind === 'lesson' ? 'academia' : 'juego'}:${g.game_id}`

// A dónde lleva cada tarea asignada
export function assignedLink(g: Pick<AssignedGame, 'kind' | 'game_id'>) {
  if (g.kind !== 'lesson') return `/juegos/${g.game_id}`
  const [course, unitOrLesson, review] = g.game_id.split('/')
  return review ? `/academia/${course}/unidad/${unitOrLesson}/repaso` : `/academia/${course}/clase/${unitOrLesson}`
}

// Clases y repasos de la Academia que el docente puede asignar
export function academyOptions() {
  const plain = (t: string) => t.replace(/\$/g, '')
  return courses.flatMap((c) =>
    c.units.flatMap((u, i) => {
      const group = `${c.title} · Unidad ${i + 1}`
      return [
        ...u.lessons.map((l) => ({ id: `${c.id}/${l.id}`, title: `${c.title}: ${plain(l.title)}`, icon: '📘', group })),
        { id: `${c.id}/${u.id}/repaso`, title: `${c.title}: repaso de ${plain(u.title)}`, icon: '⭐', group },
      ]
    }),
  )
}
