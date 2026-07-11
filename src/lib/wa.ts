// Arma el link de WhatsApp (wa.me) con mensaje prellenado opcional.
export function linkWhatsapp(numero?: string | null, mensaje?: string | null): string | null {
  if (!numero) return null;
  const limpio = numero.replace(/[^\d]/g, "");
  if (!limpio) return null;
  const base = `https://wa.me/${limpio}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
