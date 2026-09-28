# Dil Atlası

İngilizce, Fransızca, İtalyanca ve Almanca için ücretsiz, gizlilik odaklı kişisel öğrenme uygulaması. Proje bağımlılıksız bir Progressive Web App (PWA) olarak hazırlanmıştır.

## Neler var?

- Dört dil için ayrı 12 haftalık yol haritası
- İngilizce (A2 → B1, iş ve siber güvenlik) ve Fransızca (A0 → A1) için 30 günlük ders içeriği
- Önceki derslerden aralıklı tekrar kartları (1, 3, 7 ve 14 ders önce)
- Günlük 25 dakikalık dört çalışma bloğu ve ilerleme yüzdesi
- Çalışma serisi ve 28 günlük geçmiş
- 25/45/60 dakika seçilebilen odak sayacı
- İlerlemeyi JSON dosyası olarak yedekleme ve geri yükleme
- Yeni sürüm hazır olduğunda "Yenile" bildirimi
- Tarayıcının seslendirme özelliğiyle telaffuz
- Ücretsiz öğrenme kaynakları
- ChatGPT/Claude konuşma antrenörü komutu
- Çevrimdışı açılış için Service Worker
- Telefona ana ekran uygulaması olarak kurulum
- Hesap, analitik, reklam veya haricî sunucu yok

## Dosya yapısı

```text
dil-atlasi-source/
├── index.html              # Arayüz ve uygulama mantığı
├── lessons.js              # 30 günlük ders içeriği (en, fr)
├── manifest.webmanifest    # PWA tanımı
├── sw.js                   # Çevrimdışı uygulama kabuğu
├── icons/                  # Uygulama simgeleri
├── KAYNAKLAR.md            # Öğrenme kaynakları ve yöntem dayanakları
├── CLAUDE.md               # Claude ile geliştirmeye devam etmek için bağlam
└── README.md
```

## Yerelde çalıştırma

Service Worker yalnızca HTTPS veya `localhost` üzerinde çalışır. Dosyayı doğrudan çift tıklamak yerine klasörün içinde küçük bir yerel sunucu başlatın:

```bash
python3 -m http.server 4173
```

Ardından `http://localhost:4173` adresini açın. Node.js tercih ediyorsanız:

```bash
npx serve .
```

## Telefona kurma

### iPhone / iPad

1. Siteyi Safari ile açın.
2. Paylaş düğmesine dokunun.
3. **Ana Ekrana Ekle** seçeneğini seçin.
4. **Ekle** düğmesine dokunun.

### Android

1. Siteyi Chrome ile açın.
2. Menüden **Uygulamayı yükle** veya **Ana ekrana ekle** seçeneğini kullanın.

## Veri modeli ve gizlilik

Tüm ilerleme tarayıcının `localStorage` alanında tutulur:

- Aktif dil: `dil-atlasi-active`
- Sayaç süresi (dakika): `dil-atlasi-timer` — `25`, `45` veya `60`
- Görevler: `da:{görev}:{dil}:{YYYY-MM-DD}`
- Dil kodları: `en`, `fr`, `it`, `de`
- Görev kodları: `review`, `lesson`, `shadow`, `speak`

Ders günü ayrıca saklanmaz; o dilde bugünden önce en az bir görevin işaretlendiği gün sayısından hesaplanır. Bu yüzden bir gün atlamak dersi kaçırmaz, sadece ilerlemeyi bekletir.

Sunucuya kişisel veri gönderilmez. Bunun karşılığı olarak veriler cihazlar arasında eşitlenmez ve tarayıcı verileri silinirse ilerleme kaybolur; bu yüzden düzenli yedek almak önerilir.

**Yedeği indir** düğmesi `{ app, schemaVersion: 1, exportedAt, settings, tasks }` biçiminde bir JSON dosyası üretir. **Yedekten yükle** dosyayı doğrular, yalnızca geçerli `da:` anahtarlarını kabul eder ve mevcut kayıtları silmeden birleştirir.

## Yayına alma

Klasör tamamen statiktir; GitHub Pages, Cloudflare Pages, Netlify, Vercel veya HTTPS sunan herhangi bir statik barındırmada çalışır. Kök dizin olarak bu klasörü seçin; derleme komutu gerekmez.

## Claude ile devam

Tüm klasörü Claude projesine yükleyin ve önce `CLAUDE.md` dosyasını okumasını isteyin. İlk mesaj için şu komut yeterlidir:

> Bu projedeki README.md, CLAUDE.md ve KAYNAKLAR.md dosyalarını oku. Mevcut işlevleri ve localStorage anahtarlarını bozmadan projeyi geliştir. Önce mimariyi ve önerdiğin ilk küçük sürümü açıkla; onay almadan büyük bir framework geçişi yapma.

## Native mobil uygulama gerekir mi?

Günlük kişisel kullanım için PWA en düşük maliyetli çözümdür. App Store veya Google Play dağıtımı istenirse sonraki aşamada Capacitor ile paketlenebilir ya da Expo/React Native'e taşınabilir. Bu geçiş otomatik değildir; mağaza hesabı, imzalama, gizlilik beyanı ve mağaza inceleme süreçleri gerekir.
