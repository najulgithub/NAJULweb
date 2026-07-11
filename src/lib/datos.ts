import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Categoria, Config, EjeCategoria, Trabajo, CarruselItem } from "./types";

// Cliente de lectura para Server Components (anon key; RLS deja leer lo publicado).
function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// -------------------- mappers (DB snake_case -> app camelCase) --------------------

function configDe(r: Record<string, unknown> | null): Config {
  return {
    nombreEmpresa: (r?.nombre_empresa as string) ?? "Najul",
    claim: (r?.claim as string) ?? null,
    descripcion: (r?.descripcion as string) ?? null,
    whatsapp: (r?.whatsapp as string) ?? null,
    whatsappMensaje: (r?.whatsapp_mensaje as string) ?? null,
    email: (r?.email as string) ?? null,
    direccion: (r?.direccion as string) ?? null,
    horarios: (r?.horarios as string) ?? null,
    instagram: (r?.instagram as string) ?? null,
    facebook: (r?.facebook as string) ?? null,
    logoUrl: (r?.logo_url as string) ?? null,
    heroImagenUrl: (r?.hero_imagen_url as string) ?? null,
  };
}

function categoriaDe(r: Record<string, unknown>): Categoria {
  return {
    id: r.id as string,
    eje: r.eje as EjeCategoria,
    nombre: r.nombre as string,
    slug: r.slug as string,
    descripcion: (r.descripcion as string) ?? null,
    icono: (r.icono as string) ?? null,
    orden: (r.orden as number) ?? 0,
  };
}

// -------------------- lecturas (memoizadas por request) --------------------

export const getConfig = cache(async (): Promise<Config> => {
  const { data } = await sb().from("config").select("*").eq("id", 1).maybeSingle();
  return configDe(data);
});

export const getCategorias = cache(async (eje?: EjeCategoria): Promise<Categoria[]> => {
  let q = sb().from("categorias").select("*").eq("activo", true).order("orden");
  if (eje) q = q.eq("eje", eje);
  const { data } = await q;
  return (data ?? []).map(categoriaDe);
});

export const getCarrusel = cache(async (): Promise<CarruselItem[]> => {
  const { data } = await sb()
    .from("carrusel_items")
    .select("id, tipo, url, titulo, orden")
    .eq("activo", true)
    .order("orden");
  return (data ?? []) as CarruselItem[];
});

export const getTrabajos = cache(async (): Promise<Trabajo[]> => {
  const { data } = await sb()
    .from("trabajos")
    .select("*, trabajo_imagenes(*), trabajo_categorias(categoria_id)")
    .eq("activo", true)
    .order("orden");

  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    titulo: r.titulo as string,
    slug: r.slug as string,
    resumen: (r.resumen as string) ?? null,
    descripcion: (r.descripcion as string) ?? null,
    ubicacion: (r.ubicacion as string) ?? null,
    destacado: (r.destacado as boolean) ?? false,
    orden: (r.orden as number) ?? 0,
    imagenes: ((r.trabajo_imagenes as Record<string, unknown>[]) ?? [])
      .map((i) => ({
        id: i.id as string,
        url: i.url as string,
        tipo: (i.tipo as Trabajo["imagenes"][number]["tipo"]) ?? "galeria",
        alt: (i.alt as string) ?? null,
        orden: (i.orden as number) ?? 0,
      }))
      .sort((a, b) => a.orden - b.orden),
    categoriaIds: ((r.trabajo_categorias as Record<string, unknown>[]) ?? []).map(
      (t) => t.categoria_id as string,
    ),
  }));
});
