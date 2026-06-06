import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mevzuat — Acil Servis Rehberi",
    short_name: "Mevzuat",
    description:
      "Yataklı acil servis çalışma kurallarını mevzuata dayalı, kaynak göstererek yanıtlayan rehber.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#e30a17",
    lang: "tr",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
