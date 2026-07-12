import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente service_role (solo server). Necesario para la Admin API de Auth.
function admin() {
  return createClient(URL, SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Verifica que el request venga de un admin autenticado (Bearer token).
async function actual(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const { data, error } = await admin().auth.getUser(token);
  return error ? null : data.user;
}

export async function GET(req: Request) {
  if (!(await actual(req)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data, error } = await admin().auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const usuarios = data.users
    .map((u) => ({
      id: u.id,
      email: u.email,
      creado: u.created_at,
      ultimo: u.last_sign_in_at ?? null,
    }))
    .sort((a, b) => (a.creado < b.creado ? -1 : 1));
  return NextResponse.json({ usuarios });
}

export async function POST(req: Request) {
  if (!(await actual(req)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { email, password } = await req.json();
  if (!email || !password || String(password).length < 6)
    return NextResponse.json(
      { error: "Email y contraseña (mínimo 6 caracteres) requeridos." },
      { status: 400 },
    );

  const { error } = await admin().auth.admin.createUser({
    email: String(email).trim(),
    password: String(password),
    email_confirm: true,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const yo = await actual(req);
  if (!yo) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  if (id === yo.id)
    return NextResponse.json(
      { error: "No podés eliminar tu propio usuario." },
      { status: 400 },
    );

  const { error } = await admin().auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
