"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/carrusel", label: "Carrusel" },
  { href: "/admin/trabajos", label: "Trabajos" },
  { href: "/admin/config", label: "Configuración" },
  { href: "/admin/usuarios", label: "Administradores" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const esLogin = pathname === "/admin/login";
  const [session, setSession] = useState<Session | null>(null);
  const [listo, setListo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setListo(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase
      .from("config")
      .select("logo_url")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setLogoUrl((data?.logo_url as string) ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (listo && !session && !esLogin) router.replace("/admin/login");
  }, [listo, session, esLogin, router]);

  async function salir() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (esLogin) return <>{children}</>;

  if (!listo || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Cargando…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Najul" className="h-8 w-auto" />
              ) : (
                <span className="font-display text-xl font-semibold text-ink">Najul</span>
              )}
              <span className="text-[0.6rem] uppercase tracking-[0.24em] text-oro">
                Panel
              </span>
            </Link>
            <nav className="hidden gap-5 sm:flex">
              {NAV.map((n) => {
                const activo =
                  n.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`text-sm transition-colors ${
                      activo ? "text-verde" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-ink-soft hover:text-ink"
            >
              Ver sitio ↗
            </Link>
            <button
              onClick={salir}
              className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-soft hover:border-verde/40 hover:text-ink"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
