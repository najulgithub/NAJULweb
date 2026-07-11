import Link from "next/link";
import type { Config } from "@/lib/types";
import { linkWhatsapp } from "@/lib/wa";

export default function Footer({ config }: { config: Config }) {
  const wa = linkWhatsapp(config.whatsapp, config.whatsappMensaje);
  const anio = 2026;

  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          {config.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.logoUrl}
              alt={config.nombreEmpresa}
              className="h-12 w-auto"
            />
          ) : (
            <p className="font-display text-3xl font-semibold text-ink">
              {config.nombreEmpresa}
            </p>
          )}
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {config.claim ?? "Cortinas, diseño y trabajos a medida para tu hogar."}
          </p>
        </div>

        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-oro">
            Contacto
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {config.direccion && <li>{config.direccion}</li>}
            {config.horarios && <li>{config.horarios}</li>}
            {config.email && (
              <li>
                <a className="hover:text-verde" href={`mailto:${config.email}`}>
                  {config.email}
                </a>
              </li>
            )}
            {wa && (
              <li>
                <a
                  className="hover:text-verde"
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-oro">
            Explorar
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li>
              <Link className="hover:text-verde" href="/trabajos">
                Trabajos realizados
              </Link>
            </li>
            <li>
              <Link className="hover:text-verde" href="/recomendador">
                Recomendador
              </Link>
            </li>
            {config.instagram && (
              <li>
                <a
                  className="hover:text-verde"
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted lg:px-8">
          © {anio} {config.nombreEmpresa}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
