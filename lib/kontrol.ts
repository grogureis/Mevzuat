import crypto from "node:crypto";
import { extractText, getDocumentProxy } from "unpdf";
import { BELGELER } from "./belgeler";
import baseline from "@/data/baseline.json";

export type KontrolDurum = "degisti" | "ayni" | "ilk-kayit" | "hata";

export type KontrolSonuc = {
  slug: string;
  baslik: string;
  durum: KontrolDurum;
  hash?: string;
  oncekiHash?: string;
  mesaj?: string;
};

/** Resmi tam-metin PDF'in METNİNİ çıkarıp normalize ederek hash'ler (zaman damgasından bağımsız, kararlı). */
async function metinHash(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (MevzuatKontrol)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const pdf = await getDocumentProxy(buf);
  const { text } = await extractText(pdf, { mergePages: true });
  const norm = String(text).replace(/\s+/g, " ").trim();
  if (norm.length < 200) throw new Error("Metin çıkarılamadı (çok kısa)");
  return crypto.createHash("sha256").update(norm).digest("hex").slice(0, 16);
}

/** Tüm izlenen mevzuatları kontrol eder ve baseline ile karşılaştırır. */
export async function mevzuatKontrol(): Promise<KontrolSonuc[]> {
  const base = baseline as Record<string, string>;
  const sonuclar: KontrolSonuc[] = [];

  for (const b of BELGELER) {
    if (!b.tamMetinPdf) continue; // İstanbul ASKOM gibi otomatik kaynağı olmayanlar atlanır
    try {
      const hash = await metinHash(b.tamMetinPdf);
      const onceki = base[b.slug];
      const durum: KontrolDurum = !onceki
        ? "ilk-kayit"
        : onceki === hash
          ? "ayni"
          : "degisti";
      sonuclar.push({ slug: b.slug, baslik: b.baslik, durum, hash, oncekiHash: onceki });
    } catch (e) {
      sonuclar.push({
        slug: b.slug,
        baslik: b.baslik,
        durum: "hata",
        mesaj: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return sonuclar;
}
