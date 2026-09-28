# Dil Atlası

İngilizce, Fransızca, İtalyanca ve Almanca'yı **sıfırdan** öğrenmek için ücretsiz, gizlilik odaklı kişisel uygulama. Bağımlılıksız bir Progressive Web App (PWA); hesap, reklam, analitik veya sunucu yok.

Canlı adres: https://jackalkral.github.io/dil-atlasi/

## Nasıl çalışır?

Üstten dili seç, alttaki dört sekmeyi kullan:

| Sekme | Ne zaman | İçerik |
|---|---|---|
| **Bugün** | İşte kısa molalarda | 4 aşamalı yol: ① Tekrar kartları ② Kelimeler + cümleler + cümle kurma ③ Dinle ve tekrar et ④ Konuş (kendi kendine + ChatGPT/Claude sesli sohbet) |
| **Dinle** | Köpek gezdirirken, yolda | Eller serbest ses çalışması: Türkçesi → ara (sen söyle) → hedef dil ×2; podcast ve ses kursları |
| **İzle** | Akşam TV karşısında | Seviyeye göre video/dizi önerileri, hedef dilde altyazı rehberi |
| **İlerleme** | — | Seri, 28 gün, 30 günlük rota, odak sayacı, yöntem, yedekleme |

- Her dilde aynı 30 konu (selamlaşma → kendini anlatma); her derste 8 kelime ve 5 cümle.
- Aralıklı tekrar: önceki derslerin kelime ve cümleleri kart olur; bilinen kart 1 → 3 → 7 → 14 → 30 gün sonra döner.
- Hangi dili ne zaman çalışacağına sen karar verirsin. Fransızca ile İtalyancayı aynı gün çalışmamak önerilir (benzer diller karışır).

## Dosya yapısı

```text
index.html            # Arayüz iskeleti (sekme ve paneller)
styles.css            # Stil
app.js                # Uygulama mantığı
content/{en,fr,it,de}.js  # 30'ar derslik içerik: t başlık, n ipucu, w kelimeler, p cümleler
content/media.js      # Dinle ve İzle sekmelerinin doğrulanmış kaynakları
sw.js                 # Çevrimdışı uygulama kabuğu ve güncelleme bildirimi
manifest.webmanifest, icons/
KAYNAKLAR.md          # Yöntem ve kaynak dayanakları
CLAUDE.md             # Geliştirme bağlamı
```

## Yerelde çalıştırma

```bash
python3 -m http.server 4173
```

Ardından `http://localhost:4173` adresini aç. Service Worker dosyaları önbellekten verdiği için geliştirirken tarayıcıda Service Worker'ı kaldırmak veya `sw.js` içindeki `CACHE_NAME` değerini artırmak gerekir.

## Telefona kurma

- **iPhone/iPad:** Safari → Paylaş → Ana Ekrana Ekle.
- **Android:** Chrome menüsü → Uygulamayı yükle.

## Veri modeli ve gizlilik

Tüm ilerleme tarayıcının `localStorage` alanında tutulur:

- Aktif dil: `dil-atlasi-active` · Açık sekme: `dil-atlasi-tab`
- Aşamalar: `da:{görev}:{dil}:{YYYY-MM-DD}` — görevler `review`, `lesson`, `shadow`, `speak`; diller `en`, `fr`, `it`, `de`
- Sayaç süresi: `dil-atlasi-timer` (`25`, `45`, `60`)
- Tekrar kartları: `dil-atlasi-srs` — `{ v: 2, cards: { "en:0:w3": { b: kutu, d: "YYYY-MM-DD" } } }` (w = kelime, s = cümle). Eski v1 kartlar `dil-atlasi-srs-v1` anahtarında saklanır.

Ders günü ayrıca saklanmaz; o dilde bugünden önce çalışılan gün sayısından hesaplanır.

Sunucuya kişisel veri gönderilmez. "ChatGPT'de aç" / "Claude'da aç" yalnızca kullanıcı dokunduğunda, yalnızca o günün ders metnini içeren bir mesajla ilgili siteyi açar. Veriler cihazlar arasında eşitlenmez; **Yedeği indir** ile JSON dosyası alınabilir, **Yedekten yükle** doğrulayıp birleştirir.

## Yayına alma

Klasör tamamen statiktir; GitHub Pages dahil HTTPS sunan her statik barındırmada çalışır. Derleme gerekmez.
