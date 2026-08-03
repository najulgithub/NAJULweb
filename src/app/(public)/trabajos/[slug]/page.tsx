import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getConfig, getTrabajos } from "@/lib/datos";
import { linkWhatsapp } from "@/lib/wa";

const ETIQUETA_IMG: Record<string, string> = {
  antes: "Antes",
  despues: "Después",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trabajos = await getTrabajos();
  const t = trabajos.find((x) => x.slug === slug);
  return { title: t ? t.titulo : "Trabajo" };
}

export default async function TrabajoDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [config, trabajos] = await Promise.all([getConfig(), getTrabajos()]);
  const t = trabajos.find((x) => x.slug === slug);
  if (!t) notFound();

  const wa = linkWhatsapp(
    config.whatsapp,
    `Hola! Me interesó el trabajo "${t.titulo}" que vi en la web.`,
  );
  const portada = t.imagenes.find((i) => i.tipo === "portada") ?? t.imagenes[0];
  const resto = t.imagenes.filter((i) => i !== portada);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <Link
        href="/trabajos"
        className="text-sm text-muted transition-colors hover:text-verde"
      >
        ← Volver a trabajos
      </Link>

      <div className="mt-6">
        {t.ubicacion && (
          <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">
            {t.ubicacion}
          </p>
        )}
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {t.titulo}
        </h1>
        {t.descripcion && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {t.descripcion}
          </p>
        )}
      </div>

      {/* Portada */}
      {portada && (
        <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-bone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portada.url} alt={t.titulo} className="w-full object-cover" />
        </div>
      )}

      {/* Resto de imágenes */}
      {resto.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {resto.map((im) => (
            <div
              key={im.id}
              className="relative overflow-hidden rounded-2xl border border-line bg-bone"
            >
              {ETIQUETA_IMG[im.tipo] && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-ink/75 px-3 py-1 text-xs font-medium text-white">
                  {ETIQUETA_IMG[im.tipo]}
                </span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={im.url}
                alt={im.alt ?? t.titulo}
                className="w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {wa && (
        <div className="mt-14 rounded-3xl border border-line bg-paper p-8 text-center">
          <p className="font-display text-2xl text-ink">¿Querés algo así en tu casa?</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Escribinos y coordinamos una visita para medir y asesorarte.
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-verde px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-verde-dark"
          >
            Consultar por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
