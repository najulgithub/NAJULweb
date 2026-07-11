"use client";

import { supabase } from "./supabase";

// Sube una imagen vía el route handler server-side (service_role).
export async function subirImagen(file: File): Promise<{ url: string; path: string }> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sesión expirada");

  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/subir", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error al subir");
  return json;
}

// Borra una imagen del Storage a partir de su URL pública.
export async function borrarImagenPorUrl(url: string): Promise<void> {
  const marca = "/object/public/trabajos/";
  const i = url.indexOf(marca);
  if (i === -1) return; // no es una URL de nuestro bucket
  const path = url.slice(i + marca.length);
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return;
  await fetch("/api/admin/subir", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
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
