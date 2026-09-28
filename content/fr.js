// Fransızca A0 → A1, 30 ders. t: başlık (Türkçe), n: Türkçe ipucu, w: [kelime, Türkçesi] x8, p: [cümle, Türkçesi] x5
window.LESSONS = window.LESSONS || {};
window.LESSONS.fr = [
  {t:'Selamlaşma', n:"Sondaki harfler çoğu zaman okunmaz: merci 'mersi', s'il vous plaît 'sil vu ple'. Bonjour'daki 'on' genizden söylenir.",
   w:[['salut','merhaba, selam (samimi)'],['bonjour','günaydın / merhaba'],['bonsoir','iyi akşamlar'],['au revoir','hoşça kal'],["s'il vous plaît",'lütfen'],['merci','teşekkürler'],['oui','evet'],['non','hayır']],
   p:[['Salut, ça va ?','Merhaba, nasılsın?'],['Ça va bien, merci.','İyiyim, teşekkürler.'],['Bonjour !','Günaydın!'],['À bientôt !','Görüşürüz!'],['Merci beaucoup.','Çok teşekkürler.']]},

  {t:'Kendini tanıtma', n:"'Je m'appelle' = adım … (kendimi … diye çağırırım). Kadınsan 'enchantée' yazılır, okunuşu aynı. Tu samimi, vous resmî.",
   w:[['le nom','ad, isim'],['je / moi','ben'],['tu / toi','sen'],['la Turquie','Türkiye'],['turc / turque','Türk (erkek / kadın)'],["d'où",'nereden, nereli'],['enchanté(e)','memnun oldum'],['et','ve']],
   p:[["Je m'appelle Ahmet.",'Benim adım Ahmet.'],["Comment tu t'appelles ?",'Senin adın ne?'],['Je viens de Turquie.',"Türkiye'denim."],["Tu viens d'où ?",'Sen nerelisin?'],['Enchanté !','Tanıştığımıza memnun oldum.']]},

  {t:'Sayılar', n:"Yaş 'avoir' ile söylenir: j'ai trente ans (otuz yılım var). 'Six' ve 'dix' tek başına 'sis', 'dis' okunur.",
   w:[['un / une','bir'],['deux','iki'],['trois','üç'],['quatre','dört'],['cinq','beş'],['six','altı'],['sept','yedi'],['dix','on']],
   p:[['Tu as quel âge ?','Kaç yaşındasın?'],["J'ai trente ans.",'Otuz yaşındayım.'],['Quel est ton numéro de téléphone ?','Telefon numaran ne?'],["Deux cafés, s'il vous plaît.",'İki kahve, lütfen.'],["J'ai trois jours de congé.",'Üç gün iznim var.']]},

  {t:'Nasılsın?', n:"Açlık ve susuzluk 'avoir' ile: j'ai faim (açlığım var), j'ai soif. Kadın 'fatiguée' yazar, okunuş aynı.",
   w:[['bien','iyi'],['mal','kötü'],['fatigué(e)','yorgun'],['heureux / heureuse','mutlu'],['avoir faim','aç olmak'],['avoir soif','susamış olmak'],['un peu','biraz'],['très','çok']],
   p:[["Aujourd'hui, je suis très fatigué.",'Bugün çok yorgunum.'],["J'ai un peu faim.",'Biraz açım.'],['Tu es heureux ?','Mutlu musun?'],['Pas mal.','Fena değil.'],['Et toi, ça va ?','Ya sen, nasılsın?']]},

  {t:'Aile', n:"İyelik ismin cinsine uyar: mon père, ma mère. Sesliyle başlayan dişil isimde de 'mon' denir: mon amie.",
   w:[['la mère','anne'],['le père','baba'],['le frère','erkek kardeş'],['la sœur','kız kardeş'],['le mari / la femme','eş (koca / karı)'],["l'enfant (m./f.)",'çocuk'],['la famille','aile'],["l'ami / l'amie",'arkadaş (erkek / kadın)']],
   p:[["C'est ma famille.",'Bu benim ailem.'],["J'ai un frère.",'Bir erkek kardeşim var.'],["Ma mère s'appelle Ayşe.",'Annemin adı Ayşe.'],['Tu as des enfants ?','Çocuğun var mı?'],["C'est mon ami.",'O benim arkadaşım.']]},

  {t:'İş ve meslek', n:"Fiil sonundaki -e, -es, -ent okunmaz: je travaille, tu travailles, ils travaillent aynı sesle söylenir.",
   w:[['le travail','iş'],['travailler','çalışmak'],['le bureau','ofis'],["l'ordinateur (m.)",'bilgisayar'],["l'entreprise (f.)",'şirket'],['la réunion','toplantı'],['le / la collègue','meslektaş, iş arkadaşı'],['la cybersécurité','siber güvenlik']],
   p:[["Qu'est-ce que tu fais dans la vie ?",'Ne iş yapıyorsun?'],['Je travaille dans la cybersécurité.','Siber güvenlikte çalışıyorum.'],['Je travaille dans une entreprise.','Bir şirkette çalışıyorum.'],["Aujourd'hui, j'ai une réunion.",'Bugün bir toplantım var.'],['Mon bureau est au centre-ville.','Ofisim şehir merkezinde.']]},

  {t:'Kafede', n:"'Du lait, de l'eau' = biraz süt, biraz su (parçalı tanımlık). Garsona 'vous' ve 's'il vous plaît' ile hitap et.",
   w:[['le café','kahve'],['le thé','çay'],["l'eau (f.)",'su'],['le lait','süt'],['le sucre','şeker'],["un …, s'il vous plaît",'bir …, lütfen'],["l'addition (f.)",'hesap'],['combien','ne kadar']],
   p:[["Un café, s'il vous plaît.",'Bir kahve, lütfen.'],['Avec du lait, sans sucre.','Sütlü, şekersiz.'],["Vous avez de l'eau ?",'Su var mı?'],["C'est combien ?",'Ne kadar?'],["L'addition, s'il vous plaît.",'Hesap, lütfen.']]},

  {t:'Yemek ve içecek', n:"Olumsuzda ne…pas fiili sarar: je ne mange pas. Olumsuzdan sonra du / de la / des → de olur: pas de viande.",
   w:[['le pain','ekmek'],['le fromage','peynir'],['la viande','et'],['le poulet','tavuk'],['le poisson','balık'],['le légume','sebze'],['le fruit','meyve'],['le petit-déjeuner','kahvaltı']],
   p:[['Au petit-déjeuner, je mange du pain et du fromage.','Kahvaltıda ekmek ve peynir yerim.'],["J'aime le poisson.",'Balık severim.'],['Je ne mange pas de viande.','Et yemem.'],['Tu as faim ?','Aç mısın?'],["C'est très bon !",'Bu çok lezzetli!']]},

  {t:'Günler ve saat', n:"Saat 'il est … heures' ile söylenir. Gün adları küçük harfle yazılır; 'lundi' tek başına 'pazartesi günü' demektir.",
   w:[["aujourd'hui",'bugün'],['demain','yarın'],['hier','dün'],['lundi','pazartesi'],['le week-end','hafta sonu'],["l'heure (f.)",'saat'],['le matin','sabah'],['le soir','akşam']],
   p:[['Quelle heure est-il ?','Saat kaç?'],['Il est huit heures.','Saat sekiz.'],["Aujourd'hui, c'est lundi.",'Bugün pazartesi.'],['Demain, je travaille.','Yarın çalışıyorum.'],['Ce week-end, je suis libre.','Bu hafta sonu boşum.']]},

  {t:'Günlük rutin', n:"Dönüşlü fiillerde 'se' kişiye göre değişir: je me lève, tu te lèves. Saatte 'à' kullanılır: à sept heures = saat yedide.",
   w:[['se réveiller','uyanmak'],['se lever','kalkmak'],['prendre le petit-déjeuner','kahvaltı etmek'],['aller au travail','işe gitmek'],['rentrer à la maison','eve dönmek'],['faire la cuisine','yemek yapmak'],['dormir','uyumak'],['tous les jours','her gün']],
   p:[['Je me lève à sept heures.','Saat yedide kalkarım.'],['Je vais au travail tous les jours.','Her gün işe giderim.'],['Le soir, je rentre à la maison.','Akşam eve dönerim.'],['Le soir, je fais la cuisine.','Akşam yemek yaparım.'],['Je me couche à onze heures.','Saat on birde yatarım.']]},

  {t:'Ev', n:"'Il y a' = var. 'Chez moi' = benim evimde. Sıfat dişilde -e alır ve son ünsüz okunur: petit → petite, grand → grande.",
   w:[['la maison','ev'],["l'appartement (m.)",'daire'],['la pièce','oda'],['la cuisine','mutfak'],['la salle de bain','banyo'],['le salon','salon'],['la porte','kapı'],['la fenêtre','pencere']],
   p:[["J'habite dans un appartement.",'Bir dairede yaşıyorum.'],['Il y a trois pièces chez moi.','Evimde üç oda var.'],['La cuisine est petite.','Mutfak küçük.'],['Le salon est grand et clair.','Salon büyük ve aydınlık.'],['Tu peux fermer la porte ?','Kapıyı kapatır mısın?']]},

  {t:'Şehirde yön', n:"'À droite' (sağa) ile 'tout droit' (dümdüz) karışmasın. 'Rue'daki u dudak büzülerek 'ü', 'où' ise 'u' okunur.",
   w:[['où','nerede'],['à droite','sağda, sağa'],['à gauche','solda, sola'],['tout droit','düz, dümdüz'],['près','yakın'],['loin','uzak'],['la rue','cadde, sokak'],['le coin','köşe']],
   p:[['Excusez-moi, où est la gare ?','Affedersiniz, istasyon nerede?'],['Allez tout droit.','Düz gidin.'],['Tournez à gauche.','Sola dönün.'],["C'est loin ?",'Uzak mı?'],["C'est au coin, à droite.",'Köşede, sağda.']]},

  {t:'Ulaşım', n:"Araçla 'en' kullanılır: en bus, en métro, en voiture; yürüyerek ise 'à pied'. 'Train'deki 'ain' genizden okunur.",
   w:[['le bus','otobüs'],['le métro','metro'],['le train','tren'],['le taxi','taksi'],['le ticket / le billet','bilet'],["l'arrêt (m.)",'durak'],['la voiture','araba'],['à pied','yürüyerek']],
   p:[['Je vais au travail en métro.','Metroyla işe giderim.'],["Un ticket, s'il vous plaît.",'Bir bilet, lütfen.'],["Où est l'arrêt de bus ?",'Otobüs durağı nerede?'],['Le train part à quelle heure ?','Tren saat kaçta kalkıyor?'],["J'y vais à pied.",'Yürüyerek gidiyorum.']]},

  {t:'Alışveriş ve fiyat', n:"Fiyat için 'Ça coûte combien ?' yeter. 'Trop cher' = fazla pahalı. Sıfat dişilde değişir: cher → chère.",
   w:[['le magasin','dükkân, mağaza'],['le supermarché','market'],['le prix','fiyat'],['pas cher','ucuz'],['cher / chère','pahalı'],['en espèces','nakit'],['la carte','kart'],['acheter','satın almak']],
   p:[['Ça coûte combien ?','Bu ne kadar?'],["C'est trop cher.",'Çok pahalı.'],['Je peux payer par carte ?','Kartla ödeyebilir miyim?'],['Je le prends.','Bunu alıyorum.'],['Pas de sac, merci.','Poşet istemiyorum, teşekkürler.']]},

  {t:'Renkler ve kıyafet', n:"Renk ismin arkasından gelir ve cinsine uyar: une veste bleue, une chemise blanche. 'Le pantalon' tekildir.",
   w:[['rouge','kırmızı'],['bleu / bleue','mavi'],['noir / noire','siyah'],['blanc / blanche','beyaz'],['la chemise','gömlek'],['le pantalon','pantolon'],['la chaussure','ayakkabı'],['la veste','ceket']],
   p:[['Je cherche une veste bleue.','Mavi bir ceket arıyorum.'],["Je peux l'essayer ?",'Deneyebilir miyim?'],["C'est trop petit.",'Bu çok küçük.'],["Vous l'avez en noir ?",'Siyahı var mı?'],["J'aime la chemise blanche.",'Beyaz gömleği seviyorum.']]},

  {t:'Hava durumu', n:"Hava 'il fait' ile anlatılır: il fait chaud, il fait froid. Yağmur ve kar tek fiildir: il pleut, il neige.",
   w:[['le temps','hava (durumu)'],['le soleil','güneş'],['la pluie','yağmur'],['la neige','kar'],['le vent','rüzgâr'],['chaud','sıcak'],['froid','soğuk'],['nuageux','bulutlu']],
   p:[["Quel temps fait-il aujourd'hui ?",'Bugün hava nasıl?'],['Il fait très beau.','Hava çok güzel.'],['Il pleut.','Yağmur yağıyor.'],["Aujourd'hui, il fait froid.",'Bugün soğuk.'],['Demain, il va faire beau.','Yarın hava güzel (güneşli) olacak.']]},

  {t:'Sevdiklerim', n:"'Aimer'den sonra isim artikelli gelir: j'aime la musique, j'aime le sport. Türkçedeki gibi artikelsiz bırakma.",
   w:[['aimer','sevmek'],['la musique','müzik'],['le film','film'],['le livre','kitap'],['le sport','spor'],['le foot','futbol'],['nager','yüzmek'],['lire','okumak']],
   p:[["J'aime la musique.",'Müziği severim.'],["Je n'aime pas le foot.",'Futbolu sevmem.'],['Le soir, je lis des livres.','Akşamları kitap okurum.'],['Tu aimes quel genre de films ?','Ne tür filmler seversin?'],["Qu'est-ce que tu aimes le plus ?",'En çok neyi seversin?']]},

  {t:'Köpeğim ve hayvanlar', n:"Konuşmada 'nous' yerine çoğu zaman 'on' denir: on se promène = yürüyüş yapıyoruz. Fiil 'il' gibi çekilir.",
   w:[['le chien','köpek'],['le chat','kedi'],['le parc','park'],['la laisse','tasma'],['la promenade','yürüyüş'],['jouer','oynamak'],['la balle','top'],['bon chien !','aferin, iyi çocuk! (köpeğe)']],
   p:[["J'ai un chien.",'Bir köpeğim var.'],["Il s'appelle Max.",'Onun adı Max. (köpeğinin adını söyle)'],['Tous les matins, on se promène au parc.','Her sabah parkta yürüyüş yapıyoruz.'],['Mon chien adore jouer à la balle.','Köpeğim topla oynamayı sever.'],['Je peux caresser votre chien ?','Köpeğinizi sevebilir miyim?']]},

  {t:'Sağlık ve beden', n:"Ağrı 'avoir mal à' ile söylenir: j'ai mal à la tête, j'ai mal au dos (à + le = au). Doktora 'chez le médecin' gidilir.",
   w:[['la tête','baş'],['le ventre','karın, mide'],['le dos','sırt'],['la douleur','ağrı'],['le médecin','doktor'],['la pharmacie','eczane'],['le médicament','ilaç'],['malade','hasta']],
   p:[["J'ai mal à la tête.",'Başım ağrıyor.'],['Je suis malade.','Hastayım.'],['Où est la pharmacie ?','Eczane nerede?'],['Je dois aller chez le médecin.','Doktora gitmem lazım.'],['Bon rétablissement !','Geçmiş olsun!']]},

  {t:'Otelde', n:"'H' hiç okunmaz: l'hôtel 'lotel'. Sesliyle başlayan isimde le / la → l' olur; cinsiyetini ayrıca ezberle.",
   w:[["l'hôtel (m.)",'otel'],['la chambre','oda'],['la réservation','rezervasyon'],['la clé','anahtar'],['la nuit','gece'],['le petit-déjeuner','kahvaltı'],["l'ascenseur (m.)",'asansör'],['le mot de passe','şifre (Wi-Fi)']],
   p:[["J'ai une réservation.",'Rezervasyonum var.'],['Pour deux nuits.','İki gece için.'],['Le petit-déjeuner est compris ?','Kahvaltı dahil mi?'],['Quel est le mot de passe du wifi ?','Wi-Fi şifresi ne?'],["Où est l'ascenseur ?",'Asansör nerede?']]},

  {t:'Restoranda', n:"Restoranda 'la carte' yemek listesidir, 'le menu' sabit fiyatlı menü. Sipariş verirken: 'Je vais prendre…'.",
   w:[['la table','masa'],['la carte','menü (yemek listesi)'],['le serveur','garson'],['la commande','sipariş'],['le dessert','tatlı'],['la boisson','içecek'],['délicieux / délicieuse','lezzetli'],["l'addition (f.)",'hesap']],
   p:[["Une table pour deux, s'il vous plaît.",'İki kişilik bir masa, lütfen.'],['Je peux avoir la carte ?','Menüyü alabilir miyim?'],["Qu'est-ce que vous me conseillez ?",'Ne tavsiye edersiniz?'],['Je vais prendre le poisson.','Balık alacağım.'],["C'était délicieux, merci.",'Çok lezzetliydi, teşekkürler.']]},

  {t:'Telefon ve randevu', n:"'Je voudrais' (isterdim) 'je veux'dan daha kibardır. 'Rendez-vous'da z ve s okunmaz: 'randevu'.",
   w:[['le téléphone','telefon'],['appeler','aramak'],['le message','mesaj'],['le rendez-vous','randevu'],['disponible','müsait'],['annuler','iptal etmek'],['répéter','tekrar etmek'],['lentement','yavaş, yavaşça']],
   p:[["Allô, c'est Ahmet.",'Alo, ben Ahmet.'],['Je voudrais prendre rendez-vous.','Randevu almak istiyorum.'],['Vous êtes disponible jeudi ?','Perşembe müsait misiniz?'],["Vous pouvez répéter, s'il vous plaît ?",'Tekrar eder misiniz, lütfen?'],['Vous pouvez parler plus lentement ?','Daha yavaş konuşur musunuz?']]},

  {t:'İş yerinde', n:"Cihazlar için 'marcher' denir: ça ne marche pas = çalışmıyor. '-ème' ile bitse de 'le problème' erildir.",
   w:[["l'e-mail (m.)",'e-posta'],['le mot de passe','şifre'],["l'écran (m.)",'ekran'],['le fichier','dosya'],["l'imprimante (f.)",'yazıcı'],["l'aide (f.)",'yardım'],['le problème','sorun'],['prêt / prête','hazır']],
   p:[['Mon ordinateur ne marche pas.','Bilgisayarım çalışmıyor.'],["J'ai oublié mon mot de passe.",'Şifremi unuttum.'],["Je t'ai envoyé un e-mail.",'Sana bir e-posta gönderdim.'],['Il y a un problème.','Bir sorun var.'],['Tout est prêt pour la réunion ?','Toplantı için her şey hazır mı?']]},

  {t:'Dün ne yaptın? (geçmiş zaman)', n:"Geçmiş çoğunlukla avoir + fiil: j'ai mangé. Hareket fiilleri être alır: je suis allé (kadınsan 'allée').",
   w:[['hier','dün'],['la semaine dernière','geçen hafta'],["j'ai fait",'yaptım'],['je suis allé(e)','gittim'],["j'ai mangé",'yedim'],["j'ai regardé",'izledim'],["j'ai vu",'gördüm'],["j'ai travaillé",'çalıştım']],
   p:[["Hier, j'ai beaucoup travaillé.",'Dün çok çalıştım.'],["Le soir, j'ai regardé un film.",'Akşam bir film izledim.'],['La semaine dernière, je suis allé à Istanbul.',"Geçen hafta İstanbul'a gittim."],["J'ai mangé au restaurant.",'Restoranda yemek yedim.'],["Qu'est-ce que tu as fait hier ?",'Dün ne yaptın?']]},

  {t:'Yarın ne yapacaksın? (gelecek)', n:"Yakın gelecek = aller + mastar: je vais partir (gideceğim). Günlük konuşmada Türkçe '-ecek'in en pratik karşılığı.",
   w:[['demain','yarın'],['la semaine prochaine','gelecek hafta'],['le projet','plan'],['je vais faire','yapacağım'],['je vais aller','gideceğim'],['retrouver','buluşmak'],['les vacances (f. pl.)','tatil'],['peut-être','belki']],
   p:[["Qu'est-ce que tu vas faire demain ?",'Yarın ne yapacaksın?'],['Demain, je vais retrouver mes amis.','Yarın arkadaşlarımla buluşacağım.'],['La semaine prochaine, je vais partir en vacances.','Gelecek hafta tatile gideceğim.'],['On va peut-être aller au cinéma.','Belki sinemaya gideriz.'],['Tu as des projets ?','Planın var mı?']]},

  {t:'Boş zaman ve hafta sonu', n:"Liaison yap: les amis 'le-za-mi', des amis 'de-za-mi'. Fransız şimdiki zamanı hem '-iyor' hem geniş zaman anlamı taşır.",
   w:[['se reposer','dinlenmek'],['la télé','televizyon'],['la série','dizi'],['la balade','yürüyüş, gezinti'],['les amis','arkadaşlar'],['le cinéma','sinema'],['à la maison','evde'],['sortir','dışarı çıkmak']],
   p:[['Le week-end, je me repose à la maison.','Hafta sonu evde dinlenirim.'],['Le soir, je regarde la télé.','Akşam televizyon izlerim.'],['En ce moment, je regarde une série.','Şu sıralar bir dizi izliyorum.'],['On sort avec des amis.','Arkadaşlarla dışarı çıkarız.'],["Qu'est-ce que tu fais ce week-end ?",'Bu hafta sonu ne yapıyorsun?']]},

  {t:'Havaalanı ve seyahat', n:"'Les vacances' hep çoğuldur: en vacances. Liaison: les avions 'le-za-vyon'. 'Le vol' hem uçuş hem hırsızlık demek.",
   w:[["l'aéroport (m.)",'havaalanı'],["l'avion (m.)",'uçak'],['le vol','uçuş'],['le passeport','pasaport'],['la valise','bavul'],["la porte d'embarquement",'(biniş) kapı(sı)'],['le retard','rötar, gecikme'],['les vacances (f. pl.)','tatil']],
   p:[["Votre passeport, s'il vous plaît.",'Pasaportunuz, lütfen.'],['Mon vol a du retard.','Uçuşum rötarlı.'],["Où est la porte d'embarquement ?",'Biniş kapısı nerede?'],["J'ai une valise.",'Bir bavulum var.'],['Je suis ici en vacances.','Tatil için buradayım.']]},

  {t:'Yardım istemek', n:"'Anlamadım' şimdiki zamanla söylenir: je ne comprends pas. Günlük konuşmada 'ne' düşer: je sais pas.",
   w:[["l'aide (f.)",'yardım'],['je ne comprends pas','anlamadım'],['je ne sais pas','bilmiyorum'],['ça veut dire','… demek'],['répéter','tekrar etmek'],['écrire','yazmak'],['le mot','kelime'],["l'anglais / le turc",'İngilizce / Türkçe']],
   p:[['Je ne comprends pas.','Anlamadım.'],["Qu'est-ce que ça veut dire ?",'Bu ne demek?'],["Vous pouvez l'écrire ?",'Yazabilir misiniz?'],['Vous parlez anglais ?','İngilizce biliyor musunuz?'],["Vous pouvez m'aider, s'il vous plaît ?",'Bana yardım edebilir misiniz, lütfen?']]},

  {t:'Duygular ve fikirler', n:"'Katılıyorum' être ile kurulur: je suis d'accord. 'C'est'ten sonra sıfat eril kalır: c'est beau, c'est difficile.",
   w:[['penser','düşünmek'],['à mon avis','bence'],["être d'accord",'katılmak, aynı fikirde olmak'],['beau / belle','güzel'],['difficile','zor'],['facile','kolay'],['intéressant(e)','ilginç'],['ennuyeux / ennuyeuse','sıkıcı']],
   p:[["À mon avis, c'est très intéressant.",'Bence bu çok ilginç.'],["Je suis d'accord avec toi.",'Sana katılıyorum.'],['Cette langue est difficile, mais belle.','Bu dil zor ama güzel.'],['Ce film est ennuyeux.','Bu film sıkıcı.'],["Qu'est-ce que tu en penses ?",'Sen ne düşünüyorsun?']]},

  {t:'Kendini anlat (tekrar)', n:"Dil adları küçük harfle ve artikelle yazılır: le français, le turc. Tanıtıma 'je m'appelle' ve 'je viens de' ile başla.",
   w:[['apprendre','öğrenmek'],['la langue','dil'],['tous les jours','her gün'],['un peu','biraz'],['parler','konuşmak'],['comprendre','anlamak'],["l'objectif (m.)",'hedef'],['couramment','akıcı (şekilde)']],
   p:[["Je m'appelle Ahmet, je viens de Turquie.","Benim adım Ahmet, Türkiye'denim."],['Je travaille dans la cybersécurité.','Siber güvenlikte çalışıyorum.'],["J'ai un chien.",'Bir köpeğim var.'],["J'apprends un peu le français tous les jours.",'Her gün biraz Fransızca öğreniyorum.'],['Un jour, je voudrais parler couramment.','Bir gün akıcı konuşmak istiyorum.']]}
];
