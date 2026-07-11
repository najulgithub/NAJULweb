-- ==========================================================================
-- NAJULweb — Migración 001 (inicial)
-- Correr en Supabase → SQL Editor.
--
-- Sitio institucional de cortinas + diseño / otros trabajos a medida.
-- Regla de seguridad: TODO el mundo LEE el contenido publicado; solo un
-- admin autenticado ESCRIBE. No hay multi-tenant (un solo dueño = Najul),
-- así que "admin" = cualquier usuario autenticado.
--
-- IMPORTANTE: en Supabase → Authentication → Providers, DESACTIVAR el signup
-- público (allow new users to sign up = OFF). Las cuentas de admin se crean a
-- mano desde el dashboard. Con eso, authenticated == Najul.
-- ==========================================================================

create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- --------------------------------------------------------------------------
-- Helper: ¿el request viene de un admin autenticado?
-- --------------------------------------------------------------------------
create or replace function public.es_admin()
returns boolean
language sql
stable
as $$ select auth.role() = 'authenticated' $$;

-- ==========================================================================
-- 1) CONFIG — configuración global del sitio (una sola fila, id = 1)
-- ==========================================================================
create table if not exists public.config (
  id                smallint primary key default 1,
  nombre_empresa    text not null default 'Najul',
  claim             text,                       -- frase del hero
  descripcion       text,                       -- "nosotros"
  whatsapp          text,                       -- E.164 sin +, ej: 5492235551234
  whatsapp_mensaje  text,                       -- mensaje prellenado del botón
  email             text,
  direccion         text,
  horarios          text,
  instagram         text,
  facebook          text,
  logo_url          text,
  hero_imagen_url   text,
  actualizado_en    timestamptz not null default now(),
  constraint config_una_fila check (id = 1)
);

alter table public.config enable row level security;

create policy "config_lectura_publica"
  on public.config for select using (true);
create policy "config_admin_escribe"
  on public.config for all using (public.es_admin()) with check (public.es_admin());

-- ==========================================================================
-- 2) CATEGORIAS — los 4 ejes de clasificación, editables desde el admin
--    eje: espacio | tipo_trabajo | estilo | preferencia_luz
-- ==========================================================================
create type public.eje_categoria as enum
  ('espacio', 'tipo_trabajo', 'estilo', 'preferencia_luz');

create table if not exists public.categorias (
  id           uuid primary key default gen_random_uuid(),
  eje          public.eje_categoria not null,
  nombre       text not null,
  slug         text not null,
  descripcion  text,
  icono        text,                    -- nombre de ícono / emoji, opcional
  orden        int  not null default 0,
  activo       boolean not null default true,
  creado_en    timestamptz not null default now(),
  unique (eje, slug)
);

alter table public.categorias enable row level security;

create policy "categorias_lectura_publica"
  on public.categorias for select using (activo);
create policy "categorias_admin_lee_todo"
  on public.categorias for select using (public.es_admin());
create policy "categorias_admin_escribe"
  on public.categorias for all using (public.es_admin()) with check (public.es_admin());

-- ==========================================================================
-- 3) TRABAJOS — proyectos realizados (el corazón de la galería)
-- ==========================================================================
create table if not exists public.trabajos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  slug        text not null unique,
  resumen     text,                      -- para la tarjeta de la galería
  descripcion text,                       -- detalle
  ubicacion   text,
  destacado   boolean not null default false,
  orden       int  not null default 0,
  activo      boolean not null default true,
  creado_en   timestamptz not null default now()
);

alter table public.trabajos enable row level security;

create policy "trabajos_lectura_publica"
  on public.trabajos for select using (activo);
create policy "trabajos_admin_lee_todo"
  on public.trabajos for select using (public.es_admin());
create policy "trabajos_admin_escribe"
  on public.trabajos for all using (public.es_admin()) with check (public.es_admin());

-- ==========================================================================
-- 4) TRABAJO_IMAGENES — fotos de cada trabajo (Supabase Storage)
--    tipo: portada | antes | despues | galeria
-- ==========================================================================
create type public.tipo_imagen as enum ('portada', 'antes', 'despues', 'galeria');

create table if not exists public.trabajo_imagenes (
  id         uuid primary key default gen_random_uuid(),
  trabajo_id uuid not null references public.trabajos(id) on delete cascade,
  url        text not null,             -- path/URL en Storage
  tipo       public.tipo_imagen not null default 'galeria',
  alt        text,
  orden      int not null default 0
);
create index if not exists ix_trabajo_imagenes_trabajo on public.trabajo_imagenes(trabajo_id);

alter table public.trabajo_imagenes enable row level security;

create policy "trabajo_imagenes_lectura_publica"
  on public.trabajo_imagenes for select using (true);
create policy "trabajo_imagenes_admin_escribe"
  on public.trabajo_imagenes for all using (public.es_admin()) with check (public.es_admin());

-- ==========================================================================
-- 5) TRABAJO_CATEGORIAS — tags N a N (un trabajo puede tener varios espacios,
--    estilos, etc.)
-- ==========================================================================
create table if not exists public.trabajo_categorias (
  trabajo_id   uuid not null references public.trabajos(id)   on delete cascade,
  categoria_id uuid not null references public.categorias(id) on delete cascade,
  primary key (trabajo_id, categoria_id)
);

alter table public.trabajo_categorias enable row level security;

create policy "trabajo_categorias_lectura_publica"
  on public.trabajo_categorias for select using (true);
create policy "trabajo_categorias_admin_escribe"
  on public.trabajo_categorias for all using (public.es_admin()) with check (public.es_admin());

-- ==========================================================================
-- 6) RECOMENDACIONES — reglas del recomendador interactivo.
--    El visitante elige espacio + estilo + preferencia de luz y devolvemos
--    el/los tipo(s) de trabajo sugeridos con un texto editorial.
--    Los ejes de entrada son NULLABLE: NULL = "aplica a cualquiera" (comodín),
--    lo que permite reglas amplias o muy específicas.
-- ==========================================================================
create table if not exists public.recomendaciones (
  id              uuid primary key default gen_random_uuid(),
  espacio_id      uuid references public.categorias(id) on delete cascade,
  estilo_id       uuid references public.categorias(id) on delete cascade,
  preferencia_id  uuid references public.categorias(id) on delete cascade,
  tipo_trabajo_id uuid not null references public.categorias(id) on delete cascade,
  titulo          text,
  texto           text,
  orden           int not null default 0,
  activo          boolean not null default true
);
create index if not exists ix_recomendaciones_ejes
  on public.recomendaciones(espacio_id, estilo_id, preferencia_id);

alter table public.recomendaciones enable row level security;

create policy "recomendaciones_lectura_publica"
  on public.recomendaciones for select using (activo);
create policy "recomendaciones_admin_lee_todo"
  on public.recomendaciones for select using (public.es_admin());
create policy "recomendaciones_admin_escribe"
  on public.recomendaciones for all using (public.es_admin()) with check (public.es_admin());

-- ==========================================================================
-- Fila de config inicial
-- ==========================================================================
insert into public.config (id, nombre_empresa, claim)
values (1, 'Najul', 'Cortinas y diseño a medida para tu hogar')
on conflict (id) do nothing;
