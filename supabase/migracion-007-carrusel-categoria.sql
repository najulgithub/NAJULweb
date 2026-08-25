-- ==========================================================================
-- NAJULweb — Migración 007: categoría (tipo de trabajo) en las fotos del carrusel
-- Correr en Supabase → SQL Editor.
--
-- PARTE 1 es la que hace falta para que funcione el selector del admin.
-- PARTE 2 es opcional: pre-clasifica las fotos que ya están cargadas.
-- ==========================================================================

-- -------------------------------------------------------------------------
-- PARTE 1 — la columna
-- -------------------------------------------------------------------------
alter table public.carrusel_items
  add column if not exists categoria_id uuid references public.categorias(id) on delete set null;

create index if not exists ix_carrusel_categoria on public.carrusel_items(categoria_id);

comment on column public.carrusel_items.categoria_id is
  'Tipo de trabajo al que pertenece la foto (categorias con eje = tipo_trabajo). NULL = sin clasificar.';

-- -------------------------------------------------------------------------
-- PARTE 2 (OPCIONAL) — pre-clasificar lo ya cargado a partir del epígrafe
--
-- No inventa nada: se apoya en lo que dicen los títulos que cargó Najul
-- ("Sistema Roller…", "Bandas Verticales…", "Cortinas con vuelo…").
-- Solo toca filas sin categoría; las que no matchean quedan en NULL para
-- clasificar a mano desde /admin/carrusel.
-- Para deshacerlo:  update public.carrusel_items set categoria_id = null;
-- -------------------------------------------------------------------------
update public.carrusel_items ci
set categoria_id = c.id
from public.categorias c
where ci.categoria_id is null
  and c.eje = 'tipo_trabajo'
  and c.slug = case
        when ci.titulo ilike '%roller%'                             then 'roller'
        when ci.titulo ilike '%banda%'                              then 'bandas'
        when ci.titulo ilike '%romana%'                             then 'romanas'
        when ci.titulo ilike '%panel%'                              then 'paneles'
        when ci.titulo ilike '%vuelo%'
          or ci.titulo ilike '%riel%'
          or ci.titulo ilike '%barral%'                             then 'cortinados'
        else null
      end;

-- Control: cuántas quedaron en cada categoría y cuántas sin clasificar.
select coalesce(c.nombre, '(sin clasificar)') as categoria, count(*) as fotos
from public.carrusel_items ci
left join public.categorias c on c.id = ci.categoria_id
group by c.nombre
order by fotos desc;
