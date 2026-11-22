-- Pega esto entero en Supabase > SQL Editor > Run (se puede ejecutar más de una vez)
create table if not exists settings(id int primary key default 1 check(id=1), year int default 2026, recipient text, sender text, welcome text,
  style text default 'noche', color text default 'rojo', email_to text, admin_email text, site_url text, last_sent int);
alter table settings add column if not exists pin text;
alter table settings add column if not exists card24 text default 'lazo';
insert into settings(id) values(1) on conflict do nothing;
create table if not exists letters(day int primary key check(day between 1 and 24), body text default '', photo text, audio text);
alter table settings enable row level security; alter table letters enable row level security;
drop policy if exists "editor ajustes" on settings; create policy "editor ajustes" on settings for all to authenticated using(true) with check(true);
drop policy if exists "editor cartas" on letters; create policy "editor cartas" on letters for all to authenticated using(true) with check(true);
insert into storage.buckets(id,name,public) values('media','media',true) on conflict do nothing;
drop policy if exists "editor media" on storage.objects; create policy "editor media" on storage.objects for all to authenticated using(bucket_id='media') with check(bucket_id='media');
-- Lo único que ve la web pública: ajustes visuales y SOLO las cartas ya abiertas según la fecha (hora de Madrid). Si hay PIN, solo con el PIN correcto.
drop function if exists public_calendar();
create or replace function public_calendar(p text default null) returns json language plpgsql security definer set search_path=public as $$
declare s settings%rowtype;
begin
 select * into s from settings;
 if coalesce(s.pin,'')<>'' and p is distinct from s.pin then return json_build_object('pin',true); end if;
 return json_build_object(
  's',json_build_object('recipient',s.recipient,'sender',s.sender,'welcome',s.welcome,'style',s.style,'color',s.color,'card24',s.card24),
  'l',coalesce((select json_agg(json_build_object('day',l.day,'body',l.body,'photo',l.photo,'audio',l.audio))
      from letters l where (now() at time zone 'Europe/Madrid')::date >= make_date(s.year,12,l.day)),'[]'::json));
end $$;
grant execute on function public_calendar(text) to anon;
