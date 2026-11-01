-- OpenAcademy · tablas iniciales: perfiles, resultados de juegos y avance de la Academia
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.
-- Todas las tablas tienen Row Level Security: cada alumno solo ve y cambia lo suyo.

-- ---------- Perfiles ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  grade text check (char_length(grade) <= 30),
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  coins integer not null default 0 check (coins >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_active date,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Cada usuario ve su perfil"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Cada usuario edita su perfil"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Permisos explícitos (el proyecto no expone tablas nuevas automáticamente).
-- El alumno solo puede cambiar su nombre y su grado; el rol, el XP, las monedas
-- y la racha solo los cambian las funciones del servidor (no se pueden "hackear" desde la web)
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, grade) on public.profiles to authenticated;

-- Crea el perfil automáticamente cuando alguien se registra
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'Explorador'), 40)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Resultados de juegos ----------
create table public.game_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  game_id text not null check (char_length(game_id) <= 80),
  score integer not null check (score >= 0),
  total integer not null check (total between 1 and 100 and score <= total),
  xp integer not null check (xp between 0 and 200),
  created_at timestamptz not null default now()
);

create index game_results_user_idx on public.game_results (user_id, created_at desc);

alter table public.game_results enable row level security;

revoke all on public.game_results from anon, authenticated;
grant select on public.game_results to authenticated;

create policy "Cada usuario ve sus resultados"
  on public.game_results for select to authenticated
  using ((select auth.uid()) = user_id);
-- No hay política de insert: los resultados solo se guardan con la función record_game

-- Guarda un resultado y suma XP, nivel y racha (días seguidos jugando, hora de Perú)
create function public.record_game(p_game_id text, p_score integer, p_total integer, p_xp integer)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'America/Lima')::date;
  result public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  -- Límites para que nadie pueda sumarse XP sin control
  if p_total not between 1 and 100 or p_score not between 0 and p_total or p_xp not between 0 and 200 then
    raise exception 'Resultado no válido';
  end if;

  insert into public.game_results (user_id, game_id, score, total, xp)
  values (auth.uid(), left(p_game_id, 80), p_score, p_total, p_xp);

  update public.profiles
  set xp = xp + p_xp,
      level = 1 + (xp + p_xp) / 100,
      streak = case
        when last_active = today then greatest(streak, 1)
        when last_active = today - 1 then streak + 1
        else 1
      end,
      last_active = today
  where id = auth.uid()
  returning * into result;

  return result;
end;
$$;

revoke execute on function public.record_game from public, anon;
grant execute on function public.record_game to authenticated;

-- ---------- Avance de la Academia ----------
create table public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  key text not null check (char_length(key) <= 120), -- "curso/clase" o "curso/unidad/repaso"
  score integer not null check (score >= 0),
  total integer not null check (total between 1 and 100 and score <= total),
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.lesson_progress enable row level security;

revoke all on public.lesson_progress from anon, authenticated;
grant select, insert, update on public.lesson_progress to authenticated;

create policy "Cada usuario ve su avance"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Cada usuario guarda su avance"
  on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Cada usuario actualiza su avance"
  on public.lesson_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
