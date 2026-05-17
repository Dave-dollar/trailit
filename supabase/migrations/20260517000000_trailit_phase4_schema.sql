create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text not null,
  email text,
  accent_color text
);

create table if not exists public.trail_logs (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  created_by_user_id uuid not null references public.profiles(id) on delete cascade,
  visibility text not null default 'private'
);

create table if not exists public.trail_log_members (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  trail_log_id text not null references public.trail_logs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'reader',
  can_read boolean not null default true,
  can_write_spottings boolean not null default false,
  can_write_trails boolean not null default false,
  can_add_notes boolean not null default false,
  can_edit_own_inputs boolean not null default false,
  can_edit_others_inputs boolean not null default false,
  unique (trail_log_id, user_id)
);

create table if not exists public.sightings (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  trail_log_id text not null references public.trail_logs(id) on delete cascade,
  created_by_user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  latitude double precision not null,
  longitude double precision not null
);

create table if not exists public.trails (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  trail_log_id text not null references public.trail_logs(id) on delete cascade,
  created_by_user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  date timestamptz,
  distance_miles numeric,
  steps integer,
  duration_seconds integer,
  start_time timestamptz,
  end_time timestamptz,
  route_coordinates jsonb not null default '[]'::jsonb
);

create table if not exists public.notes (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  trail_log_id text not null references public.trail_logs(id) on delete cascade,
  created_by_user_id uuid not null references public.profiles(id) on delete cascade,
  sighting_id text references public.sightings(id) on delete cascade,
  trail_id text references public.trails(id) on delete cascade,
  content text not null
);

create table if not exists public.photos (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  trail_log_id text not null references public.trail_logs(id) on delete cascade,
  created_by_user_id uuid not null references public.profiles(id) on delete cascade,
  sighting_id text references public.sightings(id) on delete cascade,
  trail_id text references public.trails(id) on delete cascade,
  storage_path text not null default '',
  caption text
);

create index if not exists trail_log_members_user_id_idx on public.trail_log_members(user_id);
create index if not exists trail_log_members_trail_log_id_idx on public.trail_log_members(trail_log_id);
create index if not exists sightings_trail_log_id_idx on public.sightings(trail_log_id);
create index if not exists trails_trail_log_id_idx on public.trails(trail_log_id);
create index if not exists notes_trail_log_id_idx on public.notes(trail_log_id);
create index if not exists photos_trail_log_id_idx on public.photos(trail_log_id);

alter table public.profiles enable row level security;
alter table public.trail_logs enable row level security;
alter table public.trail_log_members enable row level security;
alter table public.sightings enable row level security;
alter table public.trails enable row level security;
alter table public.notes enable row level security;
alter table public.photos enable row level security;

create or replace function private.is_trail_log_member(target_trail_log_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trail_log_members
    where trail_log_id = target_trail_log_id
      and user_id = auth.uid()
      and can_read = true
  );
$$;

create or replace function private.can_manage_trail_log(target_trail_log_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trail_log_members
    where trail_log_id = target_trail_log_id
      and user_id = auth.uid()
      and role = 'owner'
  );
$$;

create or replace function private.has_trail_log_permission(target_trail_log_id text, permission_name text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trail_log_members
    where trail_log_id = target_trail_log_id
      and user_id = auth.uid()
      and (
        role = 'owner'
        or case permission_name
          when 'can_write_spottings' then can_write_spottings
          when 'can_write_trails' then can_write_trails
          when 'can_add_notes' then can_add_notes
          when 'can_edit_own_inputs' then can_edit_own_inputs
          when 'can_edit_others_inputs' then can_edit_others_inputs
          else false
        end
      )
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_trail_log_member(text) to authenticated;
grant execute on function private.can_manage_trail_log(text) to authenticated;
grant execute on function private.has_trail_log_permission(text, text) to authenticated;

drop policy if exists "profiles read members" on public.profiles;
create policy "profiles read members"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.trail_log_members mine
    join public.trail_log_members theirs on theirs.trail_log_id = mine.trail_log_id
    where mine.user_id = auth.uid()
      and theirs.user_id = profiles.id
  )
);

drop policy if exists "profiles upsert self" on public.profiles;
create policy "profiles upsert self"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "trail logs read members" on public.trail_logs;
create policy "trail logs read members"
on public.trail_logs for select
to authenticated
using (private.is_trail_log_member(id));

drop policy if exists "trail logs create own" on public.trail_logs;
create policy "trail logs create own"
on public.trail_logs for insert
to authenticated
with check (owner_user_id = auth.uid() and created_by_user_id = auth.uid());

drop policy if exists "trail logs owners update" on public.trail_logs;
create policy "trail logs owners update"
on public.trail_logs for update
to authenticated
using (private.can_manage_trail_log(id))
with check (private.can_manage_trail_log(id));

drop policy if exists "members read members" on public.trail_log_members;
create policy "members read members"
on public.trail_log_members for select
to authenticated
using (private.is_trail_log_member(trail_log_id) or user_id = auth.uid());

drop policy if exists "members insert owner or self owner" on public.trail_log_members;
create policy "members insert owner or self owner"
on public.trail_log_members for insert
to authenticated
with check (
  private.can_manage_trail_log(trail_log_id)
  or (user_id = auth.uid() and role = 'owner')
);

drop policy if exists "members owners update" on public.trail_log_members;
create policy "members owners update"
on public.trail_log_members for update
to authenticated
using (private.can_manage_trail_log(trail_log_id))
with check (private.can_manage_trail_log(trail_log_id));

drop policy if exists "sightings read members" on public.sightings;
create policy "sightings read members"
on public.sightings for select
to authenticated
using (private.is_trail_log_member(trail_log_id));

drop policy if exists "sightings insert permitted" on public.sightings;
create policy "sightings insert permitted"
on public.sightings for insert
to authenticated
with check (created_by_user_id = auth.uid() and private.has_trail_log_permission(trail_log_id, 'can_write_spottings'));

drop policy if exists "sightings delete permitted" on public.sightings;
create policy "sightings delete permitted"
on public.sightings for delete
to authenticated
using (
  private.has_trail_log_permission(trail_log_id, 'can_edit_others_inputs')
  or (created_by_user_id = auth.uid() and private.has_trail_log_permission(trail_log_id, 'can_edit_own_inputs'))
);

drop policy if exists "trails read members" on public.trails;
create policy "trails read members"
on public.trails for select
to authenticated
using (private.is_trail_log_member(trail_log_id));

drop policy if exists "trails insert permitted" on public.trails;
create policy "trails insert permitted"
on public.trails for insert
to authenticated
with check (created_by_user_id = auth.uid() and private.has_trail_log_permission(trail_log_id, 'can_write_trails'));

drop policy if exists "notes read members" on public.notes;
create policy "notes read members"
on public.notes for select
to authenticated
using (private.is_trail_log_member(trail_log_id));

drop policy if exists "notes insert permitted" on public.notes;
create policy "notes insert permitted"
on public.notes for insert
to authenticated
with check (created_by_user_id = auth.uid() and private.has_trail_log_permission(trail_log_id, 'can_add_notes'));

drop policy if exists "photos read members" on public.photos;
create policy "photos read members"
on public.photos for select
to authenticated
using (private.is_trail_log_member(trail_log_id));

drop policy if exists "photos insert permitted" on public.photos;
create policy "photos insert permitted"
on public.photos for insert
to authenticated
with check (created_by_user_id = auth.uid() and private.has_trail_log_permission(trail_log_id, 'can_add_notes'));

