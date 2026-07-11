import { getConfig } from "@/lib/datos";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BotonWhatsapp from "@/components/BotonWhatsapp";

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
    </>
  );
}
