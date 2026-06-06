import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { BELGELER, belgeBul } from "./belgeler";

const CONTENT_DIR = path.join(process.cwd(), "content");

let cache: string | null = null;

/**
 * content/ klasöründeki tüm mevzuat metinlerini tek bağlam bloğu halinde,
 * her belgenin slug ve resmi linkiyle birlikte birleştirir (LLM için).
 */
export async function mevzuatBaglami(): Promise<string> {
  if (cache) return cache;

  const dosyalar = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md"));
  const parcalar = await Promise.all(
    dosyalar.sort((a, b) => a.localeCompare(b, "tr")).map(async (dosya) => {
      const slug = dosya.replace(/\.md$/, "");
      const metin = await readFile(path.join(CONTENT_DIR, dosya), "utf8");
      const kayit = belgeBul(slug);
      const baslik = kayit?.baslik ?? slug;
      const link = kayit?.resmiLink ? ` | resmi: ${kayit.resmiLink}` : "";
      return `\n===== BELGE: ${baslik} [slug: ${slug}${link}] =====\n${metin.trim()}\n`;
    })
  );

  cache = parcalar.join("\n");
  return cache;
}

/** Sistem talimatı için geçerli slug listesini döndürür. */
export function gecerliSluglar(): string {
  return BELGELER.map((b) => b.slug).join(", ");
}
