-- ==========================================================================
-- NAJULweb — Migración 005: textos editables del inicio
-- Correr en Supabase → SQL Editor.
-- Agrega columnas a config para editar los títulos/copys del home desde el panel.
-- Todas nullable: si están vacías, la web usa los textos por defecto del código.
-- ==========================================================================

alter table public.config
  add column if not exists hero_eyebrow        text,
  add column if not exists hero_titulo         text,
  add column if not exists hero_destacado      text,
  add column if not exists carrusel_titulo     text,
  add column if not exists servicios_titulo    text,
  add column if not exists recomendador_titulo text,
  add column if not exists recomendador_texto  text,
  add column if not exists nosotros_titulo     text,
  add column if not exists nosotros_texto      text,
  add column if not exists cta_titulo          text,
  add column if not exists cta_texto           text;
