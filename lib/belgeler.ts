/**
 * Yüklü mevzuatların kayıt defteri (saf veri — hem sunucu hem istemci kullanır).
 * slug, content/ klasöründeki dosya adıyla (.md hariç) AYNI olmalıdır.
 */
export type BelgeKayit = {
  slug: string;
  baslik: string;
  kisaAd: string;
  resmiLink: string | null;
  /** Aylık değişiklik kontrolü için resmi tam-metin PDF adresi (yoksa kontrol edilmez). */
  tamMetinPdf: string | null;
};

export const BELGELER: BelgeKayit[] = [
  {
    slug: "acil-saglik-hizmetleri-yonetmeligi",
    baslik: "Acil Sağlık Hizmetleri Yönetmeliği",
    kisaAd: "Acil Sağlık Hiz. Yön.",
    resmiLink:
      "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=4798&MevzuatTur=7&MevzuatTertip=5",
    tamMetinPdf:
      "https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=4798&mevzuatTur=KurumVeKurulusYonetmeligi&mevzuatTertip=5",
  },
  {
    slug: "yatakli-acil-servis-tebligi",
    baslik:
      "Yataklı Sağlık Tesislerinde Acil Servis Hizmetlerinin Uygulama Usul ve Esasları Hakkında Tebliğ",
    kisaAd: "Acil Servis Tebliği",
    resmiLink:
      "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39719&MevzuatTur=9&MevzuatTertip=5",
    tamMetinPdf:
      "https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=39719&mevzuatTur=Teblig&mevzuatTertip=5",
  },
  {
    slug: "yatakli-tedavi-kurumlari-isletme-yonetmeligi",
    baslik: "Yataklı Tedavi Kurumları İşletme Yönetmeliği",
    kisaAd: "Yataklı Tedavi Yön.",
    resmiLink:
      "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=85319&MevzuatTur=3&MevzuatTertip=5",
    tamMetinPdf: "https://www.mevzuat.gov.tr/MevzuatMetin/3.5.85319.pdf",
  },
  {
    slug: "saglikta-kalite-hasta-calisan-guvenligi-yonetmeligi",
    baslik:
      "Sağlıkta Kalitenin Geliştirilmesi ve Değerlendirilmesine Dair Yönetmelik",
    kisaAd: "Sağlıkta Kalite Yön.",
    resmiLink:
      "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=20859&MevzuatTur=7&MevzuatTertip=5",
    tamMetinPdf:
      "https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=20859&mevzuatTur=KurumVeKurulusYonetmeligi&mevzuatTertip=5",
  },
  {
    slug: "istanbul-2025-askom-kararlari",
    baslik: "İstanbul İli 2025 Yılı ASKOM Kararları",
    kisaAd: "İstanbul ASKOM 2025",
    resmiLink: null,
    tamMetinPdf: null, // İl ASKOM PDF'i — herkese açık otomatik kaynak yok, elle güncellenir
  },
];

export function belgeBul(slug: string): BelgeKayit | undefined {
  return BELGELER.find((b) => b.slug === slug.trim());
}
