-- ==========================================================================
-- NAJULweb — Seed de categorías iniciales (los 4 ejes).
-- Correr DESPUÉS de migracion-001. Idempotente (on conflict do nothing).
-- Todo esto es editable después desde el panel de admin.
-- ==========================================================================

insert into public.categorias (eje, nombre, slug, orden) values
  -- Espacios ---------------------------------------------------------------
  ('espacio', 'Living',            'living',            1),
  ('espacio', 'Dormitorio',        'dormitorio',        2),
  ('espacio', 'Comedor',           'comedor',           3),
  ('espacio', 'Cocina',            'cocina',            4),
  ('espacio', 'Oficina / Estudio', 'oficina',           5),
  ('espacio', 'Baño',              'bano',              6),
  ('espacio', 'Exterior / Galería','exterior',          7),

  -- Tipos de trabajo -------------------------------------------------------
  ('tipo_trabajo', 'Roller',                'roller',        1),
  ('tipo_trabajo', 'Blackout',              'blackout',      2),
  ('tipo_trabajo', 'Bandas verticales',     'bandas',        3),
  ('tipo_trabajo', 'Cortinados clásicos',   'cortinados',    4),
  ('tipo_trabajo', 'Paneles japoneses',     'paneles',       5),
  ('tipo_trabajo', 'Cortinas romanas',      'romanas',       6),
  ('tipo_trabajo', 'Otros trabajos',        'otros',         7),

  -- Estilos ----------------------------------------------------------------
  ('estilo', 'Minimalista',       'minimalista',   1),
  ('estilo', 'Moderno',           'moderno',       2),
  ('estilo', 'Clásico',           'clasico',       3),
  ('estilo', 'Rústico / Bohemio', 'rustico',       4),
  ('estilo', 'Industrial',        'industrial',    5),

  -- Preferencia de luz -----------------------------------------------------
  ('preferencia_luz', 'Bloqueo total (blackout)', 'bloqueo',   1),
  ('preferencia_luz', 'Filtrado de luz',          'filtrado',  2),
  ('preferencia_luz', 'Screen (visión + sol)',    'screen',    3),
  ('preferencia_luz', 'Privacidad',               'privacidad',4)
on conflict (eje, slug) do nothing;
