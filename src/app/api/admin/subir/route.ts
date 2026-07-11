import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "trabajos";

// Cliente service_role (solo server). Bypassa RLS de Storage.
function admin() {
  return createClient(URL, SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Verifica que el request venga de un admin autenticado (Bearer token).
async function verificar(req: Request): Promise<boolean> {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return false;
  const { data, error } = await admin().auth.getUser(token);
  return !error && !!data.user;
}

export async function POST(req: Request) {
  if (!(await verificar(req)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  // nombre único sin depender de Date/Math (que igual acá están disponibles)
  const path = `${crypto.randomUUID()}.${ext}`;

  const sb = admin();
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}

export async function DELETE(req: Request) {
  if (!(await verificar(req)))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { path } = await req.json();
  if (!path) return NextResponse.json({ error: "Falta path" }, { status: 400 });

  const { error } = await admin().storage.from(BUCKET).remove([path]);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
