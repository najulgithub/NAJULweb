"use client";

import { supabase } from "./supabase";

const BUCKET = "trabajos";

// Sube un archivo (imagen o video) directo a Supabase Storage desde el navegador.
// Directo (no vía route handler) para no chocar con el límite de tamaño de la
// función serverless de Vercel — necesario para videos. La escritura la habilita
// la policy de Storage para usuarios autenticados (ver migracion-004).
export async function subirImagen(file: File): Promise<{ url: string; path: string }> {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `carrusel/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

// Borra un archivo del Storage a partir de su URL pública.
export async function borrarImagenPorUrl(url: string): Promise<void> {
  const marca = `/object/public/${BUCKET}/`;
  const i = url.indexOf(marca);
  if (i === -1) return;
  const path = url.slice(i + marca.length).split("?")[0];
  await supabase.storage.from(BUCKET).remove([path]);
}

// Slug simple a partir de un texto.
export function aSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
