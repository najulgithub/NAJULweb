"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { subirImagen, borrarImagenPorUrl, aSlug } from "@/lib/admin";
import { ETIQUETA_EJE, type EjeCategoria } from "@/lib/types";

type Cat = { id: string; eje: EjeCategoria; nombre: string };
type Img = { url: string; tipo: string; alt: string };

const TIPOS_IMG = ["portada", "antes", "despues", "galeria"];
const EJES: EjeCategoria[] = ["tipo_trabajo", "espacio", "estilo", "preferencia_luz"];

export default function EditorTrabajo() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const esNuevo = params.id === "nuevo";

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTocado, setSlugTocado] = useState(false);
  const [resumen, setResumen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [destacado, setDestacado] = useState(false);
  const [activo, setActivo] = useState(true);
  const [orden, setOrden] = useState(0);

  const [cats, setCats] = useState<Cat[]>([]);
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [imagenes, setImagenes] = useState<Img[]>([]);

  useEffect(() => {
    async function cargar() {
      const { data: catData } = await supabase
        .from("categorias")
        .select("id, eje, nombre")
        .eq("activo", true)
        .order("orden");
      setCats((catData as Cat[]) ?? []);

      if (!esNuevo) {
        const { data } = await supabase
          .from("trabajos")
          .select("*, trabajo_imagenes(url, tipo, alt, orden), trabajo_categorias(categoria_id)")
          .eq("id", params.id)
          .maybeSingle();
        if (data) {
          setTitulo(data.titulo ?? "");
          setSlug(data.slug ?? "");
          setSlugTocado(true);
          setResumen(data.resumen ?? "");
          setDescripcion(data.descripcion ?? "");
          setUbicacion(data.ubicacion ?? "");
          setDestacado(!!data.destacado);
          setActivo(!!data.activo);
          setOrden(data.orden ?? 0);
          setSeleccion(
            new Set(
              (data.trabajo_categorias ?? []).map(
                (t: { categoria_id: string }) => t.categoria_id,
              ),
            ),
          );
          setImagenes(
            ((data.trabajo_imagenes ?? []) as Img[])
              .slice()
              .sort((a, b) => (a as never as { orden: number }).orden - (b as never as { orden: number }).orden)
              .map((i) => ({ url: i.url, tipo: i.tipo ?? "galeria", alt: i.alt ?? "" })),
          );
        }
      }
      setCargando(false);
    }
    cargar();
  }, [esNuevo, params.id]);

  const slugFinal = useMemo(
    () => (slugTocado && slug ? aSlug(slug) : aSlug(titulo)),
    [slug, slugTocado, titulo],
  );

  const porEje = useMemo(() => {
    const m: Record<string, Cat[]> = {};
    for (const c of cats) (m[c.eje] ||= []).push(c);
    return m;
  }, [cats]);

  function toggle(id: string) {
    setSeleccion((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function onArchivos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setSubiendo(true);
    try {
      for (const f of files) {
        const { url } = await subirImagen(f);
        setImagenes((prev) => [
          ...prev,
          { url, tipo: prev.length === 0 ? "portada" : "galeria", alt: "" },
        ]);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setSubiendo(false);
    }
  }

  async function quitarImagen(idx: number) {
    const img = imagenes[idx];
    setImagenes((prev) => prev.filter((_, i) => i !== idx));
    await borrarImagenPorUrl(img.url);
  }

  function setImg(idx: number, campo: keyof Img, valor: string) {
    setImagenes((prev) =>
      prev.map((im, i) => (i === idx ? { ...im, [campo]: valor } : im)),
    );
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) {
      setMsg("Poné un título.");
      return;
    }
    setGuardando(true);
    setMsg(null);

    const fila = {
      titulo: titulo.trim(),
      slug: slugFinal,
      resumen: resumen || null,
      descripcion: descripcion || null,
      ubicacion: ubicacion || null,
      destacado,
      activo,
      orden,
    };

    let trabajoId = esNuevo ? null : params.id;

    if (esNuevo) {
      const { data, error } = await supabase
        .from("trabajos")
        .insert(fila)
        .select("id")
        .single();
      if (error) return fin(`Error: ${error.message}`);
      trabajoId = data.id;
    } else {
      const { error } = await supabase.from("trabajos").update(fila).eq("id", trabajoId!);
      if (error) return fin(`Error: ${error.message}`);
    }

    // Sincronizar tags (borrar todo + reinsertar selección)
    await supabase.from("trabajo_categorias").delete().eq("trabajo_id", trabajoId!);
    if (seleccion.size) {
      await supabase.from("trabajo_categorias").insert(
        [...seleccion].map((categoria_id) => ({ trabajo_id: trabajoId!, categoria_id })),
      );
    }

    // Sincronizar imágenes (borrar filas + reinsertar en orden actual)
    await supabase.from("trabajo_imagenes").delete().eq("trabajo_id", trabajoId!);
    if (imagenes.length) {
      await supabase.from("trabajo_imagenes").insert(
        imagenes.map((im, i) => ({
          trabajo_id: trabajoId!,
          url: im.url,
          tipo: im.tipo,
          alt: im.alt || null,
          orden: i,
        })),
      );
    }

    setGuardando(false);
    router.push("/admin/trabajos");
    router.refresh();

    function fin(m: string) {
      setGuardando(false);
      setMsg(m);
    }
  }

  if (cargando) return <p className="text-muted">Cargando…</p>;

  return (
    <form onSubmit={guardar} className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {esNuevo ? "Nuevo trabajo" : "Editar trabajo"}
        </h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-muted hover:text-ink"
        >
          ← Volver
        </button>
      </div>

      {/* Datos */}
      <div className="mt-8 space-y-5">
        <Campo label="Título">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input"
          />
        </Campo>
        <Campo label="Slug (URL)">
          <input
            value={slugTocado ? slug : slugFinal}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTocado(true);
            }}
            className="input"
          />
        </Campo>
        <Campo label="Resumen (tarjeta)">
          <input value={resumen} onChange={(e) => setResumen(e.target.value)} className="input" />
        </Campo>
        <Campo label="Descripción">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            className="input"
          />
        </Campo>
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Ubicación">
            <input value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} className="input" />
          </Campo>
          <Campo label="Orden">
            <input
              type="number"
              value={orden}
              onChange={(e) => setOrden(Number(e.target.value))}
              className="input"
            />
          </Campo>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
            Destacado
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            Publicado
          </label>
        </div>
      </div>

      {/* Categorías */}
      <div className="mt-10">
        <h2 className="font-display text-xl text-ink">Categorías</h2>
        <div className="mt-4 space-y-5">
          {EJES.map((eje) => (
            <div key={eje}>
              <p className="text-xs uppercase tracking-wide text-verde">{ETIQUETA_EJE[eje]}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(porEje[eje] ?? []).map((c) => {
                  const on = seleccion.has(c.id);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggle(c.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        on
                          ? "border-verde bg-verde text-white"
                          : "border-line text-ink-soft hover:border-verde/40"
                      }`}
                    >
                      {c.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imágenes */}
      <div className="mt-10">
        <h2 className="font-display text-xl text-ink">Imágenes</h2>
        <label className="mt-3 inline-block cursor-pointer rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft hover:border-verde/40">
          {subiendo ? "Subiendo…" : "+ Agregar fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onArchivos}
            disabled={subiendo}
            className="hidden"
          />
        </label>

        {imagenes.length > 0 && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {imagenes.map((im, i) => (
              <div key={im.url} className="rounded-2xl border border-line bg-paper p-3">
                <div className="aspect-video overflow-hidden rounded-lg bg-bone">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.url} alt={im.alt} className="h-full w-full object-cover" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <select
                    value={im.tipo}
                    onChange={(e) => setImg(i, "tipo", e.target.value)}
                    className="flex-1 rounded-lg border border-line bg-bone px-2 py-1.5 text-sm text-ink"
                  >
                    {TIPOS_IMG.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => quitarImagen(i)}
                    className="rounded-lg px-3 py-1.5 text-sm text-muted hover:text-verde-dark"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guardar */}
      <div className="mt-10 flex items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={guardando || subiendo}
          className="rounded-full bg-verde px-7 py-2.5 text-sm font-medium text-white hover:bg-verde-dark disabled:opacity-60"
        >
          {guardando ? "Guardando…" : "Guardar trabajo"}
        </button>
        {msg && <span className="text-sm text-verde-dark">{msg}</span>}
      </div>
    </form>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-ink-soft">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
