-- ==========================================================================
-- NAJULweb — Migración 004: políticas de Storage del bucket 'trabajos'
-- Correr en Supabase → SQL Editor.
--
-- Habilita subida DIRECTA desde el navegador (admin autenticado) para poder
-- subir archivos grandes (videos) sin pasar por la función serverless de
-- Vercel (que tiene límite de ~4.5 MB). Lectura pública; escritura solo
-- autenticados (= admin Najul).
-- ==========================================================================

insert into storage.buckets (id, name, public)
values ('trabajos', 'trabajos', true)
on conflict (id) do update set public = true;

drop policy if exists "trabajos_lectura_publica" on storage.objects;
create policy "trabajos_lectura_publica"
  on storage.objects for select
  using (bucket_id = 'trabajos');

drop policy if exists "trabajos_admin_insert" on storage.objects;
create policy "trabajos_admin_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'trabajos');

drop policy if exists "trabajos_admin_update" on storage.objects;
create policy "trabajos_admin_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'trabajos') with check (bucket_id = 'trabajos');

drop policy if exists "trabajos_admin_delete" on storage.objects;
create policy "trabajos_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'trabajos');
