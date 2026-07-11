"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { subirImagen, borrarImagenPorUrl } from "@/lib/admin";
import { embedInstagram } from "@/lib/instagram";
import type { CarruselItem } from "@/lib/types";

type Item = CarruselItem & { activo: boolean };

export default function CarruselAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [reelUrl, setReelUrl] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const { data } = await supabase
      .from("carrusel_items")
      .select("id, tipo, url, titulo, orden, activo")
      .order("orden");
    setItems((data as Item[]) ?? []);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function agregarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setSubiendo(true);
    try {
      let orden = items.length;
      for (const f of files) {
        const { url } = await subirImagen(f);
        await supabase.from("carrusel_items").insert({ tipo: "foto", url, orden: orden++ });
      }
      await cargar();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setSubiendo(false);
    }
  }

  async function agregarReel() {
    setMsg(null);
    if (!embedInstagram(reelUrl)) {
      setMsg("Esa URL no parece un reel/post de Instagram.");
      return;
    }
    const { error } = await supabase
      .from("carrusel_items")
      .insert({ tipo: "reel", url: reelUrl.trim(), orden: items.length });
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
        <label className="cursor-pointer rounded-full bg-verde px-5 py-2.5 text-sm font-medium text-white hover:bg-verde-dark">
          {subiendo ? "Subiendo…" : "+ Subir foto(s)"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={agregarFoto}
            disabled={subiendo}
            className="hidden"
          />
        </label>
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
                <input
                  defaultValue={it.titulo ?? ""}
                  onBlur={(e) => guardarTitulo(it, e.target.value)}
                  placeholder="Epígrafe (opcional)"
                  className="mt-2 w-full max-w-sm rounded-lg border border-line bg-bone px-2 py-1.5 text-sm text-ink outline-none focus:border-verde"
                />
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
