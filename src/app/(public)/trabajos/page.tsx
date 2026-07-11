import Link from "next/link";
import type { Metadata } from "next";
import { getCategorias, getTrabajos } from "@/lib/datos";

export const metadata: Metadata = { title: "Trabajos realizados" };

export default async function TrabajosPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const [tipos, trabajos] = await Promise.all([
    getCategorias("tipo_trabajo"),
    getTrabajos(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">Galería</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-ink">
        Trabajos realizados
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Proyectos que hicimos a medida. Filtrá por tipo de trabajo.
      </p>

      {/* Chips de filtro (por ahora navegan por query string) */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/trabajos"
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            !tipo
              ? "border-verde bg-verde text-white"
              : "border-line text-ink-soft hover:border-verde/40"
          }`}
        >
          Todos
        </Link>
        {tipos.map((t) => (
          <Link
            key={t.id}
            href={`/trabajos?tipo=${t.slug}`}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              tipo === t.slug
                ? "border-verde bg-verde text-white"
                : "border-line text-ink-soft hover:border-verde/40"
            }`}
          >
            {t.nombre}
          </Link>
        ))}
      </div>

      {trabajos.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-line bg-paper px-6 py-20 text-center">
          <p className="font-display text-2xl text-ink">Pronto, muy pronto</p>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Estamos cargando nuestros trabajos. Mientras tanto, escribinos y te
            mostramos ejemplos por WhatsApp.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Galería real: se completa en el próximo paso */}
        </div>
      )}
    </div>
  );
}
