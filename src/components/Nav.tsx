"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Config } from "@/lib/types";
import { linkWhatsapp } from "@/lib/wa";

const LINKS = [
  { href: "/trabajos", label: "Trabajos" },
  { href: "/recomendador", label: "Recomendador" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/#nosotros", label: "Nosotros" },
];

export default function Nav({ config }: { config: Config }) {
  const [abierto, setAbierto] = useState(false);
  const [scrolleado, setScrolleado] = useState(false);
  const pathname = usePathname();
  const wa = linkWhatsapp(config.whatsapp, config.whatsappMensaje);

  useEffect(() => {
    const onScroll = () => setScrolleado(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El home tiene hero con foto: el nav va claro (blanco) mientras está arriba.
  const sobreFoto = pathname === "/" && !scrolleado && !abierto;
  const solido = scrolleado || abierto;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        solido
          ? "bg-paper/85 backdrop-blur-md border-b border-line shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* velo sutil arriba para garantizar contraste del nav claro sobre la foto */}
      {sobreFoto && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
      )}

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          {config.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.logoUrl}
              alt={config.nombreEmpresa}
              className={`h-9 w-auto transition-all sm:h-10 ${
                sobreFoto ? "brightness-0 invert" : ""
              }`}
            />
          ) : (
            <span
              className={`font-display text-2xl font-semibold tracking-tight ${
                sobreFoto ? "text-white" : "text-ink"
              }`}
            >
              {config.nombreEmpresa}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all hover:after:w-full ${
                sobreFoto
                  ? "text-white/90 hover:text-white after:bg-white"
                  : "text-ink-soft hover:text-ink after:bg-verde"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                sobreFoto
                  ? "bg-white text-ink hover:bg-bone"
                  : "bg-verde text-white hover:bg-verde-dark"
              }`}
            >
              Pedí presupuesto
            </a>
          )}
        </nav>

        <button
          type="button"
          aria-label="Menú"
          onClick={() => setAbierto((v) => !v)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors md:hidden ${
            sobreFoto ? "border-white/50 text-white" : "border-line text-ink"
          }`}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-px w-5 transition-all ${
                sobreFoto ? "bg-white" : "bg-ink"
              } ${abierto ? "top-1.5 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-5 transition-all ${
                sobreFoto ? "bg-white" : "bg-ink"
              } ${abierto ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 block h-px w-5 transition-all ${
                sobreFoto ? "bg-white" : "bg-ink"
              } ${abierto ? "top-1.5 -rotate-45" : "top-3"}`}
            />
          </span>
        </button>
      </div>

      {abierto && (
        <nav className="relative border-t border-line bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setAbierto(false)}
                className="rounded-lg px-3 py-3 text-base text-ink-soft hover:bg-bone"
              >
                {l.label}
              </Link>
            ))}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAbierto(false)}
                className="mt-2 rounded-full bg-verde px-5 py-3 text-center text-base font-medium text-white"
              >
                Pedí presupuesto
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
