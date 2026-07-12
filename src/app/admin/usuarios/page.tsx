"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Usuario = { id: string; email: string; creado: string; ultimo: string | null };

async function token() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
}

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [miId, setMiId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creando, setCreando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [nueva, setNueva] = useState("");
  const [msgPass, setMsgPass] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setMiId(data.user?.id ?? null);
    const res = await fetch("/api/admin/usuarios", {
      headers: { Authorization: `Bearer ${await token()}` },
    });
    const json = await res.json();
    setUsuarios(json.usuarios ?? []);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setCreando(true);
    const res = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await token()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    setCreando(false);
    if (!res.ok) {
      setMsg(json.error || "Error al crear");
      return;
    }
    setEmail("");
    setPassword("");
    setMsg("Administrador creado ✓");
    cargar();
  }

  async function eliminar(u: Usuario) {
    if (!confirm(`¿Quitar el acceso de ${u.email}?`)) return;
    const res = await fetch("/api/admin/usuarios", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await token()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: u.id }),
    });
    const json = await res.json();
    if (!res.ok) alert(json.error || "Error");
    else cargar();
  }

  async function cambiarPass(e: React.FormEvent) {
    e.preventDefault();
    setMsgPass(null);
    if (nueva.length < 6) {
      setMsgPass("Mínimo 6 caracteres.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: nueva });
    setMsgPass(error ? `Error: ${error.message}` : "Contraseña actualizada ✓");
    if (!error) setNueva("");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink">Administradores</h1>
      <p className="mt-1 text-muted">
        Quién puede entrar al panel. Cada email con cuenta acá tiene acceso total.
      </p>

      {/* Lista */}
      {cargando ? (
        <p className="mt-8 text-muted">Cargando…</p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {usuarios.map((u) => (
            <li key={u.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {u.email}
                  {u.id === miId && (
                    <span className="ml-2 rounded-full bg-verde/10 px-2 py-0.5 text-xs text-verde">
                      vos
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {u.ultimo
                    ? `Último ingreso: ${new Date(u.ultimo).toLocaleDateString("es-AR")}`
                    : "Nunca ingresó"}
                </p>
              </div>
              {u.id !== miId && (
                <button
                  onClick={() => eliminar(u)}
                  className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-verde-dark"
                >
                  Quitar acceso
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Agregar */}
      <div className="mt-10 rounded-2xl border border-line bg-paper p-6">
        <h2 className="font-display text-xl text-ink">Agregar administrador</h2>
        <form onSubmit={agregar} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-ink-soft">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          <div>
            <label className="text-sm text-ink-soft">Contraseña inicial (mín. 6)</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
            <p className="mt-1 text-xs text-muted">
              Compartísela a la persona; puede cambiarla luego desde acá.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={creando}
              className="rounded-full bg-verde px-6 py-2.5 text-sm font-medium text-white hover:bg-verde-dark disabled:opacity-60"
            >
              {creando ? "Creando…" : "Crear administrador"}
            </button>
            {msg && <span className="text-sm text-ink-soft">{msg}</span>}
          </div>
        </form>
      </div>

      {/* Cambiar mi contraseña */}
      <div className="mt-6 rounded-2xl border border-line bg-paper p-6">
        <h2 className="font-display text-xl text-ink">Cambiar mi contraseña</h2>
        <form onSubmit={cambiarPass} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <label className="text-sm text-ink-soft">Nueva contraseña</label>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              className="input"
            />
          </div>
          <button
            type="submit"
            className="rounded-full border border-line px-6 py-2.5 text-sm text-ink-soft hover:border-verde/40 hover:text-ink"
          >
            Actualizar
          </button>
          {msgPass && <span className="w-full text-sm text-ink-soft">{msgPass}</span>}
        </form>
      </div>
    </div>
  );
}
