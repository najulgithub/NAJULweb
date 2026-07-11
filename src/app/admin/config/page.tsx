"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Campos = {
  nombre_empresa: string;
  claim: string;
  descripcion: string;
  whatsapp: string;
  whatsapp_mensaje: string;
  email: string;
  direccion: string;
  horarios: string;
  instagram: string;
  facebook: string;
};

const VACIO: Campos = {
  nombre_empresa: "",
  claim: "",
  descripcion: "",
  whatsapp: "",
  whatsapp_mensaje: "",
  email: "",
  direccion: "",
  horarios: "",
  instagram: "",
  facebook: "",
};

const LABELS: Record<keyof Campos, string> = {
  nombre_empresa: "Nombre de la empresa",
  claim: "Frase principal (hero)",
  descripcion: "Descripción / nosotros",
  whatsapp: "WhatsApp (solo números, ej: 5492235551234)",
  whatsapp_mensaje: "Mensaje prellenado de WhatsApp",
  email: "Email",
  direccion: "Dirección",
  horarios: "Horarios",
  instagram: "Instagram (URL)",
  facebook: "Facebook (URL)",
};

const LARGOS: (keyof Campos)[] = ["descripcion", "whatsapp_mensaje"];

export default function ConfigPage() {
  const [campos, setCampos] = useState<Campos>(VACIO);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
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
          for (const k of Object.keys(VACIO) as (keyof Campos)[]) {
            c[k] = (data[k] as string) ?? "";
          }
          setCampos(c);
        }
        setCargando(false);
      });
  }, []);

  function set(k: keyof Campos, v: string) {
    setCampos((c) => ({ ...c, [k]: v }));
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMsg(null);
    const { error } = await supabase
      .from("config")
      .update({ ...campos, actualizado_en: new Date().toISOString() })
      .eq("id", 1);
    setGuardando(false);
    setMsg(error ? `Error: ${error.message}` : "Guardado ✓");
  }

  if (cargando) return <p className="text-muted">Cargando…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink">Configuración</h1>
      <p className="mt-1 text-muted">
        Textos y datos de contacto que se muestran en el sitio.
      </p>

      <form onSubmit={guardar} className="mt-8 space-y-5">
        {(Object.keys(VACIO) as (keyof Campos)[]).map((k) => (
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
        ))}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={guardando}
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
