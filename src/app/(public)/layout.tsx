import { GoogleAnalytics } from "@next/third-parties/google";
import { getConfig } from "@/lib/datos";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BotonWhatsapp from "@/components/BotonWhatsapp";

// Analítica solo en el sitio público: no tiene sentido medir el panel de admin,
// y así las visitas de Najul no ensucian las estadísticas.
//
// El ID de medición no es un secreto (viaja en el HTML), así que va en el código:
// evita depender de una variable en Vercel que un deploy futuro podría no tener.
// Solo se activa en producción, para que el desarrollo local no sume visitas falsas.
// Para apagar la analítica, poner NEXT_PUBLIC_GA_ID="off" en Vercel.
const GA_ID = "G-W36TB6K9G0";
const configurado = process.env.NEXT_PUBLIC_GA_ID;
const gaId =
  configurado === "off"
    ? undefined
    : configurado || (process.env.NODE_ENV === "production" ? GA_ID : undefined);

// El contenido se edita desde el admin: render dinámico para reflejar cambios al instante.
export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config = await getConfig();
  return (
    <>
      <Nav config={config} />
      <main className="flex-1">{children}</main>
      <Footer config={config} />
      <BotonWhatsapp config={config} />
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}
