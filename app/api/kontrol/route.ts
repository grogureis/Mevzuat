import { mevzuatKontrol, type KontrolSonuc } from "@/lib/kontrol";
import { epostaGonder } from "@/lib/eposta";

// PDF indirme + metin çıkarma sürebilir
export const maxDuration = 120;
export const dynamic = "force-dynamic";

function raporHtml(sonuclar: KontrolSonuc[], tarih: string): string {
  const satir = (s: KontrolSonuc) => {
    const renk =
      s.durum === "degisti" ? "#e30a17" : s.durum === "hata" ? "#b45309" : "#0d9488";
    const etiket =
      s.durum === "degisti"
        ? "DEĞİŞTİ"
        : s.durum === "hata"
          ? "KONTROL EDİLEMEDİ"
          : s.durum === "ilk-kayit"
            ? "ilk kayıt"
            : "değişiklik yok";
    return `<tr>
      <td style="padding:8px 10px;border-bottom:1px solid #eee">${s.baslik}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;color:${renk};font-weight:600">${etiket}</td>
    </tr>`;
  };
  return `<div style="font-family:system-ui,sans-serif;max-width:560px">
    <h2 style="color:#e30a17;margin:0 0 4px">Mevzuat — Aylık Kontrol</h2>
    <p style="color:#555;margin:0 0 12px;font-size:13px">${tarih}</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px">${sonuclar.map(satir).join("")}</table>
    <p style="color:#777;font-size:12px;margin-top:14px">
      "DEĞİŞTİ" görünen mevzuatın resmi metni güncellenmiş olabilir. İçeriği gözden geçirip uygulamadaki metni güncelleyin.
      ASKOM kararları bu otomatik kontrole dahil değildir (resmi açık kaynak yok).
    </p>
  </div>`;
}

export async function GET(req: Request) {
  // Güvenlik: CRON_SECRET tanımlıysa doğrula (Vercel Cron Authorization başlığıyla çağırır)
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    const qs = new URL(req.url).searchParams.get("secret");
    if (auth !== `Bearer ${secret}` && qs !== secret) {
      return new Response("Yetkisiz", { status: 401 });
    }
  }

  const tarih = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
  const sonuc = await mevzuatKontrol();
  const degisen = sonuc.filter((s) => s.durum === "degisti");
  const hatali = sonuc.filter((s) => s.durum === "hata");

  let eposta: "gonderildi" | "yapilandirilmadi" | "gerek-yok" = "gerek-yok";
  if (degisen.length > 0 || hatali.length > 0) {
    const ok = await epostaGonder(
      `Mevzuat kontrolü: ${degisen.length} değişiklik${hatali.length ? `, ${hatali.length} hata` : ""}`,
      raporHtml(sonuc, tarih)
    );
    eposta = ok ? "gonderildi" : "yapilandirilmadi";
  }

  return Response.json(
    { tarih, degisenSayisi: degisen.length, eposta, sonuc },
    { headers: { "cache-control": "no-store" } }
  );
}
