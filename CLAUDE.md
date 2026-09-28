# Claude geliştirme bağlamı

## Ürün

Dil Atlası, Ahmet'in İngilizce, Fransızca, İtalyanca ve Almanca öğrenmesini tek ekrandan yönetmek için hazırlanmış gizlilik odaklı kişisel gelişim uygulamasıdır. Öncelik kurs satmak değil, her gün düşük sürtünmeyle çalışmayı başlatmak ve sürdürülebilir hâle getirmektir.

## Mevcut mimari

- Bağımlılıksız HTML, CSS ve JavaScript
- Uygulama `index.html` içinde; ders içeriği `lessons.js` (`window.LESSONS`) dosyasında
- PWA manifesti ve çevrimdışı uygulama kabuğu
- İlerleme için yalnızca `localStorage`
- Telaffuz için Web Speech API (`speechSynthesis`)
- Haricî API, kullanıcı hesabı, analitik veya çerez izleme yok
- Arayüz dili Türkçe

## Öğrenme planı

- Ana dil: İngilizce (A2 → B1, iş ve siber güvenlik odaklı). Yan dil: Fransızca (A0 → A1). İtalyanca ve Almanca sonra.
- Günlük hedef 25–30 dakika; yan dilde 10–15 dakika.
- Ders günü = o dilde bugünden önce çalışılan gün sayısı + 1 (`getLessonDay`); ayrı anahtar yoktur.
- `lessons.js` değişince `sw.js` içindeki `CACHE_NAME` artırılmalı.

## Korunması gereken davranışlar

1. `dil-atlasi-active` aktif dil anahtarını koru.
2. `da:{task}:{lang}:{date}` görev anahtarlarını taşımadan veya geriye uyumluluk sağlamadan değiştirme.
3. Dil kodları `en`, `fr`, `it`, `de`; görev kodları `review`, `lesson`, `shadow`, `speak` olarak kalmalı.
4. Kullanıcı verisini açık onay olmadan haricî bir servise gönderme.
5. Ücretsiz kaynak bağlantılarını koru ve ücretli hizmeti ana akışa yerleştirme.
6. Mobil erişilebilirliği, klavye kullanımını ve düşük hareket tercihini koru.
7. Gizli anahtarları istemci koduna koyma.

## Önerilen geliştirme sırası

### Sürüm 1.1

- ~~İlerleme verisini JSON olarak dışa/içe aktarma~~ (yapıldı)
- ~~Çalışma süresini 25/45/60 dakika seçebilme~~ (yapıldı)
- ~~Günlük ders içeriğini 30 güne çıkarma~~ (en ve fr için yapıldı; it ve de bekliyor)
- Telaffuz kaydı için kullanıcı izniyle mikrofon desteği
- ~~Service Worker güncelleme bildirimi~~ (yapıldı)

### Sürüm 1.2

- Dil başına hedef ve haftalık program ayarı
- Kelime/cümle kartları için aralıklı tekrar sistemi
- Günlük ve haftalık istatistikler
- Veri şemasına sürüm numarası ve kontrollü migration

### Sürüm 2

- Kişisel gelişim modülleri: okuma, spor, mesleki/siber güvenlik gelişimi
- Modüller arası ortak günlük plan ve hedef ekranı
- İsteğe bağlı, uçtan uca şifreli senkronizasyon; yerel kullanım varsayılan kalmalı

## Framework'e geçiş kararı

Mevcut kapsam için framework gerekli değildir. Bileşenler büyürse Vite + React + TypeScript uygun bir geçiştir. Geçiş yapılırsa önce davranış eşdeğerliği sağlanmalı, daha sonra özellik eklenmelidir. PWA dosyaları ve eski localStorage verileri korunmalıdır.

## Kalite ve güvenlik ölçütleri

- Mobilde yatay taşma olmamalı.
- Ana görevler JavaScript hatası olmadan çalışmalı.
- Manifest ve Service Worker aynı origin altında çalışmalı.
- Haricî bağlantılar `noopener noreferrer` ile açılmalı.
- Kullanıcı girdisi ileride eklenirse HTML'e doğrudan basılmamalı.
- Bağımlılık eklenirse sürüm sabitlenmeli ve tedarik zinciri riski değerlendirilmelidir.
- Üretimde mümkünse Content Security Policy eklenmeli; bunun için inline CSS/JS ayrı dosyalara taşınmalıdır.

## Kabul testi

- Dört dil arasında geçiş yapılabiliyor.
- Her görev işaretlendiğinde ilerleme ve geçmiş güncelleniyor.
- Sayfa yenilendiğinde seçimler korunuyor.
- Sayaç başlatılabiliyor, durdurulabiliyor ve sıfırlanabiliyor.
- Telaffuz düğmesi doğru dil kodunu kullanıyor.
- Uygulama ana ekrana kurulabiliyor ve standalone açılıyor.
- Ağ kesikken daha önce yüklenen uygulama kabuğu açılıyor.
