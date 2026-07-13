"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const APP_ID = process.env.NEXT_PUBLIC_GOOGLE_APP_ID;
const SCOPE = "https://www.googleapis.com/auth/drive.file";

const cache: Record<string, Promise<void>> = {};
function cargarScript(src: string): Promise<void> {
  if (!cache[src]) {
    cache[src] = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("No se pudo cargar " + src));
      document.head.appendChild(s);
    });
  }
  return cache[src];
}

export default function BotonDrive({
  onFiles,
  label = "Elegir de Drive",
  vista = "imagenes-videos",
}: {
  onFiles: (files: File[]) => void | Promise<void>;
  label?: string;
  vista?: "imagenes" | "imagenes-videos";
}) {
  const [cargando, setCargando] = useState(false);
  const configurado = !!(CLIENT_ID && API_KEY && APP_ID);

  async function abrir() {
    if (!configurado) {
      alert("Google Drive todavía no está configurado (faltan credenciales).");
      return;
    }
    setCargando(true);
    try {
      await Promise.all([
        cargarScript("https://apis.google.com/js/api.js"),
        cargarScript("https://accounts.google.com/gsi/client"),
      ]);
      const g = (window as any).google;
      const gapi = (window as any).gapi;
      await new Promise<void>((res) => gapi.load("picker", () => res()));

      // Token OAuth (solo alcance drive.file: la app ve únicamente lo que elegís)
      const token: string = await new Promise((resolve, reject) => {
        const tc = g.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (r: any) =>
            r?.access_token ? resolve(r.access_token) : reject(new Error("Sin token")),
        });
        tc.requestAccessToken({ prompt: "" });
      });

      const viewId =
        vista === "imagenes"
          ? g.picker.ViewId.DOCS_IMAGES
          : g.picker.ViewId.DOCS_IMAGES_AND_VIDEOS;
      const view = new g.picker.DocsView(viewId).setIncludeFolders(true);

      const picker = new g.picker.PickerBuilder()
        .setDeveloperKey(API_KEY)
        .setAppId(APP_ID)
        .setOAuthToken(token)
        .addView(view)
        .enableFeature(g.picker.Feature.MULTISELECT_ENABLED)
        .setCallback(async (data: any) => {
          if (data.action === g.picker.Action.CANCEL) setCargando(false);
          if (data.action !== g.picker.Action.PICKED) return;
          try {
            const files: File[] = [];
            for (const d of data.docs) {
              const res = await fetch(
                `https://www.googleapis.com/drive/v3/files/${d.id}?alt=media`,
                { headers: { Authorization: `Bearer ${token}` } },
              );
              if (!res.ok) throw new Error(`No se pudo bajar ${d.name}`);
              const blob = await res.blob();
              files.push(new File([blob], d.name, { type: d.mimeType || blob.type }));
            }
            await onFiles(files);
          } catch (err) {
            alert(err instanceof Error ? err.message : "Error importando de Drive");
          } finally {
            setCargando(false);
          }
        })
        .build();
      picker.setVisible(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error abriendo Drive");
      setCargando(false);
    }
  }

  if (!configurado) return null;

  return (
    <button
      type="button"
      onClick={abrir}
      disabled={cargando}
      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft hover:border-verde/40 disabled:opacity-60"
    >
      {cargando ? "Importando…" : `▾ ${label}`}
    </button>
  );
}
