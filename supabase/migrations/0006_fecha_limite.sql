-- OpenAcademy · fecha límite para los juegos asignados a un aula
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.
-- La fecha se guarda como día (sin hora): vence al terminar ese día, hora de Perú.

alter table public.classroom_games add column due_date date;

grant insert (classroom_id, game_id, title, icon, due_date) on public.classroom_games to authenticated;
grant update (due_date) on public.classroom_games to authenticated;

create policy "El docente cambia la fecha límite"
  on public.classroom_games for update to authenticated
  using ((select public.owns_classroom(classroom_id)))
  with check ((select public.owns_classroom(classroom_id)));

-- El reporte ahora dice si el alumno jugó a tiempo (null = el juego no tiene fecha límite)
drop function public.classroom_report(uuid);

create function public.classroom_report(p_classroom uuid)
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
    join public.game_results r on r.user_id = m.student_id and r.game_id = 'juego:' || g.game_id
    where m.classroom_id = p_classroom
    group by m.student_id, g.game_id, g.due_date;
end;
$$;

revoke execute on function public.classroom_report from public, anon;
grant execute on function public.classroom_report to authenticated;
