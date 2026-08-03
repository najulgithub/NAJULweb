"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Config } from "@/lib/types";
import { linkWhatsapp } from "@/lib/wa";

const LINKS = [
  { href: "/trabajos", label: "Trabajos" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/#nosotros", label: "Nosotros" },
];

export default function Nav({ config }: { config: Config }) {
  const [abierto, setAbierto] = useState(false);
  const [scrolleado, setScrolleado] = useState(false);
  const wa = linkWhatsapp(config.whatsapp, config.whatsappMensaje);

  useEffect(() => {
    const onScroll = () => setScrolleado(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md transition-shadow duration-300 ${
        scrolleado ? "shadow-[0_2px_12px_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          {config.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.logoUrl}
              alt={config.nombreEmpresa}
              className="h-9 w-auto sm:h-10"
            />
          ) : (
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              {config.nombreEmpresa}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm text-ink-soft transition-colors hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-verde after:transition-all hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-verde px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-verde-dark"
            >
              Pedí presupuesto
            </a>
          )}
        </nav>

        <button
          type="button"
          aria-label="Menú"
          onClick={() => setAbierto((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-px w-5 bg-ink transition-all ${
                abierto ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-5 bg-ink transition-all ${
                abierto ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-5 bg-ink transition-all ${
                abierto ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {abierto && (
        <nav className="border-t border-line bg-paper px-5 py-4 md:hidden">
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
