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

// Texto de la DB, normalizado: recorta y devuelve null si quedó vacío. Es clave,
// porque el admin guarda "" cuando se borra un campo y las páginas resuelven los
// textos con `?? default` — un "" pasaría el ?? y dejaría el título en blanco.
function txt(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : null;
  return s ? s : null;
}

function configDe(r: Record<string, unknown> | null): Config {
  return {
    nombreEmpresa: txt(r?.nombre_empresa) ?? "Najul",
    claim: txt(r?.claim),
    descripcion: txt(r?.descripcion),
    whatsapp: txt(r?.whatsapp),
    whatsappMensaje: txt(r?.whatsapp_mensaje),
    email: txt(r?.email),
    direccion: txt(r?.direccion),
    horarios: txt(r?.horarios),
    instagram: txt(r?.instagram),
    facebook: txt(r?.facebook),
    logoUrl: txt(r?.logo_url),
    heroImagenUrl: txt(r?.hero_imagen_url),
    heroEyebrow: txt(r?.hero_eyebrow),
    heroTitulo: txt(r?.hero_titulo),
    heroDestacado: txt(r?.hero_destacado),
    carruselTitulo: txt(r?.carrusel_titulo),
    serviciosTitulo: txt(r?.servicios_titulo),
    serviciosEyebrow: txt(r?.servicios_eyebrow),
    serviciosLink: txt(r?.servicios_link),
    serviciosVer: txt(r?.servicios_ver),
    recomendadorTitulo: txt(r?.recomendador_titulo),
    recomendadorTexto: txt(r?.recomendador_texto),
    nosotrosTitulo: txt(r?.nosotros_titulo),
    nosotrosTexto: txt(r?.nosotros_texto),
    ctaTitulo: txt(r?.cta_titulo),
    ctaTexto: txt(r?.cta_texto),
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
    .select("id, tipo, url, titulo, orden, categoria_id")
    .eq("activo", true)
    .order("orden");
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    tipo: r.tipo as CarruselItem["tipo"],
    url: r.url as string,
    titulo: txt(r.titulo),
    orden: (r.orden as number) ?? 0,
    categoriaId: (r.categoria_id as string) ?? null,
  }));
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
