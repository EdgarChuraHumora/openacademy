-- OpenAcademy · ranking
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.
-- Las tablas siguen cerradas: el ranking solo se lee con esta función, que devuelve
-- el nombre visible y los puntos, nunca correos ni otros datos del alumno.

-- p_game_id = null → XP sumado en todos los juegos durante los últimos 7 días (hora de Perú)
-- p_game_id = 'juego:tablas' → mejor resultado de cada alumno en ese juego (siempre)
create function public.leaderboard(p_game_id text default null)
returns table (pos bigint, display_name text, points integer, is_me boolean)
language sql
stable
security definer
set search_path = ''
as $$
  with scores as (
    select r.user_id,
           case when p_game_id is null then sum(r.xp)::integer else max(r.score)::integer end as points,
           min(r.created_at) as first_at
    from public.game_results r
    where (p_game_id is null
           and r.created_at >= (((now() at time zone 'America/Lima')::date - 6)::timestamp at time zone 'America/Lima'))
       or (p_game_id is not null and r.game_id = p_game_id)
    group by r.user_id
  ),
  ranked as (
    select rank() over (order by s.points desc, s.first_at) as pos,
           p.display_name, s.points, s.user_id = auth.uid() as is_me
    from scores s
    join public.profiles p on p.id = s.user_id
    where s.points > 0
  )
  -- Los 20 primeros y, si el alumno no está entre ellos, también su propia fila
  select pos, display_name, points, is_me from ranked where pos <= 20 or is_me
  order by pos
$$;

revoke execute on function public.leaderboard from public, anon;
grant execute on function public.leaderboard to authenticated;
