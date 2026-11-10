-- OpenAcademy · asignar clases de la Academia (y repasos de unidad) a un aula
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.
-- Para una clase, game_id guarda la clave de la clase ("algebra/problemas-edades" o
-- "algebra/problemas-con-ecuaciones/repaso"); sus resultados están en game_results como "academia:<clave>".

alter table public.classroom_games
  add column kind text not null default 'game' check (kind in ('game', 'lesson'));

grant insert (classroom_id, game_id, title, icon, due_date, kind) on public.classroom_games to authenticated;

create or replace function public.classroom_report(p_classroom uuid)
returns table (student_id uuid, game_id text, best_pct integer, attempts integer, last_played timestamptz, on_time boolean)
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
           max(r.created_at),
           case when g.due_date is null then null
                else bool_or(r.created_at < ((g.due_date + 1)::timestamp at time zone 'America/Lima')) end
    from public.classroom_members m
    join public.classroom_games g on g.classroom_id = m.classroom_id
    join public.game_results r
      on r.user_id = m.student_id
     and r.game_id = (case g.kind when 'lesson' then 'academia:' else 'juego:' end) || g.game_id
    where m.classroom_id = p_classroom
    group by m.student_id, g.game_id, g.due_date;
end;
$$;
