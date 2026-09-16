import type { ReactNode } from "react";

/** Envoltorio común de las páginas legales: columna angosta para lectura larga. */
export function PaginaLegal({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <p className="text-[0.72rem] uppercase tracking-[0.3em] text-oro">Legales</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        {titulo}
      </h1>
      <p className="mt-4 text-sm text-muted">Última actualización: {actualizado}</p>
      <div className="mt-12 space-y-10">{children}</div>
    </div>
  );
}

export function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-ink">{titulo}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export function Lista({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 space-y-2 border-l border-line pl-5 leading-relaxed text-ink-soft">
      {children}
    </ul>
  );
}

/** Bloque de datos de la sociedad, al pie de cada documento. */
export function Firma() {
  return (
    <section className="rounded-2xl border border-line bg-paper px-6 py-6 text-sm leading-relaxed text-ink-soft">
      <p className="font-display text-lg text-ink">CONTRATELLI TEXTIL S.R.L.</p>
      <p className="text-xs uppercase tracking-[0.18em] text-oro">Najul</p>
      <p className="mt-3">CUIT 30-71621330-3</p>
      <p>19 N°624, Balcarce, Provincia de Buenos Aires, Argentina</p>
      <p className="mt-2">
        <a className="hover:text-verde" href="mailto:najul.textil@gmail.com">
          najul.textil@gmail.com
        </a>
      </p>
      <p>
        <a className="hover:text-verde" href="https://najul.com.ar">
          https://najul.com.ar
        </a>
      </p>
    </section>
  );
}
