// İtalyanca A0 → A1, 30 ders. t: başlık (Türkçe), n: Türkçe ipucu, w: [kelime, Türkçesi] x8, p: [cümle, Türkçesi] x5
window.LESSONS = window.LESSONS || {};
window.LESSONS.it = [
  {t:"Selamlaşma", n:"ci 'çi', gi 'ci' okunur: ciao 'çao', buongiorno 'bon-cor-no'. Hâl sorarken essere değil stare kullanılır: Come stai?",
    w:[["ciao","merhaba / hoşça kal (samimi)","ÇAO"],["buongiorno","günaydın / iyi günler","buon-COR-no"],["buonasera","iyi akşamlar","buo-na-SE-ra"],["arrivederci","hoşça kal","ar-ri-ve-DER-çi"],["per favore","lütfen","per fa-VO-re"],["grazie","teşekkürler","GRA-tsie"],["sì","evet","Sİ"],["no","hayır","NO"]],
    p:[["Ciao, come stai?","Merhaba, nasılsın?"],["Sto bene, grazie.","İyiyim, teşekkürler."],["Buongiorno a tutti!","Herkese günaydın!"],["Ci vediamo!","Görüşürüz!"],["Grazie mille.","Çok teşekkürler."]]},

  {t:"Kendini tanıtma", n:"ch 'k' okunur: mi chiamo 'mi kiamo'. Nereli olduğunu söylemek için: Vengo dalla Turchia veya Sono di Ankara.",
    w:[["il nome","ad, isim","il NO-me"],["io","ben","İ-o"],["tu","sen","TU"],["la Turchia","Türkiye","la tur-Kİ-a"],["turco / turca","Türk (erkek / kadın)","TUR-ko / TUR-ka"],["di dove?","nereli?","di DO-ve"],["piacere","memnun oldum","pia-ÇE-re"],["e","ve","E"]],
    p:[["Mi chiamo Ahmet.","Benim adım Ahmet."],["Come ti chiami?","Senin adın ne?"],["Vengo dalla Turchia.","Türkiye'denim."],["Di dove sei?","Sen nerelisin?"],["Piacere di conoscerti.","Tanıştığımıza memnun oldum."]]},

  {t:"Sayılar", n:"Yaş avere ile söylenir: Ho trent'anni (otuz yılım var). Çift ünsüzü uzat: sette 'set-te', quattro 'kuat-tro'.",
    w:[["uno","bir","U-no"],["due","iki","DU-e"],["tre","üç","TRE"],["quattro","dört","KUAT-tro"],["cinque","beş","ÇİN-kue"],["sei","altı","SEY"],["sette","yedi","SET-te"],["dieci","on","DİE-çi"]],
    p:[["Quanti anni hai?","Kaç yaşındasın?"],["Ho trent'anni.","Otuz yaşındayım."],["Qual è il tuo numero di telefono?","Telefon numaran ne?"],["Due caffè, per favore.","İki kahve, lütfen."],["Ho tre giorni liberi.","Üç boş günüm var."]]},

  {t:"Nasılsın?", n:"Açlık ve susuzluk avere ile: ho fame, ho sete (açlığım var). Sıfat cinsiyete uyar: stanco (erkek), stanca (kadın).",
    w:[["bene","iyi","BE-ne"],["male","kötü","MA-le"],["stanco / stanca","yorgun (erkek / kadın)","STAN-ko / STAN-ka"],["felice","mutlu","fe-Lİ-çe"],["avere fame","aç olmak","a-VE-re FA-me"],["avere sete","susamış olmak","a-VE-re SE-te"],["un po'","biraz","un PO"],["molto","çok","MOL-to"]],
    p:[["Oggi sono molto stanco.","Bugün çok yorgunum."],["Ho un po' di fame.","Biraz açım."],["Sei felice?","Mutlu musun?"],["Non c'è male.","Fena değil."],["E tu, come stai?","Sen nasılsın?"]]},

  {t:"Aile", n:"Tekil aile üyelerinde artikel düşer: mia madre, mio fratello; ama la mia famiglia. gli 'lyi' okunur: famiglia 'fa-mi-lya'.",
    w:[["la madre","anne","la MA-dre"],["il padre","baba","il PA-dre"],["il fratello","erkek kardeş","il fra-TEL-lo"],["la sorella","kız kardeş","la so-REL-la"],["il marito / la moglie","eş (koca / karı)","il ma-Rİ-to / la MO-lye"],["il figlio / la figlia","çocuk (oğul / kız)","il Fİ-lyo / la Fİ-lya"],["la famiglia","aile","la fa-Mİ-lya"],["l'amico (m.) / l'amica (f.)","arkadaş","la-Mİ-ko / la-Mİ-ka"]],
    p:[["Questa è la mia famiglia.","Bu benim ailem."],["Ho un fratello.","Bir erkek kardeşim var."],["Mia madre si chiama Ayşe.","Annemin adı Ayşe."],["Hai figli?","Çocuğun var mı?"],["Lui è un mio amico.","O benim arkadaşım."]]},

  {t:"İş ve meslek", n:"Fiil sonu özneyi gösterir, io genelde söylenmez: Lavoro = çalışıyorum. zi 'tsi' okunur: azienda 'a-tsien-da'.",
    w:[["il lavoro","iş","il la-VO-ro"],["lavorare","çalışmak","la-vo-RA-re"],["l'ufficio (m.)","ofis","luf-Fİ-ço"],["il computer","bilgisayar","il kom-PYU-ter"],["l'azienda (f.)","şirket","la-TSİEN-da"],["la riunione","toplantı","la riu-NYO-ne"],["il / la collega","meslektaş, iş arkadaşı","il / la kol-LE-ga"],["la sicurezza informatica","siber güvenlik","la si-ku-RET-tsa in-for-MA-ti-ka"]],
    p:[["Che lavoro fai?","Ne iş yapıyorsun?"],["Lavoro nella sicurezza informatica.","Siber güvenlikte çalışıyorum."],["Lavoro in un'azienda.","Bir şirkette çalışıyorum."],["Oggi ho una riunione.","Bugün bir toplantım var."],["Il mio ufficio è in centro.","Ofisim şehir merkezinde."]]},

  {t:"Kafede", n:"z ile başlayan eril isimler lo alır: lo zucchero. Dikkat: latte sadece süttür; sütlü kahve için caffè latte veya cappuccino de.",
    w:[["il caffè","kahve","il kaf-FE"],["il tè","çay","il TE"],["l'acqua (f.)","su","LAK-kua"],["il latte","süt","il LAT-te"],["lo zucchero","şeker","lo DZUK-ke-ro"],["un / una …, per favore","bir … lütfen","un / U-na … per fa-VO-re"],["il conto","hesap","il KON-to"],["quanto costa?","ne kadar?","KUAN-to KOS-ta"]],
    p:[["Un caffè, per favore.","Bir kahve, lütfen."],["Con latte, senza zucchero.","Sütlü, şekersiz."],["Avete dell'acqua?","Suyunuz var mı?"],["Quanto costa?","Ne kadar?"],["Il conto, per favore.","Hesap, lütfen."]]},

  {t:"Yemek ve içecek", n:"Sevmek için piacere: Mi piace il pesce (balık bana hoş gelir). Çoğulda piacciono: Mi piacciono le verdure.",
    w:[["il pane","ekmek","il PA-ne"],["il formaggio","peynir","il for-MAC-co"],["la carne","et","la KAR-ne"],["il pollo","tavuk","il POL-lo"],["il pesce","balık","il PE-şe"],["la verdura","sebze","la ver-DU-ra"],["la frutta","meyve","la FRUT-ta"],["la colazione","kahvaltı","la ko-la-TSYO-ne"]],
    p:[["A colazione mangio pane e formaggio.","Kahvaltıda ekmek ve peynir yerim."],["Mi piace il pesce.","Balık severim."],["Non mangio carne.","Et yemem."],["Hai fame?","Aç mısın?"],["Questo è molto buono.","Bu çok lezzetli."]]},

  {t:"Günler ve saat", n:"Saat çoğul le ile söylenir: Sono le otto; yalnız saat bir için È l'una. Gün adları küçük harfle yazılır: lunedì.",
    w:[["oggi","bugün","OC-ci"],["domani","yarın","do-MA-ni"],["ieri","dün","İE-ri"],["il lunedì","pazartesi","il lu-ne-Dİ"],["il fine settimana","hafta sonu","il Fİ-ne set-ti-MA-na"],["l'ora (f.)","saat (zaman)","LO-ra"],["la mattina","sabah","la mat-Tİ-na"],["la sera","akşam","la SE-ra"]],
    p:[["Che ore sono?","Saat kaç?"],["Sono le otto.","Saat sekiz."],["Oggi è lunedì.","Bugün pazartesi."],["Domani lavoro.","Yarın çalışıyorum."],["Il fine settimana sono libero.","Hafta sonu boşum."]]},

  {t:"Günlük rutin", n:"-si ile biten fiiller dönüşlüdür: alzarsi → mi alzo, ti alzi. 'Saat …te' = alle: alle sette, alle undici.",
    w:[["svegliarsi","uyanmak","zve-LYAR-si"],["alzarsi","kalkmak","al-TSAR-si"],["fare colazione","kahvaltı etmek","FA-re ko-la-TSYO-ne"],["andare al lavoro","işe gitmek","an-DA-re al la-VO-ro"],["tornare a casa","eve dönmek","tor-NA-re a KA-za"],["cucinare","yemek yapmak","ku-çi-NA-re"],["dormire","uyumak","dor-Mİ-re"],["ogni giorno","her gün","O-nyi COR-no"]],
    p:[["Mi alzo alle sette.","Saat yedide kalkarım."],["Vado al lavoro ogni giorno.","Her gün işe giderim."],["La sera torno a casa.","Akşam eve dönerim."],["La sera cucino.","Akşam yemek yaparım."],["Vado a letto alle undici.","Saat on birde yatarım."]]},

  {t:"Ev", n:"'Var' demek için c'è (tekil) ve ci sono (çoğul). ci 'çi' okunur: cucina 'ku-çi-na'.",
    w:[["la casa","ev","la KA-za"],["l'appartamento (m.)","daire","lap-par-ta-MEN-to"],["la stanza","oda","la STAN-tsa"],["la cucina","mutfak","la ku-Çİ-na"],["il bagno","banyo","il BA-nyo"],["il soggiorno","salon","il sod-COR-no"],["la porta","kapı","la POR-ta"],["la finestra","pencere","la fi-NES-tra"]],
    p:[["Abito in un appartamento.","Bir dairede yaşıyorum."],["A casa mia ci sono tre stanze.","Evimde üç oda var."],["La cucina è piccola.","Mutfak küçük."],["Il soggiorno è grande e luminoso.","Salon büyük ve aydınlık."],["Puoi chiudere la porta?","Kapıyı kapatır mısın?"]]},

  {t:"Şehirde yön", n:"Yabancıya Lei ile konuş: Scusi (affedersiniz), Giri, Vada. Scusa ise arkadaşa söylenir.",
    w:[["dove","nerede","DO-ve"],["a destra","sağda / sağa","a DES-tra"],["a sinistra","solda / sola","a si-NİS-tra"],["dritto","düz","DRİT-to"],["vicino","yakın","vi-Çİ-no"],["lontano","uzak","lon-TA-no"],["la strada","cadde, yol","la STRA-da"],["l'angolo (m.)","köşe","LAN-go-lo"]],
    p:[["Scusi, dov'è la stazione?","Affedersiniz, istasyon nerede?"],["Vada sempre dritto.","Düz gidin."],["Giri a sinistra.","Sola dönün."],["È lontano?","Uzak mı?"],["All'angolo, a destra.","Köşede, sağda."]]},

  {t:"Ulaşım", n:"Araçla gitmek in ile: in treno, in macchina, in metro; yürüyerek ise a piedi. gli 'lyi': biglietto 'bi-lyet-to'.",
    w:[["l'autobus (m.)","otobüs","LAU-to-bus"],["la metro","metro","la ME-tro"],["il treno","tren","il TRE-no"],["il taxi","taksi","il TAK-si"],["il biglietto","bilet","il bi-LYET-to"],["la fermata","durak","la fer-MA-ta"],["la macchina","araba","la MAK-ki-na"],["a piedi","yürüyerek","a PİE-di"]],
    p:[["Vado al lavoro in metro.","Metroyla işe giderim."],["Un biglietto, per favore.","Bir bilet, lütfen."],["Dov'è la fermata dell'autobus?","Otobüs durağı nerede?"],["A che ora parte il treno?","Tren saat kaçta kalkıyor?"],["Vado a piedi.","Yürüyerek gidiyorum."]]},

  {t:"Alışveriş ve fiyat", n:"Mağazada 'alıyorum' için comprare yerine Prendo daha doğal. zz uzun 'ts' okunur: prezzo 'pret-tso'.",
    w:[["il negozio","dükkân, mağaza","il ne-GO-tsio"],["il supermercato","market","il su-per-mer-KA-to"],["il prezzo","fiyat","il PRET-tso"],["economico","ucuz","e-ko-NO-mi-ko"],["caro","pahalı","KA-ro"],["i contanti","nakit","i kon-TAN-ti"],["la carta","kart","la KAR-ta"],["comprare","satın almak","kom-PRA-re"]],
    p:[["Quanto costa questo?","Bu ne kadar?"],["È molto caro.","Çok pahalı."],["Posso pagare con la carta?","Kartla ödeyebilir miyim?"],["Prendo questo.","Bunu alıyorum."],["Non mi serve la busta, grazie.","Poşete gerek yok, teşekkürler."]]},

  {t:"Renkler ve kıyafet", n:"Renk ismin arkasına gelir ve uyar: camicia bianca, pantaloni neri. Blu değişmez. Pantaloni hep çoğuldur.",
    w:[["rosso","kırmızı","ROS-so"],["blu","mavi","BLU"],["nero","siyah","NE-ro"],["bianco","beyaz","BİAN-ko"],["la camicia","gömlek","la ka-Mİ-ça"],["i pantaloni","pantolon","i pan-ta-LO-ni"],["le scarpe","ayakkabı(lar)","le SKAR-pe"],["la giacca","ceket","la CAK-ka"]],
    p:[["Cerco una giacca blu.","Mavi bir ceket arıyorum."],["Posso provarla?","Deneyebilir miyim?"],["È troppo piccola.","Bu çok küçük."],["Ce l'ha in nero?","Siyahı var mı?"],["Mi piace la camicia bianca.","Beyaz gömleği seviyorum."]]},

  {t:"Hava durumu", n:"Hava çoğunlukla fare ile anlatılır: fa caldo, fa freddo, fa bel tempo. Il tempo hem 'hava' hem 'zaman' demektir.",
    w:[["il tempo","hava","il TEM-po"],["il sole","güneş","il SO-le"],["la pioggia","yağmur","la PİOC-ca"],["la neve","kar","la NE-ve"],["il vento","rüzgâr","il VEN-to"],["caldo","sıcak","KAL-do"],["freddo","soğuk","FRED-do"],["nuvoloso","bulutlu","nu-vo-LO-zo"]],
    p:[["Che tempo fa oggi?","Bugün hava nasıl?"],["Il tempo è bellissimo.","Hava çok güzel."],["Oggi piove.","Bugün yağmur yağıyor."],["Oggi fa freddo.","Bugün soğuk."],["Domani ci sarà il sole.","Yarın hava güneşli olacak."]]},

  {t:"Sevdiklerim", n:"Mi piace + tekil, mi piacciono + çoğul. Amare daha çok insanlar için kullanılır; hobiler için piacere de.",
    w:[["piacere","hoşa gitmek, sevmek","pia-ÇE-re"],["la musica","müzik","la MU-zi-ka"],["il film","film","il FİLM"],["il libro","kitap","il Lİ-bro"],["lo sport","spor","lo SPORT"],["il calcio","futbol","il KAL-ço"],["nuotare","yüzmek","nuo-TA-re"],["leggere","okumak","LEC-ce-re"]],
    p:[["Mi piace la musica.","Müziği severim."],["Non mi piace il calcio.","Futbolu sevmem."],["La sera leggo un libro.","Akşamları kitap okurum."],["Che genere di film ti piace?","Ne tür filmler seversin?"],["Che cosa ti piace di più?","En çok neyi seversin?"]]},

  {t:"Köpeğim ve hayvanlar", n:"Köpeğe Bravo! (dişiye Brava!) denir. gli 'lyi': guinzaglio 'guin-tsa-lyo'. Yürüyüş yapmak = fare una passeggiata.",
    w:[["il cane","köpek","il KA-ne"],["il gatto","kedi","il GAT-to"],["il parco","park","il PAR-ko"],["il guinzaglio","tasma","il guin-TSA-lyo"],["la passeggiata","yürüyüş","la pas-sec-CA-ta"],["giocare","oynamak","co-KA-re"],["la palla","top","la PAL-la"],["Bravo!","Aferin! / İyi çocuk!","BRA-vo"]],
    p:[["Ho un cane.","Bir köpeğim var."],["Si chiama Max.","Onun adı Max. (köpeğinin adını söyle)"],["Ogni mattina facciamo una passeggiata al parco.","Her sabah parkta yürüyüş yapıyoruz."],["Al mio cane piace giocare con la palla.","Köpeğim topla oynamayı sever."],["Posso accarezzare il tuo cane?","Köpeğini sevebilir miyim?"]]},

  {t:"Sağlık ve beden", n:"Ağrı avere mal di ile: ho mal di testa, ho mal di schiena. sch 'sk' okunur: schiena 'skie-na'.",
    w:[["la testa","baş","la TES-ta"],["lo stomaco","mide","lo STO-ma-ko"],["la schiena","sırt","la SKİE-na"],["il dolore","ağrı","il do-LO-re"],["il medico","doktor","il ME-di-ko"],["la farmacia","eczane","la far-ma-Çİ-a"],["la medicina","ilaç","la me-di-Çİ-na"],["malato","hasta","ma-LA-to"]],
    p:[["Ho mal di testa.","Başım ağrıyor."],["Sono malato.","Hastayım."],["Dov'è la farmacia?","Eczane nerede?"],["Devo andare dal medico.","Doktora gitmem lazım."],["Guarisci presto!","Geçmiş olsun!"]]},

  {t:"Otelde", n:"Otel odası la camera'dır; la stanza genel anlamda oda. Qual è kesmesiz yazılır, dov'è ise kesmeyle.",
    w:[["l'albergo (m.)","otel","lal-BER-go"],["la camera","(otel) oda(sı)","la KA-me-ra"],["la prenotazione","rezervasyon","la pre-no-ta-TSYO-ne"],["la chiave","anahtar","la KİA-ve"],["la notte","gece","la NOT-te"],["la colazione","kahvaltı","la ko-la-TSYO-ne"],["l'ascensore (m.)","asansör","la-şen-SO-re"],["la password del Wi-Fi","Wi-Fi şifresi","la PAS-vord del UAY-fay"]],
    p:[["Ho una prenotazione.","Rezervasyonum var."],["Per due notti.","İki gece için."],["La colazione è inclusa?","Kahvaltı dahil mi?"],["Qual è la password del Wi-Fi?","Wi-Fi şifresi ne?"],["Dov'è l'ascensore?","Asansör nerede?"]]},

  {t:"Restoranda", n:"Garsona Lei ile hitap et: Che cosa mi consiglia? Sipariş verirken Prendo… de. Hesapta 'coperto' (servis) ücreti olabilir.",
    w:[["il tavolo","masa","il TA-vo-lo"],["il menù","menü","il me-NU"],["il cameriere","garson","il ka-me-RİE-re"],["l'ordinazione (f.)","sipariş","lor-di-na-TSYO-ne"],["il dolce","tatlı","il DOL-çe"],["la bevanda","içecek","la be-VAN-da"],["buono","lezzetli, iyi","BUO-no"],["il conto","hesap","il KON-to"]],
    p:[["Un tavolo per due, per favore.","İki kişilik bir masa, lütfen."],["Posso avere il menù?","Menüyü alabilir miyim?"],["Che cosa mi consiglia?","Ne tavsiye edersiniz?"],["Prendo il pesce.","Balık alacağım."],["Era buonissimo, grazie!","Çok lezzetliydi, teşekkürler!"]]},

  {t:"Telefon ve randevu", n:"Telefonu Pronto ile aç. Kibar istek için Vorrei… (isterdim) ve Lei ile Può…? kullan. appuntamento'da pp ve nt'yi belirgin söyle.",
    w:[["il telefono","telefon","il te-LE-fo-no"],["chiamare","aramak","kia-MA-re"],["il messaggio","mesaj","il mes-SAC-co"],["l'appuntamento (m.)","randevu","lap-pun-ta-MEN-to"],["disponibile","müsait","dis-po-Nİ-bi-le"],["cancellare","iptal etmek","kan-çel-LA-re"],["di nuovo","tekrar","di NUO-vo"],["piano","yavaş","PİA-no"]],
    p:[["Pronto, sono Ahmet.","Alo, ben Ahmet."],["Vorrei prendere un appuntamento.","Randevu almak istiyorum."],["È disponibile giovedì?","Perşembe müsait misiniz?"],["Può ripetere, per favore?","Tekrar eder misiniz, lütfen?"],["Può parlare più piano?","Daha yavaş konuşur musunuz?"]]},

  {t:"İş yerinde", n:"Makineler için lavorare değil funzionare: non funziona. Il problema -a ile bitse de erildir. Pronto burada 'hazır' demek.",
    w:[["la mail","e-posta","la MEYL"],["la password","şifre","la PAS-vord"],["lo schermo","ekran","lo SKER-mo"],["il file","dosya","il FAYL"],["la stampante","yazıcı","la stam-PAN-te"],["l'aiuto (m.)","yardım","la-YU-to"],["il problema","sorun","il pro-BLE-ma"],["pronto / pronta","hazır","PRON-to / PRON-ta"]],
    p:[["Il mio computer non funziona.","Bilgisayarım çalışmıyor."],["Ho dimenticato la password.","Şifremi unuttum."],["Ti ho mandato una mail.","Sana bir e-posta gönderdim."],["C'è un problema.","Bir sorun var."],["La riunione è pronta?","Toplantı hazır mı?"]]},

  {t:"Dün ne yaptın? (geçmiş zaman)", n:"Hareket fiilleri essere alır ve özneye uyar: sono andato / sono andata. Çoğu fiil avere alır: ho mangiato, ho visto.",
    w:[["ieri","dün","İE-ri"],["la settimana scorsa","geçen hafta","la set-ti-MA-na SKOR-sa"],["ho fatto","yaptım","o FAT-to"],["sono andato / andata","gittim (erkek / kadın)","SO-no an-DA-to / an-DA-ta"],["ho mangiato","yedim","o man-CA-to"],["ho guardato","izledim","o guar-DA-to"],["ho visto","gördüm","o VİS-to"],["ho lavorato","çalıştım","o la-vo-RA-to"]],
    p:[["Ieri ho lavorato molto.","Dün çok çalıştım."],["Ieri sera ho guardato un film.","Dün akşam bir film izledim."],["La settimana scorsa sono andato a Istanbul.","Geçen hafta İstanbul'a gittim."],["Ho mangiato al ristorante.","Restoranda yemek yedim."],["Che cosa hai fatto ieri?","Dün ne yaptın?"]]},

  {t:"Yarın ne yapacaksın? (gelecek)", n:"Yakın plan için şimdiki zaman yeter: Domani lavoro. Gelecek zamanda vurgu sondadır: farò, andrò. Il programma eril!",
    w:[["domani","yarın","do-MA-ni"],["la settimana prossima","gelecek hafta","la set-ti-MA-na PROS-si-ma"],["il programma","plan","il pro-GRAM-ma"],["farò","yapacağım","fa-RO"],["andrò","gideceğim","an-DRO"],["incontrare","buluşmak","in-kon-TRA-re"],["le vacanze","tatil","le va-KAN-tse"],["forse","belki","FOR-se"]],
    p:[["Che cosa farai domani?","Yarın ne yapacaksın?"],["Domani incontro i miei amici.","Yarın arkadaşlarımla buluşacağım."],["La settimana prossima andrò in vacanza.","Gelecek hafta tatile gideceğim."],["Forse andiamo al cinema.","Belki sinemaya gideriz."],["Hai dei programmi?","Planın var mı?"]]},

  {t:"Boş zaman ve hafta sonu", n:"Şu an süren iş: stare + -ando/-endo: sto guardando. sc + e/i 'ş' okunur: uscire 'u-şi-re', esco ise 'es-ko'.",
    w:[["riposarsi","dinlenmek","ri-po-ZAR-si"],["la televisione","televizyon","la te-le-vi-ZYO-ne"],["la serie","dizi","la SE-rie"],["la passeggiata","yürüyüş","la pas-sec-CA-ta"],["gli amici","arkadaşlar","lyi a-Mİ-çi"],["il cinema","sinema","il Çİ-ne-ma"],["a casa","evde","a KA-za"],["fuori","dışarı(da)","FUO-ri"]],
    p:[["Il fine settimana mi riposo a casa.","Hafta sonu evde dinlenirim."],["La sera guardo la televisione.","Akşam televizyon izlerim."],["Sto guardando una serie.","Bir dizi izliyorum."],["Usciamo con gli amici.","Arkadaşlarla dışarı çıkarız."],["Che cosa fai il fine settimana?","Hafta sonu ne yapıyorsun?"]]},

  {t:"Havaalanı ve seyahat", n:"Rötar essere in ritardo ile söylenir: il volo è in ritardo. Tatildeyim = sono in vacanza. gi 'ci': valigia 'va-li-ca'.",
    w:[["l'aeroporto (m.)","havaalanı","la-e-ro-POR-to"],["l'aereo (m.)","uçak","la-E-re-o"],["il volo","uçuş","il VO-lo"],["il passaporto","pasaport","il pas-sa-POR-to"],["la valigia","bavul","la va-Lİ-ca"],["il gate","kapı (biniş)","il GEYT"],["il ritardo","rötar","il ri-TAR-do"],["la vacanza","tatil","la va-KAN-tsa"]],
    p:[["Il passaporto, per favore.","Pasaportunuz, lütfen."],["Il mio volo è in ritardo.","Uçuşum rötarlı."],["Dov'è il gate?","Kapı nerede?"],["Ho una valigia.","Bir bavulum var."],["Sono qui in vacanza.","Tatil için buradayım."]]},

  {t:"Yardım istemek", n:"'Anlamadım' geçmiş zamanla söylenir: Non ho capito. Bilmiyorum = Non lo so. Yabancıya Lei: Parla inglese?",
    w:[["l'aiuto (m.)","yardım","la-YU-to"],["non ho capito","anlamadım","non o ka-Pİ-to"],["non lo so","bilmiyorum","non lo SO"],["che cosa vuol dire?","ne demek?","ke KO-za vuol Dİ-re"],["ripetere","tekrar etmek","ri-PE-te-re"],["scrivere","yazmak","SKRİ-ve-re"],["la parola","kelime","la pa-RO-la"],["l'inglese (m.) / il turco","İngilizce / Türkçe","lin-GLE-ze / il TUR-ko"]],
    p:[["Non ho capito.","Anlamadım."],["Che cosa vuol dire questo?","Bu ne demek?"],["Può scriverlo, per favore?","Yazabilir misiniz, lütfen?"],["Parla inglese?","İngilizce biliyor musunuz?"],["Mi può aiutare?","Bana yardım edebilir misiniz?"]]},

  {t:"Duygular ve fikirler", n:"Fikir için Secondo me… veya Penso che…. Sıfatlar uyar: la lingua è bella, il film è bello. Katılıyorum = Sono d'accordo.",
    w:[["pensare","düşünmek","pen-SA-re"],["secondo me","bence","se-KON-do ME"],["sono d'accordo","katılıyorum","SO-no dak-KOR-do"],["bello / bella","güzel","BEL-lo / BEL-la"],["difficile","zor","dif-Fİ-çi-le"],["facile","kolay","FA-çi-le"],["interessante","ilginç","in-te-res-SAN-te"],["noioso","sıkıcı","no-YO-zo"]],
    p:[["Secondo me è molto interessante.","Bence bu çok ilginç."],["Sono d'accordo con te.","Sana katılıyorum."],["Questa lingua è difficile ma bella.","Bu dil zor ama güzel."],["Questo film è noioso.","Bu film sıkıcı."],["Tu che cosa ne pensi?","Sen ne düşünüyorsun?"]]},

  {t:"Kendini anlat (tekrar)", n:"Dil adları küçük harfle yazılır: l'italiano, il turco. Vurgu çoğunlukla sondan bir önceki hecededir: imparo 'im-PA-ro'.",
    w:[["imparare","öğrenmek","im-pa-RA-re"],["la lingua","dil","la LİN-gua"],["ogni giorno","her gün","O-nyi COR-no"],["un po'","biraz","un PO"],["parlare","konuşmak","par-LA-re"],["capire","anlamak","ka-Pİ-re"],["l'obiettivo (m.)","hedef","lo-biet-Tİ-vo"],["fluentemente","akıcı (şekilde)","flu-en-te-MEN-te"]],
    p:[["Mi chiamo Ahmet e vengo dalla Turchia.","Benim adım Ahmet, Türkiye'denim."],["Lavoro nella sicurezza informatica.","Siber güvenlikte çalışıyorum."],["Ho un cane.","Bir köpeğim var."],["Ogni giorno imparo un po' di italiano.","Her gün biraz İtalyanca öğreniyorum."],["Un giorno voglio parlare italiano fluentemente.","Bir gün akıcı İtalyanca konuşmak istiyorum."]]}
];
