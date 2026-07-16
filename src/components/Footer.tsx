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

          {(config.instagram || config.facebook) && (
            <div className="mt-5 flex items-center gap-3">
              {config.instagram && (
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-verde/40 hover:bg-verde hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5.01-4.74.07-.9.04-1.38.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.9.19 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.33-.13-.81-.28-1.71-.32C15.5 4.01 15.15 4 12 4zm0 3.05A4.95 4.95 0 1 1 12 17a4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.15-3.24a1.16 1.16 0 1 1 0 2.32 1.16 1.16 0 0 1 0-2.32z" />
                  </svg>
                </a>
              )}
              {config.facebook && (
                <a
                  href={config.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-verde/40 hover:bg-verde hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                  </svg>
                </a>
              )}
            </div>
          )}
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
