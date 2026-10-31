import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si faltan las variables (frontend/.env o Vercel), la app sigue funcionando sin Supabase
export const supabase = url && anonKey ? createClient(url, anonKey) : null
