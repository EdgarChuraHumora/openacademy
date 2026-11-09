-- OpenAcademy · juegos creados por docentes
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.
-- Un solo tipo de tabla sirve para las 7 plantillas: el contenido del juego (preguntas,
-- parejas, pasos…) va en "content" con el mismo formato que los juegos de prueba del código.

create table public.games (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('quiz', 'match', 'order', 'truefalse', 'classify', 'domino', 'roulette')),
  title text not null check (char_length(title) between 1 and 80),
  level text not null check (level in ('primaria', 'secundaria')),
  icon text not null default '🎯' check (char_length(icon) <= 8),
  color text not null default 'blue' check (color in ('yellow', 'green', 'pink', 'blue')),
  content jsonb not null check (pg_column_size(content) <= 100000),
  status text not null default 'draft' check (status in ('draft', 'published')),
  -- Código corto para compartir en clase (por ejemplo "K7M2QX")
  share_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index games_owner_idx on public.games (owner_id, updated_at desc);

alter table public.games enable row level security;

revoke all on public.games from anon, authenticated;
grant select on public.games to anon, authenticated;
grant insert (kind, title, level, icon, color, content, status) on public.games to authenticated;
grant update (title, level, icon, color, content, status, updated_at) on public.games to authenticated;
grant delete on public.games to authenticated;

-- ¿El usuario actual es docente o administrador?
create function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin')
  )
$$;

-- Cualquiera (incluso sin cuenta) puede jugar los juegos publicados; el dueño también ve sus borradores
create policy "Ver juegos publicados o propios"
  on public.games for select to anon, authenticated
  using (status = 'published' or owner_id = (select auth.uid()));

create policy "Docentes crean sus juegos"
  on public.games for insert to authenticated
  with check (owner_id = (select auth.uid()) and (select public.is_teacher()));

create policy "Docentes editan sus juegos"
  on public.games for update to authenticated
  using (owner_id = (select auth.uid()) and (select public.is_teacher()))
  with check (owner_id = (select auth.uid()));

create policy "Docentes borran sus juegos"
  on public.games for delete to authenticated
  using (owner_id = (select auth.uid()) and (select public.is_teacher()));

-- El dueño se pone solo (no se puede crear un juego a nombre de otro)
alter table public.games alter column owner_id set default auth.uid();

-- Nombre del autor visible para los alumnos (los perfiles no son públicos) y fecha de edición
alter table public.games add column author_name text;

create function public.games_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.author_name := (select display_name from public.profiles where id = new.owner_id);
  new.updated_at := now();
  return new;
end;
$$;

create trigger games_before_write
  before insert or update on public.games
  for each row execute function public.games_before_write();
