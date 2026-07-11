import type { Metadata } from "next";
import { getCategorias } from "@/lib/datos";

export const metadata: Metadata = { title: "Recomendador" };

export default async function RecomendadorPage() {
  const [espacios, estilos, luz] = await Promise.all([
    getCategorias("espacio"),
    getCategorias("estilo"),
    getCategorias("preferencia_luz"),
  ]);

  const bloques = [
    { titulo: "Espacio", items: espacios },
    { titulo: "Estilo", items: estilos },
    { titulo: "Preferencia de luz", items: luz },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <p className="text-[0.72rem] uppercase tracking-[0.3em] text-verde">
        Recomendador
      </p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-ink">
        Encontremos tu cortina ideal
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Contanos tres cosas y te sugerimos qué tipo de trabajo te conviene, con
        ejemplos reales. (Versión interactiva en camino — por ahora, un vistazo a
        las opciones.)
      </p>

      <div className="mt-12 space-y-10">
        {bloques.map((b) => (
          <div key={b.titulo}>
            <h2 className="font-display text-2xl text-ink">{b.titulo}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.items.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-soft"
                >
                  {c.nombre}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
