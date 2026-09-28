// Dinle (audio) ve İzle (video) kaynakları. Yalnızca ücretsiz, bağlantısı Eylül 2026'da kontrol edilmiş adresler.
// c = grup, n = ad, d = nasıl kullanılır, u = adres, lv = seviye. Uygulama yalnızca bağlantı verir, içerik kopyalamaz.
window.MEDIA = {
  en: {
    audio: [
      {c:'Başlangıç', n:'BBC Real Easy English', d:'Yavaş, günlük konular. İlk ayın dinleme kaynağı.', u:'https://www.bbc.co.uk/learningenglish/english/features/real-easy-english', lv:'A1–A2'},
      {c:'Başlangıç', n:'BBC English You Need', d:'Kısa üniteler; işte kısa molalarda dinle.', u:'https://www.bbc.co.uk/learningenglish/english/course/english-you-need', lv:'A2'},
      {c:'Sonraki adım', n:'Coffee Break English', d:'15–20 dakikalık podcast; podcast uygulamanda aboneliğe al.', u:'https://coffeebreaklanguages.com/english/', lv:'A2'},
      {c:'Sonraki adım', n:'BBC 6 Minute English', d:'Metinli 6 dakikalık bölümler.', u:'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', lv:'A2–B1'}
    ],
    video: [
      {c:'Hiç bilmiyorsan', n:'Peppa Pig (resmî kanal)', d:'Çok basit konuşma, kısa bölümler. İngilizce altyazıyı aç.', u:'https://www.youtube.com/@PeppaPigOfficial', lv:'A0–A1'},
      {c:'Hiç bilmiyorsan', n:'Sıfırdan İngilizce – Tüm Dersler', d:'Türkçe anlatımlı video dersler (bireysel içerik üretici).', u:'https://www.youtube.com/playlist?list=PLSp5ysZy-x8CGlp-eyIMI6jSEtsoNIhGF', lv:'A0'},
      {c:'Öğrenci dizileri', n:'BBC Learning English (YouTube)', d:'Kısa dersler, ekranda İngilizce metin.', u:'https://www.youtube.com/@bbclearningenglish', lv:'A1–B2'},
      {c:'Gerçek konuşma', n:'Easy English', d:'Sokak röportajları; 2–3. aydan sonra.', u:'https://www.youtube.com/@EasyEnglishVideos', lv:'A2+'}
    ]
  },
  fr: {
    audio: [
      {c:'Başlangıç', n:'Coffee Break French — 1. sezon', d:'Sıfırdan başlayanlar için podcast. Açıklamalar İngilizce.', u:'https://coffeebreaklanguages.com/coffeebreakfrench/', lv:'A0–A1'},
      {c:'Başlangıç', n:'Language Transfer — Complete French', d:'Sadece ses, cevabı yüksek sesle verirsin. Ücretsiz; anlatım İngilizce.', u:'https://www.languagetransfer.org/french', lv:'A0–A2'},
      {c:'Sonraki adım', n:'RFI Journal en français facile', d:'Metinli 10 dakikalık haber. 3.–4. aydan sonra.', u:'https://www.rfi.fr/fr/podcasts/journal-fran%C3%A7ais-facile/', lv:'A2–B1'}
    ],
    video: [
      {c:'Hiç bilmiyorsan', n:'Comprehensible French', d:'Resim ve jestlerle sıfırdan anlaşılır Fransızca.', u:'https://www.youtube.com/@comprehensiblefrench', lv:'A0–A2'},
      {c:'Hiç bilmiyorsan', n:'Alice Ayel', d:'Yavaş, görsel destekli hikâyeler.', u:'https://www.youtube.com/@AliceAyel', lv:'A0–A2'},
      {c:'Hiç bilmiyorsan', n:'Trotro (resmî)', d:'Çocuk çizgi filmi; çok basit cümleler.', u:'https://www.youtube.com/@TrotroOfficiel', lv:'A0'},
      {c:'Hiç bilmiyorsan', n:'Fransızca Öğreniyorum – Temel Gramer', d:'Türkçe anlatımlı video dersler (bireysel içerik üretici).', u:'https://www.youtube.com/playlist?list=PLut7QmaL7dSGqVKSjnFttMqwXZ0PoutR8', lv:'A0'},
      {c:'Öğrenci dizileri', n:'TV5MONDE Première classe', d:'Başlangıç video alıştırmaları.', u:'https://apprendre.tv5monde.com/fr/exercices/premiere-classe', lv:'A1'},
      {c:'Gerçek konuşma', n:'Easy French', d:'Sokak röportajları; Fransızca altyazıyla.', u:'https://www.youtube.com/@EasyFrench', lv:'A2+'}
    ]
  },
  it: {
    audio: [
      {c:'Başlangıç', n:'Coffee Break Italian — 1. sezon', d:'Sıfırdan başlayanlar için podcast. Açıklamalar İngilizce.', u:'https://coffeebreaklanguages.com/coffeebreakitalian/', lv:'A0–A1'},
      {c:'Başlangıç', n:'Language Transfer — Complete Italian', d:'Sadece ses, cevabı yüksek sesle verirsin. Ücretsiz; anlatım İngilizce.', u:'https://www.languagetransfer.org/italian', lv:'A0–A2'},
      {c:'Sonraki adım', n:'Podcast Italiano – Principiante', d:'Yavaş anlatılan kısa bölümler.', u:'https://www.podcastitaliano.com/podcast/principiante', lv:'A2–B1'}
    ],
    video: [
      {c:'Hiç bilmiyorsan', n:'Peppa Pig Italiano (resmî)', d:'Çok basit konuşma; İtalyanca altyazıyı aç.', u:'https://www.youtube.com/@PeppaPigItalianoUfficiale', lv:'A0'},
      {c:'Hiç bilmiyorsan', n:'Sıfırdan İtalyanca A1', d:'Türkçe anlatımlı video dersler (bireysel içerik üretici).', u:'https://www.youtube.com/playlist?list=PL01o1TLimF1bsD6P5kHzO-SW2U_xScMFn', lv:'A0–A1'},
      {c:'Hiç bilmiyorsan', n:'İrem\'le İtalya ve İtalyanca', d:'Türkçe anlatımlı kanal (bireysel içerik üretici).', u:'https://www.youtube.com/channel/UC2dtjuYL6kV-JC86VUftXWA', lv:'A0–A1'},
      {c:'Öğrenci dizileri', n:'Learn Italian with Lucrezia', d:'Kısa, anlaşılır dersler.', u:'https://www.youtube.com/@lucreziaoddone', lv:'A1–B1'},
      {c:'Gerçek konuşma', n:'Easy Italian', d:'Sokak röportajları; 2–3. aydan sonra.', u:'https://www.youtube.com/@EasyItalian', lv:'A2+'}
    ]
  },
  de: {
    audio: [
      {c:'Başlangıç', n:'Coffee Break German — 1. sezon', d:'Sıfırdan başlayanlar için podcast. Açıklamalar İngilizce.', u:'https://coffeebreaklanguages.com/coffeebreakgerman/', lv:'A0–A1'},
      {c:'Başlangıç', n:'Language Transfer — Complete German', d:'Sadece ses; anlatım İngilizce. Kurs henüz tamamlanmamış.', u:'https://www.languagetransfer.org/german', lv:'A0–A2'},
      {c:'Başlangıç', n:'DW Deutschtrainer (Türkçe)', d:'Türkçe açıklamalı kısa A1 üniteleri; işte kısa molalar için ideal.', u:'https://learngerman.dw.com/tr/deutschtrainer/c-56407596', lv:'A1'}
    ],
    video: [
      {c:'Hiç bilmiyorsan', n:'DW Nicos Weg A1 (Türkçe arayüz)', d:'Almanca için en iyi başlangıç dizisi: kısa bölümler + alıştırma. Akşam için ana kaynak.', u:'https://learngerman.dw.com/tr/nicos-weg/c-54846011', lv:'A0–A1'},
      {c:'Hiç bilmiyorsan', n:'Peppa Pig Deutsch (resmî)', d:'Çok basit konuşma; Almanca altyazıyı aç.', u:'https://www.youtube.com/@PeppaPigDeutschOffizieller', lv:'A0'},
      {c:'Hiç bilmiyorsan', n:'Die Maus (WDR, resmî)', d:'Çocuklara yönelik kısa bilgi videoları.', u:'https://www.youtube.com/@diemaus', lv:'A1'},
      {c:'Hiç bilmiyorsan', n:'A1 Başlangıç Seviyesi Almanca', d:'Türkçe anlatımlı video dersler (bireysel içerik üretici).', u:'https://www.youtube.com/playlist?list=PLA3O0gt-qHTNN7-iN6UykKW5rnaliMI8y', lv:'A0–A1'},
      {c:'Gerçek konuşma', n:'Easy German', d:'Sokak röportajları; 2–3. aydan sonra.', u:'https://www.youtube.com/@EasyGerman', lv:'A2+'}
    ]
  }
};
