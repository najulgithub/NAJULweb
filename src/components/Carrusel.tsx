"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CarruselItem } from "@/lib/types";
import { embedInstagram } from "@/lib/instagram";
import { juego, miniatura } from "@/lib/imagen";

/** Cuántos slides a cada lado del visible se precargan. */
const MARGEN = 1;

export default function Carrusel({ items }: { items: CarruselItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [pausado, setPausado] = useState(false);
  // Qué slides ya pueden cargar su media. Arranca con los primeros: el resto
  // espera a estar cerca, así la primera visita no se baja el carrusel entero.
  const [cargar, setCargar] = useState<Set<number>>(
    () => new Set([0, 1, 2].filter((i) => i < items.length)),
  );

  const habilitar = useCallback((i: number) => {
    setCargar((prev) => {
      if (prev.has(i)) return prev;
      const s = new Set(prev);
      for (let k = i - MARGEN; k <= i + MARGEN; k++) s.add(k);
      return s;
    });
  }, []);

  const irA = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el || !items.length) return;
      const n = (i + items.length) % items.length;
      const child = el.children[n] as HTMLElement | undefined;
      if (child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
      idxRef.current = n;
      setIndex(n);
      habilitar(n);
    },
    [items.length, habilitar],
  );

  // Carga lo que se acerca al borde del visor. El nativo loading="lazy" no
  // alcanza en una tira horizontal: el navegador las considera a todas cercanas.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            habilitar(Number((e.target as HTMLElement).dataset.i));
          }
        }
      },
      { root: el, rootMargin: "0px 300px" },
    );
    for (const hijo of Array.from(el.children)) obs.observe(hijo);
    return () => obs.disconnect();
  }, [items.length, habilitar]);

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
        {items.map((it, i) => {
          const embed = it.tipo === "reel" ? embedInstagram(it.url) : null;
          const listo = cargar.has(i);
          return (
            <div
              key={it.id}
              data-i={i}
              className="relative h-[380px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-paper shadow-sm sm:h-[460px] lg:h-[520px]"
            >
              {it.tipo === "reel" && embed ? (
                <div className="h-full aspect-[9/16]">
                  {listo && (
                    <iframe
                      src={embed}
                      title={it.titulo ?? "Instagram"}
                      loading="lazy"
                      allow="encrypted-media; clipboard-write"
                      className="h-full w-full"
                      scrolling="no"
                    />
                  )}
                </div>
              ) : it.tipo === "video" ? (
                <>
                  {listo ? (
                    <video
                      src={it.url}
                      className="h-full w-auto max-w-none object-cover"
                      controls
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div className="h-full aspect-[9/16] bg-bone" />
                  )}
                  {it.titulo && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
                      <p className="text-sm font-medium text-white">{it.titulo}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* La miniatura pesa ~1 KB y conserva la proporción, así el
                      ancho del slide no salta cuando entra la foto grande. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    {...(listo
                      ? juego(it.url, [640, 828, 1080])
                      : { src: miniatura(it.url) })}
                    sizes="(min-width: 1024px) 700px, (min-width: 640px) 620px, 510px"
                    alt={it.titulo ?? "Trabajo de Najul"}
                    decoding="async"
                    className={`h-full w-auto max-w-none object-cover transition-opacity duration-500 ${
                      listo ? "opacity-100" : "opacity-70 blur-sm"
                    }`}
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
