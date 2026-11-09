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
