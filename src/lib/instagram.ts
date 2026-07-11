// Convierte una URL de Instagram (reel / post / tv) en su URL de embed para <iframe>.
// Acepta formatos como:
//   https://www.instagram.com/reel/CODE/
//   https://instagram.com/p/CODE/?igsh=...
//   https://www.instagram.com/tv/CODE/
export function embedInstagram(url: string): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (!m) return null;
  const tipo = m[1].toLowerCase() === "reels" ? "reel" : m[1].toLowerCase();
  return `https://www.instagram.com/${tipo}/${m[2]}/embed`;
}
