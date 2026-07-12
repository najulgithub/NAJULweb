"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("config")
      .select("logo_url")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setLogoUrl((data?.logo_url as string) ?? null));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setCargando(false);
    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Najul" className="mx-auto h-12 w-auto" />
        ) : (
          <p className="text-center font-display text-3xl font-semibold text-ink">
            Najul
          </p>
        )}
        <p className="mt-2 text-center text-[0.7rem] uppercase tracking-[0.24em] text-oro">
          Panel de administración
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-line bg-paper p-6"
        >
          <div>
            <label className="text-sm text-ink-soft">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-line bg-bone px-3 py-2.5 text-ink outline-none focus:border-verde"
            />
          </div>
          <div>
            <label className="text-sm text-ink-soft">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-line bg-bone px-3 py-2.5 text-ink outline-none focus:border-verde"
            />
          </div>
          {error && <p className="text-sm text-verde-dark">{error}</p>}
          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-full bg-verde py-3 text-sm font-medium text-white transition-colors hover:bg-verde-dark disabled:opacity-60"
          >
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
