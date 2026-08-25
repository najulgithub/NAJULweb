import Link from "next/link";
import type { Metadata } from "next";
import { getCarrusel, getCategorias, getTrabajos } from "@/lib/datos";

export const metadata: Metadata = { title: "Trabajos realizados" };

function portada(t: { imagenes: { url: string; tipo: string }[] }): string | null {
  const p = t.imagenes.find((i) => i.tipo === "portada") ?? t.imagenes[0];
  return p?.url ?? null;
}

export default async function TrabajosPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const [tipos, trabajos, carrusel] = await Promise.all([
    getCategorias("tipo_trabajo"),
    getTrabajos(),
    getCarrusel(),
  ]);

  const tipoCat = tipo ? tipos.find((t) => t.slug === tipo) : null;
  const filtrados = tipoCat
    ? trabajos.filter((t) => t.categoriaIds.includes(tipoCat.id))
    : trabajos;

  // Fotos sueltas cargadas desde /admin/carrusel, clasificadas por tipo de trabajo.
  // Los reels de Instagram quedan afuera de la grilla (son embeds, no fotos).
  const fotos = carrusel.filter((f) => f.tipo !== "reel");
  const fotosFiltradas = tipoCat ? fotos.filter((f) => f.categoriaId === tipoCat.id) : fotos;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">Galería</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-ink">
        Trabajos realizados
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Proyectos que hicimos a medida. Filtrá por tipo de trabajo.
      </p>

      {/* Chips de filtro */}
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

      {filtrados.length === 0 && fotosFiltradas.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-line bg-paper px-6 py-20 text-center">
          <p className="font-display text-2xl text-ink">
            {tipoCat ? `Todavía no subimos fotos de ${tipoCat.nombre}` : "Pronto, muy pronto"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            {tipoCat
              ? "Probá con otro filtro o escribinos y te mostramos ejemplos por WhatsApp."
              : "Estamos cargando nuestros trabajos. Mientras tanto, escribinos y te mostramos ejemplos por WhatsApp."}
          </p>
        </div>
      ) : (
        <>
          {filtrados.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtrados.map((t) => {
                const url = portada(t);
                return (
                  <Link
                    key={t.id}
                    href={`/trabajos/${t.slug}`}
                    className="group overflow-hidden rounded-2xl border border-line bg-paper transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-bone">
                      {url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={url}
                          alt={t.titulo}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="font-display text-xl text-ink">{t.titulo}</p>
                      {t.ubicacion && (
                        <p className="mt-0.5 text-xs uppercase tracking-wide text-oro">
                          {t.ubicacion}
                        </p>
                      )}
                      {t.resumen && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                          {t.resumen}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {fotosFiltradas.length > 0 && (
            <section className={filtrados.length > 0 ? "mt-16" : "mt-12"}>
              {filtrados.length > 0 && (
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">
                  Más instalaciones
                </p>
              )}
              <div
                className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
                  filtrados.length > 0 ? "mt-6" : ""
                }`}
              >
                {fotosFiltradas.map((f) => (
                  <figure
                    key={f.id}
                    className="overflow-hidden rounded-2xl border border-line bg-paper"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-bone">
                      {f.tipo === "video" ? (
                        <video
                          src={f.url}
                          controls
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.url}
                          alt={f.titulo ?? "Instalación de Najul"}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    {f.titulo && (
                      <figcaption className="px-4 py-3 text-sm leading-relaxed text-muted">
                        {f.titulo}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
