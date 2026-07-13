-- ==========================================================================
-- NAJULweb — Migración 006: textos sueltos de la sección Servicios
-- Correr en Supabase → SQL Editor.
-- ==========================================================================

alter table public.config
  add column if not exists servicios_eyebrow text,   -- rótulo "Qué hacemos"
  add column if not exists servicios_link    text,   -- "¿No sabés cuál elegir?…"
  add column if not exists servicios_ver     text;   -- CTA de cada tarjeta "Ver ejemplos →"
