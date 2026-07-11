import Link from "next/link";
import { getConfig, getCategorias } from "@/lib/datos";
import { linkWhatsapp } from "@/lib/wa";

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
  const [config, tipos] = await Promise.all([
    getConfig(),
    getCategorias("tipo_trabajo"),
  ]);
  const wa = linkWhatsapp(config.whatsapp, config.whatsappMensaje);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative grano overflow-hidden">
        <div className="pliegues pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70" />
        <div
          className="pointer-events-none absolute -top-1/3 right-0 h-[80vh] w-[80vh] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(55,83,63,0.20), transparent 65%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <p className="subir text-[0.75rem] uppercase tracking-[0.34em] text-verde">
              Cortinas · Diseño · Trabajos a medida
            </p>
            <h1
              className="subir mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "0.08s" }}
            >
              La luz de tu casa,
              <br />
              <span className="italic text-verde">bien vestida.</span>
            </h1>
            <p
              className="subir mt-6 max-w-md text-lg leading-relaxed text-ink-soft"
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
                  className="rounded-full bg-verde px-7 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-verde-dark"
                >
                  Pedí tu presupuesto
                </a>
              )}
              <Link
                href="/trabajos"
                className="group inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/40"
              >
                Ver trabajos
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Tarjeta decorativa: pliegues de tela */}
          <div
            className="subir relative hidden lg:block"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-paper shadow-xl shadow-black/5">
              <div className="pliegues absolute inset-0 opacity-90" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(244,239,230,0) 40%, rgba(55,83,63,0.16) 100%)",
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-paper/80 p-5 backdrop-blur-sm">
                <p className="font-display text-xl text-ink">A medida, sin apuro</p>
                <p className="mt-1 text-sm text-muted">
                  Medición a domicilio y asesoramiento personalizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TIPOS DE TRABAJO ---------------- */}
      <section id="trabajos" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-verde">
              Qué hacemos
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
              Soluciones para cada espacio
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
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-verde">
              Recomendador
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Decinos cómo es tu espacio y te sugerimos la cortina ideal
            </h2>
            <p className="mt-4 text-bone/70">
              Elegís el ambiente, el estilo y cuánta luz querés dejar pasar. En un
              minuto te mostramos las mejores opciones con ejemplos reales.
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
        <p className="text-[0.72rem] uppercase tracking-[0.3em] text-verde">
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
            Hacemos que tu casa se sienta{" "}
            <span className="italic text-verde">como querés.</span>
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              En {config.nombreEmpresa} trabajamos las cortinas y el diseño del
              hogar como un oficio: medimos con cuidado, elegimos buenas telas y
              cuidamos cada terminación.
            </p>
            <p>
              Cada proyecto es a medida. Nos importa que la solución no solo se vea
              bien, sino que funcione para cómo vivís tu espacio.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- CTA FINAL ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-24 text-center lg:px-8">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold text-ink sm:text-5xl">
          ¿Empezamos tu proyecto?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Escribinos por WhatsApp y coordinamos una visita para medir y asesorarte.
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
