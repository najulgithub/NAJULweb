/**
 * URL de una imagen pasada por el optimizador de Next/Vercel.
 *
 * Las fotos del Storage se suben tal cual salen de la cámara (1600-1800 px, ~1 MB)
 * pero se muestran a menos de 700 px. Esto pide una versión redimensionada y en
 * formato moderno, servida y cacheada por el CDN: la misma foto baja de ~1 MB a
 * ~150 KB sin tocar el original.
 *
 * Los anchos válidos son los que Next tiene configurados por defecto
 * (deviceSizes e imageSizes); pedir otro devuelve 400.
 */
export function optimizar(url: string | null | undefined, ancho = 1080, calidad = 72) {
  if (!url) return "";
  // Sólo pasamos por el optimizador lo que viene del Storage; el resto queda igual.
  if (!url.includes("/storage/v1/object/public/")) return url;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${ancho}&q=${calidad}`;
}

/** Miniatura mínima: conserva la proporción (y por lo tanto el ancho del slide) pesando ~1 KB. */
export function miniatura(url: string | null | undefined) {
  return optimizar(url, 32, 40);
}

/**
 * Juego de anchos para un <img> normal: el navegador elige el que le sirve
 * según la pantalla. Sin esto un celular de 390 px se baja la misma foto que
 * un monitor de 1920, que es de donde sale la mayor parte del peso.
 *
 * `sizes` describe cuánto espacio ocupa la imagen en pantalla (no su tamaño
 * real); si no se pasa, asume el ancho completo.
 */
export function juego(
  url: string | null | undefined,
  anchos: number[],
  calidad = 72,
) {
  if (!url) return { src: "", srcSet: undefined };
  const mayor = anchos[anchos.length - 1];
  const src = optimizar(url, mayor, calidad);
  // Si no pasa por el optimizador (p. ej. una URL externa) no hay juego posible.
  if (src === url) return { src, srcSet: undefined };
  return {
    src,
    srcSet: anchos.map((a) => `${optimizar(url, a, calidad)} ${a}w`).join(", "),
  };
}
