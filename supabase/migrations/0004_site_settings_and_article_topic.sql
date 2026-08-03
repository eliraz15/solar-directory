-- site_settings: singleton row (boolean PK trick) for sitewide config like
-- the homepage hero background image, editable from admin.
-- articles.topic/cover_image_url: new content taxonomy (production/
-- maintenance/economics/troubleshooting) and per-article cover photo,
-- both for the homepage topic cards + redesigned article cards.

create type article_topic as enum ('production', 'maintenance', 'economics', 'troubleshooting');

alter table articles
  add column topic article_topic,
  add column cover_image_url text;

create table site_settings (
  id boolean primary key default true check (id),
  hero_image_url text,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values (true);

alter table site_settings enable row level security;

create policy site_settings_public_read on site_settings for select
  using (true);
create policy site_settings_admin_write on site_settings for update
  using (is_active_admin()) with check (is_active_admin());
