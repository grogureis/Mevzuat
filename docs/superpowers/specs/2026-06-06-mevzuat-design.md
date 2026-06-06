# Mevzuat — Tasarım Belgesi

**Tarih:** 2026-06-06
**Durum:** Onaylandı

## Amaç

Yataklı acil serviste çalışan personelin, bir olay anında telefondan veya
bilgisayardan soru sorup, **resmi mevzuata dayalı**, **kaynak gösteren**, adım
adım yönlendirme aldığı bir sohbet (chat) uygulaması.

Örnek kullanım: *"Acil servise gelen adli vaka için ne yapmalıyım?"* →
uygulama ilgili tebliğ/yönetmelik maddesine dayanarak ne yapılması gerektiğini
söyler ve hangi belgeye dayandığını belirtir.

## Kapsam

### Yapacakları
- Sohbet tarzı soru-cevap (önceki sorular görünür, takip sorusu sorulabilir)
- Yalnızca yüklü resmi mevzuat metinlerine dayalı cevap
- Her cevapta dayandığı belge/madde gösterimi (kaynak)
- Mevzuatta cevap yoksa **uydurmaz**; nereye başvurulacağını söyleyen bir
  yönlendirme bildirimi gösterir
- Mobil uyumlu, hızlı, sade arayüz

### Yapmayacakları (YAGNI)
- Tıbbi karar/tanı vermez (sadece mevzuat yönlendirmesi)
- Kullanıcı hesabı / giriş yok
- Veritabanı yok, vektör arama (embedding) yok — belge sayısı az

## Mevzuat Belgeleri (içerik)

Resmi kanallardan (Mevzuat.gov.tr / Resmi Gazete / Sağlık Bakanlığı) güncel
haliyle toplanacak ve `content/` altında markdown olarak saklanacak:

1. **Acil Sağlık Hizmetleri Yönetmeliği** — ASKOM'un (Acil Sağlık Hizmetleri
   Koordinasyon Komisyonu) tanımı ve kuralları
2. **Yataklı Sağlık Tesislerinde Acil Servis Hizmetlerinin Uygulama Usul ve
   Esasları Hakkında Tebliğ** — acil servis işleyişi, triyaj, sevk
3. **Yataklı Tedavi Kurumları İşletme Yönetmeliği** — hastane içi işleyiş, nöbet
4. **Hasta ve Çalışan Güvenliğinin Sağlanmasına Dair Yönetmelik** — güvenlik

Her belge dosyasının başında kaynak künyesi bulunur (resmi adı, Resmi Gazete
tarih/sayı, erişim tarihi).

## Mimari

```
Mevzuat/
├── content/                  # Mevzuat metinleri (markdown)
│   ├── acil-saglik-hizmetleri-yonetmeligi.md
│   ├── yatakli-acil-servis-tebligi.md
│   ├── yatakli-tedavi-kurumlari-isletme-yonetmeligi.md
│   └── hasta-calisan-guvenligi-yonetmeligi.md
├── app/
│   ├── page.tsx              # Sohbet arayüzü
│   ├── layout.tsx
│   └── api/sor/route.ts      # Soru + belgeler -> Claude -> akan cevap
├── lib/
│   └── mevzuat.ts            # content/ klasörünü okuyup birleştirir
└── ...
```

- **Çatı:** Next.js (App Router)
- **AI:** Vercel AI SDK, model olarak Claude (AI Gateway üzerinden)
- **Stil:** Tailwind CSS
- **Depolama:** Yok (belgeler dosya sisteminde markdown)

## Veri Akışı

1. Kullanıcı sohbete soru yazar
2. `api/sor` route'u tüm mevzuat metinlerini (`lib/mevzuat.ts`) + sohbet
   geçmişini + soruyu birleştirir
3. Claude'a sıkı bir sistem talimatıyla gönderilir:
   - SADECE verilen mevzuat metinlerine dayan
   - Bilgi metinde yoksa uydurma; "mevzuatta bulunamadı" de
   - Cevabın dayandığı belge adını ve mümkünse madde numarasını belirt
   - Tıbbi tanı/tedavi kararı verme
4. Cevap kullanıcıya **streaming** olarak gösterilir

## "Cevap Bulunamadı" Davranışı

Model, metinde karşılık bulamadığında özel bir işaret döndürür (ör. cevabın
başında `[BULUNAMADI]`). Arayüz bunu algılayıp normal metin yerine bir uyarı
kutusu gösterir:

> ⚠️ Bu soru yüklü mevzuatta bulunamadı. Şuralara başvurabilirsiniz:
> İl Sağlık Müdürlüğü ASKOM birimi, hastane başhekimliği veya ilgili mevzuatın
> tam metni.

## Hata Yönetimi

- AI çağrısı başarısızsa: kullanıcıya "şu an cevap üretilemiyor, tekrar deneyin"
  mesajı; teknik hata loglanır
- API anahtarı yoksa: arayüzde net kurulum uyarısı
- Boş soru gönderimi engellenir

## Güvenlik / Sorumluluk Notu

Uygulama altında kalıcı bir hatırlatma bulunur: *"Bu uygulama mevzuat
yönlendirmesi yapar, tıbbi karar yerine geçmez. Acil durumlarda kurum
protokollerini uygulayın."*

## Test

- `lib/mevzuat.ts` belgeleri doğru okuyup birleştiriyor mu (birim test)
- API route bilinen bir soruya kaynak gösteren cevap veriyor mu
- Mevzuat dışı bir soru için "bulunamadı" davranışı tetikleniyor mu
- Arayüz mobilde düzgün görünüyor mu (manuel)
