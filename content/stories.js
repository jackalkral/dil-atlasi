// Okuma metinleri ve diyaloglar (Oku sekmesi). Uygulama için yazılmış özgün metinler; dört dilde birebir paralel, Türkçesi ortak.
// day: metnin açıldığı ders günü (o güne kadarki derslerin kelimeleriyle yazıldı). kind: story | dialog.
// sp: diyalog konuşmacıları {A: [ad, ses 'f'|'m'], B: [...]}. s: [konuşmacı ('' anlatı), en, fr, it, de, tr].
// k: anahtar kelimeler [en, fr, it, de, tr] (tekrar kartına eklenebilir; kart kimliği dil:r:metinSırası:kelimeSırası).
// q: anlama soruları [soru, seçenekler, doğru seçenek]. Sırayı değiştirme, yeni metni sona ekle (kart kimlikleri sıraya bağlı).
window.STORIES = [
 {
  "day": 1,
  "kind": "dialog",
  "t": {
   "tr": "Günaydın",
   "en": "Good morning",
   "fr": "Bonjour",
   "it": "Buongiorno",
   "de": "Guten Morgen"
  },
  "sp": {
   "A": [
    "Elena",
    "f"
   ],
   "B": [
    "Ahmet",
    "m"
   ]
  },
  "s": [
   [
    "A",
    "Good morning!",
    "Bonjour !",
    "Buongiorno!",
    "Guten Morgen!",
    "Günaydın!"
   ],
   [
    "B",
    "Good morning! How are you?",
    "Bonjour ! Comment ça va ?",
    "Buongiorno! Come stai?",
    "Guten Morgen! Wie geht es dir?",
    "Günaydın! Nasılsın?"
   ],
   [
    "A",
    "Very well, thank you. And you?",
    "Très bien, merci. Et toi ?",
    "Molto bene, grazie. E tu?",
    "Sehr gut, danke. Und dir?",
    "Çok iyiyim, teşekkürler. Ya sen?"
   ],
   [
    "B",
    "Good, thanks. A coffee?",
    "Bien, merci. Un café ?",
    "Bene, grazie. Un caffè?",
    "Gut, danke. Einen Kaffee?",
    "İyiyim, sağ ol. Kahve?"
   ],
   [
    "A",
    "Yes, please!",
    "Oui, s'il te plaît !",
    "Sì, per favore!",
    "Ja, bitte!",
    "Evet, lütfen!"
   ],
   [
    "B",
    "Here you are.",
    "Voilà.",
    "Ecco.",
    "Bitte schön.",
    "Buyur."
   ],
   [
    "A",
    "Thank you, Ahmet!",
    "Merci, Ahmet !",
    "Grazie, Ahmet!",
    "Danke, Ahmet!",
    "Teşekkürler, Ahmet!"
   ]
  ],
  "k": [
   [
    "good morning",
    "bonjour",
    "buongiorno",
    "guten Morgen",
    "günaydın"
   ],
   [
    "How are you?",
    "Comment ça va ?",
    "Come stai?",
    "Wie geht es dir?",
    "Nasılsın?"
   ],
   [
    "very well",
    "très bien",
    "molto bene",
    "sehr gut",
    "çok iyi"
   ],
   [
    "please",
    "s'il te plaît",
    "per favore",
    "bitte",
    "lütfen"
   ],
   [
    "thank you",
    "merci",
    "grazie",
    "danke",
    "teşekkürler"
   ]
  ],
  "q": [
   [
    "Elena nasıl?",
    [
     "Çok iyi",
     "Yorgun",
     "Hasta"
    ],
    0
   ],
   [
    "Ahmet ne teklif ediyor?",
    [
     "Çay",
     "Kahve",
     "Su"
    ],
    1
   ],
   [
    "Elena kahve istiyor mu?",
    [
     "Evet",
     "Hayır"
    ],
    0
   ]
  ]
 },
 {
  "day": 3,
  "kind": "story",
  "t": {
   "tr": "Ben Ahmet",
   "en": "I am Ahmet",
   "fr": "Je suis Ahmet",
   "it": "Sono Ahmet",
   "de": "Ich bin Ahmet"
  },
  "s": [
   [
    "",
    "My name is Ahmet.",
    "Je m'appelle Ahmet.",
    "Mi chiamo Ahmet.",
    "Ich heiße Ahmet.",
    "Benim adım Ahmet."
   ],
   [
    "",
    "I am from Turkey.",
    "Je viens de Turquie.",
    "Vengo dalla Turchia.",
    "Ich komme aus der Türkei.",
    "Türkiye'denim."
   ],
   [
    "",
    "I live in Istanbul.",
    "J'habite à Istanbul.",
    "Abito a Istanbul.",
    "Ich wohne in Istanbul.",
    "İstanbul'da yaşıyorum."
   ],
   [
    "",
    "I work in cybersecurity.",
    "Je travaille dans la cybersécurité.",
    "Lavoro nella sicurezza informatica.",
    "Ich arbeite in der Cybersicherheit.",
    "Siber güvenlikte çalışıyorum."
   ],
   [
    "",
    "I have a dog. His name is Karamel.",
    "J'ai un chien. Il s'appelle Karamel.",
    "Ho un cane. Si chiama Karamel.",
    "Ich habe einen Hund. Er heißt Karamel.",
    "Bir köpeğim var. Adı Karamel."
   ],
   [
    "",
    "I am learning four languages.",
    "J'apprends quatre langues.",
    "Imparo quattro lingue.",
    "Ich lerne vier Sprachen.",
    "Dört dil öğreniyorum."
   ],
   [
    "",
    "Every day, a little.",
    "Chaque jour, un peu.",
    "Ogni giorno, un po'.",
    "Jeden Tag ein bisschen.",
    "Her gün biraz."
   ]
  ],
  "k": [
   [
    "to live",
    "habiter",
    "abitare",
    "wohnen",
    "yaşamak, oturmak"
   ],
   [
    "to work",
    "travailler",
    "lavorare",
    "arbeiten",
    "çalışmak"
   ],
   [
    "dog",
    "le chien",
    "il cane",
    "der Hund",
    "köpek"
   ],
   [
    "language",
    "la langue",
    "la lingua",
    "die Sprache",
    "dil"
   ],
   [
    "every day",
    "chaque jour",
    "ogni giorno",
    "jeden Tag",
    "her gün"
   ]
  ],
  "q": [
   [
    "Ahmet nerede yaşıyor?",
    [
     "Ankara",
     "İstanbul",
     "İzmir"
    ],
    1
   ],
   [
    "Köpeğin adı ne?",
    [
     "Karamel",
     "Paşa",
     "Bulut"
    ],
    0
   ],
   [
    "Ahmet kaç dil öğreniyor?",
    [
     "İki",
     "Üç",
     "Dört"
    ],
    2
   ]
  ]
 },
 {
  "day": 5,
  "kind": "story",
  "t": {
   "tr": "Ailem",
   "en": "My family",
   "fr": "Ma famille",
   "it": "La mia famiglia",
   "de": "Meine Familie"
  },
  "s": [
   [
    "",
    "This is my family.",
    "Voici ma famille.",
    "Questa è la mia famiglia.",
    "Das ist meine Familie.",
    "Bu benim ailem."
   ],
   [
    "",
    "My mother is a teacher.",
    "Ma mère est professeure.",
    "Mia madre è insegnante.",
    "Meine Mutter ist Lehrerin.",
    "Annem öğretmen."
   ],
   [
    "",
    "My father is a doctor.",
    "Mon père est médecin.",
    "Mio padre è medico.",
    "Mein Vater ist Arzt.",
    "Babam doktor."
   ],
   [
    "",
    "I have a brother and a sister.",
    "J'ai un frère et une sœur.",
    "Ho un fratello e una sorella.",
    "Ich habe einen Bruder und eine Schwester.",
    "Bir erkek kardeşim ve bir kız kardeşim var."
   ],
   [
    "",
    "My sister is ten years old.",
    "Ma sœur a dix ans.",
    "Mia sorella ha dieci anni.",
    "Meine Schwester ist zehn Jahre alt.",
    "Kız kardeşim on yaşında."
   ],
   [
    "",
    "We are a happy family.",
    "Nous sommes une famille heureuse.",
    "Siamo una famiglia felice.",
    "Wir sind eine glückliche Familie.",
    "Biz mutlu bir aileyiz."
   ]
  ],
  "k": [
   [
    "mother",
    "la mère",
    "la madre",
    "die Mutter",
    "anne"
   ],
   [
    "father",
    "le père",
    "il padre",
    "der Vater",
    "baba"
   ],
   [
    "brother",
    "le frère",
    "il fratello",
    "der Bruder",
    "erkek kardeş"
   ],
   [
    "sister",
    "la sœur",
    "la sorella",
    "die Schwester",
    "kız kardeş"
   ],
   [
    "happy",
    "heureux, heureuse",
    "felice",
    "glücklich",
    "mutlu"
   ]
  ],
  "q": [
   [
    "Annesinin mesleği ne?",
    [
     "Doktor",
     "Öğretmen",
     "Aşçı"
    ],
    1
   ],
   [
    "Kız kardeşi kaç yaşında?",
    [
     "Yedi",
     "On",
     "Beş"
    ],
    1
   ],
   [
    "Nasıl bir aile?",
    [
     "Mutlu",
     "Yorgun",
     "Aç"
    ],
    0
   ]
  ]
 },
 {
  "day": 7,
  "kind": "dialog",
  "t": {
   "tr": "Kafede",
   "en": "At the café",
   "fr": "Au café",
   "it": "Al bar",
   "de": "Im Café"
  },
  "sp": {
   "A": [
    "Garson",
    "f"
   ],
   "B": [
    "Ahmet",
    "m"
   ]
  },
  "s": [
   [
    "A",
    "Hello! What would you like?",
    "Bonjour ! Qu'est-ce que vous désirez ?",
    "Buongiorno! Cosa desidera?",
    "Hallo! Was möchten Sie?",
    "Merhaba! Ne arzu edersiniz?"
   ],
   [
    "B",
    "A coffee with milk, please.",
    "Un café au lait, s'il vous plaît.",
    "Un caffellatte, per favore.",
    "Einen Milchkaffee, bitte.",
    "Sütlü bir kahve, lütfen."
   ],
   [
    "A",
    "With sugar?",
    "Avec du sucre ?",
    "Con zucchero?",
    "Mit Zucker?",
    "Şekerli mi?"
   ],
   [
    "B",
    "No, thank you. And a water.",
    "Non, merci. Et une eau.",
    "No, grazie. E un'acqua.",
    "Nein, danke. Und ein Wasser.",
    "Hayır, teşekkürler. Bir de su."
   ],
   [
    "A",
    "Of course. Here you are.",
    "Bien sûr. Voilà.",
    "Certo. Ecco a lei.",
    "Natürlich. Bitte schön.",
    "Tabii. Buyurun."
   ],
   [
    "B",
    "How much is it?",
    "C'est combien ?",
    "Quanto costa?",
    "Was kostet das?",
    "Ne kadar?"
   ],
   [
    "A",
    "Four euros, please.",
    "Quatre euros, s'il vous plaît.",
    "Quattro euro, per favore.",
    "Vier Euro, bitte.",
    "Dört euro, lütfen."
   ]
  ],
  "k": [
   [
    "coffee",
    "le café",
    "il caffè",
    "der Kaffee",
    "kahve"
   ],
   [
    "milk",
    "le lait",
    "il latte",
    "die Milch",
    "süt"
   ],
   [
    "sugar",
    "le sucre",
    "lo zucchero",
    "der Zucker",
    "şeker"
   ],
   [
    "water",
    "l'eau",
    "l'acqua",
    "das Wasser",
    "su"
   ],
   [
    "How much is it?",
    "C'est combien ?",
    "Quanto costa?",
    "Was kostet das?",
    "Ne kadar?"
   ]
  ],
  "q": [
   [
    "Ahmet ne sipariş ediyor?",
    [
     "Çay",
     "Sütlü kahve",
     "Meyve suyu"
    ],
    1
   ],
   [
    "Şeker istiyor mu?",
    [
     "Evet",
     "Hayır"
    ],
    1
   ],
   [
    "Hesap ne kadar?",
    [
     "Dört euro",
     "On euro",
     "İki euro"
    ],
    0
   ]
  ]
 },
 {
  "day": 10,
  "kind": "story",
  "t": {
   "tr": "Bir günüm",
   "en": "My day",
   "fr": "Ma journée",
   "it": "La mia giornata",
   "de": "Mein Tag"
  },
  "s": [
   [
    "",
    "I wake up at seven.",
    "Je me réveille à sept heures.",
    "Mi sveglio alle sette.",
    "Ich wache um sieben Uhr auf.",
    "Saat yedide uyanırım."
   ],
   [
    "",
    "I have breakfast: bread, cheese and tea.",
    "Je prends le petit-déjeuner : du pain, du fromage et du thé.",
    "Faccio colazione: pane, formaggio e tè.",
    "Ich frühstücke: Brot, Käse und Tee.",
    "Kahvaltı yaparım: ekmek, peynir ve çay."
   ],
   [
    "",
    "Then I walk the dog in the park.",
    "Ensuite, je promène le chien au parc.",
    "Poi porto il cane al parco.",
    "Dann gehe ich mit dem Hund in den Park.",
    "Sonra köpeği parkta gezdiririm."
   ],
   [
    "",
    "At nine I go to work.",
    "À neuf heures, je vais au travail.",
    "Alle nove vado al lavoro.",
    "Um neun Uhr gehe ich zur Arbeit.",
    "Dokuzda işe giderim."
   ],
   [
    "",
    "In the evening I come home and cook.",
    "Le soir, je rentre à la maison et je cuisine.",
    "La sera torno a casa e cucino.",
    "Am Abend komme ich nach Hause und koche.",
    "Akşam eve gelir, yemek yaparım."
   ],
   [
    "",
    "I go to bed at eleven.",
    "Je me couche à onze heures.",
    "Vado a letto alle undici.",
    "Ich gehe um elf Uhr schlafen.",
    "Saat on birde yatarım."
   ]
  ],
  "k": [
   [
    "to wake up",
    "se réveiller",
    "svegliarsi",
    "aufwachen",
    "uyanmak"
   ],
   [
    "breakfast",
    "le petit-déjeuner",
    "la colazione",
    "das Frühstück",
    "kahvaltı"
   ],
   [
    "to go to work",
    "aller au travail",
    "andare al lavoro",
    "zur Arbeit gehen",
    "işe gitmek"
   ],
   [
    "evening",
    "le soir",
    "la sera",
    "der Abend",
    "akşam"
   ],
   [
    "to cook",
    "cuisiner",
    "cucinare",
    "kochen",
    "yemek yapmak"
   ]
  ],
  "q": [
   [
    "Ahmet kaçta uyanıyor?",
    [
     "Altıda",
     "Yedide",
     "Dokuzda"
    ],
    1
   ],
   [
    "Kahvaltıda ne içiyor?",
    [
     "Kahve",
     "Çay",
     "Süt"
    ],
    1
   ],
   [
    "Akşam ne yapıyor?",
    [
     "Yemek yapıyor",
     "Spor yapıyor",
     "Çalışıyor"
    ],
    0
   ]
  ]
 },
 {
  "day": 13,
  "kind": "dialog",
  "t": {
   "tr": "Yol sormak",
   "en": "Asking the way",
   "fr": "Demander le chemin",
   "it": "Chiedere la strada",
   "de": "Nach dem Weg fragen"
  },
  "sp": {
   "A": [
    "Ahmet",
    "m"
   ],
   "B": [
    "Kadın",
    "f"
   ]
  },
  "s": [
   [
    "A",
    "Excuse me, where is the station?",
    "Excusez-moi, où est la gare ?",
    "Scusi, dov'è la stazione?",
    "Entschuldigung, wo ist der Bahnhof?",
    "Affedersiniz, istasyon nerede?"
   ],
   [
    "B",
    "Go straight, then turn left.",
    "Allez tout droit, puis tournez à gauche.",
    "Vada dritto, poi giri a sinistra.",
    "Gehen Sie geradeaus, dann links.",
    "Düz gidin, sonra sola dönün."
   ],
   [
    "A",
    "Is it far?",
    "C'est loin ?",
    "È lontano?",
    "Ist es weit?",
    "Uzak mı?"
   ],
   [
    "B",
    "No, it is near. Five minutes on foot.",
    "Non, c'est près. Cinq minutes à pied.",
    "No, è vicino. Cinque minuti a piedi.",
    "Nein, es ist nah. Fünf Minuten zu Fuß.",
    "Hayır, yakın. Yürüyerek beş dakika."
   ],
   [
    "A",
    "And the bus stop?",
    "Et l'arrêt de bus ?",
    "E la fermata dell'autobus?",
    "Und die Bushaltestelle?",
    "Ya otobüs durağı?"
   ],
   [
    "B",
    "It is on the right, at the corner.",
    "Il est à droite, au coin.",
    "È a destra, all'angolo.",
    "Sie ist rechts, an der Ecke.",
    "Sağda, köşede."
   ],
   [
    "A",
    "Thank you very much!",
    "Merci beaucoup !",
    "Grazie mille!",
    "Vielen Dank!",
    "Çok teşekkürler!"
   ]
  ],
  "k": [
   [
    "straight",
    "tout droit",
    "dritto",
    "geradeaus",
    "düz"
   ],
   [
    "left",
    "à gauche",
    "a sinistra",
    "links",
    "sola, solda"
   ],
   [
    "right",
    "à droite",
    "a destra",
    "rechts",
    "sağa, sağda"
   ],
   [
    "near",
    "près",
    "vicino",
    "nah",
    "yakın"
   ],
   [
    "on foot",
    "à pied",
    "a piedi",
    "zu Fuß",
    "yürüyerek"
   ]
  ],
  "q": [
   [
    "Ahmet neyi arıyor?",
    [
     "Oteli",
     "İstasyonu",
     "Eczaneyi"
    ],
    1
   ],
   [
    "İstasyon uzak mı?",
    [
     "Evet, çok uzak",
     "Hayır, yakın"
    ],
    1
   ],
   [
    "Otobüs durağı nerede?",
    [
     "Solda",
     "Sağda, köşede",
     "Karşıda"
    ],
    1
   ]
  ]
 },
 {
  "day": 16,
  "kind": "story",
  "t": {
   "tr": "Karamel'le cumartesi",
   "en": "Saturday with Karamel",
   "fr": "Samedi avec Karamel",
   "it": "Sabato con Karamel",
   "de": "Samstag mit Karamel"
  },
  "s": [
   [
    "",
    "Today is Saturday.",
    "Aujourd'hui, c'est samedi.",
    "Oggi è sabato.",
    "Heute ist Samstag.",
    "Bugün cumartesi."
   ],
   [
    "",
    "The sun is shining, but it is a little cold.",
    "Il y a du soleil, mais il fait un peu froid.",
    "C'è il sole, ma fa un po' freddo.",
    "Die Sonne scheint, aber es ist ein bisschen kalt.",
    "Güneş var ama biraz soğuk."
   ],
   [
    "",
    "I put on my jacket and my shoes.",
    "Je mets ma veste et mes chaussures.",
    "Metto la giacca e le scarpe.",
    "Ich ziehe meine Jacke und meine Schuhe an.",
    "Ceketimi ve ayakkabılarımı giyerim."
   ],
   [
    "",
    "Karamel is very happy.",
    "Karamel est très content.",
    "Karamel è molto felice.",
    "Karamel ist sehr glücklich.",
    "Karamel çok mutlu."
   ],
   [
    "",
    "In the park, he plays with a red ball.",
    "Au parc, il joue avec une balle rouge.",
    "Al parco gioca con una palla rossa.",
    "Im Park spielt er mit einem roten Ball.",
    "Parkta kırmızı bir topla oynar."
   ],
   [
    "",
    "Good boy, Karamel!",
    "Bon chien, Karamel !",
    "Bravo, Karamel!",
    "Braver Hund, Karamel!",
    "Aferin, Karamel!"
   ]
  ],
  "k": [
   [
    "sun",
    "le soleil",
    "il sole",
    "die Sonne",
    "güneş"
   ],
   [
    "cold",
    "froid",
    "freddo",
    "kalt",
    "soğuk"
   ],
   [
    "jacket",
    "la veste",
    "la giacca",
    "die Jacke",
    "ceket"
   ],
   [
    "park",
    "le parc",
    "il parco",
    "der Park",
    "park"
   ],
   [
    "ball",
    "la balle",
    "la palla",
    "der Ball",
    "top"
   ]
  ],
  "q": [
   [
    "Bugün hangi gün?",
    [
     "Pazartesi",
     "Cumartesi",
     "Pazar"
    ],
    1
   ],
   [
    "Hava nasıl?",
    [
     "Güneşli ama biraz soğuk",
     "Yağmurlu",
     "Karlı"
    ],
    0
   ],
   [
    "Top ne renk?",
    [
     "Mavi",
     "Kırmızı",
     "Siyah"
    ],
    1
   ]
  ]
 },
 {
  "day": 19,
  "kind": "dialog",
  "t": {
   "tr": "Eczanede",
   "en": "At the pharmacy",
   "fr": "À la pharmacie",
   "it": "In farmacia",
   "de": "In der Apotheke"
  },
  "sp": {
   "A": [
    "Eczacı",
    "f"
   ],
   "B": [
    "Ahmet",
    "m"
   ]
  },
  "s": [
   [
    "A",
    "Hello, can I help you?",
    "Bonjour, je peux vous aider ?",
    "Buongiorno, posso aiutarla?",
    "Guten Tag, kann ich Ihnen helfen?",
    "Merhaba, yardımcı olabilir miyim?"
   ],
   [
    "B",
    "Yes, I have a headache.",
    "Oui, j'ai mal à la tête.",
    "Sì, ho mal di testa.",
    "Ja, ich habe Kopfschmerzen.",
    "Evet, başım ağrıyor."
   ],
   [
    "A",
    "Since when?",
    "Depuis quand ?",
    "Da quando?",
    "Seit wann?",
    "Ne zamandan beri?"
   ],
   [
    "B",
    "Since yesterday. I am very tired.",
    "Depuis hier. Je suis très fatigué.",
    "Da ieri. Sono molto stanco.",
    "Seit gestern. Ich bin sehr müde.",
    "Dünden beri. Çok yorgunum."
   ],
   [
    "A",
    "Take this medicine twice a day.",
    "Prenez ce médicament deux fois par jour.",
    "Prenda questa medicina due volte al giorno.",
    "Nehmen Sie dieses Medikament zweimal am Tag.",
    "Bu ilacı günde iki kez alın."
   ],
   [
    "A",
    "And drink a lot of water.",
    "Et buvez beaucoup d'eau.",
    "E beva molta acqua.",
    "Und trinken Sie viel Wasser.",
    "Ve bol su için."
   ],
   [
    "B",
    "Thank you. How much is it?",
    "Merci. C'est combien ?",
    "Grazie. Quanto costa?",
    "Danke. Was kostet das?",
    "Teşekkürler. Ne kadar?"
   ]
  ],
  "k": [
   [
    "headache",
    "le mal de tête",
    "il mal di testa",
    "die Kopfschmerzen",
    "baş ağrısı"
   ],
   [
    "medicine",
    "le médicament",
    "la medicina",
    "das Medikament",
    "ilaç"
   ],
   [
    "tired",
    "fatigué",
    "stanco",
    "müde",
    "yorgun"
   ],
   [
    "since yesterday",
    "depuis hier",
    "da ieri",
    "seit gestern",
    "dünden beri"
   ],
   [
    "twice a day",
    "deux fois par jour",
    "due volte al giorno",
    "zweimal am Tag",
    "günde iki kez"
   ]
  ],
  "q": [
   [
    "Ahmet'in neresi ağrıyor?",
    [
     "Midesi",
     "Başı",
     "Sırtı"
    ],
    1
   ],
   [
    "Ne zamandan beri?",
    [
     "Bugünden",
     "Dünden",
     "Geçen haftadan"
    ],
    1
   ],
   [
    "İlacı günde kaç kez alacak?",
    [
     "Bir",
     "İki",
     "Üç"
    ],
    1
   ]
  ]
 },
 {
  "day": 24,
  "kind": "story",
  "t": {
   "tr": "Dün",
   "en": "Yesterday",
   "fr": "Hier",
   "it": "Ieri",
   "de": "Gestern"
  },
  "s": [
   [
    "",
    "Yesterday was a good day.",
    "Hier, c'était une bonne journée.",
    "Ieri è stata una bella giornata.",
    "Gestern war ein guter Tag.",
    "Dün güzel bir gündü."
   ],
   [
    "",
    "In the morning I worked at the office.",
    "Le matin, j'ai travaillé au bureau.",
    "La mattina ho lavorato in ufficio.",
    "Am Morgen habe ich im Büro gearbeitet.",
    "Sabah ofiste çalıştım."
   ],
   [
    "",
    "At noon I ate fish with a colleague.",
    "À midi, j'ai mangé du poisson avec un collègue.",
    "A mezzogiorno ho mangiato pesce con un collega.",
    "Mittags habe ich mit einem Kollegen Fisch gegessen.",
    "Öğlen bir iş arkadaşımla balık yedim."
   ],
   [
    "",
    "In the evening I went to the cinema with friends.",
    "Le soir, je suis allé au cinéma avec des amis.",
    "La sera sono andato al cinema con gli amici.",
    "Am Abend bin ich mit Freunden ins Kino gegangen.",
    "Akşam arkadaşlarımla sinemaya gittim."
   ],
   [
    "",
    "We saw a French film.",
    "Nous avons vu un film français.",
    "Abbiamo visto un film francese.",
    "Wir haben einen französischen Film gesehen.",
    "Bir Fransız filmi izledik."
   ],
   [
    "",
    "I understood a little!",
    "J'ai compris un peu !",
    "Ho capito un po'!",
    "Ich habe ein bisschen verstanden!",
    "Biraz anladım!"
   ]
  ],
  "k": [
   [
    "yesterday",
    "hier",
    "ieri",
    "gestern",
    "dün"
   ],
   [
    "I worked",
    "j'ai travaillé",
    "ho lavorato",
    "ich habe gearbeitet",
    "çalıştım"
   ],
   [
    "I ate",
    "j'ai mangé",
    "ho mangiato",
    "ich habe gegessen",
    "yedim"
   ],
   [
    "I went",
    "je suis allé",
    "sono andato",
    "ich bin gegangen",
    "gittim"
   ],
   [
    "we saw",
    "nous avons vu",
    "abbiamo visto",
    "wir haben gesehen",
    "gördük, izledik"
   ]
  ],
  "q": [
   [
    "Sabah nerede çalıştı?",
    [
     "Evde",
     "Ofiste",
     "Kafede"
    ],
    1
   ],
   [
    "Öğlen ne yedi?",
    [
     "Tavuk",
     "Balık",
     "Et"
    ],
    1
   ],
   [
    "Akşam nereye gitti?",
    [
     "Sinemaya",
     "Parka",
     "Restorana"
    ],
    0
   ]
  ]
 },
 {
  "day": 27,
  "kind": "dialog",
  "t": {
   "tr": "Havaalanında",
   "en": "At the airport",
   "fr": "À l'aéroport",
   "it": "All'aeroporto",
   "de": "Am Flughafen"
  },
  "sp": {
   "A": [
    "Görevli",
    "f"
   ],
   "B": [
    "Ahmet",
    "m"
   ]
  },
  "s": [
   [
    "A",
    "Good morning. Your passport, please.",
    "Bonjour. Votre passeport, s'il vous plaît.",
    "Buongiorno. Il passaporto, per favore.",
    "Guten Morgen. Ihren Pass, bitte.",
    "Günaydın. Pasaportunuz, lütfen."
   ],
   [
    "B",
    "Here you are.",
    "Voilà.",
    "Ecco.",
    "Bitte schön.",
    "Buyurun."
   ],
   [
    "A",
    "Where are you going?",
    "Où allez-vous ?",
    "Dove va?",
    "Wohin fliegen Sie?",
    "Nereye gidiyorsunuz?"
   ],
   [
    "B",
    "To Paris, on vacation.",
    "À Paris, en vacances.",
    "A Parigi, in vacanza.",
    "Nach Paris, in den Urlaub.",
    "Paris'e, tatile."
   ],
   [
    "A",
    "One suitcase?",
    "Une valise ?",
    "Una valigia?",
    "Ein Koffer?",
    "Bir bavul mu?"
   ],
   [
    "B",
    "Yes, one. Is the flight on time?",
    "Oui, une. Le vol est à l'heure ?",
    "Sì, una. Il volo è in orario?",
    "Ja, einer. Ist der Flug pünktlich?",
    "Evet, bir tane. Uçuş zamanında mı?"
   ],
   [
    "A",
    "Yes. Gate twelve. Have a good trip!",
    "Oui. Porte douze. Bon voyage !",
    "Sì. Uscita dodici. Buon viaggio!",
    "Ja. Gate zwölf. Gute Reise!",
    "Evet. On iki numaralı kapı. İyi yolculuklar!"
   ]
  ],
  "k": [
   [
    "passport",
    "le passeport",
    "il passaporto",
    "der Pass",
    "pasaport"
   ],
   [
    "suitcase",
    "la valise",
    "la valigia",
    "der Koffer",
    "bavul"
   ],
   [
    "flight",
    "le vol",
    "il volo",
    "der Flug",
    "uçuş"
   ],
   [
    "gate",
    "la porte",
    "l'uscita",
    "das Gate",
    "kapı (uçuş kapısı)"
   ],
   [
    "vacation",
    "les vacances",
    "la vacanza",
    "der Urlaub",
    "tatil"
   ]
  ],
  "q": [
   [
    "Ahmet nereye gidiyor?",
    [
     "Roma",
     "Paris",
     "Berlin"
    ],
    1
   ],
   [
    "Kaç bavulu var?",
    [
     "Bir",
     "İki",
     "Hiç"
    ],
    0
   ],
   [
    "Hangi kapı?",
    [
     "On",
     "On iki",
     "İki"
    ],
    1
   ]
  ]
 }
];
