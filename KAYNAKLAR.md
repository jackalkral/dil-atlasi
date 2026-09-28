# Öğrenme kaynakları ve yöntem dayanakları

Bu liste uygulamadaki bağlantıların ve öğrenme tasarımının dayanaklarını bir arada tutar. Haricî sitelerin içerik ve kullanım koşulları kendi sahiplerine aittir; uygulama bu içerikleri kopyalamaz, yalnızca bağlantı verir.

## Benzer uygulamalardan alınanlar (Eylül 2026 araştırması)

| Uygulama | Aldığımız fikir |
|---|---|
| Duolingo | Tek "Bugün" yolu, 5–10 dakikalık birimler, seri (yalnızca motivasyon; öğrenme kanıtı değil) |
| Pimsleur, Glossika, Language Transfer | Eller serbest ses çalışması: Türkçe ipucu → ara → hedef dil (önce üret, sonra dinle) |
| Anki, Skola, Idiomap | Aralıklı tekrar kutuları, günlük sınırlı kuyruk, arka uç olmadan localStorage |
| Mango, Glossika | Kelime aynı gün cümle içinde; cümle kurma |
| Dreaming French, Easy Languages, DW Nicos Weg | Akşam için seviyeli video listesi, hedef dilde altyazı |
| Language Reactor | Bilgisayarda çift altyazı önerisi (yalnızca masaüstü) |
| ChatGPT Voice, Claude ses modu | Konuşma pratiği uygulama dışına, kullanıcı dokununca devredilir |

Bağımsız kanıt sınırlı: Kim vd. 2026 (SSLA, 183 Fransızca başlangıç öğrencisi) Duolingo ile sınıfın benzer, birlikte kullanımın daha iyi olduğunu buldu. Vesselinov & Grego (Duolingo 2012, Busuu 2016) şirket destekli ve kontrol grubu yok. Loewen vd. 2020 (Babbel) kontrol grubu yok, %36 bırakma. Birden fazla dili aynı anda öğrenmede benzer kelimelerde karışma artar (Bartolotti & Marian, https://pmc.ncbi.nlm.nih.gov/articles/PMC7451201).

Ses: `speechSynthesis` iOS'ta ekran kilitlenince durur (https://weboutloud.io/bulletin/speech_synthesis_in_safari/). Kilitli ekranda dinleme için tek parça ses dosyası + Media Session gerekir; iOS PWA'da parçalar arası otomatik geçiş hatası var (WebKit 261858).

## Uygulamadaki yöntemler ve kanıt düzeyi

### Doğrulama notu (Eylül 2026)

Kullanıcının paylaştığı özet tek tek kontrol edildi:
- Aralıklı tekrar (Kim & Webb 2022): 48 deney, 3.411 katılımcı; uzun aralık gecikmeli testte daha iyi; eşit ve genişleyen aralık farksız. **Doğru.**
- Bilinçli kelime etkinlikleri (Webb, Yanagisawa & Uchihara 2020, https://doi.org/10.1111/modl.12671): 22 çalışma; biçim hatırlama %58,5 → gecikmeli %25,1. **Doğru**; tek kelime yerine cümle ve üretim gerekçesi.
- Video (Sutton & Webb 2026, https://doi.org/10.1017/S0272263126101612): öğretici video g = 1,61, ders 1,31, TED 1,23, **belgesel 1,21**; film ,53 ve dizi ,51 anlamlı değil. Özetteki "belgesel zayıf" ifadesi **yanlış**.
- Diyalog sistemleri (Hou & Min, ReCALL 2025/2026, https://doi.org/10.1017/S0958344025100268): 16 çalışma, g = ,61; hedefe yönelik sistemler daha etkili. **Büyük ölçüde doğru.**
- Düzeltici geri bildirim (Li 2010): 33 çalışma, d = ,61, kalıcı. **Doğru.**
- Fonetik eğitim (Uchihara, Karas & Thomson 2025, SSLA): 79 çalışma, kontrol grubuna göre g = ,67; kalıcı. **Doğru**, ama ölçülen algı (üretim ayrı).
- Geniş okuma (Educational Psychology Review 2025, https://doi.org/10.1007/s10648-025-10068-6): küçük–orta etkiler; seviye sınırlama ve hesap verebilirlik etkili. **Doğru.**
- Açık/örtük öğretim (Spada & Tomita 2010): 41 çalışma, açık öğretim daha etkili. **Doğru.**
- 4 dil için %70/%20/%10: **araştırma yok, görüş.**

Resim ve emoji: Lotto & de Groot 1998 ve Carpenter & Olson 2012'ye göre resim tek başına çeviriden iyi değil ve fazla özgüven yaratabilir; hatırlama pratiğiyle birlikte somut isimlerde ek ipucu olarak kullanılır. Emoji için uzun süreli kanıt yok (tek küçük tanıma çalışması).

Sıklık: Nation 2006 — anlamak için %95–98 kapsama gerekir; FR/DE/ES'de ilk 2.000 lemma konuşmanın ~%90'ını kapsar. A0 için öneri: önce hayatta kalma kalıpları, sonra en sık ~1.000 lemma. Açık lisanslı listeler: hermitdave/FrequencyWords (CC BY-SA 4.0), NGSL (CC BY-SA 4.0), Lexique (CC BY-SA 4.0), wordfreq verisi (CC BY-SA 4.0). SUBTLEX-DE (CC BY-NC-ND) uygulamaya konamaz.

Günlük plan, Paul Nation'ın "dört kol" dengesine göre kurulu: anlaşılır girdi, anlamlı konuşma, bilinçli dil çalışması ve akıcılık (Nation 2007, https://doi.org/10.2167/illt039.0).

| Yöntem | Uygulamadaki karşılığı | Kanıt | Kaynak |
|---|---|---|---|
| Aralıklı tekrar ve hatırlama | Tekrar kartları (1-3-7-14-30 gün) | Meta-analiz | Kim & Webb 2022 — https://doi.org/10.1111/lang.12479 |
| Anlaşılır, bol girdi | Dinle ve izle; seviye %95–98 anlaşılır olmalı | Meta-analiz | Nakanishi 2015 — https://doi.org/10.1002/tesq.157 · Nation 2006 — https://doi.org/10.3138/cmlr.63.1.59 |
| Hedef dilde altyazı | Videoyu hedef dilde altyazıyla izle | Meta-analiz + deney | Montero Perez vd. 2013 — https://doi.org/10.1016/j.system.2013.07.013 · Mitterer & McQueen 2009 — https://doi.org/10.1371/journal.pone.0007785 |
| Shadowing | Shadowing bloğu | Birkaç küçük çalışma | Hamada 2016 — https://doi.org/10.1177/1362168815597504 |
| Konuşma ve etkileşim | Konuşma görevi, antrenör, haftalık gerçek sohbet | Meta-analiz | Mackey & Goo 2007 (OUP, DOI yok) |
| Düzeltici geri bildirim | Antrenör komutu önce kendin düzeltmeni ister; kayıt dinleme | Meta-analiz | Li 2010 — https://doi.org/10.1111/j.1467-9922.2010.00561.x · Lyster & Saito 2010 — https://doi.org/10.1017/S0272263109990520 |
| 4/3/2 akıcılık | Konuşma görevindeki sayaç | Deney | de Jong & Perfetti 2011 — https://doi.org/10.1111/j.1467-9922.2010.00620.x |
| Kalıp ifadeler | Dersler tek kelime değil, tam cümle | Derleme | Boers & Lindstromberg 2012 — https://doi.org/10.1017/S0267190512000050 |
| Görev temelli öğrenme | Seyahat, toplantı ve mülakat görevleri | Meta-analiz (dikkatli yorumla) | Bryfonski & McKay 2019 — https://doi.org/10.1177/1362168817744389 |
| Açık telaffuz eğitimi | Ders ipuçları, shadowing | Meta-analiz | Lee, Jang & Plonsky 2015 — https://doi.org/10.1093/applin/amu040 |

Kanıtı zayıf ya da yanıltıcı olanlar: öğrenme stilleri (Pashler vd. 2008 — https://doi.org/10.1111/j.1539-6053.2009.01038.x), konuşmadan yalnızca dinleme, "3 ayda akıcı" türü vaatler. Seri ve rozetler yalnızca motivasyon içindir.

Not: Nakanishi 2015, Montero Perez 2013 ve Lee vd. 2015'in etki büyüklükleri özetlerden alındı; tam metin okunmadı.

## Ortak yöntem

- Avrupa Konseyi CEFR seviyeleri ve “yapabilirim” tanımları: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions
- Aralıklı çalışmanın ikinci dil öğrenimine etkisi — meta-analiz: https://doi.org/10.1111/lang.12479
- Altyazılı videonun dinleme ve kelime öğrenimine etkisi — meta-analiz: https://doi.org/10.1016/j.system.2013.07.013
- Anki ve ücretsiz AnkiWeb eşitleme hizmeti: https://apps.ankiweb.net/

## Dört dil için A0 kaynakları (content/media.js)

Dinle ve İzle sekmelerindeki bağlantılar Eylül 2026'da tek tek açılarak kontrol edildi. Öne çıkanlar:
- Fransızca/İtalyanca/Almanca ses: Coffee Break 1. sezon, Language Transfer (ücretsiz; anlatım İngilizce)
- Almanca: DW Nicos Weg A1 Türkçe arayüz (https://learngerman.dw.com/tr/nicos-weg/c-54846011), DW Deutschtrainer Türkçe
- Fransızca video: Comprehensible French, Alice Ayel, Trotro; İtalyanca: Peppa Pig Italiano, Learn Italian with Lucrezia
- Türkçe anlatımlı YouTube listeleri (bireysel içerik üreticiler; kalite denetlenmedi)
- Kelime listeleri: Oxford 3000, Goethe A1 Wortliste (https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf), De Mauro temel kelimeler, Wiktionary sıklık listeleri
- Doğrulanamayan: ChatGPT ücretsiz ses süresi (resmî sayı yok), claude.ai/new?q=, ARD/ZDF/RaiPlay/ARTE Türkiye'den coğrafi erişim

## İngilizce

- British Council LearnEnglish ücretsiz materyalleri: https://learnenglish.britishcouncil.org/free-resources
- British Council A1 dinleme: https://learnenglish.britishcouncil.org/free-resources/listening/a1
- British Council A1 konuşma: https://learnenglish.britishcouncil.org/free-resources/speaking/a1
- VOA Let's Learn English — Level 1: https://learningenglish.voanews.com/p/5644.html
- BBC Learning English — 6 Minute English (A2–B1 dinleme): https://www.bbc.co.uk/learningenglish/english/features/6-minute-english

### Dinle ve izle (İngilizce, Eylül 2026'da bağlantısı kontrol edildi)

- BBC 6 Minute English (B1): https://www.bbc.co.uk/learningenglish/english/features/6-minute-english
- BBC Real Easy English (A2): https://www.bbc.co.uk/learningenglish/english/features/real-easy-english
- BBC English at Work (B1): https://www.bbc.co.uk/learningenglish/english/features/english-at-work
- British Council Business English (B1–B2): https://learnenglish.britishcouncil.org/free-resources/business
- BBC Learning English YouTube, Easy English, Rachel's English, TED, Professor Messer, Darknet Diaries (B2+), VOA Learning English (2025 bütçe kesintilerinden sonra yeni içerik belirsiz), Breaking News English, ER Central, YouGlish

## Fransızca

- TV5MONDE Première classe: https://apprendre.tv5monde.com/fr/exercices/premiere-classe
- RFI Journal en français facile: https://francaisfacile.rfi.fr/fr/podcasts/journal-en-francais-facile/
- Türk öğrenciler için Fransızca dilbilgisi güçlükleri: https://dergipark.org.tr/tr/pub/hunefd/article/102334

### Dinle ve izle (Fransızca)

- Coffee Break French 1. sezon (A0): https://coffeebreaklanguages.com/coffeebreakfrench/ — podcast ücretsiz, ders notları ücretli (gerekmez)
- RFI Journal en français facile (A2–B1): https://www.rfi.fr/fr/podcasts/journal-en-fran%C3%A7ais-facile/
- Easy French, Comme une Française, Français avec Pierre, innerFrench (YouTube); BBC Languages French (eski arşiv); 1jour1actu
- Doğrulanamayanlar: Extr@ (resmî kaynak bulunamadı, bağlanmadı), ücretsiz ve yasal tam dizi/film kaynağı bulunamadı.

## İtalyanca

- İtalya Göçmen Entegrasyon Portalı — çevrimiçi İtalyanca kaynakları: https://www.integrazionemigranti.gov.it/en-gb/Dettaglio-approfondimento/id/53
- Online Italian Club A1 alıştırmaları: https://onlineitalianclub.com/free-italian-exercises-and-resources/online-italian-course-beginner-level-a1/

## Almanca

- Deutsche Welle Nicos Weg: https://learngerman.dw.com/en/nicos-weg/c-36519789
- Goethe-Institut Deutsch für dich: https://www.goethe.de/prj/dfd/en/home.cfm
- Goethe-Institut ücretsiz Almanca alıştırmaları: https://www.goethe.de/en/spr/ueb.html
