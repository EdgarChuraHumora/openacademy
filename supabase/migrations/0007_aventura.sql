-- OpenAcademy · avance de la Aventura guardado en la cuenta
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.
-- La tabla solo se lee desde la web; las monedas, estrellas y mejoras solo cambian con
-- estas funciones, que calculan los premios en el servidor (nadie puede sumarse monedas a mano).
-- Si cambias etapas o héroes en features/adventure/data.ts, actualiza también las listas de aquí.

create table public.adventure_progress (
  user_id uuid primary key default auth.uid() references public.profiles (id) on delete cascade,
  hero_xp jsonb not null default '{}',
  stars jsonb not null default '{}',
  upgrades jsonb not null default '{}',
  coins integer not null default 0 check (coins >= 0),
  last_win_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.adventure_progress enable row level security;
revoke all on public.adventure_progress from anon, authenticated;
grant select on public.adventure_progress to authenticated;

create policy "Cada alumno ve su aventura"
  on public.adventure_progress for select to authenticated
  using (user_id = (select auth.uid()));

-- Etapas en orden y su dificultad (igual que en data.ts)
create function public.adventure_stages()
returns text[] language sql immutable set search_path = '' as $$
  select array['pradera', 'cueva', 'pantano', 'torre', 'jardin', 'valle', 'mercado', 'feria', 'castillo']
$$;

create function public.adventure_tiers()
returns int[] language sql immutable set search_path = '' as $$
  select array[1, 2, 1, 2, 1, 2, 1, 2, 3]
$$;

-- Etapa que hay que ganar para tener cada héroe ('' = desde el inicio; null = no existe)
create function public.adventure_hero_unlock(p_hero text)
returns text language sql immutable set search_path = '' as $$
  select case p_hero when 'numeron' then '' when 'incognita' then 'cueva'
                     when 'compasia' then 'torre' when 'azaria' then 'valle' end
$$;

create function public.adventure_int(p_value text)
returns integer language sql immutable set search_path = '' as $$
  select case when p_value ~ '^\d{1,6}$' then p_value::integer else 0 end
$$;

-- Registra una victoria: el servidor calcula la XP del héroe y las monedas
create function public.adventure_win(p_stage text, p_hero text, p_stars integer)
returns public.adventure_progress
language plpgsql
security definer
set search_path = ''
as $$
declare
  idx integer := array_position(public.adventure_stages(), p_stage);
  unlock text := public.adventure_hero_unlock(p_hero);
  prog public.adventure_progress;
  tier integer;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  if idx is null or unlock is null or p_stars not between 1 and 3 then
    raise exception 'Datos no válidos';
  end if;

  insert into public.adventure_progress (user_id) values (auth.uid()) on conflict do nothing;
  select * into prog from public.adventure_progress where user_id = auth.uid() for update;

  if idx > 1 and public.adventure_int(prog.stars ->> (public.adventure_stages())[idx - 1]) = 0 then
    raise exception 'Esa etapa todavía está cerrada';
  end if;
  if unlock <> '' and public.adventure_int(prog.stars ->> unlock) = 0 then
    raise exception 'Ese héroe todavía está bloqueado';
  end if;
  -- Un combate dura más que esto: evita que un programa sume victorias sin parar
  if prog.last_win_at > now() - interval '15 seconds' then
    raise exception 'Espera un momento antes de otra victoria';
  end if;

  tier := (public.adventure_tiers())[idx];
  update public.adventure_progress
  set stars = stars || jsonb_build_object(p_stage, greatest(public.adventure_int(stars ->> p_stage), p_stars)),
      hero_xp = hero_xp || jsonb_build_object(p_hero, public.adventure_int(hero_xp ->> p_hero) + 15 * tier + 5 * p_stars),
      coins = coins + 10 * tier + 5 * p_stars,
      last_win_at = now(),
      updated_at = now()
  where user_id = auth.uid()
  returning * into prog;
  return prog;
end;
$$;

-- Compra una mejora (+ataque o +vida) para un héroe
create function public.adventure_buy(p_hero text, p_type text)
returns public.adventure_progress
language plpgsql
security definer
set search_path = ''
as $$
declare
  unlock text := public.adventure_hero_unlock(p_hero);
  prog public.adventure_progress;
  owned integer;
  cost integer;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  if unlock is null or p_type not in ('attack', 'hp') then
    raise exception 'Datos no válidos';
  end if;
  select * into prog from public.adventure_progress where user_id = auth.uid() for update;
  if not found or (unlock <> '' and public.adventure_int(prog.stars ->> unlock) = 0) then
    raise exception 'Ese héroe todavía está bloqueado';
  end if;

  owned := public.adventure_int(prog.upgrades -> p_hero ->> p_type);
  cost := 30 + 20 * owned;
  if owned >= 5 then
    raise exception 'Esa mejora ya está al máximo';
  end if;
  if prog.coins < cost then
    raise exception 'No tienes monedas suficientes';
  end if;

  update public.adventure_progress
  set coins = coins - cost,
      upgrades = upgrades || jsonb_build_object(p_hero, coalesce(upgrades -> p_hero, '{}') || jsonb_build_object(p_type, owned + 1)),
      updated_at = now()
  where user_id = auth.uid()
  returning * into prog;
  return prog;
end;
$$;

-- Pasa a la cuenta el avance que el alumno tenía en el navegador (solo una vez y con topes)
create function public.adventure_import(p_save jsonb)
returns public.adventure_progress
language plpgsql
security definer
set search_path = ''
as $$
declare
  s text;
  h text;
  v integer;
  new_stars jsonb := '{}';
  new_xp jsonb := '{}';
  new_upgrades jsonb := '{}';
  prog public.adventure_progress;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  if exists (select 1 from public.adventure_progress where user_id = auth.uid()) then
    select * into prog from public.adventure_progress where user_id = auth.uid();
    return prog; -- ya tenía avance en la cuenta: no se reemplaza
  end if;

  foreach s in array public.adventure_stages() loop
    v := least(public.adventure_int(p_save -> 'stars' ->> s), 3);
    if v > 0 then new_stars := new_stars || jsonb_build_object(s, v); end if;
  end loop;
  foreach h in array array['numeron', 'incognita', 'compasia', 'azaria'] loop
    v := least(public.adventure_int(p_save -> 'heroXp' ->> h), 600);
    if v > 0 then new_xp := new_xp || jsonb_build_object(h, v); end if;
    if p_save -> 'upgrades' -> h is not null then
      new_upgrades := new_upgrades || jsonb_build_object(h, jsonb_build_object(
        'attack', least(public.adventure_int(p_save -> 'upgrades' -> h ->> 'attack'), 5),
        'hp', least(public.adventure_int(p_save -> 'upgrades' -> h ->> 'hp'), 5)));
    end if;
  end loop;

  insert into public.adventure_progress (user_id, hero_xp, stars, upgrades, coins)
  values (auth.uid(), new_xp, new_stars, new_upgrades, least(public.adventure_int(p_save ->> 'coins'), 600))
  returning * into prog;
  return prog;
end;
$$;

revoke execute on function public.adventure_win, public.adventure_buy, public.adventure_import from public, anon;
grant execute on function public.adventure_win, public.adventure_buy, public.adventure_import to authenticated;
