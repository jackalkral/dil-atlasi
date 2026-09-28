# Claude geliştirme bağlamı

## Ürün

Dil Atlası, Ahmet'in İngilizce, Fransızca, İtalyanca ve Almanca öğrenmesini tek ekrandan yönetmek için hazırlanmış gizlilik odaklı kişisel gelişim uygulamasıdır. Öncelik kurs satmak değil, her gün düşük sürtünmeyle çalışmayı başlatmak ve sürdürülebilir hâle getirmektir.

## Mevcut mimari

- Bağımlılıksız HTML, CSS ve JavaScript
- Arayüz `index.html`, stil `styles.css`, mantık `app.js`; içerik `content/{en,fr,it,de}.js` (`window.LESSONS`) ve `content/media.js` (`window.MEDIA`)
- PWA manifesti ve çevrimdışı uygulama kabuğu
- İlerleme için yalnızca `localStorage`
- Telaffuz için Web Speech API (`speechSynthesis`)
- Haricî API, kullanıcı hesabı, analitik veya çerez izleme yok
- Arayüz dili Türkçe

## Öğrenme planı

- Dört dil de sıfırdan (A0). Kullanıcı dili kendisi seçer; uygulama sıralama dayatmaz.
- Dört dilde aynı 30 konu aynı sırayla (ortak müfredat). Her ders: t başlık, n Türkçe ipucu, w 8 × [kelime, Türkçe, okunuş], p 5 × [cümle, Türkçe].
- Okunuş kuralları: Türkçe harfler, heceler tireyle, vurgulu hece BÜYÜK; Fransızca genizden ünlü = ünlü + ñ; İtalyanca çift ünsüz yazılır.
- Ses: `utter()` her seslendirmede `voiceFor()` ile sesi seçer (kullanıcı seçimi `dil-atlasi-voices`, yoksa en yüksek `voiceScore`). Hız çarpanı `dil-atlasi-rate`. Doğal ses için kalıcı çözüm cihaza Premium/Enhanced ses indirmek ya da derleme sırasında üretilmiş ses dosyaları (lisans ve boyut değerlendirilmeli).
- Hata defteri `dil-atlasi-notlar` (`{v:1, items:{"fr:n:xxxx": {t, tr, d}}}`): kullanıcı girdisi, yalnızca `textContent` ile gösterilir, 200 karakter sınırı, günde en fazla 2; ertesi günden itibaren tekrar kartı olur.
- Ders adımında "Kendini sına": aynı gün hatırlama testi (kayıt tutmaz).
- Cümle kurma başa sarmaz: her cümlenin ilk denemesi sayılır, son cümlede "Bitir" doğru/yanlış/atlanan özetini ve kaçırılan cümleleri gösterir; "Baştan" ilk cümleye döner ve sayımı sıfırlar.
- `content/emoji.js`: yalnızca somut kelimeler için `"ders:kelime"` → emoji; dört dilde kelime sırası aynı olduğu için tek eşleme. Emoji Türkçe ipucunun yanında ek ipucudur, onun yerine geçmez.
- İlerleme ölçüsü: kutu ≥ 2 (7+ gün aralık) kartların hatırlama oranı `dil-atlasi-srs.stats[dil] = {ok, n}`.
- `dil-atlasi-sifirlama-2026-09` tek seferlik sıfırlama bayrağıdır; kaldırma, yoksa kullanıcının verisi yeniden silinir.
- Sekmeler bağlama göre: Bugün (iş molası), Dinle (yürüyüş, eller serbest), İzle (akşam TV), İlerleme.
- Bugün aşamaları görev kodlarına bağlı: `review` = tekrar kartları, `lesson` = kelime + cümle + cümle kurma, `shadow` = ses çalışması (bitince kendiliğinden işaretlenir), `speak` = telaffuz testi + konuşma + ChatGPT/Claude.
- Ders günü = o dilde bugünden önce çalışılan gün sayısı + 1 (`getLessonDay`); ayrı anahtar yoktur.
- Aralıklı tekrar `dil-atlasi-srs` (v2); kart kimliği `dil:dersSırası:w|s + sıra`. Derslerin kelime/cümle sırasını değiştirme, yenisini sona ekle.
- `speechSynthesis` ekran kilitlenince durur (özellikle iOS). Dinle sekmesi Wake Lock ile ekranı açık tutmaya çalışır; ekran kilitli dinleme için podcast bağlantıları verilir. Kalıcı çözüm: derleme sırasında üretilmiş tek parça ses dosyaları + Media Session API (ses lisansı ve boyut değerlendirilmeli).
- Şema sürümü `dil-atlasi-surum` (şu an 2, anahtar yoksa 1). Yeni veri biçimi gerekince `SCHEMA` artır ve `MIGRATIONS[yeniSürüm]` adımı ekle; adımlar veri silmemeli. Geçişten önce kayıtlar `dil-atlasi-goc-yedegi`'ne kopyalanır; daha yeni sürümün verisine dokunulmaz.
- Haftalık plan `dil-atlasi-plan` (`{v:1, langs:{en:{days:[0-6], goal:2|3|4}}}`, 0 = Pazar): yalnızca hatırlatır (dil düğmesinde nokta, Bugün'de ipucu, FR/IT aynı gün uyarısı); ders günü hesabını ve sırayı değiştirmez.
- Günlük istatistik `dil-atlasi-gunluk` (`{v:1, d:{"YYYY-MM-DD":{en:{c, ok, m}}}}`; kart, bilinen kart, odak dakikası; 400 gün). Aşama sayıları `da:` anahtarlarından hesaplanır, ayrıca saklanmaz.
- Türkçe seslendirme yok (kullanıcı isteği): Türkçe anlam yalnızca yazı olarak hedef metnin altında durur. Dinle sekmesindeki ses çalışması: hedef dil → ara (kullanıcı tekrar eder) → hedef dil.
- Tek ses kaynağı: `speak()` ve `playAll()` önce `stopAudio()` çağırır; bu, `audioRun` belirtecini artırıp "Hepsini dinle" zincirini, ses çalışmasını ve çalan kaydı durdurur. Safari `cancel()` sonrasında da `onend` gönderdiği için sıralı çalan her zincir belirteci denetlemeli. Sekme değişince ses durur.
- Telaffuz testi (Konuş adımının 1. bölümü): bugünün 8 kelimesi + 5 cümlesi; her satırda ▶ dinle, 🎙 Kaydet, ✓ Kontrol et.
  - 🎙 Kaydet: mikrofon yalnızca dokununca açılır, kayıt bellekte blob olarak kalır, saklanmaz/gönderilmez, bitince mikrofon kapatılır, en fazla 10 sn. CSP'de `media-src 'self' blob:` bunun için var.
  - ✓ Kontrol et: tarayıcının `SpeechRecognition` hizmeti (iPhone'da Apple, Chrome'da Google) sesi yazıya çevirir; bu ses cihaz dışına çıktığı için ilk kullanımda açık onay istenir (`dil-atlasi-tanima` = '1', İlerleme → Ses ve telaffuz'dan kapatılır). `matchWords()` hedef kelimeleri sırayı koruyarak eşleştirir (aksan/noktalama yok sayılır), yüzde ve eksik kelimeleri gösterir.
- Yedek biçimi `schemaVersion: 2` (hatırlama ölçüsü, plan, günlük istatistik, hız eklendi); geri yükleme 1 ve 2'yi kabul eder.
- Odak sayacı bitiş anından hesaplanır (arka planda kaymaz); tamamlanan süre günlük istatistiğe yazılır.
- `content/*.js`, `app.js` veya `styles.css` değişince `sw.js` içindeki `CACHE_NAME` artırılmalı (Service Worker bu dosyaları önbellekten verir).
- `https://chatgpt.com/?q=` mesajı otomatik gönderir (doğrulandı). `claude.ai/new?q=` doğrulanamadı; Claude düğmesi mesajı kopyalayıp claude.ai/new açar.

## Korunması gereken davranışlar

1. `dil-atlasi-active` aktif dil anahtarını koru.
2. `da:{task}:{lang}:{date}` görev anahtarlarını taşımadan veya geriye uyumluluk sağlamadan değiştirme.
3. Dil kodları `en`, `fr`, `it`, `de`; görev kodları `review`, `lesson`, `shadow`, `speak` olarak kalmalı. `dil-atlasi-timer`, `dil-atlasi-srs` ve `dil-atlasi-tab` anahtarları da korunmalı.
4. Kullanıcı verisini açık onay olmadan haricî bir servise gönderme.
5. Ücretsiz kaynak bağlantılarını koru ve ücretli hizmeti ana akışa yerleştirme.
6. Mobil erişilebilirliği, klavye kullanımını ve düşük hareket tercihini koru.
7. Gizli anahtarları istemci koduna koyma.

## Önerilen geliştirme sırası

### Sürüm 1.1

- ~~İlerleme verisini JSON olarak dışa/içe aktarma~~ (yapıldı)
- ~~Çalışma süresini 25/45/60 dakika seçebilme~~ (yapıldı)
- ~~Günlük ders içeriğini 30 güne çıkarma~~ (dört dil, ortak A0 müfredatı)
- ~~Telaffuz kaydı için kullanıcı izniyle mikrofon desteği~~ (yapıldı: Konuş adımı, kayıt saklanmaz)
- ~~Service Worker güncelleme bildirimi~~ (yapıldı)

### Sürüm 1.2

- ~~Dil başına hedef ve haftalık program ayarı~~ (yapıldı: `dil-atlasi-plan`)
- ~~Kelime/cümle kartları için aralıklı tekrar sistemi~~ (yapıldı: Leitner kutuları)
- ~~Günlük ve haftalık istatistikler~~ (yapıldı: `dil-atlasi-gunluk`)
- ~~Veri şemasına sürüm numarası ve kontrollü migration~~ (yapıldı: `dil-atlasi-surum`)

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
- `index.html` içinde CSP meta etiketi var (`default-src 'self'`). Satır içi betik ve `style=""` özniteliği ekleme; stil `styles.css`'e, betik `app.js`'e gider. `innerHTML` kullanma, `el()` yardımcısı ve `textContent` kullan.

## Çalışma akışı

- Kullanıcı isteği (Eylül 2026): değişiklik bitip iki test de geçince PR aç ve **sormadan birleştir**; her seferinde onay isteme. Birleştirdikten sonra ne değiştiğini kısaca bildir.

## Kabul testi

Otomatik: `node tests/content.test.mjs` ve tarayıcıda `tests/smoke.html` (99 kontrol). Her değişiklikten sonra ikisi de geçmeli.


- Dört dil arasında geçiş yapılabiliyor.
- Her görev işaretlendiğinde ilerleme ve geçmiş güncelleniyor.
- Sayfa yenilendiğinde seçimler korunuyor.
- Sayaç (İlerleme sekmesi) başlatılabiliyor, durdurulabiliyor ve sıfırlanabiliyor.
- Dört sekme arasında geçiş yapılabiliyor; açık sekme yenilemede korunuyor.
- Dinle sekmesindeki ses çalışması bitince `shadow` aşaması işaretleniyor.
- Telaffuz düğmesi doğru dil kodunu kullanıyor.
- Uygulama ana ekrana kurulabiliyor ve standalone açılıyor.
- Ağ kesikken daha önce yüklenen uygulama kabuğu açılıyor.
