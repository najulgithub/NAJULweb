// Tipos del dominio (app usa camelCase; la base usa snake_case — ver mappers en datos.ts)

export type EjeCategoria = "espacio" | "tipo_trabajo" | "estilo" | "preferencia_luz";

export type TipoImagen = "portada" | "antes" | "despues" | "galeria";

export interface Categoria {
  id: string;
  eje: EjeCategoria;
  nombre: string;
  slug: string;
  descripcion?: string | null;
  icono?: string | null;
  orden: number;
}

export interface TrabajoImagen {
  id: string;
  url: string;
  tipo: TipoImagen;
  alt?: string | null;
  orden: number;
}

export interface Trabajo {
  id: string;
  titulo: string;
  slug: string;
  resumen?: string | null;
  descripcion?: string | null;
  ubicacion?: string | null;
  destacado: boolean;
  orden: number;
  imagenes: TrabajoImagen[];
  categoriaIds: string[];
}

export interface Config {
  nombreEmpresa: string;
  claim?: string | null;
  descripcion?: string | null;
  whatsapp?: string | null;
  whatsappMensaje?: string | null;
  email?: string | null;
  direccion?: string | null;
  horarios?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  logoUrl?: string | null;
  heroImagenUrl?: string | null;
  // Textos editables del inicio (con fallback en la página)
  heroEyebrow?: string | null;
  heroTitulo?: string | null;
  heroDestacado?: string | null;
  carruselTitulo?: string | null;
  serviciosTitulo?: string | null;
  serviciosEyebrow?: string | null;
  serviciosLink?: string | null;
  serviciosVer?: string | null;
  recomendadorTitulo?: string | null;
  recomendadorTexto?: string | null;
  nosotrosTitulo?: string | null;
  nosotrosTexto?: string | null;
  ctaTitulo?: string | null;
  ctaTexto?: string | null;
}

export type TipoCarrusel = "foto" | "reel" | "video";

export interface CarruselItem {
  id: string;
  tipo: TipoCarrusel;
  url: string;
  titulo?: string | null;
  orden: number;
  /** Tipo de trabajo al que pertenece (categorias con eje "tipo_trabajo"). */
  categoriaId?: string | null;
}

export const ETIQUETA_EJE: Record<EjeCategoria, string> = {
  espacio: "Espacio",
  tipo_trabajo: "Tipo de trabajo",
  estilo: "Estilo",
  preferencia_luz: "Preferencia de luz",
};
