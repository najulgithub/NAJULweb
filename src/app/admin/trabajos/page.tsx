"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { borrarImagenPorUrl } from "@/lib/admin";

type Fila = {
  id: string;
  titulo: string;
  activo: boolean;
  destacado: boolean;
  orden: number;
  trabajo_imagenes: { url: string; tipo: string; orden: number }[];
};

function portada(f: Fila): string | null {
  const imgs = f.trabajo_imagenes ?? [];
  const p = imgs.find((i) => i.tipo === "portada") ?? imgs[0];
  return p?.url ?? null;
}

export default function TrabajosAdmin() {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    const { data } = await supabase
      .from("trabajos")
      .select("id, titulo, activo, destacado, orden, trabajo_imagenes(url, tipo, orden)")
      .order("orden");
    setFilas((data as Fila[]) ?? []);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function eliminar(f: Fila) {
    if (!confirm(`¿Eliminar "${f.titulo}"? Esta acción no se puede deshacer.`)) return;
    // borrar imágenes del Storage
    for (const img of f.trabajo_imagenes ?? []) await borrarImagenPorUrl(img.url);
    // borrar el trabajo (cascade borra imágenes y tags en la base)
    const { error } = await supabase.from("trabajos").delete().eq("id", f.id);
    if (error) alert(`Error: ${error.message}`);
    else cargar();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Trabajos</h1>
          <p className="mt-1 text-muted">Los proyectos que se muestran en la galería.</p>
        </div>
        <Link
          href="/admin/trabajos/nuevo"
          className="rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white hover:bg-clay-dark"
        >
          + Nuevo trabajo
        </Link>
      </div>

      {cargando ? (
        <p className="mt-8 text-muted">Cargando…</p>
      ) : filas.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
          <p className="font-display text-xl text-ink">Todavía no hay trabajos</p>
          <p className="mt-1 text-muted">Creá el primero con “Nuevo trabajo”.</p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {filas.map((f) => {
            const url = portada(f);
            return (
              <li key={f.id} className="flex items-center gap-4 p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-bone">
                  {url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{f.titulo}</p>
                  <div className="mt-1 flex gap-2 text-xs">
                    {f.destacado && (
                      <span className="rounded-full bg-clay/10 px-2 py-0.5 text-clay">
                        Destacado
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        f.activo
                          ? "bg-olive/15 text-olive"
                          : "bg-ink/5 text-muted"
                      }`}
                    >
                      {f.activo ? "Publicado" : "Oculto"}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/trabajos/${f.id}`}
                  className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-soft hover:border-clay/40 hover:text-ink"
                >
                  Editar
                </Link>
                <button
                  onClick={() => eliminar(f)}
                  className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-clay-dark"
                >
                  Eliminar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
