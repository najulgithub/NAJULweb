import { createClient } from "@supabase/supabase-js";

// Cliente de navegador. Usa la clave anon/publishable — toda la seguridad la
// da RLS en Postgres, así que esta clave es pública y puede viajar al browser.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anonKey);
