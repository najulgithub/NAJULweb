"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CarruselItem } from "@/lib/types";
import { embedInstagram } from "@/lib/instagram";

export default function Carrusel({ items }: { items: CarruselItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [pausado, setPausado] = useState(false);

  const irA = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el || !items.length) return;
      const n = (i + items.length) % items.length;
      const child = el.children[n] as HTMLElement | undefined;
      if (child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
      idxRef.current = n;
      setIndex(n);
    },
    [items.length],
  );

  // Autoplay: avanza solo, en loop; se pausa con el mouse encima.
  useEffect(() => {
    if (pausado || items.length < 2) return;
    const t = setInterval(() => irA(idxRef.current + 1), 4500);
    return () => clearInterval(t);
  }, [pausado, items.length, irA]);

  if (!items.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => {
          const embed = it.tipo === "reel" ? embedInstagram(it.url) : null;
          return (
            <div
              key={it.id}
              className="relative h-[380px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-paper shadow-sm sm:h-[460px] lg:h-[520px]"
            >
              {it.tipo === "reel" && embed ? (
                <div className="h-full aspect-[9/16]">
                  <iframe
                    src={embed}
                    title={it.titulo ?? "Instagram"}
                    loading="lazy"
                    allow="encrypted-media; clipboard-write"
                    className="h-full w-full"
                    scrolling="no"
                  />
                </div>
              ) : it.tipo === "video" ? (
                <>
                  <video
                    src={it.url}
                    className="h-full w-auto max-w-none object-cover"
                    controls
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  {it.titulo && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
                      <p className="text-sm font-medium text-white">{it.titulo}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.url}
                    alt={it.titulo ?? "Trabajo de Najul"}
                    loading="lazy"
                    className="h-full w-auto max-w-none object-cover"
                  />
                  {it.titulo && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
                      <p className="text-sm font-medium text-white">{it.titulo}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => irA(index - 1)}
            className="absolute -left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-md backdrop-blur transition-colors hover:bg-paper md:flex"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => irA(index + 1)}
            className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-md backdrop-blur transition-colors hover:bg-paper md:flex"
          >
            →
          </button>

          {/* Puntitos indicadores */}
          <div className="mt-5 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir al ${i + 1}`}
                onClick={() => irA(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-verde" : "w-2 bg-line hover:bg-muted"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
