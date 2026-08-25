"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { subirImagen, borrarImagenPorUrl } from "@/lib/admin";
import { embedInstagram } from "@/lib/instagram";
import BotonDrive from "@/components/BotonDrive";
import type { CarruselItem, Categoria } from "@/lib/types";

// El admin trabaja con las filas crudas de la DB (snake_case), como el resto del panel.
type Item = Omit<CarruselItem, "categoriaId"> & {
  activo: boolean;
  categoria_id: string | null;
};

export default function CarruselAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [cats, setCats] = useState<Categoria[]>([]);
  // Categoría que se le aplica a todo lo que se suba ahora ("" = sin clasificar).
  const [catNueva, setCatNueva] = useState("");
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [reelUrl, setReelUrl] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const [{ data }, { data: cs }] = await Promise.all([
      supabase
        .from("carrusel_items")
        .select("id, tipo, url, titulo, orden, activo, categoria_id")
        .order("orden"),
      supabase
        .from("categorias")
        .select("id, eje, nombre, slug, orden")
        .eq("eje", "tipo_trabajo")
        .eq("activo", true)
        .order("orden"),
    ]);
    setItems((data as Item[]) ?? []);
    setCats((cs as Categoria[]) ?? []);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function subirLista(files: File[], tipoForzado?: "foto" | "video") {
    if (!files.length) return;
    setSubiendo(true);
    try {
      let orden = items.length;
      for (const f of files) {
        const tipo = tipoForzado ?? (f.type.startsWith("video") ? "video" : "foto");
        const { url } = await subirImagen(f);
        await supabase
          .from("carrusel_items")
          .insert({ tipo, url, orden: orden++, categoria_id: catNueva || null });
      }
      await cargar();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setSubiendo(false);
    }
  }

  async function subirArchivos(
    e: React.ChangeEvent<HTMLInputElement>,
    tipo: "foto" | "video",
  ) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    await subirLista(files, tipo);
  }

  async function agregarReel() {
    setMsg(null);
    if (!embedInstagram(reelUrl)) {
      setMsg("Esa URL no parece un reel/post de Instagram.");
      return;
    }
    const { error } = await supabase
      .from("carrusel_items")
      .insert({
        tipo: "reel",
        url: reelUrl.trim(),
        orden: items.length,
        categoria_id: catNueva || null,
      });
    if (error) setMsg(`Error: ${error.message}`);
    else {
      setReelUrl("");
      cargar();
    }
  }

  async function toggleActivo(it: CarruselItem, activo: boolean) {
    await supabase.from("carrusel_items").update({ activo }).eq("id", it.id);
    cargar();
  }

  async function guardarTitulo(it: CarruselItem, titulo: string) {
    await supabase.from("carrusel_items").update({ titulo: titulo || null }).eq("id", it.id);
  }

  async function guardarCategoria(it: Item, categoriaId: string) {
    const categoria_id = categoriaId || null;
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, categoria_id } : x)));
    await supabase.from("carrusel_items").update({ categoria_id }).eq("id", it.id);
  }

  async function mover(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    setItems(arr);
    await Promise.all(
      arr.map((it, i) => supabase.from("carrusel_items").update({ orden: i }).eq("id", it.id)),
    );
  }

  async function eliminar(it: CarruselItem) {
    if (!confirm("¿Eliminar este elemento del carrusel?")) return;
    if (it.tipo === "foto") await borrarImagenPorUrl(it.url);
    await supabase.from("carrusel_items").delete().eq("id", it.id);
    cargar();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Carrusel</h1>
      <p className="mt-1 text-muted">
        Fotos y reels de Instagram que se muestran en el carrusel del inicio.
      </p>

      {/* Agregar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-paper p-4">
        <label className="flex w-full flex-wrap items-center gap-2 border-b border-line pb-3 text-sm text-ink-soft">
          <span className="shrink-0">Tipo de trabajo de lo que subas:</span>
          <select
            value={catNueva}
            onChange={(e) => setCatNueva(e.target.value)}
            className="rounded-lg border border-line bg-bone px-2 py-1.5 text-sm text-ink outline-none focus:border-verde"
          >
            <option value="">Sin clasificar</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted">
            Se le aplica a cada foto, video o reel que agregues; después se puede cambiar por
            elemento.
          </span>
        </label>
        <label className="cursor-pointer rounded-full bg-verde px-5 py-2.5 text-sm font-medium text-white hover:bg-verde-dark">
          {subiendo ? "Subiendo…" : "+ Foto(s)"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => subirArchivos(e, "foto")}
            disabled={subiendo}
            className="hidden"
          />
        </label>
        <label className="cursor-pointer rounded-full bg-verde px-5 py-2.5 text-sm font-medium text-white hover:bg-verde-dark">
          {subiendo ? "Subiendo…" : "+ Video(s)"}
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => subirArchivos(e, "video")}
            disabled={subiendo}
            className="hidden"
          />
        </label>
        <BotonDrive onFiles={(files) => subirLista(files)} />
        <span className="text-sm text-muted">o</span>
        <input
          value={reelUrl}
          onChange={(e) => setReelUrl(e.target.value)}
          placeholder="Pegá la URL de un reel de Instagram"
          className="min-w-0 flex-1 rounded-lg border border-line bg-bone px-3 py-2.5 text-sm text-ink outline-none focus:border-verde"
        />
        <button
          type="button"
          onClick={agregarReel}
          className="rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft hover:border-verde/40"
        >
          Agregar reel
        </button>
      </div>
      {msg && <p className="mt-2 text-sm text-verde-dark">{msg}</p>}

      {/* Lista */}
      {cargando ? (
        <p className="mt-8 text-muted">Cargando…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
          <p className="font-display text-xl text-ink">El carrusel está vacío</p>
          <p className="mt-1 text-muted">Subí una foto o agregá un reel para empezar.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((it, idx) => (
            <li
              key={it.id}
              className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-3"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bone">
                {it.tipo === "foto" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.url} alt="" className="h-full w-full object-cover" />
                ) : it.tipo === "video" ? (
                  <video src={it.url} muted className="h-full w-full object-cover" preload="metadata" />
                ) : (
                  <span className="text-center text-xs font-medium text-verde">
                    ▶ Reel
                    <br />
                    IG
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-bone px-2 py-0.5 text-xs uppercase tracking-wide text-muted">
                  {it.tipo}
                </span>
                {it.tipo === "reel" && (
                  <p className="mt-1 truncate text-xs text-muted">{it.url}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    defaultValue={it.titulo ?? ""}
                    onBlur={(e) => guardarTitulo(it, e.target.value)}
                    placeholder="Epígrafe (opcional)"
                    className="w-full max-w-sm rounded-lg border border-line bg-bone px-2 py-1.5 text-sm text-ink outline-none focus:border-verde"
                  />
                  <select
                    value={it.categoria_id ?? ""}
                    onChange={(e) => guardarCategoria(it, e.target.value)}
                    title="Tipo de trabajo"
                    className={`rounded-lg border bg-bone px-2 py-1.5 text-sm outline-none focus:border-verde ${
                      it.categoria_id ? "border-line text-ink" : "border-dashed border-line text-muted"
                    }`}
                  >
                    <option value="">Sin clasificar</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => mover(idx, -1)}
                  disabled={idx === 0}
                  className="rounded-lg px-2 py-1 text-ink-soft hover:bg-bone disabled:opacity-30"
                  aria-label="Subir"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => mover(idx, 1)}
                  disabled={idx === items.length - 1}
                  className="rounded-lg px-2 py-1 text-ink-soft hover:bg-bone disabled:opacity-30"
                  aria-label="Bajar"
                >
                  ↓
                </button>
              </div>

              <label className="flex items-center gap-1.5 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  defaultChecked={it.activo}
                  onChange={(e) => toggleActivo(it, e.target.checked)}
                />
                Visible
              </label>

              <button
                type="button"
                onClick={() => eliminar(it)}
                className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-verde-dark"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
