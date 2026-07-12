import Link from "next/link";
import { getConfig, getCategorias, getCarrusel } from "@/lib/datos";
import { linkWhatsapp } from "@/lib/wa";
import Carrusel from "@/components/Carrusel";

const PROCESO = [
  {
    n: "01",
    t: "Consulta",
    d: "Nos contás qué buscás y para qué espacio. Te asesoramos sin compromiso.",
  },
  {
    n: "02",
    t: "Medición",
    d: "Vamos a tu casa a medir y ver la luz, las telas y las opciones que mejor quedan.",
  },
  {
    n: "03",
    t: "Presupuesto",
    d: "Te pasamos una propuesta clara, con materiales, plazos y precio cerrado.",
  },
  {
    n: "04",
    t: "Instalación",
    d: "Fabricamos a medida e instalamos. Vos solo disfrutás el resultado.",
  },
];

export default async function Home() {
  const [config, tipos, carrusel] = await Promise.all([
    getConfig(),
    getCategorias("tipo_trabajo"),
    getCarrusel(),
  ]);
  const wa = linkWhatsapp(config.whatsapp, config.whatsappMensaje);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative -mt-[76px] flex min-h-[92vh] items-end overflow-hidden bg-ink">
        {config.heroImagenUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={config.heroImagenUrl}
            alt="Cortinas tradicionales a medida en un living de doble altura"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* degradé azul→verde de marca sobre la foto (contraste fuerte para el texto) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(118deg, rgba(8,52,72,0.94) 0%, rgba(10,72,78,0.82) 30%, rgba(14,102,95,0.5) 56%, rgba(14,107,98,0.14) 80%, rgba(14,107,98,0) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background: "linear-gradient(to top, rgba(8,44,58,0.78), transparent)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-36 lg:px-8 lg:pb-24">
          <div className="max-w-xl [text-shadow:0_2px_20px_rgba(3,26,32,0.4)]">
            <p className="subir text-[0.75rem] uppercase tracking-[0.34em] text-[#eab62c]">
              {config.heroEyebrow ?? "Cortinas · Diseño · Trabajos a medida"}
            </p>
            <h1
              className="subir mt-5 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "0.08s" }}
            >
              {config.heroTitulo ?? "La luz de tu casa,"}
              <br />
              <span className="italic text-[#eab62c]">
                {config.heroDestacado ?? "bien vestida."}
              </span>
            </h1>
            <p
              className="subir mt-6 max-w-md text-lg leading-relaxed text-white/85"
              style={{ animationDelay: "0.16s" }}
            >
              {config.descripcion ??
                "Diseñamos, fabricamos e instalamos cortinas y soluciones a medida. Contanos tu espacio y te ayudamos a encontrar la mejor opción."}
            </p>
            <div
              className="subir mt-9 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "0.24s" }}
            >
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink shadow-lg shadow-black/10 transition-colors hover:bg-bone"
                >
                  Pedí tu presupuesto
                </a>
              )}
              <Link
                href="/trabajos"
                className="group inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Ver trabajos
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CARRUSEL (fotos + reels) ---------------- */}
      {carrusel.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <div className="mb-8">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">
              Nuestro trabajo
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
              {config.carruselTitulo ?? "Ambientes que vestimos"}
            </h2>
          </div>
          <Carrusel items={carrusel} />
        </section>
      )}

      {/* ---------------- TIPOS DE TRABAJO ---------------- */}
      <section id="trabajos" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">
              Qué hacemos
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
              {config.serviciosTitulo ?? "Soluciones para cada espacio"}
            </h2>
          </div>
          <Link
            href="/recomendador"
            className="text-sm text-ink-soft underline decoration-verde/40 underline-offset-4 hover:text-verde"
          >
            ¿No sabés cuál elegir? Usá el recomendador →
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tipos.map((t, i) => (
            <Link
              key={t.id}
              href={`/trabajos?tipo=${t.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-line bg-paper p-6 transition-all hover:-translate-y-1 hover:border-verde/40 hover:shadow-lg hover:shadow-black/5"
            >
              <span className="font-display text-4xl text-line transition-colors group-hover:text-verde/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-6 font-display text-2xl text-ink">{t.nombre}</p>
              {t.descripcion && (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t.descripcion}
                </p>
              )}
              <span className="mt-6 inline-flex items-center gap-1 text-sm text-verde opacity-0 transition-opacity group-hover:opacity-100">
                Ver ejemplos →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- RECOMENDADOR TEASER ---------------- */}
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-xl">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">
              Recomendador
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              {config.recomendadorTitulo ??
                "Decinos cómo es tu espacio y te sugerimos la cortina ideal"}
            </h2>
            <p className="mt-4 text-bone/70">
              {config.recomendadorTexto ??
                "Elegís el ambiente, el estilo y cuánta luz querés dejar pasar. En un minuto te mostramos las mejores opciones con ejemplos reales."}
            </p>
          </div>
          <Link
            href="/recomendador"
            className="rounded-full bg-verde px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-verde-dark"
          >
            Empezar recomendador →
          </Link>
        </div>
      </section>

      {/* ---------------- PROCESO ---------------- */}
      <section id="proceso" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">
          Cómo trabajamos
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-ink sm:text-5xl">
          Del primer mensaje a la cortina instalada
        </h2>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESO.map((p) => (
            <div key={p.n} className="border-t border-line pt-5">
              <span className="font-display text-2xl text-verde">{p.n}</span>
              <p className="mt-3 font-display text-xl text-ink">{p.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- NOSOTROS ---------------- */}
      <section id="nosotros" className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <h2 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {config.nosotrosTitulo ?? (
              <>
                Hacemos que tu casa se sienta{" "}
                <span className="italic text-verde">como querés.</span>
              </>
            )}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
            {(
              config.nosotrosTexto ??
              `En ${config.nombreEmpresa} trabajamos las cortinas y el diseño del hogar como un oficio: medimos con cuidado, elegimos buenas telas y cuidamos cada terminación.\n\nCada proyecto es a medida. Nos importa que la solución no solo se vea bien, sino que funcione para cómo vivís tu espacio.`
            )
              .split("\n")
              .filter((p) => p.trim())
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA FINAL ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-24 text-center lg:px-8">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold text-ink sm:text-5xl">
          {config.ctaTitulo ?? "¿Empezamos tu proyecto?"}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          {config.ctaTexto ??
            "Escribinos por WhatsApp y coordinamos una visita para medir y asesorarte."}
        </p>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-verde px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-verde-dark"
          >
            Pedí tu presupuesto
          </a>
        )}
      </section>
    </>
  );
}
