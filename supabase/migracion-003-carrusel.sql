-- ==========================================================================
-- NAJULweb — Migración 003: carrusel editable (fotos + reels de Instagram)
-- Correr en Supabase → SQL Editor.
-- Público lee lo activo; admin escribe.
-- ==========================================================================

create type public.tipo_carrusel as enum ('foto', 'reel');

create table if not exists public.carrusel_items (
  id         uuid primary key default gen_random_uuid(),
  tipo       public.tipo_carrusel not null default 'foto',
  url        text not null,          -- foto: URL de Storage · reel: URL del reel/post de Instagram
  titulo     text,                    -- epígrafe opcional
  orden      int  not null default 0,
  activo     boolean not null default true,
  creado_en  timestamptz not null default now()
);
create index if not exists ix_carrusel_orden on public.carrusel_items(orden);

alter table public.carrusel_items enable row level security;

create policy "carrusel_lectura_publica"
  on public.carrusel_items for select using (activo);
create policy "carrusel_admin_lee_todo"
  on public.carrusel_items for select using (public.es_admin());
create policy "carrusel_admin_escribe"
  on public.carrusel_items for all using (public.es_admin()) with check (public.es_admin());
