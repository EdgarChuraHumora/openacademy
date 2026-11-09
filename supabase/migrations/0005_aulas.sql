-- OpenAcademy · aulas: el docente crea un aula, los alumnos entran con un código,
-- el docente les asigna juegos y ve los resultados de cada alumno.
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.

-- ---------- Tablas ----------
create table public.classrooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  -- Código para que los alumnos se unan (por ejemplo "Q4T9ZB")
  join_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  created_at timestamptz not null default now()
);

create index classrooms_owner_idx on public.classrooms (owner_id, created_at desc);

create table public.classroom_members (
  classroom_id uuid not null references public.classrooms (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (classroom_id, student_id)
);

create index classroom_members_student_idx on public.classroom_members (student_id);

-- Juegos asignados. game_id es el id de un juego de prueba (ej. "tablas") o el uuid de un juego
-- creado por un docente; título e ícono se copian para mostrarlos sin buscar el juego
create table public.classroom_games (
  classroom_id uuid not null references public.classrooms (id) on delete cascade,
  game_id text not null check (char_length(game_id) <= 80),
  title text not null check (char_length(title) between 1 and 80),
  icon text not null default '🎯' check (char_length(icon) <= 8),
  assigned_at timestamptz not null default now(),
  primary key (classroom_id, game_id)
);

-- ---------- Funciones de ayuda (security definer para no crear ciclos entre políticas) ----------
create function public.owns_classroom(p_classroom uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.classrooms where id = p_classroom and owner_id = auth.uid())
$$;

create function public.in_classroom(p_classroom uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.classroom_members where classroom_id = p_classroom and student_id = auth.uid()
  )
$$;

revoke execute on function public.owns_classroom, public.in_classroom from public, anon;
grant execute on function public.owns_classroom, public.in_classroom to authenticated;

-- ---------- Permisos y Row Level Security ----------
alter table public.classrooms enable row level security;
alter table public.classroom_members enable row level security;
alter table public.classroom_games enable row level security;

revoke all on public.classrooms, public.classroom_members, public.classroom_games from anon, authenticated;
grant select, delete on public.classrooms to authenticated;
grant insert (name), update (name) on public.classrooms to authenticated;
grant select, delete on public.classroom_members to authenticated; -- se entra solo con join_classroom
grant select, insert (classroom_id, game_id, title, icon), delete on public.classroom_games to authenticated;

create policy "Ver aulas propias o donde estoy"
  on public.classrooms for select to authenticated
  using (owner_id = (select auth.uid()) or (select public.in_classroom(id)));

create policy "Docentes crean aulas"
  on public.classrooms for insert to authenticated
  with check (owner_id = (select auth.uid()) and (select public.is_teacher()));

create policy "Docentes renombran sus aulas"
  on public.classrooms for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Docentes borran sus aulas"
  on public.classrooms for delete to authenticated
  using (owner_id = (select auth.uid()));

create policy "Ver miembros: el alumno a sí mismo, el docente a todos"
  on public.classroom_members for select to authenticated
  using (student_id = (select auth.uid()) or (select public.owns_classroom(classroom_id)));

create policy "Salir del aula o quitar a un alumno"
  on public.classroom_members for delete to authenticated
  using (student_id = (select auth.uid()) or (select public.owns_classroom(classroom_id)));

create policy "Ver juegos asignados"
  on public.classroom_games for select to authenticated
  using ((select public.owns_classroom(classroom_id)) or (select public.in_classroom(classroom_id)));

create policy "El docente asigna juegos"
  on public.classroom_games for insert to authenticated
  with check ((select public.owns_classroom(classroom_id)));

create policy "El docente quita juegos"
  on public.classroom_games for delete to authenticated
  using ((select public.owns_classroom(classroom_id)));

-- ---------- Unirse con el código ----------
create function public.join_classroom(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  select id into target from public.classrooms where join_code = upper(trim(p_code));
  if target is null then
    raise exception 'No existe un aula con ese código';
  end if;
  if (select count(*) from public.classroom_members where classroom_id = target) >= 200 then
    raise exception 'El aula está llena';
  end if;
  insert into public.classroom_members (classroom_id, student_id)
  values (target, auth.uid())
  on conflict do nothing;
  return target;
end;
$$;

-- ---------- Alumnos del aula y resultados (solo el docente dueño) ----------
-- Los perfiles no son públicos: el docente ve de sus alumnos solo nombre, grado y XP
create function public.classroom_students(p_classroom uuid)
returns table (student_id uuid, display_name text, grade text, xp integer, week_xp integer, joined_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.owns_classroom(p_classroom) then
    raise exception 'Solo el docente del aula puede ver a sus alumnos';
  end if;
  return query
    select m.student_id, p.display_name, p.grade, p.xp,
           coalesce((select sum(r.xp) from public.game_results r
                     where r.user_id = m.student_id
                       and r.created_at >= (((now() at time zone 'America/Lima')::date - 6)::timestamp at time zone 'America/Lima')), 0)::integer,
           m.joined_at
    from public.classroom_members m
    join public.profiles p on p.id = m.student_id
    where m.classroom_id = p_classroom
    order by p.display_name;
end;
$$;

-- Mejor resultado (en %) y número de intentos de cada alumno en cada juego asignado.
-- Solo devuelve las combinaciones que tienen al menos un intento
create function public.classroom_report(p_classroom uuid)
returns table (student_id uuid, game_id text, best_pct integer, attempts integer, last_played timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.owns_classroom(p_classroom) then
    raise exception 'Solo el docente del aula puede ver los resultados';
  end if;
  return query
    select m.student_id, g.game_id,
           max(round(100.0 * r.score / r.total))::integer,
           count(*)::integer,
           max(r.created_at)
    from public.classroom_members m
    join public.classroom_games g on g.classroom_id = m.classroom_id
    join public.game_results r on r.user_id = m.student_id and r.game_id = 'juego:' || g.game_id
    where m.classroom_id = p_classroom
    group by m.student_id, g.game_id;
end;
$$;

-- Ranking semanal del aula: lo ven el docente y los alumnos (solo nombre y XP)
create function public.classroom_leaderboard(p_classroom uuid)
returns table (pos bigint, display_name text, points integer, is_me boolean)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (public.owns_classroom(p_classroom) or public.in_classroom(p_classroom)) then
    raise exception 'No perteneces a esta aula';
  end if;
  return query
    with scores as (
      select m.student_id,
             coalesce(sum(r.xp), 0)::integer as points,
             m.joined_at
      from public.classroom_members m
      left join public.game_results r
        on r.user_id = m.student_id
       and r.created_at >= (((now() at time zone 'America/Lima')::date - 6)::timestamp at time zone 'America/Lima')
      where m.classroom_id = p_classroom
      group by m.student_id, m.joined_at
    )
    select rank() over (order by s.points desc, s.joined_at), p.display_name, s.points,
           coalesce(s.student_id = auth.uid(), false)
    from scores s
    join public.profiles p on p.id = s.student_id
    order by 1
    limit 200;
end;
$$;

revoke execute on function public.join_classroom, public.classroom_students, public.classroom_report,
  public.classroom_leaderboard from public, anon;
grant execute on function public.join_classroom, public.classroom_students, public.classroom_report,
  public.classroom_leaderboard to authenticated;
