"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { subirImagen, borrarImagenPorUrl } from "@/lib/admin";

type Clave =
  | "nombre_empresa"
  | "claim"
  | "descripcion"
  | "whatsapp"
  | "whatsapp_mensaje"
  | "email"
  | "direccion"
  | "horarios"
  | "instagram"
  | "facebook"
  | "hero_eyebrow"
  | "hero_titulo"
  | "hero_destacado"
  | "carrusel_titulo"
  | "servicios_titulo"
  | "recomendador_titulo"
  | "recomendador_texto"
  | "nosotros_titulo"
  | "nosotros_texto"
  | "cta_titulo"
  | "cta_texto";

type Campos = Record<Clave, string>;

const CLAVES: Clave[] = [
  "nombre_empresa", "claim", "descripcion", "whatsapp", "whatsapp_mensaje",
  "email", "direccion", "horarios", "instagram", "facebook",
  "hero_eyebrow", "hero_titulo", "hero_destacado", "carrusel_titulo",
  "servicios_titulo", "recomendador_titulo", "recomendador_texto",
  "nosotros_titulo", "nosotros_texto", "cta_titulo", "cta_texto",
];

const VACIO = Object.fromEntries(CLAVES.map((k) => [k, ""])) as Campos;

const LABELS: Record<Clave, string> = {
  nombre_empresa: "Nombre de la empresa",
  claim: "Frase corta (SEO / footer)",
  descripcion: "Hero — bajada (subtítulo)",
  whatsapp: "WhatsApp (solo números, ej: 5492266670991)",
  whatsapp_mensaje: "Mensaje prellenado de WhatsApp",
  email: "Email",
  direccion: "Dirección",
  horarios: "Horarios",
  instagram: "Instagram (URL)",
  facebook: "Facebook (URL)",
  hero_eyebrow: "Hero — rótulo superior",
  hero_titulo: "Hero — título (línea 1)",
  hero_destacado: "Hero — palabra destacada (dorado)",
  carrusel_titulo: "Carrusel — título",
  servicios_titulo: "Servicios — título",
  recomendador_titulo: "Recomendador — título",
  recomendador_texto: "Recomendador — texto",
  nosotros_titulo: "Nosotros — título",
  nosotros_texto: "Nosotros — texto (usá renglones para separar párrafos)",
  cta_titulo: "Cierre — título",
  cta_texto: "Cierre — texto",
};

const LARGOS: Clave[] = [
  "descripcion", "whatsapp_mensaje", "recomendador_texto", "nosotros_texto", "cta_texto",
];

const GRUPOS: { titulo: string; claves: Clave[] }[] = [
  { titulo: "Marca", claves: ["nombre_empresa", "claim"] },
  {
    titulo: "Contacto",
    claves: ["whatsapp", "whatsapp_mensaje", "email", "direccion", "horarios", "instagram", "facebook"],
  },
  {
    titulo: "Inicio — Hero",
    claves: ["hero_eyebrow", "hero_titulo", "hero_destacado", "descripcion"],
  },
  {
    titulo: "Inicio — Secciones",
    claves: [
      "carrusel_titulo", "servicios_titulo", "recomendador_titulo",
      "recomendador_texto", "nosotros_titulo", "nosotros_texto", "cta_titulo", "cta_texto",
    ],
  },
];

export default function ConfigPage() {
  const [campos, setCampos] = useState<Campos>(VACIO);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("config")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const c = { ...VACIO };
          for (const k of CLAVES) c[k] = (data[k] as string) ?? "";
          setCampos(c);
          setLogoUrl((data.logo_url as string) ?? "");
        }
        setCargando(false);
      });
  }, []);

  function set(k: Clave, v: string) {
    setCampos((c) => ({ ...c, [k]: v }));
  }

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setSubiendo(true);
    try {
      const anterior = logoUrl;
      const { url } = await subirImagen(file);
      setLogoUrl(url);
      if (anterior) await borrarImagenPorUrl(anterior);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setSubiendo(false);
    }
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMsg(null);
    const { error } = await supabase
      .from("config")
      .update({ ...campos, logo_url: logoUrl || null, actualizado_en: new Date().toISOString() })
      .eq("id", 1);
    setGuardando(false);
    setMsg(error ? `Error: ${error.message}` : "Guardado ✓");
  }

  function campo(k: Clave) {
    return (
      <div key={k}>
        <label className="text-sm text-ink-soft">{LABELS[k]}</label>
        {LARGOS.includes(k) ? (
          <textarea
            value={campos[k]}
            onChange={(e) => set(k, e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-verde"
          />
        ) : (
          <input
            value={campos[k]}
            onChange={(e) => set(k, e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-verde"
          />
        )}
      </div>
    );
  }

  if (cargando) return <p className="text-muted">Cargando…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink">Configuración</h1>
      <p className="mt-1 text-muted">
        Logo, contacto y todos los textos del inicio. Si un texto queda vacío, se
        muestra el valor por defecto.
      </p>

      <form onSubmit={guardar} className="mt-8 space-y-10">
        {/* Logo */}
        <div>
          <h2 className="font-display text-xl text-ink">Logo</h2>
          <div className="mt-3 flex items-center gap-4 rounded-xl border border-line bg-paper p-4">
            <div className="flex h-16 w-40 items-center justify-center overflow-hidden rounded-lg bg-bone">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs text-muted">Sin logo</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-verde/40">
                {subiendo ? "Subiendo…" : logoUrl ? "Cambiar logo" : "Subir logo"}
                <input
                  type="file"
                  accept="image/png,image/svg+xml,image/webp,image/jpeg"
                  onChange={onLogo}
                  disabled={subiendo}
                  className="hidden"
                />
              </label>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="text-left text-sm text-muted hover:text-verde-dark"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>
        </div>

        {GRUPOS.map((g) => (
          <div key={g.titulo}>
            <h2 className="font-display text-xl text-ink">{g.titulo}</h2>
            <div className="mt-4 space-y-5">{g.claves.map(campo)}</div>
          </div>
        ))}

        <div className="sticky bottom-0 -mx-1 flex items-center gap-4 border-t border-line bg-bone/90 px-1 py-4 backdrop-blur">
          <button
            type="submit"
            disabled={guardando || subiendo}
            className="rounded-full bg-verde px-7 py-2.5 text-sm font-medium text-white hover:bg-verde-dark disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
          {msg && <span className="text-sm text-ink-soft">{msg}</span>}
        </div>
      </form>
    </div>
  );
}
