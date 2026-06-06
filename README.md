# Mevzuat

Yataklı acil serviste çalışan personelin, bir olay anında soru sorup **resmi
mevzuata dayalı, kaynak gösteren** adım adım yönlendirme aldığı sohbet
uygulaması.

## Özellikler

- 💬 Sohbet tarzı arayüz (takip soruları sorulabilir), mobil uyumlu
- 📚 Cevaplar yalnızca `content/` klasöründeki resmi mevzuat metinlerine dayanır
- 🔖 Her cevapta dayanılan belge/madde gösterilir
- ⚠️ Mevzuatta yanıt yoksa uydurmaz; nereye başvurulacağını söyler
- 🔒 Tıbbi karar vermez; mevzuat yönlendirmesi yapar

## Yüklü Mevzuat

`content/` klasöründe (Mevzuat.gov.tr kaynaklı):

1. Acil Sağlık Hizmetleri Yönetmeliği (ASKOM)
2. Yataklı Sağlık Tesislerinde Acil Servis Hizmetlerinin Uygulama Usul ve Esasları Hakkında Tebliğ
3. Yataklı Tedavi Kurumları İşletme Yönetmeliği (acil servisle ilgili maddeler)
4. Sağlıkta Kalitenin Geliştirilmesi ve Değerlendirilmesine Dair Yönetmelik (hasta/çalışan güvenliği)

> Yeni belge eklemek için `content/` klasörüne bir `.md` dosyası koymanız
> yeterli; başına `belge_adi:` künyesini yazın. Uygulama otomatik okur.

## Kurulum

```bash
npm install
cp .env.example .env        # AI_GATEWAY_API_KEY değerini doldurun
npm run dev
```

`.env` içine [Vercel AI Gateway](https://vercel.com/dashboard) API anahtarınızı
girin. Ardından http://localhost:3000 adresini açın.

## Teknoloji

- Next.js (App Router) + React
- Vercel AI SDK + AI Gateway (varsayılan model: `anthropic/claude-sonnet-4.5`)
- Tailwind CSS
- Veritabanı/embedding yok — belgeler dosya sisteminde markdown

## Önemli Not

Bu uygulama mevzuat yönlendirmesi yapar, tıbbi karar yerine geçmez. Cevaplar
yüklü mevzuat metinlerinin güncelliğiyle sınırlıdır; kesin işlem için resmî
kaynak (Mevzuat.gov.tr) ve kurum protokolleri esas alınmalıdır.
