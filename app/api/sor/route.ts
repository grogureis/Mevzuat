import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { mevzuatBaglami, gecerliSluglar } from "@/lib/mevzuat";

// Streaming yanıtlar için süre (saniye) — soğuk başlangıç + uzun cevaba pay
export const maxDuration = 60;

const MODEL = process.env.MEVZUAT_MODEL ?? "google/gemini-2.5-flash";

function sistemTalimati(baglam: string): string {
  return `Sen "Mevzuat" adlı bir rehber asistanısın. Yataklı acil serviste çalışan sağlık personeline, bir olay anında ne yapmaları gerektiğini Türkiye sağlık mevzuatına dayanarak anlatırsın.

KESİN KURALLAR:
1. SADECE aşağıda "MEVZUAT METİNLERİ" bölümünde verilen belgelere dayan. Genel bilgini veya tahmini kullanma.
2. Cevabını net, uygulanabilir ADIMLAR halinde ver. Olay anında okunacağı için kısa ve anlaşılır ol. Markdown kullan (başlık, kalın, liste).
3. Kritik/dikkat gerektiren uyarıları markdown alıntı (>) ile "uyarı kutusu" olarak ver.
4. Madde numaralarını metnin içinde belirt (ör. "Tebliğ m.11'e göre…").
5. Tıbbi tanı veya tedavi kararı VERME. Sadece mevzuatın ne yapılmasını söylediğini aktar. Tıbbi karar gereken yerde "tıbbi değerlendirme ilgili hekimindir" de.
6. İstanbul ASKOM kararları İSTANBUL'a özeldir; il-özel bir kural kullandığında bunu belirt.
7. Soru, verilen mevzuat metinlerinde KARŞILIK BULMUYORSA: cevabına AYNEN "[BULUNAMADI]" yazarak başla, ardından konunun hangi mevzuat alanına girdiğini ve nereye başvurulabileceğini kısaca açıkla. Bilgi UYDURMA.
8. Türkçe yanıt ver. Resmî ama sade bir dil kullan.

KAYNAK GÖSTERİMİ (ÇOK ÖNEMLİ):
- Cevabının EN SONUNA, kullandığın belgelerin slug'larını TEK SATIRDA şu formatta ekle:
  <<KAYNAK: slug1, slug2>>
- Başka açıklama ekleme, "Kaynaklar" başlığı yazma — sadece bu satır.
- Yalnızca gerçekten dayandığın belgelerin slug'larını yaz.
- Geçerli slug'lar: ${gecerliSluglar()}
- "[BULUNAMADI]" cevaplarında bu satırı EKLEME.

MEVZUAT METİNLERİ:
${baglam}`;
}

export async function POST(req: Request) {
  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return new Response("Geçersiz istek.", { status: 400 });
  }

  // Yerelde AI_GATEWAY_API_KEY gerekir; Vercel'de OIDC ile de çalışabilir.
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL) {
    return new Response(
      "Sunucu yapılandırması eksik: AI_GATEWAY_API_KEY tanımlı değil. Lütfen .env dosyasını doldurun.",
      { status: 500 }
    );
  }

  const baglam = await mevzuatBaglami();

  const result = streamText({
    model: MODEL,
    system: sistemTalimati(baglam),
    messages: await convertToModelMessages(messages),
    // Bu görev "verilen metinden çıkarım" olduğu için ağır düşünme (reasoning)
    // gerekmez. Gemini'de düşünme bütçesini kısarak maliyeti ~%60 azaltıyoruz.
    // (Google dışı modeller bu ayarı yok sayar.)
    providerOptions: {
      google: { thinkingConfig: { thinkingBudget: 0 } },
    },
    onFinish: ({ usage }) => {
      console.log(`[KULLANIM] model=${MODEL} usage=${JSON.stringify(usage)}`);
    },
  });

  return result.toUIMessageStreamResponse();
}
