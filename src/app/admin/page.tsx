"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminInicio() {
  const [trabajos, setTrabajos] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("trabajos")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setTrabajos(count ?? 0));
    supabase
      .from("categorias")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setCategorias(count ?? 0));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Panel</h1>
      <p className="mt-1 text-muted">Gestioná el contenido del sitio.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/trabajos"
          className="rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-verde/40"
        >
          <p className="text-sm text-muted">Trabajos publicados</p>
          <p className="mt-2 font-display text-4xl text-ink">
            {trabajos ?? "—"}
          </p>
          <p className="mt-4 text-sm text-verde">Gestionar trabajos →</p>
        </Link>

        <Link
          href="/admin/config"
          className="rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-verde/40"
        >
          <p className="text-sm text-muted">Categorías</p>
          <p className="mt-2 font-display text-4xl text-ink">
            {categorias ?? "—"}
          </p>
          <p className="mt-4 text-sm text-verde">Editar configuración →</p>
        </Link>
      </div>
    </div>
  );
}
