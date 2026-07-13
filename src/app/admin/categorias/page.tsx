"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { aSlug } from "@/lib/admin";
import { ETIQUETA_EJE, type EjeCategoria } from "@/lib/types";

type Cat = {
  id: string;
  eje: EjeCategoria;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
};

const EJES: EjeCategoria[] = ["tipo_trabajo", "espacio", "estilo", "preferencia_luz"];

const AYUDA: Record<EjeCategoria, string> = {
  tipo_trabajo: "Las tarjetas de “Qué hacemos” en el inicio (nombre + descripción).",
  espacio: "Opciones de ambiente en el recomendador.",
  estilo: "Opciones de estilo en el recomendador.",
  preferencia_luz: "Opciones de luz en el recomendador.",
};

export default function CategoriasAdmin() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nuevo, setNuevo] = useState<Record<string, string>>({});

  const cargar = useCallback(async () => {
    const { data } = await supabase
      .from("categorias")
      .select("id, eje, nombre, slug, descripcion, orden, activo")
      .order("eje")
      .order("orden");
    setCats((data as Cat[]) ?? []);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function actualizar(id: string, campo: "nombre" | "descripcion" | "activo", valor: string | boolean) {
    const v = campo === "descripcion" ? (valor as string) || null : valor;
    await supabase.from("categorias").update({ [campo]: v }).eq("id", id);
    setCats((cs) => cs.map((c) => (c.id === id ? { ...c, [campo]: v } : c)));
  }

  async function mover(eje: EjeCategoria, idx: number, dir: -1 | 1) {
    const grupo = cats.filter((c) => c.eje === eje);
    const j = idx + dir;
    if (j < 0 || j >= grupo.length) return;
    [grupo[idx], grupo[j]] = [grupo[j], grupo[idx]];
    setCats((cs) => [...cs.filter((c) => c.eje !== eje), ...grupo].sort((a, b) => a.eje.localeCompare(b.eje)));
    await Promise.all(
      grupo.map((c, i) => supabase.from("categorias").update({ orden: i }).eq("id", c.id)),
    );
    cargar();
  }

  async function agregar(eje: EjeCategoria) {
    const nombre = (nuevo[eje] ?? "").trim();
    if (!nombre) return;
    let slug = aSlug(nombre) || "cat";
    const existe = cats.some((c) => c.eje === eje && c.slug === slug);
    if (existe) slug = `${slug}-${cats.filter((c) => c.eje === eje).length + 1}`;
    const orden = cats.filter((c) => c.eje === eje).length;
    const { error } = await supabase.from("categorias").insert({ eje, nombre, slug, orden });
    if (error) alert(error.message);
    else {
      setNuevo((n) => ({ ...n, [eje]: "" }));
      cargar();
    }
  }

  async function eliminar(c: Cat) {
    if (!confirm(`¿Eliminar "${c.nombre}"? Se quita de las tarjetas/recomendador y de los trabajos etiquetados.`))
      return;
    const { error } = await supabase.from("categorias").delete().eq("id", c.id);
    if (error) alert(error.message);
    else cargar();
  }

  if (cargando) return <p className="text-muted">Cargando…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-ink">Categorías</h1>
      <p className="mt-1 text-muted">
        Tipos de trabajo (las tarjetas del inicio) y las opciones del recomendador.
      </p>

      <div className="mt-8 space-y-10">
        {EJES.map((eje) => {
          const grupo = cats.filter((c) => c.eje === eje);
          return (
            <div key={eje}>
              <h2 className="font-display text-xl text-ink">{ETIQUETA_EJE[eje]}</h2>
              <p className="mt-0.5 text-sm text-muted">{AYUDA[eje]}</p>

              <ul className="mt-4 space-y-2">
                {grupo.map((c, idx) => (
                  <li
                    key={c.id}
                    className="rounded-xl border border-line bg-paper p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col pt-1.5">
                        <button
                          type="button"
                          onClick={() => mover(eje, idx, -1)}
                          disabled={idx === 0}
                          className="px-1 text-ink-soft hover:text-ink disabled:opacity-30"
                          aria-label="Subir"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => mover(eje, idx, 1)}
                          disabled={idx === grupo.length - 1}
                          className="px-1 text-ink-soft hover:text-ink disabled:opacity-30"
                          aria-label="Bajar"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <input
                          defaultValue={c.nombre}
                          onBlur={(e) => actualizar(c.id, "nombre", e.target.value)}
                          className="w-full rounded-lg border border-line bg-bone px-3 py-2 font-medium text-ink outline-none focus:border-verde"
                        />
                        {eje === "tipo_trabajo" && (
                          <textarea
                            defaultValue={c.descripcion ?? ""}
                            onBlur={(e) => actualizar(c.id, "descripcion", e.target.value)}
                            rows={2}
                            placeholder="Descripción (aparece en la tarjeta)"
                            className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink-soft outline-none focus:border-verde"
                          />
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-ink-soft">
                          <input
                            type="checkbox"
                            defaultChecked={c.activo}
                            onChange={(e) => actualizar(c.id, "activo", e.target.checked)}
                          />
                          Visible
                        </label>
                        <button
                          type="button"
                          onClick={() => eliminar(c)}
                          className="text-xs text-muted hover:text-verde-dark"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-2">
                <input
                  value={nuevo[eje] ?? ""}
                  onChange={(e) => setNuevo((n) => ({ ...n, [eje]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      agregar(eje);
                    }
                  }}
                  placeholder={`Agregar a ${ETIQUETA_EJE[eje].toLowerCase()}…`}
                  className="flex-1 rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-verde"
                />
                <button
                  type="button"
                  onClick={() => agregar(eje)}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-verde/40"
                >
                  Agregar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
