import type { Session } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { syncProgress } from './progress'
import { supabase } from './supabase'

export interface Profile {
  id: string
  display_name: string
  role: 'student' | 'teacher' | 'admin'
  grade: string | null
  xp: number
  level: number
  coins: number
  streak: number
  last_active: string | null
}

interface AuthState {
  session: Session | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => Promise<void>
  setProfile: (profile: Profile) => void
}

const AuthContext = createContext<AuthState>({
  session: null,
  profile: null,
  loading: false,
  refreshProfile: async () => {},
  setProfile: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(supabase !== null)

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    setProfile((data as Profile | null) ?? null)
  }, [])

  useEffect(() => {
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setLoading(false)
      if (newSession) {
        // Fuera del callback, como recomienda Supabase, para no bloquear la sesión
        setTimeout(() => {
          loadProfile(newSession.user.id)
          syncProgress(newSession.user.id)
        }, 0)
      } else {
        setProfile(null)
        syncProgress(null)
      }
    })
    return () => data.subscription.unsubscribe()
  }, [loadProfile])

  const refreshProfile = useCallback(async () => {
    if (session) await loadProfile(session.user.id)
  }, [session, loadProfile])

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile, setProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export async function signOut() {
  await supabase?.auth.signOut()
}

// Mensajes de Supabase traducidos para el alumno
export function authErrorMessage(message: string) {
  if (/invalid login credentials/i.test(message)) return 'Correo o contraseña incorrectos.'
  if (/email not confirmed/i.test(message)) return 'Primero confirma tu correo con el enlace que te enviamos.'
  if (/already registered|already exists/i.test(message)) return 'Ya existe una cuenta con ese correo. Inicia sesión.'
  if (/password should be at least/i.test(message)) return 'La contraseña debe tener al menos 6 caracteres.'
  if (/rate limit|too many/i.test(message)) return 'Demasiados intentos. Espera unos minutos y vuelve a probar.'
  if (/invalid.*email|email.*invalid/i.test(message)) return 'Ese correo no es válido.'
  return 'Algo salió mal. Revisa tus datos y vuelve a intentarlo.'
}
