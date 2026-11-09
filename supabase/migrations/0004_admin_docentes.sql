-- OpenAcademy · solicitudes de docente y administración de usuarios
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.

-- Fecha en que el usuario pidió ser docente (null = no lo pidió)
alter table public.profiles add column teacher_requested_at timestamptz;

-- El alumno pide ser docente (solo puede marcarse a sí mismo)
create function public.request_teacher()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles set teacher_requested_at = now()
  where id = auth.uid() and role = 'student';
$$;

revoke execute on function public.request_teacher from public, anon;
grant execute on function public.request_teacher to authenticated;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

-- Lista de usuarios para el administrador (incluye el correo, que no es público)
create function public.admin_list_users()
returns table (id uuid, display_name text, email text, role text, grade text, xp integer,
               teacher_requested_at timestamptz, created_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo el administrador puede ver esta lista';
  end if;
  return query
    select p.id, p.display_name, u.email::text, p.role, p.grade, p.xp, p.teacher_requested_at, p.created_at
    from public.profiles p
    join auth.users u on u.id = p.id
    order by p.teacher_requested_at desc nulls last, p.created_at desc
    limit 500;
end;
$$;

-- El administrador cambia el rol de un usuario (no puede quitarse a sí mismo el rol de admin)
create function public.admin_set_role(p_user uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo el administrador puede cambiar roles';
  end if;
  if p_role not in ('student', 'teacher', 'admin') then
    raise exception 'Rol no válido';
  end if;
  if p_user = auth.uid() and p_role <> 'admin' then
    raise exception 'No puedes quitarte tu propio rol de administrador';
  end if;
  update public.profiles set role = p_role, teacher_requested_at = null where id = p_user;
end;
$$;

revoke execute on function public.admin_list_users, public.admin_set_role from public, anon;
grant execute on function public.admin_list_users, public.admin_set_role to authenticated;
