-- Core schema for the solar.org.il content + professional directory site.
-- Applied via the Supabase MCP apply_migration tool once the project exists.

create extension if not exists "pgcrypto";

create type article_status as enum ('draft', 'published');
create type banner_placement as enum ('article_inline', 'sidebar', 'category_top', 'homepage');
create type banner_event_type as enum ('impression', 'click');
create type admin_role as enum ('owner', 'editor');

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int not null default 0,
  -- true for categories that only ever hold the site owner's own listing
  -- (e.g. monitoring/SUNWISE) - admin UI hides "add competitor" there.
  is_exclusive boolean not null default false,
  created_at timestamptz not null default now()
);

create table professionals (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  phone text,
  whatsapp text,
  website text,
  service_areas text,
  is_active boolean not null default true,
  slot_position smallint check (slot_position between 1 and 3),
  is_house_brand boolean not null default false,
  disclosure_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index professionals_active_slot_unique
  on professionals (category_id, slot_position)
  where is_active and slot_position is not null;

-- Defense in depth: the admin UI already blocks a 4th active listing per
-- category, this trigger stops it at the DB level too (e.g. concurrent edits).
create or replace function enforce_max_active_professionals()
returns trigger as $$
declare
  active_count int;
begin
  if new.is_active then
    select count(*) into active_count
    from professionals
    where category_id = new.category_id
      and is_active
      and id <> new.id;
    if active_count >= 3 then
      raise exception 'Category already has 3 active professionals';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_enforce_max_active_professionals
before insert or update on professionals
for each row execute function enforce_max_active_professionals();

create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text not null default '',
  excerpt text,
  meta_description text,
  related_category_id uuid references categories(id) on delete set null,
  status article_status not null default 'draft',
  faq_items jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  link_url text not null,
  placement banner_placement not null,
  category_id uuid references categories(id) on delete cascade,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table banner_events (
  id uuid primary key default gen_random_uuid(),
  banner_id uuid not null references banners(id) on delete cascade,
  event_type banner_event_type not null,
  page_path text,
  created_at timestamptz not null default now()
);

create index banner_events_banner_id_idx on banner_events (banner_id, created_at);

create table admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role admin_role not null default 'editor',
  is_suspended boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS

alter table categories enable row level security;
alter table professionals enable row level security;
alter table articles enable row level security;
alter table banners enable row level security;
alter table banner_events enable row level security;
alter table admin_profiles enable row level security;

-- security definer so these can read admin_profiles without recursing
-- through admin_profiles' own RLS policies.
create or replace function is_active_admin()
returns boolean as $$
  select exists (
    select 1 from admin_profiles
    where user_id = auth.uid() and not is_suspended
  );
$$ language sql security definer stable;

create or replace function is_owner()
returns boolean as $$
  select exists (
    select 1 from admin_profiles
    where user_id = auth.uid() and role = 'owner' and not is_suspended
  );
$$ language sql security definer stable;

create policy categories_public_read on categories for select using (true);
create policy categories_admin_write on categories for all
  using (is_active_admin()) with check (is_active_admin());

create policy professionals_public_read on professionals for select
  using (is_active or is_active_admin());
create policy professionals_admin_insert on professionals for insert
  with check (is_active_admin());
create policy professionals_admin_update on professionals for update
  using (is_active_admin()) with check (is_active_admin());
create policy professionals_admin_delete on professionals for delete
  using (is_active_admin());

create policy articles_public_read on articles for select
  using (status = 'published' or is_active_admin());
create policy articles_admin_insert on articles for insert
  with check (is_active_admin());
create policy articles_admin_update on articles for update
  using (is_active_admin()) with check (is_active_admin());
create policy articles_admin_delete on articles for delete
  using (is_active_admin());

create policy banners_public_read on banners for select
  using (
    (is_active
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now()))
    or is_active_admin()
  );
create policy banners_admin_insert on banners for insert
  with check (is_active_admin());
create policy banners_admin_update on banners for update
  using (is_active_admin()) with check (is_active_admin());
create policy banners_admin_delete on banners for delete
  using (is_active_admin());

-- No public insert policy: impression/click logging goes through server
-- route handlers using the service-role client, not straight from the
-- browser, so an open "anyone can insert" policy isn't needed.
create policy banner_events_admin_read on banner_events for select
  using (is_active_admin());

create policy admin_profiles_self_read on admin_profiles for select
  using (user_id = auth.uid() or is_owner());
create policy admin_profiles_owner_write on admin_profiles for all
  using (is_owner()) with check (is_owner());
