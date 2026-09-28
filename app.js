'use strict';
// Dil Atlası — bağımlılıksız uygulama mantığı.
// Korunan localStorage anahtarları: dil-atlasi-active, da:{task}:{lang}:{date}, dil-atlasi-timer, dil-atlasi-srs.
// Şema sürümü dil-atlasi-surum; yeni anahtarlar: dil-atlasi-plan (haftalık plan), dil-atlasi-gunluk (günlük istatistik).

const languages = {
  en:{name:'İngilizce', acc:'İngilizceyi', native:'English', code:'EN', color:'#65c8ff', voice:'en-US'},
  fr:{name:'Fransızca', acc:'Fransızcayı', native:'Français', code:'FR', color:'#7be0c3', voice:'fr-FR'},
  it:{name:'İtalyanca', acc:'İtalyancayı', native:'Italiano', code:'IT', color:'#ffca77', voice:'it-IT'},
  de:{name:'Almanca', acc:'Almancayı', native:'Deutsch', code:'DE', color:'#ff8b9b', voice:'de-DE'}
};
// Görev kodları sabittir; her biri Bugün sekmesindeki bir aşamaya karşılık gelir.
// Uygulama sürümü: sw.js CACHE_NAME ile aynı olmalı (içerik testi denetler); İlerleme'de ve tanılama satırında görünür.
const APP_VERSION = 'v33';
const tasks = ['review', 'lesson', 'shadow', 'speak'];
const TABS = ['bugun', 'oku', 'yuru', 'izle', 'ilerleme'];

const $ = s => document.querySelector(s);
const el = (tag, props = {}, ...children) => { const e = document.createElement(tag); Object.assign(e, props); e.append(...children); return e; };
const store = {
  get: k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  del: k => { try { localStorage.removeItem(k); } catch {} }
};
function localDate(offset = 0) { const d = new Date(); d.setDate(d.getDate() + offset); return d.toLocaleDateString('en-CA'); }
const key = (type, lang = active, date = localDate()) => `da:${type}:${lang}:${date}`;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isDone = (t, lang = active, date = localDate()) => store.get(key(t, lang, date)) === '1';
const readJson = k => { try { return JSON.parse(store.get(k)); } catch { return null; } };
// Yansız karıştırma (Fisher–Yates).
function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function setDone(t, on = true) { on ? store.set(key(t), '1') : store.del(key(t)); if (t === 'lesson') freqAdvance(on); render(); }

// ---------- En sık 1000 kelime ----------
// Günde 10 kelimelik paket; ders aşaması "Tamamladım" ile işaretlenince paket öğrenilmiş sayılır.
// Durum: dil-atlasi-sik = {en: {on, done, last}} — done: öğrenilen paket sayısı, last: son ilerletilen gün.
const FREQ_KEY = 'dil-atlasi-sik', FREQ_BATCH = 10;
const freqList = (lang = active) => window.FREQ?.[lang] || [];
function freqState(lang = active) {
  let all = {}; try { all = JSON.parse(store.get(FREQ_KEY)) || {}; } catch {}
  const st = all[lang] || {};
  return {on: st.on !== false, done: Number.isInteger(st.done) && st.done >= 0 ? st.done : 0, last: DATE_RE.test(st.last || '') ? st.last : ''};
}
function saveFreqState(lang, st) { let all = {}; try { all = JSON.parse(store.get(FREQ_KEY)) || {}; } catch {} all[lang] = st; store.set(FREQ_KEY, JSON.stringify(all)); }
// Bugün gösterilen paket: bugün ilerletildiyse bir önceki (bugün öğrenilen), değilse sıradaki.
function freqToday(lang = active) {
  const st = freqState(lang), list = freqList(lang); if (!st.on || !list.length) return null;
  const batch = st.last === localDate() ? st.done - 1 : st.done, from = batch * FREQ_BATCH;
  if (from >= list.length) return {batch, from, items: []};
  return {batch, from, items: list.slice(from, from + FREQ_BATCH)};
}
function freqAdvance(on) {
  const st = freqState(), today = localDate(); if (!st.on || !freqList().length) return;
  if (on && st.last !== today && st.done * FREQ_BATCH < freqList().length) { st.done++; st.last = today; }
  else if (!on && st.last === today) { st.done = Math.max(0, st.done - 1); st.last = ''; }
  saveFreqState(active, st);
}

// Tek seferlik sıfırlama (Eylül 2026, kullanıcı isteği): dört dil ders 1'den başlar.
// Silinen kayıtlar kaybolmaz; dil-atlasi-sifirlama-yedegi anahtarında JSON olarak saklanır.
const RESET_FLAG = 'dil-atlasi-sifirlama-2026-09';
if (!store.get(RESET_FLAG)) {
  try {
    const backup = {}, keys = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^da:/.test(k) || k === 'dil-atlasi-srs') keys.push(k); }
    keys.forEach(k => { backup[k] = store.get(k); });
    if (keys.length) store.set('dil-atlasi-sifirlama-yedegi', JSON.stringify(backup));
    keys.forEach(k => store.del(k));
  } catch {}
  store.set(RESET_FLAG, '1');
}

// ---------- Veri şeması ve kontrollü geçiş ----------
// dil-atlasi-surum yerel verinin şema sürümüdür (anahtar yoksa 1). Yeni biçim gerektiğinde MIGRATIONS'a bir adım eklenir.
// Geçişten önce tüm kayıtlar dil-atlasi-goc-yedegi anahtarına kopyalanır; bir adım hata verirse sürüm artmaz, sonraki açılışta yeniden denenir.
// Daha yeni bir sürümün yazdığı veriye (ör. önbellekten açılan eski uygulama) dokunulmaz.
const SCHEMA_KEY = 'dil-atlasi-surum', SCHEMA = 2;
const MIGRATIONS = {
  // 1 → 2: haftalık plan ve günlük istatistik anahtarları başlatılır; tekrar kartlarındaki hatırlama ölçüsü sayıya çevrilir.
  2: () => {
    if (!readJson('dil-atlasi-plan')) store.set('dil-atlasi-plan', JSON.stringify({v:1, langs:{}}));
    if (!readJson('dil-atlasi-gunluk')) store.set('dil-atlasi-gunluk', JSON.stringify({v:1, d:{}}));
    const s = readJson('dil-atlasi-srs');
    if (s?.v === 2 && s.stats && typeof s.stats === 'object') {
      for (const [lang, st] of Object.entries(s.stats)) { const n = Math.max(0, parseInt(st?.n, 10) || 0), ok = Math.min(n, Math.max(0, parseInt(st?.ok, 10) || 0)); s.stats[lang] = {ok, n}; }
      store.set('dil-atlasi-srs', JSON.stringify(s));
    }
  }
};
function migrate() {
  let v = parseInt(store.get(SCHEMA_KEY), 10) || 1;
  if (v >= SCHEMA) return;
  try {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if ((/^da:/.test(k) || /^dil-atlasi-/.test(k)) && !/yedegi$/.test(k)) data[k] = localStorage.getItem(k); }
    if (Object.keys(data).length) store.set('dil-atlasi-goc-yedegi', JSON.stringify({from:v, at:new Date().toISOString(), data}));
  } catch {}
  while (v < SCHEMA) {
    try { MIGRATIONS[v + 1]?.(); } catch { return; }
    v++; store.set(SCHEMA_KEY, String(v));
  }
}
migrate();

let active = languages[store.get('dil-atlasi-active')] ? store.get('dil-atlasi-active') : 'en';
let tab = TABS.includes(store.get('dil-atlasi-tab')) ? store.get('dil-atlasi-tab') : 'bugun';
let openStep = null;

// ---------- Ders içeriği ----------
const lessonsFor = (lang = active) => window.LESSONS?.[lang] || [];
// Ders günü = bu dilde bugünden önce çalışılan gün sayısı + 1. Bugün aşama işaretlemek dersi değiştirmez.
// Geçmiş gün içinde değişmediği için dil+tarih başına bir kez hesaplanır; geçmişi değiştiren işlemler (yedek, sıfırlama) önbelleği temizler.
const dayCache = new Map();
function getLessonDay(lang = active) {
  const ck = `${lang}|${localDate()}`;
  if (!dayCache.has(ck)) { let count = 0; for (let i = 1; i <= 365; i++) if (tasks.some(t => isDone(t, lang, localDate(-i)))) count++; dayCache.set(ck, count); }
  return Math.max(1, Math.min(dayCache.get(ck) + 1, lessonsFor(lang).length));
}
window.addEventListener('storage', () => dayCache.clear());
const todayLesson = () => lessonsFor()[getLessonDay() - 1];
const emojiFor = (li, wi) => window.EMOJI?.[`${li}:${wi}`] || '';

// ---------- Seslendirme ----------
// Ses kalitesi cihazdaki seslere bağlıdır. Otomatik seçim "Premium/Enhanced/Natural/Neural/Google" sesleri öne alır,
// Apple'ın eğlence ve Eloquence seslerini (robotik) geri iter. Kullanıcı İlerleme sekmesinden ses ve hız seçebilir.
const VOICE_KEY = 'dil-atlasi-voices', RATE_KEY = 'dil-atlasi-rate';
const ROBOTIC = /\b(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Deranged|Hysterical|Pipe Organ|Princess|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley)\b/i;
const voiceList = lang => ('speechSynthesis' in window ? speechSynthesis.getVoices() : []).filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
// Doğal aksan: dilin kendi bölgesindeki ses (fr-FR, it-IT, de-DE, en-US) güçlü biçimde öne alınır; ör. Fransızca için Kanada sesi ancak Fransa sesi yoksa seçilir.
function voiceScore(v, lang) {
  let s = 0;
  if (/premium|enhanced|geliştirilmiş|natural|neural|wavenet|siri/i.test(v.name)) s += 6;
  if (/google/i.test(v.name)) s += 3;
  if (v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase()) s += 7;
  if (ROBOTIC.test(v.name)) s -= 10;
  if (v.default) s += 1;
  return s;
}
const chosenVoices = () => { try { return JSON.parse(store.get(VOICE_KEY)) || {}; } catch { return {}; } };
// Kadın/erkek ses tercihi (dil-atlasi-ses-cinsiyet: 'f' | 'm', yoksa otomatik). Tarayıcılar sesin cinsiyetini bildirmez;
// ad içindeki "Female/Male" ya da bilinen Apple, Google ve Microsoft ses adlarından çıkarılır. Bilinmeyen ses '' döner.
const GENDER_KEY = 'dil-atlasi-ses-cinsiyet';
const VOICE_F = /\b(samantha|karen|moira|tessa|victoria|allison|ava|susan|zoe|nicky|martha|catherine|serena|fiona|veena|kate|joelle|jenny|aria|libby|sonia|natasha|michelle|emma|sara|clara|ana|amélie|amelie|audrey|aurélie|aurelie|marie|virginie|julie|céline|celine|denise|eloise|hortense|brigitte|coralie|chantal|sylvie|alice|federica|paola|elsa|isabella|carla|fiamma|giulia|anna|petra|helena|katja|amala|hedda|marlene|vicki|ingrid|seraphina|gisela|elke|leni|tanja)\b/i;
const VOICE_M = /\b(alex|daniel|aaron|arthur|gordon|rishi|oliver|tom|evan|nathan|guy|davis|ryan|george|james|thomas|jacques|henri|paul|claude|remy|rémy|nicolas|luca|diego|cosimo|giorgio|benigno|markus|yannick|martin|conrad|killian|stefan|hans|florian|christoph|ralf|jonas)\b/i;
const GOOGLE_F = /^google (us english|français|italiano|deutsch)$/i;
function voiceGender(v) {
  const n = v?.name || '';
  if (/\b(female|woman|kadın|femme|weiblich|donna)\b/i.test(n)) return 'f';
  if (/\b(male|man|erkek|homme|männlich|uomo)\b/i.test(n)) return 'm';
  if (GOOGLE_F.test(n.trim())) return 'f';
  // Microsoft: "Microsoft Denise Online (Natural) - French" → ilk ad
  const first = n.replace(/^microsoft\s+/i, '').trim();
  if (VOICE_F.test(first.split(/[\s(,-]/)[0])) return 'f';
  if (VOICE_M.test(first.split(/[\s(,-]/)[0])) return 'm';
  return '';
}
const genderPref = () => ['f', 'm'].includes(store.get(GENDER_KEY)) ? store.get(GENDER_KEY) : '';
const byScore = (list, lang) => [...list].sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang));
// Seçim sırası: elle seçilen ses (tercih edilen cinsiyete aykırı değilse) → tercih edilen cinsiyetteki en doğal ses → en doğal ses.
// force: diyaloglarda konuşmacının cinsiyeti ('f' | 'm'); elle seçilen sesin ve genel tercihin önüne geçer.
function voiceFor(lang, force = '') {
  const list = voiceList(lang), pick = list.find(v => v.voiceURI === chosenVoices()[lang.slice(0, 2)]), g = force || genderPref();
  if (pick && (!g || voiceGender(pick) !== (g === 'f' ? 'm' : 'f')) && (!force || voiceGender(pick) === force)) return pick;
  const same = g ? list.filter(v => voiceGender(v) === g) : [];
  return byScore(same.length ? same : list, lang)[0] || null;
}
const genderAvailable = (lang, g) => voiceList(lang).some(v => voiceGender(v) === g);
const rateFactor = () => [0.8, 1, 1.15].includes(+store.get(RATE_KEY)) ? +store.get(RATE_KEY) : 1;
function utter(text, lang, rate, g = '') {
  AUDIO_USE.tts++;
  const u = new SpeechSynthesisUtterance(text), v = voiceFor(lang, g);
  // Diyalog: o cinsiyette ses yoksa iki konuşmacı ses perdesiyle ayrılır.
  if (g && voiceGender(v) !== g) u.pitch = g === 'f' ? 1.25 : .8;
  // Mikrofon açıkken çalan ses: bitene kadar ve bittikten sonra ASR_ECHO_MS boyunca tanıyıcıdan gelenler yok sayılır ('end' gelmezse süre tahmini).
  if (ASR.state === 'listening') {
    if (ASR.log.length < 40) ASR.log.push('tts');
    // iPhone (v25 tanılaması: "… → sonuç → tts → tts", sonra ses yok): seslendirme açık oturumun mikrofonunu da susturuyor.
    if (isIOS()) ASR.broken = true;
    ASR.echoUntil = Infinity;
    const ended = () => { if (ASR.echoUntil === Infinity) ASR.echoUntil = Date.now() + ASR_ECHO_MS; };
    u.addEventListener('end', ended); u.addEventListener('error', ended); setTimeout(ended, 1500 + text.length * 120);
  }
  u.lang = v?.lang || lang; if (v) try { u.voice = v; } catch {} u.rate = rate * rateFactor();
  return u;
}
// Tek ses kaynağı: yeni bir seslendirme, "Hepsini dinle" zincirini, ses çalışmasını ve çalan kaydı durdurur.
// Safari cancel() sonrasında da onend gönderir; zincirler bu yüzden audioRun belirtecini denetler, yoksa kendi kendine sürer.
let audioRun = 0;
function stopAudio() {
  audioRun++;
  if (drill.playing) stopDrill();
  readPlayEnd();
  // Konuşmuyorsa cancel() çağrılmaz: iPhone'da gereksiz ses oturumu değişikliği mikrofonu etkileyebilir.
  if ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
  document.querySelectorAll('audio').forEach(a => { a.onended = null; a.pause(); });
}
// Sayfa yüklendiğinden beri seslendirme (tts) ve kayıt (rec) sayısı: telaffuz kontrolü başarısız olursa tanılama satırında gösterilir
// (iPhone'da seslendirme ya da kayıttan sonra mikrofonun sessiz açıldığından şüpheleniliyor; bu sayılar bunu doğrulamak için).
const AUDIO_USE = {tts: 0, rec: 0};
// Mikrofon açıkken çalan seslendirme ve hemen sonrası: tanıyıcı telefonun kendi sesini "söylenen" sanmasın.
const ASR_ECHO_MS = 600;
const ttsEcho = () => Date.now() < ASR.echoUntil;
// iPhone/iPad (iPadOS masaüstü Safari gibi görünür). Testler window.DA_IOS ile zorlayabilir.
const isIOS = () => window.DA_IOS ?? (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
// onEnd: seslendirme bitince (başka bir ses araya girmediyse) bir kez çağrılır; 'end' gelmezse süre tahmini.
// g: diyalogda konuşmacının sesi ('f' | 'm').
function speak(text, lang = languages[active].voice, rate = .85, onEnd, g = '') {
  if (!('speechSynthesis' in window)) return;
  stopAudio(); const run = audioRun, u = utter(text, lang, rate, g);
  if (onEnd) { let fired = false; const f = () => { if (fired || run !== audioRun) return; fired = true; onEnd(); }; u.addEventListener('end', f); u.addEventListener('error', f); setTimeout(f, 2000 + text.length * 150); }
  speechSynthesis.speak(u);
}
// Listeyi sırayla okur; başka bir ses başlatılınca ya da sekme değişince durur.
function playAll(list, lang, rate = .8) {
  if (!('speechSynthesis' in window)) return;
  stopAudio(); const run = audioRun; let k = 0;
  const next = () => { if (run !== audioRun || k >= list.length) return; const u = utter(list[k++][0], lang, rate); u.onend = () => setTimeout(next, 700); speechSynthesis.speak(u); };
  next();
}
const speakBtn = (text, lang) => el('button', {type:'button', className:'speak', textContent:'▶', ariaLabel:`Seslendir: ${text}`, onclick: () => speak(text, lang)});

// ---------- Aralıklı tekrar (Leitner kutuları) ----------
// Önceki derslerin kelime (w) ve cümleleri (s) karta dönüşür. Bildim → kutu +1 (1/3/7/14/30 gün), Tekrar → yarın.
const SRS_KEY = 'dil-atlasi-srs', INTERVALS = [1, 3, 7, 14, 30];
const CARD_ID = /^(en|fr|it|de):(\d{1,3}:[ws]\d{1,2}|n:[a-z0-9]{4,14}|f:\d{1,4}|r:\d{1,2}:\d{1,2})$/, DATE = /^\d{4}-\d{2}-\d{2}$/;
// Hata defteri: yapay zekânın ya da kendinin düzelttiği cümleler kullanıcı kartı olur (dil-atlasi-notlar).
// Kullanıcı girdisidir: yalnızca textContent ile gösterilir, uzunluk sınırlıdır.
const NOTES_KEY = 'dil-atlasi-notlar', NOTE_MAX = 200, NOTES_PER_DAY = 2;
const cleanText = v => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, NOTE_MAX);
function loadNotes() { try { const v = JSON.parse(store.get(NOTES_KEY)); if (v && v.v === 1 && v.items && typeof v.items === 'object') return v; } catch {} return {v:1, items:{}}; }
function saveNotes(n) { store.set(NOTES_KEY, JSON.stringify(n)); }
const notesToday = (lang = active) => Object.entries(loadNotes().items).filter(([id, n]) => id.startsWith(lang + ':') && n.d === localDate()).length;
function addNote(target, tr) {
  const t = cleanText(target), m = cleanText(tr); if (!t) return false;
  const n = loadNotes(), id = `${active}:n:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`; n.items[id] = {t, tr: m || '(kendi cümlen)', d: localDate()}; saveNotes(n); return true;
}
function loadSrs() {
  const raw = store.get(SRS_KEY);
  try { const v = JSON.parse(raw); if (v && v.v === 2 && v.cards && typeof v.cards === 'object') return v; } catch {}
  // Eski (v1) kartlar önceki ders içeriğine aitti; silinmez, ayrı anahtarda saklanır.
  if (raw && !store.get('dil-atlasi-srs-v1')) store.set('dil-atlasi-srs-v1', raw);
  return {v:2, cards:{}};
}
function saveSrs(s) { store.set(SRS_KEY, JSON.stringify(s)); }
function dueCards(lang = active, limit = 60) {
  const cards = loadSrs().cards, all = lessonsFor(lang), today = localDate(), out = [];
  for (let li = 0; li < getLessonDay(lang) - 1; li++) {
    const add = (kind, [target, tr, pron], i) => { const id = `${lang}:${li}:${kind}${i}`, c = cards[id]; if (!c || c.d <= today) out.push({id, target, tr, pron, emoji: kind === 'w' ? emojiFor(li, i) : '', box: c ? c.b : -1, due: c ? c.d : ''}); };
    all[li].w.forEach((x, i) => add('w', x, i)); all[li].p.forEach((x, i) => add('s', x, i));
  }
  // Sık kelimeler: bugünden önce öğrenilen paketler karta dönüşür.
  const fs = freqState(lang), fl = freqList(lang), learned = Math.min(fl.length, (fs.last === today ? fs.done - 1 : fs.done) * FREQ_BATCH);
  for (let k = 0; k < learned; k++) { const id = `${lang}:f:${k}`, c = cards[id], [target, tr, pron, , , emoji] = fl[k]; if (!c || c.d <= today) out.push({id, target, tr, pron, emoji, box: c ? c.b : -1, due: c ? c.d : ''}); }
  // Hata defteri kartları eklendikleri günün ertesinden itibaren gelir.
  for (const [id, n] of Object.entries(loadNotes().items)) { if (!id.startsWith(lang + ':') || n.d >= today) continue; const c = cards[id]; if (!c || c.d <= today) out.push({id, target:n.t, tr:n.tr, box: c ? c.b : -1, due: c ? c.d : ''}); }
  // Okuma anahtar kelimeleri: "Kartlara ekle" dendiği günün ertesinden itibaren.
  const rc = loadRead().cards;
  stories().forEach((st, si) => { const added = rc[`${lang}:${si}`]; if (!DATE.test(added || '') || added >= today) return; st.k.forEach((k, ki) => { const id = `${lang}:r:${si}:${ki}`, c = cards[id]; if (!c || c.d <= today) out.push({id, target:k[SLI[lang] - 1], tr:k[4], box: c ? c.b : -1, due: c ? c.d : ''}); }); });
  // Önce günü gelmiş tekrarlar (en eski önce), sonra yeni kartlar.
  return out.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999')).slice(0, limit);
}
function gradeCard(id, box, ok) {
  const s = loadSrs(), b = ok ? Math.min(box + 1, INTERVALS.length - 1) : 0;
  // Harcanan süre yerine kalıcılığı ölç: 7+ gün aralıkla dönen kartlarda hatırlama oranı.
  if (box >= 2) { const lang = id.slice(0, 2), st = (s.stats ||= {})[lang] ||= {ok:0, n:0}; st.n++; if (ok) st.ok++; }
  s.cards[id] = {b, d: localDate(ok ? INTERVALS[b] : 1)}; saveSrs(s);
  logAdd(id.slice(0, 2), 'c'); if (ok) logAdd(id.slice(0, 2), 'ok');
}

// ---------- Günlük istatistik ----------
// dil-atlasi-gunluk = {v:1, d:{"YYYY-MM-DD": {en: {c, ok, m}}}} — c: değerlendirilen kart, ok: bilinen kart, m: tamamlanan odak dakikası.
// Aşama sayıları ayrıca saklanmaz, da: anahtarlarından hesaplanır. LOG_DAYS günden eski kayıtlar silinir.
const LOG_KEY = 'dil-atlasi-gunluk', LOG_DAYS = 400, LOG_FIELDS = ['c', 'ok', 'm'];
function loadLog() { const v = readJson(LOG_KEY); return v?.v === 1 && v.d && typeof v.d === 'object' ? v : {v:1, d:{}}; }
function saveLog(l) { const min = localDate(-LOG_DAYS); Object.keys(l.d).forEach(d => { if (!DATE_RE.test(d) || d < min) delete l.d[d]; }); store.set(LOG_KEY, JSON.stringify(l)); }
function logAdd(lang, field, n = 1) { const l = loadLog(), x = ((l.d[localDate()] ||= {})[lang] ||= {}); x[field] = (x[field] || 0) + n; saveLog(l); }
const logGet = (log, date, lang) => { const x = log.d[date]?.[lang] || {}; return {c: x.c || 0, ok: x.ok || 0, m: x.m || 0}; };

// ---------- Haftalık plan ----------
// dil-atlasi-plan = {v:1, langs:{en:{days:[1,3,5], goal:4}}} — days: haftanın günleri (0 = Pazar), goal: günlük hedef aşama sayısı (2–4).
// Plan yalnızca hatırlatır; planda olmayan günde de çalışılabilir, ders günü hesabı değişmez.
const PLAN_KEY = 'dil-atlasi-plan', WEEKDAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'], GOALS = [2, 3, 4];
function loadPlan() { const v = readJson(PLAN_KEY); return v?.v === 1 && v.langs && typeof v.langs === 'object' ? v : {v:1, langs:{}}; }
function cleanPlan(p) { const days = [...new Set(Array.isArray(p?.days) ? p.days.filter(d => Number.isInteger(d) && d >= 0 && d <= 6) : [])].sort((a, b) => a - b); return {days, goal: GOALS.includes(p?.goal) ? p.goal : 4}; }
const planFor = (lang = active) => cleanPlan(loadPlan().langs[lang]);
function savePlan(lang, p) { const all = loadPlan(); all.langs[lang] = cleanPlan(p); store.set(PLAN_KEY, JSON.stringify(all)); }
const todayDow = () => new Date().getDay();
const plannedToday = lang => planFor(lang).days.includes(todayDow());
const stepsOn = (date, lang = active) => tasks.filter(t => isDone(t, lang, date)).length;
// Pazartesi başlayan hafta: weeksAgo = 0 bu hafta (bugüne kadar), 1 geçen hafta (7 gün).
function weekDates(weeksAgo = 0) { const back = (todayDow() + 6) % 7 + weeksAgo * 7, n = weeksAgo ? 7 : back + 1; return Array.from({length:n}, (_, i) => localDate(i - back)); }
function weekSummary(lang, dates, log = loadLog()) {
  const goal = planFor(lang).goal, r = {days:0, met:0, steps:0, c:0, ok:0, m:0};
  dates.forEach(d => { const n = stepsOn(d, lang), x = logGet(log, d, lang); if (n || x.c) r.days++; if (n >= goal) r.met++; r.steps += n; r.c += x.c; r.ok += x.ok; r.m += x.m; });
  return r;
}
const learnedCount = (lang = active) => Object.entries(loadSrs().cards).filter(([id, c]) => id.startsWith(lang + ':') && c.b >= 2).length;

// ---------- Dil ve sekme ----------
function renderLangs() {
  const nav = $('#langs'); nav.replaceChildren();
  Object.entries(languages).forEach(([id, l]) => {
    const planned = plannedToday(id);
    const b = el('button', {type:'button', className:`lang-chip${planned ? ' planned' : ''}`, onclick: () => switchLang(id)}, el('span', {textContent:l.code}), el('span', {className:'full', textContent:l.name}));
    b.style.setProperty('--c', l.color); b.setAttribute('aria-pressed', id === active); b.setAttribute('aria-label', planned ? `${l.name}, bugün planda` : l.name);
    nav.append(b);
  });
}
function switchLang(id) { stopDrill(); stopAudio(); releaseMic(); readOpen = null; active = id; store.set('dil-atlasi-active', id); openStep = null; render(); }
function switchTab(id) {
  if (id !== tab) { stopAudio(); releaseMic(); }
  tab = id; store.set('dil-atlasi-tab', id);
  TABS.forEach(t => { const on = t === id; $(`#tab-${t}`).setAttribute('aria-selected', on); $(`#tab-${t}`).tabIndex = on ? 0 : -1; $(`#panel-${t}`).hidden = !on; });
  window.scrollTo({top: 0});
}
document.querySelectorAll('.tab').forEach(b => {
  b.onclick = () => switchTab(b.dataset.tab);
  b.onkeydown = e => { const i = TABS.indexOf(b.dataset.tab), n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (n) { const t = TABS[(i + n + TABS.length) % TABS.length]; switchTab(t); $(`#tab-${t}`).focus(); } };
});

// ---------- Bugün: aşamalı yol ----------
const STEPS = [
  {task:'review', title:'Tekrar', sub:'Önceki derslerin kartları', min:5},
  {task:'lesson', title:'Kelimeler ve cümleler', sub:'8 kelime, 5 cümle, cümle kurma', min:10},
  {task:'shadow', title:'Dinle ve tekrar et', sub:'Yürürken ya da yolda', min:10},
  {task:'speak', title:'Konuş', sub:'Telaffuz testi, sesli söyle, yapay zekâyla pratik', min:5}
];
function renderToday() {
  const l = languages[active], lesson = todayLesson(), day = getLessonDay(), due = dueCards();
  $('#todayEyebrow').textContent = `${l.name} · ${l.native}`;
  $('#lessonTitle').textContent = lesson.t;
  $('#lessonPill').textContent = `Ders ${day}/${lessonsFor().length}`;
  const doneSteps = STEPS.filter(s => isDone(s.task) || (s.task === 'review' && !due.length)).length;
  $('#todayBar').style.width = `${doneSteps / STEPS.length * 100}%`;
  $('#todayHint').textContent = doneSteps === STEPS.length ? 'Bugünlük tamam. Akşam İzle sekmesinden kısa bir bölüm açabilirsin.' : 'Adımları sırayla yap; her biri 5–10 dakika. Gün içinde bölebilirsin.';
  $('#planHint').textContent = planHint();
  const ns = nextStory(), rh = $('#readHint');
  rh.replaceChildren(); rh.hidden = ns < 0;
  if (ns >= 0) { const st = stories()[ns]; rh.append(`${st.kind === 'dialog' ? '💬 Diyalog' : '📖 Okuma'} açık: „${storyTitle(st)}” (${st.t.tr}). `, el('button', {type:'button', className:'text-link', textContent:'Oku →', onclick: () => { readOpen = ns; renderRead(); switchTab('oku'); }})); }
  if (openStep === null) openStep = STEPS.findIndex(s => !(isDone(s.task) || (s.task === 'review' && !due.length)));
  const box = $('#steps'); box.replaceChildren();
  STEPS.forEach((s, i) => {
    const done = isDone(s.task) || (s.task === 'review' && !due.length), open = i === openStep;
    const head = el('button', {type:'button', className:'step-head', onclick: () => { openStep = open ? -1 : i; renderToday(); }},
      el('span', {className:'step-num', textContent: done ? '✓' : i + 1}),
      el('span', {}, el('span', {className:'step-title', textContent:s.title}), el('span', {className:'step-sub', textContent:s.sub})),
      el('span', {className:'step-time', textContent:`${s.min} dk`}));
    head.setAttribute('aria-expanded', open);
    const wrap = el('div', {className:`step${done ? ' done' : ''}${open ? ' open' : ''}`}, head);
    if (open) wrap.append(el('div', {className:'step-body'}, ...stepBody(s, lesson, due, i)));
    box.append(wrap);
  });
  // Mikrofon yalnızca Konuş adımı açıkken açık kalır.
  if (STEPS[openStep]?.task !== 'speak' && ASR.state === 'listening') asrStop();
  asrBar();
}
function planHint() {
  const l = languages[active], p = planFor();
  if (p.days.includes(todayDow())) return `Plan: bugün ${l.name} günü · hedef ${p.goal} aşama · bu hafta hedefe ulaşılan gün ${weekSummary(active, weekDates()).met}/${p.days.length}.`;
  const others = Object.keys(languages).filter(plannedToday).map(id => languages[id].name);
  if (!p.days.length && !others.length) return 'İstersen İlerleme sekmesinden bu dil için haftalık plan kurabilirsin.';
  return `Bugün ${l.name} planında yok${others.length ? `; planlı: ${others.join(', ')}` : ''}. İstersen yine de çalışabilirsin.`;
}
function doneRow(task, next) {
  const done = isDone(task);
  return el('div', {className:'step-actions'},
    el('button', {type:'button', className: done ? 'btn secondary' : 'btn', textContent: done ? 'Geri al' : 'Tamamladım ✓', onclick: () => { setDone(task, !done); openStep = done ? openStep : next; renderToday(); }}));
}
function stepBody(s, lesson, due, i) {
  const voice = languages[active].voice;
  if (s.task === 'review') {
    if (!due.length) return [el('p', {className:'small', textContent: getLessonDay() < 2 ? 'Tekrar kartları ilk dersten sonraki çalışma gününde başlar. Bugün 2. adımdan başla.' : 'Bugün tekrar edilecek kart yok. Harika!'})];
    return [flashcard(due, voice, i)];
  }
  if (s.task === 'lesson') return lessonBody(lesson, voice, i);
  if (s.task === 'shadow') {
    const first = (window.MEDIA?.[active]?.audio || [])[0];
    return [
      el('p', {className:'small', textContent:'Ses çalışması bugünün kelime ve cümlelerini sırayla okur: her birini duyarsın, arada yüksek sesle tekrar edersin, sonra bir kez daha dinlersin. Türkçe anlamı ekranda yazar, seslendirilmez. Bittiğinde bu adım kendiliğinden işaretlenir.'}),
      el('div', {className:'step-actions'}, el('button', {type:'button', className:'btn', textContent:'🎧 Ses çalışmasını başlat', onclick: () => { switchTab('yuru'); startDrill(); }})),
      first ? el('div', {}, el('p', {className:'small', textContent:'Uzun yürüyüşte ekstra (podcast uygulamanda, ekran kilitliyken de çalışır):'}), el('div', {className:'res'}, resLink(first))) : '',
      doneRow('shadow', i + 1)
    ];
  }
  return speakBody(lesson, voice, i);
}
function flashcard(due, voice, i) {
  const c = due[0], box = el('div', {className:'flash'});
  const meta = el('div', {className:'small muted', textContent:`Kalan ${due.length} kart · ${c.box < 0 ? 'yeni' : 'kutu ' + (c.box + 1)}`});
  const q = el('div', {className:'q', textContent: c.emoji ? `${c.emoji}  ${c.tr}` : c.tr});
  const reveal = el('button', {type:'button', className:'btn big', textContent:'Cevabı göster'});
  box.append(meta, q, el('p', {className:'small', textContent:'Önce yüksek sesle söyle, sonra aç.'}), reveal);
  reveal.onclick = () => {
    speak(c.target, voice);
    const grade = ok => { gradeCard(c.id, c.box, ok); if (dueCards().length === 0) { store.set(key('review'), '1'); openStep = i + 1; } render(); $('#steps .flash .btn, #steps .step.open .btn')?.focus(); };
    reveal.replaceWith(el('div', {className:'a'}, el('span', {textContent:c.target}), speakBtn(c.target, voice)), c.pron ? el('div', {className:'pron', textContent:`okunuşu: ${c.pron}`}) : '',
      el('div', {className:'actions'}, el('button', {type:'button', className:'btn secondary', textContent:'Tekrar et', onclick: () => grade(false)}), el('button', {type:'button', className:'btn', textContent:'Bildim', onclick: () => grade(true)})));
    box.querySelector('.actions .btn:last-child').focus();
  };
  return box;
}
function freqSection(voice) {
  const f = freqToday(); if (!f) return [];
  if (!f.items.length) return [el('div', {className:'eyebrow mt', textContent:'5 · Sık kelimeler'}), el('p', {className:'small', textContent:'1000 kelimenin hepsini gördün! Tekrar kartları devam ediyor.'})];
  const list = el('div', {className:'items'}, ...f.items.map(([t, tr, pron, ex, exTr, emo]) => el('div', {className:'item freq'},
    el('div', {}, el('strong', {textContent: emo ? `${emo} ${t}` : t}), el('span', {className:'pron', textContent:`[${pron}]`}), el('span', {textContent:tr}),
      el('span', {className:'example', textContent:`„${ex}”`}), el('span', {className:'example-tr', textContent:exTr})),
    el('div', {className:'freq-btns'}, speakBtn(t, voice), el('button', {type:'button', className:'speak', textContent:'💬', ariaLabel:`Örneği seslendir: ${ex}`, onclick: () => speak(ex, voice)})))));
  return [el('div', {className:'eyebrow mt', textContent:`5 · Sık kelimeler (${f.from + 1}–${f.from + f.items.length} / ${freqList().length})`}),
    el('p', {className:'small', textContent:'En sık kullanılan kelimelerden bugünün 10\'u. Kelimeyi ve örnek cümleyi dinle, cümleyi yüksek sesle söyle. Ders adımını tamamlayınca paket öğrenilmiş sayılır, yarın tekrar kartlarına girer.'}), list];
}
function lessonBody(lesson, voice, i) {
  const words = el('div', {className:'items'}, ...lesson.w.map(([t, tr, pron], wi) => el('div', {className:'item'}, el('div', {}, el('strong', {textContent: emojiFor(getLessonDay() - 1, wi) ? `${emojiFor(getLessonDay() - 1, wi)} ${t}` : t}), pron ? el('span', {className:'pron', textContent:`[${pron}]`}) : '', el('span', {textContent:tr})), speakBtn(t, voice))));
  const sentences = el('div', {className:'items'}, ...lesson.p.map(([t, tr]) => el('div', {className:'item'}, el('div', {}, el('strong', {textContent:t}), el('span', {textContent:tr})), speakBtn(t, voice))));
  return [
    el('div', {className:'eyebrow', textContent:'1 · Kelimeler'}), el('p', {className:'small', textContent:'Her kelimeyi dinle ve iki kez yüksek sesle söyle. Köşeli parantez Türkçe okunuştur; BÜYÜK hece vurguludur' + (active === 'fr' ? ', ñ: n\'yi söyleme, sesi burundan ver.' : '.')}),
    el('button', {type:'button', className:'btn secondary', textContent:'▶ Hepsini dinle', onclick: () => playAll(lesson.w, voice)}), words,
    el('div', {className:'eyebrow mt', textContent:'2 · Cümleler'}), el('p', {className:'small', textContent:'Aynı kelimeler cümle içinde. Dinle, sonra ekrana bakmadan söylemeyi dene.'}),
    el('button', {type:'button', className:'btn secondary', textContent:'▶ Hepsini dinle', onclick: () => playAll(lesson.p, voice)}), sentences,
    el('div', {className:'tip', textContent:`💡 ${lesson.n}`}),
    el('div', {className:'eyebrow mt', textContent:'3 · Cümle kur'}), sentenceBuilder(lesson.p, voice),
    el('div', {className:'eyebrow mt', textContent:'4 · Kendini sına'}), el('p', {className:'small', textContent:'Birkaç dakika sonra, bakmadan hatırla: Türkçesini gör, hedef dilde söyle, sonra aç. Bilemediklerin sona eklenir. Hatırlamaya çalışmak, tekrar okumaktan daha kalıcıdır.'}),
    ...freqSection(voice),
    selfQuiz([...lesson.w.map(([t, tr, pron], wi) => [t, tr, pron, emojiFor(getLessonDay() - 1, wi)]), ...lesson.p, ...(freqToday()?.items || []).map(([t, tr, pron, , , emo]) => [t, tr, pron, emo])], voice),
    doneRow('lesson', i + 1)
  ];
}
// Aynı gün hatırlama testi (testing effect): bugünün öğeleri karışık sırada, bilinmeyenler sona döner. Kayıt tutmaz.
function selfQuiz(items, voice) {
  const box = el('div');
  const start = () => {
    let queue = shuffle(items), right = 0;
    const draw = () => {
      if (!queue.length) { box.replaceChildren(el('p', {className:'result ok', role:'status', textContent:`Tamam! ${right} öğeyi hatırladın.`}), el('button', {type:'button', className:'btn secondary', textContent:'Yeniden', onclick: start})); return; }
      const [t, tr, pron, emo] = queue[0], card = el('div', {className:'flash'});
      const reveal = el('button', {type:'button', className:'btn big', textContent:'Cevabı göster'});
      card.append(el('div', {className:'small muted', textContent:`Kalan ${queue.length}`}), el('div', {className:'q', textContent: emo ? `${emo}  ${tr}` : tr}), reveal);
      reveal.onclick = () => {
        speak(t, voice);
        const next = ok => { const it = queue.shift(); if (ok) right++; else queue.push(it); draw(); box.querySelector('.btn')?.focus(); };
        reveal.replaceWith(el('div', {className:'a'}, el('span', {textContent:t}), speakBtn(t, voice)), pron ? el('div', {className:'pron', textContent:`okunuşu: ${pron}`}) : '',
          el('div', {className:'actions'}, el('button', {type:'button', className:'btn secondary', textContent:'Bilemedim', onclick: () => next(false)}), el('button', {type:'button', className:'btn', textContent:'Bildim', onclick: () => next(true)})));
        card.querySelector('.actions .btn:last-child').focus();
      };
      box.replaceChildren(card);
    };
    draw();
  };
  box.append(el('button', {type:'button', className:'btn secondary', textContent:`▶ Testi başlat (${items.length} öğe)`, onclick: start}));
  return box;
}
// Cümle kurma: Türkçesini gör, karışık kelimeleri doğru sıraya diz.
// Her cümlenin ilk denemesi sayılır. Son cümleden sonra "Bitir" doğru/yanlış özetini gösterir; "Baştan" ilk cümleye döner ve sayımı sıfırlar.
function sentenceBuilder(sentences, voice) {
  let idx = 0, results = []; const box = el('div');
  const restart = () => { idx = 0; results = []; draw(); box.querySelector('.chip')?.focus(); };
  const summary = () => {
    const right = results.filter(r => r === true).length, wrong = results.filter(r => r === false).length, skipped = sentences.length - right - wrong;
    const missed = sentences.filter((x, k) => results[k] !== true);
    box.replaceChildren(
      el('p', {className:`result ${wrong || skipped ? 'no' : 'ok'}`, role:'status', textContent:`Bitti! ${sentences.length} cümleden ${right} doğru, ${wrong} yanlış${skipped ? `, ${skipped} atlandı` : ''}.`}),
      missed.length ? el('div', {className:'items'}, ...missed.map(([t, tr]) => el('div', {className:'item'}, el('div', {}, el('strong', {textContent:t}), el('span', {textContent:tr})), speakBtn(t, voice)))) : '',
      el('div', {className:'step-actions'}, el('button', {type:'button', className:'btn secondary', textContent:'Baştan başla', onclick: restart})));
    box.querySelector('.step-actions .btn').focus();
  };
  const draw = () => {
    const [target, tr] = sentences[idx], tokens = target.split(/\s+/), last = idx === sentences.length - 1;
    // Karışık sıra, doğru cümleyle aynı çıkmasın.
    let order = shuffle(tokens.map((t, k) => k)); for (let n = 0; n < 10 && tokens.length > 1 && order.every((k, p) => tokens[k] === tokens[p]); n++) order = shuffle(order);
    const picked = [], tgt = el('div', {className:'build-target', ariaLabel:'Kurduğun cümle'}), pool = el('div', {className:'build-pool'}), res = el('div', {className:'result', role:'status'});
    const update = () => { tgt.replaceChildren(...picked.map((k, p) => el('button', {type:'button', className:'chip', textContent:tokens[k], onclick: () => { picked.splice(p, 1); update(); }}))); pool.replaceChildren(...order.filter(k => !picked.includes(k)).map(k => el('button', {type:'button', className:'chip', textContent:tokens[k], onclick: () => { picked.push(k); update(); if (picked.length === tokens.length) check(); }}))); };
    const check = () => { const ok = picked.map(k => tokens[k]).join(' ') === target; results[idx] ??= ok; res.className = `result ${ok ? 'ok' : 'no'}`; res.textContent = ok ? `Doğru! ${last ? 'Sonucu görmek için Bitir\'e dokun.' : 'Sıradakine geç.'}` : `Tam değil. Doğrusu: ${target}`; speak(target, voice); };
    box.replaceChildren(el('p', {className:'small', textContent:`${idx + 1}/${sentences.length} · “${tr}”`}), tgt, pool, res,
      el('div', {className:'step-actions'}, el('button', {type:'button', className:'btn secondary', textContent:'Baştan', onclick: restart}),
        el('button', {type:'button', className:'btn secondary', textContent: last ? 'Bitir ✓' : 'Sıradaki →', onclick: () => { if (last) summary(); else { idx++; draw(); } }})));
    update();
  };
  draw(); return box;
}
// Konuş: önce kendi kendine, sonra isteğe bağlı olarak yapay zekâ ile sesli sohbet.
function coachPrompt(lesson) {
  const l = languages[active];
  return `Sen sabırlı bir ${l.name} öğretmenisin. Ben Türküm ve ${l.acc} sıfırdan öğreniyorum (A0). Bugünkü konu: "${lesson.t}". ` +
    `Bugünkü kelimeler: ${lesson.w.map(w => w[0]).join(', ')}. Bugünkü cümleler: ${lesson.p.map(p => p[0]).join(' / ')}. ` +
    `Kurallar: 1) Bu konuya uygun gerçek hayattan bir senaryo seç (ör. kafede sipariş, otelde giriş, yeni biriyle tanışma) ve rolünü bir cümleyle Türkçe söyle. ` +
    `2) Çok kısa ve yavaş ${l.name} cümleler kur; bu kelimeleri ve çok basit ifadeleri kullan. 3) Her seferinde tek soru sor. ` +
    `4) Konuşurken beni düzeltme. 5–6 soruluk tur bitince yalnızca anlamı en çok etkileyen EN FAZLA 2 hatamı göster: benim cümlem → doğal cümle, tek kısa Türkçe açıklama. ` +
    `5) Sonra düzeltilmiş cümleleri üç kez söylememi iste ve aynı senaryoyu bir kez daha, biraz farklı yap. ` +
    `${l.name} bir selamla başla.`;
}
function noteForm() {
  const box = el('div'), left = NOTES_PER_DAY - notesToday();
  const target = el('input', {type:'text', maxLength:NOTE_MAX, placeholder:`Doğru cümle (${languages[active].name})`, ariaLabel:'Doğru cümle'});
  const tr = el('input', {type:'text', maxLength:NOTE_MAX, placeholder:'Türkçesi (isteğe bağlı)', ariaLabel:'Türkçesi'});
  const msg = el('p', {className:'small', role:'status'});
  const add = el('button', {type:'button', className:'btn secondary', textContent:'Kartlara ekle', disabled: left <= 0, onclick: () => {
    if (!addNote(target.value, tr.value)) { msg.textContent = 'Önce doğru cümleyi yaz.'; return; }
    target.value = ''; tr.value = ''; box.replaceWith(noteForm());
  }});
  box.append(el('p', {className:'small', textContent:`Sohbette düzeltilen en önemli cümleyi buraya yaz; yarından itibaren tekrar kartı olarak gelir. Günde en fazla ${NOTES_PER_DAY} (bugün kalan: ${Math.max(0, left)}). Çok hata eklemek tekrar yükünü artırır.`}),
    el('div', {className:'note-form'}, target, tr, add), msg);
  return box;
}
function speakBody(lesson, voice, i) {
  const prompt = coachPrompt(lesson), q = encodeURIComponent(prompt), status = el('span', {className:'small muted', role:'status'});
  const say = el('div', {className:'items'}, ...lesson.p.map(([t, tr]) => {
    const d = el('details', {className:'item'}); d.append(el('summary', {textContent:tr}), el('div', {className:'say-row'}, el('strong', {textContent:t}), speakBtn(t, voice)));
    return d;
  }));
  const li = getLessonDay() - 1, testItems = [...lesson.w.map(([t, tr, pron], wi) => [t, emojiFor(li, wi) ? `${emojiFor(li, wi)} ${tr}` : tr, pron]), ...lesson.p];
  const tools = [canRecord() ? '🎙 Kaydet: kendi sesini dinleyip doğrusuyla karşılaştırırsın; kayıt yalnızca bu cihazda, geçici olarak durur, saklanmaz ve gönderilmez.' : '', canCheck() ? '✓ Kontrol et: söylediğini tarayıcının konuşma tanıma hizmeti yazıya çevirir ve hangi kelimelerin anlaşıldığını gösterir (ilk kullanımda onay ister).' : ''].filter(Boolean);
  return [
    el('div', {className:'eyebrow', textContent:'1 · Telaffuz testi'}),
    el('p', {className:'small', textContent:`Bugünün kelime ve cümlelerini ▶ ile dinle, sonra kendin söyle. ${tools.join(' ') || 'Bu tarayıcı mikrofonu desteklemiyor; dinleyip yüksek sesle tekrar et.'}`}),
    el('div', {className:'asr-bar', id:'asrBar', role:'status', hidden:true}),
    el('div', {className:'items', id:'pronTest'}, ...testItems.map(([t, tr, pron]) => pronRow(t, tr, pron, voice))),
    el('div', {className:'eyebrow mt', textContent:'2 · Kendi kendine'}),
    el('p', {className:'small', textContent:'Türkçe anlamı oku, cümleyi hedef dilde yüksek sesle söyle, sonra dokunup doğrusunu gör.'}), say,
    el('div', {className:'eyebrow mt', textContent:'3 · Yapay zekâyla sesli sohbet (isteğe bağlı)'}),
    el('p', {className:'small', textContent:'"ChatGPT\'de aç" bugünkü dersle hazırlanmış mesajı ChatGPT\'ye gönderir ve öğretmen gibi yazmaya başlar. Konuşarak devam etmek için sağ alttaki ses dalgası simgesine dokun. "Claude\'da aç" mesajı kopyalar ve Claude\'u açar; mesajı yapıştırıp gönder, sonra ses simgesine dokun. Mesajda kişisel bilgin yok; yalnızca bugünkü ders gider. Hesap gerekir.'}),
    el('div', {className:'step-actions'},
      el('a', {className:'btn link-btn', href:`https://chatgpt.com/?q=${q}`, target:'_blank', rel:'noopener noreferrer', textContent:'ChatGPT\'de aç'}),
      el('button', {type:'button', className:'btn', textContent:'Claude\'da aç', onclick: async () => { try { await navigator.clipboard.writeText(prompt); status.textContent = 'Mesaj kopyalandı — Claude\'da yapıştırıp gönder.'; } catch { status.textContent = 'Kopyalanamadı; aşağıdaki düğmeyi dene.'; } window.open('https://claude.ai/new', '_blank', 'noopener,noreferrer'); }}),
      el('button', {type:'button', className:'btn secondary', textContent:'Mesajı kopyala', onclick: async () => { try { await navigator.clipboard.writeText(prompt); status.textContent = 'Kopyalandı — ChatGPT veya Claude uygulamasına yapıştır.'; } catch { status.textContent = 'Kopyalanamadı.'; } }})),
    el('p', {className:'small', textContent:'Köpek gezdirirken: ChatGPT uygulamasında Ayarlar → Voice → "Background conversations" açıksa telefon kilitliyken de sohbet sürer. Claude\'un ses modu da eller serbest dinler.'}),
    status,
    el('div', {className:'eyebrow mt', textContent:'4 · Hata defteri'}),
    noteForm(),
    doneRow('speak', -1)
  ];
}

// ---------- Telaffuz kaydı (mikrofon) ----------
// İzin yalnızca kullanıcı dokununca istenir. Kayıt bellekte kalır (blob), saklanmaz, gönderilmez; kayıt bitince mikrofon kapatılır.
// Aynı anda tek kayıt tutulur: yenisi yapılınca öncekinin adresi silinir. Bir kayıt en fazla REC_MAX_MS sürer.
const REC_MAX_MS = 10000;
// Açık mikrofon oturumlarını kapatan işlevler. Yeni kayıt/kontrol başlarken, sayfa arka plana geçerken hepsi kapatılır;
// böylece telefonun durum çubuğundaki mikrofon işareti iş bitince söner.
const micStoppers = new Set();
const releaseMic = () => [...micStoppers].forEach(f => { try { f(); } catch {} });
addEventListener('pagehide', releaseMic);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') releaseMic(); });
const canRecord = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
let lastRec = null; // {url, player}
function recorder(text, voice) {
  const btn = el('button', {type:'button', className:'btn secondary', textContent:'🎙 Kaydet'});
  const status = el('span', {className:'small muted', role:'status'}), player = el('div', {className:'rec-player'});
  let rec = null, stream = null, timer = null;
  const stopRec = () => { if (rec?.state === 'recording') rec.stop(); else release(); };
  const release = () => { clearTimeout(timer); stream?.getTracks().forEach(t => t.stop()); stream = null; micStoppers.delete(stopRec); };
  btn.onclick = async () => {
    if (rec?.state === 'recording') { rec.stop(); return; }
    releaseMic(); stopAudio();
    try { stream = await navigator.mediaDevices.getUserMedia({audio:true}); }
    catch (e) { status.textContent = e?.name === 'NotAllowedError' ? 'Mikrofon izni verilmedi. İstersen tarayıcı ayarlarından izin verebilirsin.' : 'Mikrofon açılamadı.'; return; }
    micStoppers.add(stopRec); const chunks = [];
    try { rec = new MediaRecorder(stream); } catch { release(); status.textContent = 'Bu tarayıcı ses kaydını desteklemiyor.'; return; }
    rec.ondataavailable = e => { if (e.data?.size) chunks.push(e.data); };
    rec.onstop = () => {
      release(); btn.textContent = '🎙 Yeniden';
      if (lastRec) { URL.revokeObjectURL(lastRec.url); lastRec.player.replaceChildren(); }
      const url = URL.createObjectURL(new Blob(chunks, {type: rec.mimeType || 'audio/webm'})); lastRec = {url, player};
      const audio = el('audio', {controls:true, preload:'auto', src:url, ariaLabel:'Senin kaydın'});
      audio.onerror = () => { status.replaceChildren(el('span', {textContent:'Kayıt oynatılamadı; iPhone mikrofonu bu sayfada takılmış olabilir. '}), reloadBtn(text)); };
      const both = () => { stopAudio(); audio.currentTime = 0; audio.onended = () => { audio.onended = null; speak(text, voice); }; audio.play().catch(() => {}); };
      player.replaceChildren(audio, el('div', {className:'row'}, el('button', {type:'button', className:'btn secondary', textContent:'▶ Ben, sonra doğrusu', onclick: both})));
      status.textContent = 'Kaydını dinle; doğrusu için üstteki ▶.';
    };
    rec.start(); AUDIO_USE.rec++; btn.textContent = '■ Bitir'; status.textContent = `Kaydediliyor… cümleyi söyle (en fazla ${REC_MAX_MS / 1000} sn).`;
    timer = setTimeout(() => { if (rec.state === 'recording') rec.stop(); }, REC_MAX_MS);
  };
  return {btn, panel: el('div', {className:'rec'}, status, player)};
}

// ---------- Telaffuz kontrolü (konuşma tanıma) ----------
// Tarayıcının konuşma tanıma hizmeti sesi yazıya çevirir (iPhone'da Apple, Chrome'da Google sunucuları olabilir).
// Bu, sesin cihaz dışına çıkması demektir; bu yüzden ilk kullanımda açık onay istenir (dil-atlasi-tanima = '1'), İlerleme'den geri alınabilir.
// Hedef cümledeki kelimeler, anlaşılan metinle sıra korunarak (en uzun ortak alt dizi) eşleştirilir; aksan ve noktalama göz ardı edilir.
const ASR_KEY = 'dil-atlasi-tanima';
const SpeechRec = () => window.SpeechRecognition || window.webkitSpeechRecognition;
const canCheck = () => !!SpeechRec();
const wordKey = w => w.toLocaleLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]/gu, '');
const splitWords = s => String(s).replace(/[’']/g, "' ").split(/\s+/).filter(w => wordKey(w));
function matchWords(target, heard) {
  const tw = splitWords(target), a = tw.map(wordKey), b = splitWords(heard).map(wordKey);
  const L = Array.from({length:a.length + 1}, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ok = new Array(a.length).fill(false);
  for (let i = 0, j = 0; i < a.length && j < b.length;) { if (a[i] === b[j]) { ok[i] = true; i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  return {words: tw.map((w, i) => ({w, ok: ok[i]})), score: a.length ? ok.filter(Boolean).length / a.length : 0};
}
// Telaffuz kontrolünün iPhone'daki davranışı (gerçek cihaz tanılamasıyla görüldü, v18: "başladı → mikrofon" ve sonra hiçbir şey):
// sayfada ilk açılan tanıma oturumu çalışıyor; sonraki her oturumda mikrofon açılıyor ama ses gelmiyor. Ayrıca start() yalnızca dokunmanın
// içinde, beklemeden çağrılırsa dinler; son (isFinal) sonuç çoğu zaman gelmez.
// Bu yüzden: ilk ✓ Kontrol et dokunuşu tek bir sürekli oturum (continuous) açar ve sonraki bütün kontroller aynı oturumu kullanır.
// Her kontrol, dokunduğu andaki sonuç listesinin kopyasını (snap) alır; sonra gelen yeni sonuçlar ve değişen sonuçların yeni kısmı
// (asrDelta) ASR_QUIET_MS sessizlikten sonra değerlendirilir. iPhone duraklamadan sonra metne eklemek yerine yeni bir metin başlatabildiği için
// kelime sayısına göre kesmek yanlıştı ("how are you" sonrası "hello" hiç görülmüyordu).
// Gerçek cihaz tanılaması (v24: "oturum 2 · tts 2 · kayıt 0", sessiz): iPhone'da mikrofon sayfada bir kez kullanıldıktan sonra (tanıma ya da kayıt)
// yeniden açılan tanıma oturumu ses almıyor. Bu yüzden: (1) oturum kendiliğinden kapatılmaz; Konuş adımı açık olduğu sürece açık kalır, adımdan/sekmeden/
// dilden çıkınca, arka planda ya da "Kapat" ile kapanır; (2) iPhone'da yeniden açmak gerekirse sessiz oturum açılmaz, sayfa hemen yenilenir ve aynı
// satıra dönülür ("Mikrofon hazır, dokun ve söyle"); yenilenen sayfada ilk oturum temiz açılır. (3) Seslendirme sırasında ve hemen sonrasında gelen
// sonuçlar yok sayılır (ttsEcho), yalnızca başlangıç kopyası (snap) yenilenir.
const ASR_QUIET_MS = 1200, ASR_END_WAIT_MS = 1500, ASR_STUCK_MS = 3000, ASR_REOPEN_KEY = 'dil-atlasi-konus-ac';
const ASR = {r: null, state: 'idle', owner: null, log: [], starts: 0, heard: 0, results: [], snap: [], lang: '', stopAt: 0, endT: null, echoUntil: 0, broken: false};
const ASR_EVENTS = {start:'başladı', audiostart:'mikrofon', soundstart:'ses', speechstart:'konuşma', speechend:'konuşma bitti', audioend:'mikrofon kapandı', nomatch:'eşleşme yok'};
const ASR_ERRORS = {'not-allowed':'Mikrofon ya da konuşma tanıma izni verilmedi. Tarayıcı ayarlarından izin verebilirsin.', 'service-not-allowed':'Konuşma tanıma bu cihazda kapalı (iPhone: Ayarlar → Genel → Klavye → Dikte açık olmalı).', 'no-speech':'Ses duyulmadı. ✓ Kontrol et\'e dokun ve hemen söyle.', 'network':'Konuşma tanıma için internet bağlantısı gerekiyor.', 'audio-capture':'Mikrofon bulunamadı.'};
const ASR_FATAL = ['not-allowed', 'service-not-allowed', 'network', 'audio-capture'];
function asrBar() {
  const bar = document.getElementById('asrBar'); if (!bar) return;
  const on = ASR.state === 'listening';
  bar.hidden = !on;
  if (on) bar.replaceChildren(el('span', {textContent:'🎙 Mikrofon açık · Konuş adımından çıkınca kapanır'}), el('button', {type:'button', className:'btn secondary', textContent:'Kapat', onclick: asrStop}));
}
function asrEnded() {
  clearTimeout(ASR.endT); micStoppers.delete(asrStop);
  ASR.state = 'idle'; const o = ASR.owner; ASR.owner = null; o?.ended(); asrBar();
}
// Dokunma anındaki sonuçlarla (snap) şimdikiler arasındaki yeni konuşma: yeni sonuç sıraları tamamen, değişen bir sonuç eskisinin
// devamıysa yalnızca eklenen kısım, değilse (iPhone metni baştan yazdıysa) tamamı.
function asrDelta(snap, now) {
  const norm = x => x.toLocaleLowerCase().trim();
  return now.map((t, i) => {
    const old = snap[i];
    if (old === undefined) return t;
    if (norm(t) === norm(old)) return '';
    return norm(t).startsWith(norm(old)) ? t.slice(old.length) : t;
  }).join(' ').replace(/\s+/g, ' ').trim();
}
function asrInstance() {
  if (ASR.r) return ASR.r;
  const r = new (SpeechRec())(); ASR.r = r;
  Object.entries(ASR_EVENTS).forEach(([ev, name]) => { r[`on${ev}`] = () => { if (ASR.r === r && ASR.log.length < 40) ASR.log.push(name); }; });
  r.onresult = e => {
    if (ASR.r !== r) return;
    if (ASR.log.at(-1) !== 'sonuç') ASR.log.push('sonuç');
    ASR.heard++;
    ASR.results = [...e.results].map(x => x[0]?.transcript || '');
    if (ttsEcho()) { ASR.snap = [...ASR.results]; return; }
    // Metin değişmediyse (ör. aynı kelime yeniden söylendi ve iPhone metni aynısıyla baştan yazdı) dokunmadan sonra gelen sonuç yine yeni konuşmadır.
    ASR.owner?.update(asrDelta(ASR.snap, ASR.results) || ASR.results.filter(t => t.trim()).at(-1)?.trim() || '');
  };
  r.onerror = e => { if (ASR.r !== r) return; ASR.log.push(`hata:${e.error}`); if (ASR_FATAL.includes(e.error)) ASR.owner?.error(e.error); };
  r.onend = () => { if (ASR.r !== r) return; ASR.log.push('bitti'); asrEnded(); };
  return r;
}
// Bir kontrolü başlatır. Dokunmanın içinde eşzamanlı çağrılmalı. 'ok' | 'busy' | 'fail' | 'reload' döner.
function asrCheck(owner, lang) {
  // iPhone: seslendirme açık oturumu susturduysa aynı sayfada kurtarılamaz; önce sayfa yenilenmeli.
  if (ASR.state === 'listening' && ASR.broken) { asrStop(); return 'reload'; }
  if (ASR.state === 'listening' && ASR.lang === lang) {
    const prev = ASR.owner; ASR.owner = null; prev?.cancel();
    ASR.snap = [...ASR.results]; ASR.owner = owner; return 'ok';
  }
  if (ASR.state === 'listening') { asrStop(); return 'busy'; }
  if (ASR.state === 'closing') {
    if (Date.now() - ASR.stopAt < ASR_STUCK_MS) return 'busy';
    try { ASR.r.abort(); } catch {} ASR.r = null; asrEnded();
  }
  // iPhone: bu sayfada mikrofon kullanıldıysa ya da ses çalındıysa yeni oturum sessiz açılır; önce sayfa yenilenmeli.
  if (isIOS() && (ASR.starts > 0 || AUDIO_USE.rec > 0 || AUDIO_USE.tts > 0)) return 'reload';
  ASR.broken = false;
  ASR.log = []; ASR.heard = 0; ASR.results = []; ASR.snap = []; ASR.lang = lang;
  const go = () => { const r = asrInstance(); r.lang = lang; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1; r.start(); };
  try { go(); }
  catch (e) {
    ASR.log.push(`start:${e?.name || 'hata'}`);
    try { ASR.r?.abort(); } catch {} ASR.r = null;
    try { go(); } catch (e2) { ASR.log.push(`start:${e2?.name || 'hata'}`); return 'fail'; }
  }
  ASR.starts++; ASR.state = 'listening'; ASR.owner = owner; micStoppers.add(asrStop);
  asrBar();
  return 'ok';
}
// Oturumu stop() ile kapatır; 'end' gelmezse mikrofonu bırakmak için abort() yedek.
function asrStop() {
  if (ASR.state !== 'listening') return;
  ASR.state = 'closing'; ASR.stopAt = Date.now(); micStoppers.delete(asrStop);
  try { ASR.r.stop(); } catch {}
  clearTimeout(ASR.endT);
  ASR.endT = setTimeout(() => { if (ASR.state !== 'closing') return; ASR.log.push('bitti (zorla)'); try { ASR.r.abort(); } catch {} asrEnded(); }, ASR_END_WAIT_MS);
  asrBar();
}
// Yenile ve devam et: yenilemeden sonra Konuş adımı açılır, aynı satıra kaydırılır ve "şimdi dokun ve söyle" denir.
// kind: 'listen' (▶ ile dinledikten sonra) ya da 'mic'. Telaffuz sonuçları yenilemede kaybolmasın diye ASR_RESULTS_KEY'de tutulur.
const ASR_RESULTS_KEY = 'dil-atlasi-konus-sonuc';
function reloadToSpeak(row, kind = 'mic') { try { sessionStorage.setItem(ASR_REOPEN_KEY, JSON.stringify({row: row || '', kind})); } catch {} location.reload(); }
const savedResults = () => { try { return JSON.parse(sessionStorage.getItem(ASR_RESULTS_KEY)) || {}; } catch { return {}; } };
function saveResult(text, heard) { try { const r = savedResults(); delete r[text]; r[text] = heard; const keys = Object.keys(r); keys.slice(0, Math.max(0, keys.length - 40)).forEach(k => delete r[k]); sessionStorage.setItem(ASR_RESULTS_KEY, JSON.stringify(r)); } catch {} }
const reloadBtn = row => el('button', {type:'button', className:'btn', textContent:'↻ Yenile ve devam et', onclick: () => reloadToSpeak(row)});
function checker(text, voice) {
  const btn = el('button', {type:'button', className:'btn secondary', textContent:'✓ Kontrol et'}), panel = el('div', {className:'check', role:'status'});
  let cur = null; // bu satırın bekleyen kontrolü
  const ask = () => panel.replaceChildren(
    el('p', {className:'small', textContent:'Otomatik kontrol, söylediğini yazıya çevirmek için sesini tarayıcının konuşma tanıma hizmetine gönderir (iPhone\'da Apple, Chrome\'da Google). Mikrofon, Konuş adımından çıkana ya da Kapat\'a basana kadar açık kalır. Uygulama sesini saklamaz. Onaylıyor musun?'}),
    el('div', {className:'row'}, el('button', {type:'button', className:'btn', textContent:'Onayla ve dene', onclick: () => { store.set(ASR_KEY, '1'); renderVoiceSettings(); listen(); }}),
      el('button', {type:'button', className:'btn secondary', textContent:'Vazgeç', onclick: () => panel.replaceChildren()})));
  const showResult = heard => {
    saveResult(text, heard);
    const best = {h: heard, ...matchWords(text, heard)};
    const pct = Math.round(best.score * 100), missed = best.words.filter(x => !x.ok).map(x => x.w);
    const words = el('div', {className:'check-words'}, ...best.words.map(x => el('span', {className: x.ok ? 'word-ok' : 'word-miss', textContent:x.w})));
    words.setAttribute('aria-label', missed.length ? `Anlaşılmayan kelimeler: ${missed.join(', ')}` : 'Bütün kelimeler anlaşıldı');
    panel.replaceChildren(el('p', {className:`result ${pct >= 80 ? 'ok' : 'no'}`, textContent:`%${pct} · ${pct === 100 ? 'Mükemmel!' : pct >= 80 ? 'Çok iyi.' : pct >= 50 ? 'Fena değil; kırmızı kelimeleri dinleyip tekrar dene.' : 'Anlaşılmadı; ▶ ile dinle, yavaş ve net söyle.'}`}),
      words, el('p', {className:'small muted', textContent:`Anlaşılan: „${best.h}”`}));
  };
  // Başarısızlıkta: mesaj, gerekirse "Yenile ve devam et", ve tanılama satırı (sürüm + tanıma olayları).
  const fail = (msg, reload) => panel.replaceChildren(el('p', {textContent:msg}), reload ? reloadBtn(text) : '', el('p', {className:'small muted diag', textContent:`Tanılama ${APP_VERSION}: ${ASR.log.join(' → ') || '—'} · oturum ${ASR.starts} · tts ${AUDIO_USE.tts} · kayıt ${AUDIO_USE.rec} · son duyulan: „${ASR.results.join(' ').trim().slice(-60) || '—'}”`}));
  // Dokunmanın içinde eşzamanlı çalışır; burada await olmamalı.
  const listen = () => {
    stopAudio();
    let heard = '', done = false, quiet = null, maxT = null;
    const finish = kind => {
      if (done) return; done = true; clearTimeout(quiet); clearTimeout(maxT);
      if (ASR.owner === owner) ASR.owner = null;
      if (cur === owner) { cur = null; btn.textContent = '✓ Kontrol et'; }
      if (kind === 'cancel') { panel.replaceChildren(); return; }
      if (heard) { showResult(heard); return; }
      if (ASR_FATAL.includes(kind)) { fail(ASR_ERRORS[kind]); return; }
      // Oturumdan hiç sonuç gelmediyse mikrofon sessiz açılmış olabilir (iPhone'da ilk oturumda da görüldü, v22): her durumda yenileme önerilir.
      const silent = ASR.heard === 0;
      fail(silent ? 'Mikrofondan ses gelmedi. iPhone bazen seslendirme ya da kayıttan sonra mikrofonu sessiz açıyor; yenileyince düzelir ve bu kelimeye dönersin.' : ASR_ERRORS['no-speech'], silent);
    };
    const owner = {
      finish: () => finish(),
      update: text => { heard = text; if (!heard) return; clearTimeout(quiet); quiet = setTimeout(() => finish(), ASR_QUIET_MS); },
      error: code => finish(code), ended: () => finish(), cancel: () => finish('cancel')
    };
    let st; try { st = asrCheck(owner, voice); } catch { panel.textContent = 'Bu tarayıcı konuşma tanımayı desteklemiyor.'; return; }
    if (st === 'reload') { panel.textContent = 'Mikrofon hazırlanıyor…'; reloadToSpeak(text, 'mic'); return; }
    if (st === 'busy') { panel.textContent = 'Mikrofon kapanıyor; bir saniye sonra tekrar dokun.'; return; }
    if (st === 'fail') { fail('Kontrol başlatılamadı; bir saniye sonra tekrar dokun. Olmazsa yenile.', true); return; }
    cur = owner;
    maxT = setTimeout(() => finish(), REC_MAX_MS);
    btn.textContent = '■ Bitir'; panel.textContent = 'Dinliyorum… şimdi söyle.';
  };
  // Dinlerken dokunulursa o ana kadar anlaşılanla sonuç gösterilir; oturum açık kalır.
  btn.onclick = () => { if (cur) { cur.finish(); return; } store.get(ASR_KEY) === '1' ? listen() : ask(); };
  if (savedResults()[text]) showResult(savedResults()[text]);
  return {btn, panel};
}
// Telaffuz testi satırı: hedef metin, okunuş ve Türkçe anlam yazılı; ▶ dinle, 🎙 kaydet, ✓ kontrol et.
function pronRow(t, tr, pron, voice) {
  const r = canRecord() ? recorder(t, voice) : null, c = canCheck() ? checker(t, voice) : null;
  const row = el('div', {className:'item pron-item'},
    el('div', {}, el('strong', {textContent:t}), pron ? el('span', {className:'pron', textContent:`[${pron}]`}) : '', el('span', {textContent:tr})),
    // iPhone'da seslendirme mikrofonu susturduğu için: telaffuz testinde ▶ bitince sayfa yenilenir ve aynı satırda "şimdi ✓" denir.
    el('button', {type:'button', className:'speak', textContent:'▶', ariaLabel:`Seslendir: ${t}`, onclick: () => speak(t, voice, .85, c && isIOS() && store.get(ASR_KEY) === '1' ? () => reloadToSpeak(t, 'listen') : undefined)}),
    r || c ? el('div', {className:'pron-tools'}, el('div', {className:'row'}, r?.btn || '', c?.btn || ''), r?.panel || '', c?.panel || '') : '');
  row.dataset.t = t; // "Yenile ve devam et" sonrası aynı satıra dönmek için
  return row;
}

// ---------- Dinle: eller serbest ses çalışması ----------
// Sıra: hedef dil → ara (sen tekrar et) → hedef dil tekrar. Türkçe anlam yalnızca ekranda yazar, seslendirilmez.
// Kapsam: bugünün kelime ve cümleleri, sık kelimeler, sonra günün tekrar kartlarından 10'u.
let drill = {run:0, playing:false}, wakeLock = null;
const sleep = ms => new Promise(r => setTimeout(r, ms));
function sayAsync(text, lang, rate, run) {
  return new Promise(res => {
    if (drill.run !== run) return res();
    const u = utter(text, lang, rate);
    const t = setTimeout(res, Math.max(4000, text.length * 180)); // onend bazı tarayıcılarda gelmeyebilir
    u.onend = u.onerror = () => { clearTimeout(t); res(); };
    speechSynthesis.speak(u);
  });
}
function drillItems() {
  const lesson = todayLesson();
  return [...lesson.w.map((x, wi) => ({tr: emojiFor(getLessonDay() - 1, wi) ? `${emojiFor(getLessonDay() - 1, wi)} ${x[1]}` : x[1], t:x[0], pron:x[2]})), ...lesson.p.map(x => ({tr:x[1], t:x[0]})), ...(freqToday()?.items || []).map(x => ({tr:x[1], t:x[0], pron:x[2]})), ...dueCards(active, 10).map(c => ({tr:c.tr, t:c.target, pron:c.pron}))];
}
async function startDrill() {
  if (!('speechSynthesis' in window)) { $('#drillL1').textContent = 'Bu tarayıcı seslendirmeyi desteklemiyor.'; return; }
  if (drill.playing) return stopDrill();
  const run = ++drill.run, voice = languages[active].voice, items = drillItems(), gap = () => +(document.querySelector('input[name=gap]:checked')?.value || 3.5) * 1000;
  stopAudio(); drill.playing = true; $('#drillPlay').textContent = '■ Durdur';
  try { wakeLock = await navigator.wakeLock?.request('screen'); } catch {}
  for (let k = 0; k < items.length && drill.run === run; k++) {
    const it = items[k];
    $('#drillLabel').textContent = `${k + 1}/${items.length}`; $('#drillL1').textContent = 'Dinle…';
    $('#drillL2').textContent = it.t; $('#drillPron').textContent = it.pron ? `[${it.pron}]` : ''; $('#drillTr').textContent = it.tr;
    await sayAsync(it.t, voice, .8, run); if (drill.run !== run) break;
    $('#drillL1').textContent = 'Şimdi sen söyle…'; await sleep(gap()); if (drill.run !== run) break;
    $('#drillL1').textContent = 'Tekrar dinle'; await sayAsync(it.t, voice, .8, run); await sleep(1200);
  }
  if (drill.run === run) { $('#drillL1').textContent = 'Bitti! Aferin.'; $('#drillL2').textContent = ''; $('#drillPron').textContent = ''; $('#drillTr').textContent = ''; $('#drillLabel').textContent = 'Bugünün ses çalışması'; store.set(key('shadow'), '1'); render(); }
  drill.playing = false; $('#drillPlay').textContent = '▶ Başlat'; wakeLock?.release?.().catch(() => {}); wakeLock = null;
}
function stopDrill() { drill.run++; drill.playing = false; if ('speechSynthesis' in window) speechSynthesis.cancel(); $('#drillPlay').textContent = '▶ Başlat'; wakeLock?.release?.().catch(() => {}); wakeLock = null; }
// Tek düğme: çalarken Durdur, dururken Başlat.
$('#drillPlay').onclick = () => { if (!drill.playing) return startDrill(); stopDrill(); $('#drillL1').textContent = 'Durduruldu.'; $('#drillL2').textContent = ''; $('#drillPron').textContent = ''; $('#drillTr').textContent = ''; };
document.addEventListener('visibilitychange', async () => { if (drill.playing && document.visibilityState === 'visible' && !wakeLock) { try { wakeLock = await navigator.wakeLock?.request('screen'); } catch {} } });

// ---------- Kaynak listeleri (yalnızca bağlantı) ----------
function resLink(r) {
  const a = el('a', {href:r.u, target:'_blank', rel:'noopener noreferrer'});
  const name = el('strong', {textContent:r.n}); if (r.lv) name.append(el('span', {className:'badge', textContent:r.lv}));
  a.append(el('span', {}, name, el('span', {textContent:r.d})), el('span', {className:'arrow', textContent:'↗'}));
  return a;
}
function renderRes(target, items) {
  const box = $(target); box.replaceChildren();
  if (!items?.length) { box.append(el('p', {className:'small', textContent:'Bu dil için henüz kaynak eklenmedi.'})); return; }
  const groups = new Map();
  items.forEach(r => { if (!groups.has(r.c)) { const list = el('div', {className:'res'}); groups.set(r.c, list); box.append(el('div', {className:'group-title', textContent:r.c}), list); } groups.get(r.c).append(resLink(r)); });
}

// ---------- Oku: kısa hikâyeler ve diyaloglar ----------
// Metinler content/stories.js (window.STORIES); dört dilde paralel, Türkçesi ortak. Metin, ders günü story.day'e gelince açılır.
// dil-atlasi-okuma = {v:1, done:{"fr:3": {d, s}}, cards:{"fr:3": "YYYY-MM-DD"}} — done: anlama testi (gün, doğru sayısı),
// cards: anahtar kelimelerin kartlara eklendiği gün (kartlar ertesi gün gelir; kimlik dil:r:metin:kelime).
const READ_KEY = 'dil-atlasi-okuma', SLI = {en:1, fr:2, it:3, de:4};
const stories = () => window.STORIES || [];
function loadRead() { const v = readJson(READ_KEY); return v?.v === 1 && v.done && typeof v.done === 'object' && v.cards && typeof v.cards === 'object' ? v : {v:1, done:{}, cards:{}}; }
function saveRead(r) { store.set(READ_KEY, JSON.stringify(r)); }
const storyUnlocked = (si, lang = active) => getLessonDay(lang) >= stories()[si].day;
const storyTitle = (st, lang = active) => st.t[lang] || st.t.tr;
// Sıradaki okuma: açılmış ve anlama testi yapılmamış en yeni metin.
function nextStory(lang = active) { const done = loadRead().done; for (let si = stories().length - 1; si >= 0; si--) if (storyUnlocked(si, lang) && !done[`${lang}:${si}`]) return si; return -1; }
let readOpen = null, readPlay = null;
function renderRead() {
  const list = $('#readList'), view = $('#readView'); if (!list) return;
  const all = stories(), r = loadRead(), day = getLessonDay();
  list.hidden = readOpen !== null; view.hidden = readOpen === null;
  if (readOpen !== null && (!all[readOpen] || !storyUnlocked(readOpen))) readOpen = null;
  if (readOpen === null) {
    const open = all.filter((_, si) => storyUnlocked(si)).length, read = all.filter((_, si) => r.done[`${active}:${si}`]).length;
    list.replaceChildren(el('div', {className:'card'},
      el('h2', {textContent:`${languages[active].name} okumaları`}),
      el('p', {className:'small', textContent: all.length ? `${open}/${all.length} metin açık · ${read} tanesinin testini çözdün. Yeni metin, derslerde ilerledikçe açılır.` : 'Metinler yüklenemedi.'}),
      el('div', {className:'story-list'}, ...all.map((st, si) => {
        const unlocked = storyUnlocked(si), res = r.done[`${active}:${si}`];
        const b = el('button', {type:'button', className:`story-item${unlocked ? '' : ' locked'}${res ? ' read' : ''}`, disabled: !unlocked, onclick: () => { readOpen = si; renderRead(); window.scrollTo({top: 0}); }},
          el('span', {className:'story-ico', textContent: st.kind === 'dialog' ? '💬' : '📖'}),
          el('span', {className:'story-name'}, el('strong', {textContent:storyTitle(st)}), el('span', {textContent:`${st.t.tr} · ${st.kind === 'dialog' ? 'Diyalog' : 'Hikâye'} · ${st.s.length} cümle`})),
          el('span', {className:'story-state', textContent: !unlocked ? `🔒 Ders ${st.day}` : res ? `✓ ${res.s}/${st.q.length}` : 'Yeni'}));
        if (!unlocked) b.setAttribute('aria-label', `${storyTitle(st)} — Ders ${st.day}'de açılır (şu an Ders ${day})`);
        return b;
      }))));
    return;
  }
  const si = readOpen, st = all[si], li = SLI[active], voice = languages[active].voice, sid = `${active}:${si}`;
  const lines = st.s.map(row => {
    const who = st.sp?.[row[0]], tr = el('span', {className:'tr', textContent:row[5], hidden:true});
    const btn = el('button', {type:'button', className:'line-text', onclick: () => { tr.hidden = !tr.hidden; btn.setAttribute('aria-expanded', !tr.hidden); }},
      who ? el('span', {className:`who ${who[1]}`, textContent:who[0]}) : '', el('span', {className:'tx', textContent:row[li]}), el('span', {className:'cue', textContent:'🗣 Sıra sende: Türkçesine bak, yüksek sesle söyle.'}), tr);
    btn.setAttribute('aria-expanded', 'false');
    return el('div', {className:`line${who ? ' ' + row[0] : ''}`}, btn, el('button', {type:'button', className:'speak', textContent:'▶', ariaLabel:`Seslendir: ${row[li]}`, onclick: () => speak(row[li], voice, .85, null, who?.[1] || '')}));
  });
  const listenBtn = el('button', {type:'button', className:'btn', textContent:'▶ Hepsini dinle', onclick: () => readPlay?.btn === listenBtn ? stopAudio() : playStory(st, lines, '', listenBtn)});
  const roleBtns = st.kind === 'dialog' ? Object.entries(st.sp).map(([k, [name]]) => { const b = el('button', {type:'button', className:'btn secondary', textContent:`🎭 Sen ${name} ol`, onclick: () => readPlay?.btn === b ? stopAudio() : playStory(st, lines, k, b)}); b.dataset.label = b.textContent; return b; }) : [];
  listenBtn.dataset.label = listenBtn.textContent;
  // Anahtar kelimeler → tekrar kartları (ertesi günden itibaren).
  const added = r.cards[sid];
  const addBtn = el('button', {type:'button', className: added ? 'btn secondary' : 'btn', disabled: !!added, textContent: added ? (added >= localDate() ? 'Kartlara eklendi ✓ (yarından itibaren)' : 'Kartlarda ✓') : '＋ Kartlara ekle',
    onclick: () => { const x = loadRead(); x.cards[sid] = localDate(); saveRead(x); renderRead(); toast('5 kelime tekrar kartlarına eklendi; yarından itibaren Tekrar adımında gelecek.'); }});
  const keys = el('div', {className:'items'}, ...st.k.map(k => el('div', {className:'item'}, el('div', {}, el('strong', {textContent:k[li - 1]}), el('span', {textContent:k[4]})), speakBtn(k[li - 1], voice))));
  view.replaceChildren(
    el('button', {type:'button', className:'back-link', textContent:'← Tüm metinler', onclick: () => { stopAudio(); readOpen = null; renderRead(); }}),
    el('div', {className:'card story'},
      el('div', {className:'eyebrow', textContent:`${st.kind === 'dialog' ? 'Diyalog' : 'Hikâye'} · Ders ${st.day}`}),
      el('h1', {className:'lesson-title', textContent:storyTitle(st)}), el('p', {className:'small', textContent:st.t.tr}),
      el('p', {className:'small', textContent: st.kind === 'dialog' ? 'Önce dinle, sonra canlandır: diğer rolü uygulama okur; sıra sana gelince Türkçesini görürsün, yüksek sesle söylersin, ardından doğrusunu duyarsın. Cümleye dokun: Türkçesi açılır.' : 'Önce bir kez dinle, sonra cümle cümle oku. Anlamadığın cümleye dokun: Türkçesi açılır.'}),
      el('div', {className:'story-controls'}, listenBtn, ...roleBtns),
      el('div', {className:'story-lines'}, ...lines)),
    el('div', {className:'card'}, el('h2', {textContent:'Anahtar kelimeler'}), el('p', {className:'small', textContent:'Metnin en önemli 5 kelimesi. Kartlara eklersen yarından itibaren aralıklı tekrarda karşına çıkar.'}), keys, el('div', {className:'step-actions'}, addBtn)),
    el('div', {className:'card'}, el('h2', {textContent:'Anladın mı?'}), storyQuiz(st, sid)));
}
// Anlama testi: her sorunun ilk cevabı sayılır; bitince sonuç kaydedilir (en iyi sonuç kalır).
function storyQuiz(st, sid) {
  const box = el('div', {className:'story-quiz'}), prev = loadRead().done[sid];
  let answered = 0, correct = 0;
  const result = el('p', {className:'small quiz-result', textContent: prev ? `Önceki sonucun: ${prev.s}/${st.q.length}.` : ''}); result.setAttribute('role', 'status');
  st.q.forEach(([q, opts, ans], qi) => {
    const btns = opts.map((o, oi) => el('button', {type:'button', className:'chip opt', textContent:o, onclick: () => {
      btns.forEach(b => { b.disabled = true; }); btns[ans].classList.add('right'); if (oi !== ans) btns[oi].classList.add('wrong'); else correct++;
      if (++answered === st.q.length) {
        const x = loadRead(), best = Math.max(correct, x.done[sid]?.s ?? 0); x.done[sid] = {d: localDate(), s: best}; saveRead(x);
        result.textContent = `${correct}/${st.q.length} doğru. ${correct === st.q.length ? 'Harika!' : 'Metni bir kez daha dinleyip tekrar dene.'}`;
        if (correct < st.q.length) result.append(' ', el('button', {type:'button', className:'btn secondary small-btn', textContent:'Yeniden çöz', onclick: () => box.replaceWith(storyQuiz(st, sid))}));
        renderToday();
      }
    }}));
    box.append(el('div', {className:'quiz-q'}, el('p', {textContent:`${qi + 1}. ${q}`}), el('div', {className:'opts'}, ...btns)));
  });
  box.append(result);
  return box;
}
// Metni sırayla okur (diyalogda konuşmacıya göre kadın/erkek ses). role verilirse o rolün cümlelerinde kullanıcı konuşur:
// Türkçesi görünür, hedef metin gizlenir, cümle uzunluğuna göre bekler, sonra doğrusu okunur. Her başka ses zinciri durdurur (audioRun).
function playStory(st, lines, role, btn) {
  if (!('speechSynthesis' in window)) return;
  stopAudio(); const run = audioRun, li = SLI[active], voice = languages[active].voice; let k = 0;
  readPlay = {btn, lines}; btn.textContent = '■ Durdur';
  const say = (row, then) => {
    const u = utter(row[li], voice, .85, st.sp?.[row[0]]?.[1] || ''); let fired = false;
    const f = () => { if (fired || run !== audioRun) return; fired = true; then(); };
    u.addEventListener('end', f); u.addEventListener('error', f); setTimeout(f, 4000 + row[li].length * 200); speechSynthesis.speak(u);
  };
  const next = () => {
    if (run !== audioRun) return;
    lines.forEach(e => e.classList.remove('now', 'yours'));
    if (k >= st.s.length) { readPlayEnd(); if (role) toast('Canlandırma bitti. Bir de diğer rolü dene.'); return; }
    const i = k++, row = st.s[i], e = lines[i]; e.classList.add('now'); e.scrollIntoView?.({block:'nearest'});
    if (role && row[0] === role) {
      e.classList.add('yours'); e.querySelector('.tr').hidden = false;
      setTimeout(() => { if (run !== audioRun) return; e.classList.remove('yours'); say(row, () => setTimeout(next, 500)); }, 1800 + row[li].split(/\s+/).length * 650);
    } else say(row, () => setTimeout(next, 600));
  };
  next();
}
function readPlayEnd() {
  if (!readPlay) return;
  const {btn, lines} = readPlay; readPlay = null;
  btn.textContent = btn.dataset.label; lines.forEach(e => e.classList.remove('now', 'yours'));
}

// ---------- İlerleme ----------
function studiedOn(date, lang = active) { return tasks.some(t => isDone(t, lang, date)); }
function getStreak() { let s = 0; for (let i = studiedOn(localDate()) ? 0 : 1; i < 365; i++) { if (studiedOn(localDate(-i))) s++; else break; } return s; }
function renderFreqCard() {
  const box = $('#freqCard'); if (!box) return;
  const st = freqState(), total = freqList().length, seen = Math.min(total, st.done * FREQ_BATCH);
  $('#freqProgress').textContent = total ? `${seen} / ${total} kelime · kalan yaklaşık ${Math.ceil((total - seen) / FREQ_BATCH)} gün` : 'Bu dil için liste yüklenemedi.';
  $('#freqBar').style.width = total ? `${seen / total * 100}%` : '0';
  $('#freqToggle').checked = st.on;
}
$('#freqToggle').onchange = e => { const st = freqState(); st.on = e.target.checked; saveFreqState(active, st); render(); };
function renderProgress() {
  const l = languages[active], day = getLessonDay();
  $('#progressTitle').textContent = `${l.name} ilerlemesi`;
  let days = 0; for (let i = 0; i < 365; i++) if (studiedOn(localDate(-i))) days++;
  $('#statDays').textContent = days; $('#statStreak').textContent = getStreak(); $('#statCards').textContent = learnedCount();
  const rs = loadSrs().stats?.[active];
  $('#retention').textContent = rs?.n ? `7+ gün sonra hatırlama: %${Math.round(rs.ok / rs.n * 100)} (${rs.n} kart). Asıl ilerleme ölçün bu; süre değil.` : 'Uzun süreli hatırlama, kartlar 7+ gün aralıkla dönmeye başlayınca burada ölçülür.';
  const h = $('#history'); h.replaceChildren(); let studied = 0;
  for (let i = 27; i >= 0; i--) { const n = stepsOn(localDate(-i)); if (n) studied++; h.append(el('span', {className:`history-day ${n === 4 ? 'full' : n ? 'some' : ''}`, title:`${localDate(-i)} · ${n}/4`})); }
  h.setAttribute('aria-label', `Son 28 gün: ${studied} gün çalışıldı`);
  // Yol haritası: her ders bir durak; açılan okuma metni ve haftalık hedefler (gerçekçi, A0 → A1 girişi) aynı çizgide.
  const unlocks = new Map(stories().map(st => [st.day, st]));
  $('#lessonList').replaceChildren(...lessonsFor().flatMap((ls, k) => {
    const n = k + 1, st = unlocks.get(n), cur = n === day;
    const li = el('li', {className: n < day ? 'done' : cur ? 'current' : ''}, el('span', {className:'node', textContent: n < day ? '✓' : n}), el('span', {className:'rm-body'}, el('span', {className:'rm-title', textContent:ls.t}),
      cur ? el('span', {className:'here', textContent:'Şu an buradasın'}) : '', st ? el('span', {className:'rm-story', textContent:`${st.kind === 'dialog' ? '💬' : '📖'} ${storyTitle(st)}`}) : ''));
    if (cur) li.setAttribute('aria-current', 'step');
    return MILESTONES[n] ? [li, el('li', {className:`milestone${n < day ? ' reached' : ''}`}, el('span', {className:'node', textContent:'🏁'}), el('span', {className:'rm-body'}, el('span', {className:'rm-title', textContent:`${n}. ders sonunda`}), el('span', {textContent:MILESTONES[n]})))] : [li];
  }));
}

const MILESTONES = {
  7: 'Selamlaşır, kendini ve aileni tanıtır, sayıları söyler, kafede sipariş verirsin.',
  14: 'Günlük rutinini anlatır, saat ve gün söyler, yol sorar, alışverişte fiyat sorarsın.',
  21: 'Hava, sevdiklerin ve sağlık hakkında kısa cümleler kurar; otel ve restoranda idare edersin.',
  30: 'Dün ne yaptığını ve yarın ne yapacağını kısaca anlatır, yardım ister, kendini birkaç cümleyle tanıtırsın (A1\'e giriş).'
};
function renderPlan() {
  const l = languages[active], p = planFor();
  $('#planTitle').textContent = `${l.name} haftalık planı`;
  document.querySelectorAll('#planDays input').forEach(i => { i.checked = p.days.includes(+i.value); });
  document.querySelectorAll('#planGoal input').forEach(i => { i.checked = +i.value === p.goal; });
  const w = weekSummary(active, weekDates());
  $('#planStatus').textContent = p.days.length ? `Haftada ${p.days.length} gün, günde en az ${p.goal} aşama. Bu hafta hedefe ulaşılan gün: ${w.met}/${p.days.length}.` : 'Henüz gün seçilmedi; plan yokken uygulama hatırlatma yapmaz.';
  const fr = planFor('fr').days, it = planFor('it').days, both = fr.filter(d => it.includes(d));
  $('#planWarn').textContent = (active === 'fr' || active === 'it') && both.length ? `Fransızca ve İtalyanca aynı günlerde (${both.map(d => WEEKDAYS[d]).join(', ')}). Benzer diller karışabilir; mümkünse farklı günlere koy.` : '';
}
document.querySelectorAll('#planDays input, #planGoal input').forEach(i => { i.onchange = () => {
  savePlan(active, {days:[...document.querySelectorAll('#planDays input:checked')].map(x => +x.value), goal:+(document.querySelector('#planGoal input:checked')?.value || 4)});
  renderLangs(); renderToday(); renderPlan(); renderStats();
}; });
function renderStats() {
  const log = loadLog(), today = localDate(), ids = Object.keys(languages), pct = (ok, c) => c ? `%${Math.round(ok / c * 100)}` : '—';
  const t = ids.reduce((a, id) => { const x = logGet(log, today, id); a.steps += stepsOn(today, id); a.c += x.c; a.ok += x.ok; a.m += x.m; return a; }, {steps:0, c:0, ok:0, m:0});
  $('#statsToday').textContent = t.steps || t.c || t.m ? `Bugün: ${t.steps} aşama · ${t.c} kart${t.c ? ` (${pct(t.ok, t.c)} bildin)` : ''}${t.m ? ` · ${t.m} dk odak` : ''}.` : 'Bugün henüz çalışma yok.';
  const week = weekDates(), rows = ids.map(id => ({id, ...weekSummary(id, week, log), plan: planFor(id).days.length}));
  const sum = rows.reduce((a, r) => { ['days', 'steps', 'c', 'ok', 'm'].forEach(f => { a[f] += r[f]; }); return a; }, {days:0, steps:0, c:0, ok:0, m:0});
  const cell = (tag, text) => el(tag, {textContent:text});
  $('#statsBody').replaceChildren(...rows.map(r => { const tr = el('tr', {className: r.id === active ? 'current' : ''}, el('th', {scope:'row', textContent:languages[r.id].name}), cell('td', r.plan ? `${r.days}/${r.plan}` : r.days), cell('td', r.steps), cell('td', r.c), cell('td', pct(r.ok, r.c))); return tr; }));
  $('#statsFoot').replaceChildren(el('tr', {}, el('th', {scope:'row', textContent:'Toplam'}), cell('td', sum.days), cell('td', sum.steps), cell('td', sum.c), cell('td', pct(sum.ok, sum.c))));
  const last = ids.reduce((a, id) => { const r = weekSummary(id, weekDates(1), log); a.steps += r.steps; a.c += r.c; return a; }, {steps:0, c:0});
  $('#statsLast').textContent = `Karşılaştırma — geçen hafta: ${last.steps} aşama, ${last.c} kart.${sum.m ? ` Bu hafta ${sum.m} dk odak sayacı.` : ''}`;
}

function renderVoiceSettings() {
  const l = languages[active], sel = $('#voiceSelect');
  if (!sel) return;
  const fill = (select, lang) => {
    const list = byScore(voiceList(lang), lang), pick = chosenVoices()[lang.slice(0, 2)], sign = v => ({f:' ♀', m:' ♂'})[voiceGender(v)] || '';
    select.replaceChildren(el('option', {value:'', textContent:`Otomatik (${voiceFor(lang)?.name || 'cihaz sesi yok'})`}), ...list.map(v => el('option', {value:v.voiceURI, textContent:`${v.name} · ${v.lang}${sign(v)}${/premium|enhanced|geliştirilmiş|natural|neural|wavenet|siri/i.test(v.name) ? ' ★' : ''}`, selected: v.voiceURI === pick})));
  };
  $('#voiceLangLabel').textContent = `${l.name} sesi`; fill(sel, l.voice);
  $('#asrCard').hidden = !canCheck(); $('#asrToggle').checked = store.get(ASR_KEY) === '1';
  document.querySelectorAll('input[name=rate]').forEach(i => { i.checked = +i.value === rateFactor(); });
  const good = voiceList(l.voice).some(v => /premium|enhanced|geliştirilmiş|natural|neural|wavenet|siri/i.test(v.name)), g = genderPref();
  const missing = g && voiceList(l.voice).length && !genderAvailable(l.voice, g) ? ` Bu cihazda ${l.name} ${g === 'f' ? 'kadın' : 'erkek'} ses yok; aşağıdaki adımlarla ücretsiz indirebilirsin.` : '';
  $('#voiceHint').textContent = (good ? 'Cihazında doğal (★) bir ses var.' : 'Cihazında bu dil için doğal (★) bir ses bulunamadı. Aşağıdaki adımlarla ücretsiz indirebilirsin.') + missing + ' Kadın/erkek sesi sayfanın üstündeki ♀ ♂ düğmeleriyle seçersin.';
  renderGender();
}
// Sayfanın üstündeki ♀ ♂ düğmeleri: dokununca tercih kaydedilir, bugünün ilk kelimesi o sesle okunur ve hangi sesin seçildiği kısa bir bildirimle söylenir.
function renderGender() {
  const g = genderPref();
  document.querySelectorAll('#genderToggle button').forEach(b => b.setAttribute('aria-pressed', b.dataset.g === g));
}
let toastT = null;
function toast(text) { const t = $('#toast'); t.textContent = text; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 4000); }
document.querySelectorAll('#genderToggle button').forEach(b => { b.onclick = () => {
  const g = genderPref() === b.dataset.g ? '' : b.dataset.g, l = languages[active];
  g ? store.set(GENDER_KEY, g) : store.del(GENDER_KEY);
  renderVoiceSettings();
  const v = voiceFor(l.voice);
  if (g && voiceList(l.voice).length && !genderAvailable(l.voice, g)) toast(`Bu cihazda ${l.name} ${g === 'f' ? 'kadın' : 'erkek'} ses yok (${v?.name || '—'} kullanılıyor). İndirmek için: İlerleme → Ses ve telaffuz.`);
  else toast(`${g === 'f' ? 'Kadın ses' : g === 'm' ? 'Erkek ses' : 'Otomatik ses'}: ${v ? `${v.name} (${v.lang})` : 'cihaz sesi yok'}`);
  speak(todayLesson().w[0][0]);
}; });
const saveVoice = (lang, uri) => { const v = chosenVoices(); if (uri) v[lang] = uri; else delete v[lang]; store.set(VOICE_KEY, JSON.stringify(v)); renderVoiceSettings(); };
$('#voiceSelect').onchange = e => { saveVoice(active, e.target.value); speak(todayLesson().p[0][0]); };
$('#asrToggle').onchange = e => { e.target.checked ? store.set(ASR_KEY, '1') : store.del(ASR_KEY); };
$('#voiceTest').onclick = () => speak(todayLesson().p[0][0]);
document.querySelectorAll('input[name=rate]').forEach(i => { i.onchange = () => { store.set(RATE_KEY, i.value); speak(todayLesson().p[0][0]); }; });
if ('speechSynthesis' in window) speechSynthesis.addEventListener?.('voiceschanged', renderVoiceSettings);

// ---------- Tema ----------
// dil-atlasi-tema: 'light' | 'dark', yoksa sistem. theme.js açılışta uygular; burada seçim değişince uygulanır.
const THEME_KEY = 'dil-atlasi-tema';
const themePref = () => ['light', 'dark'].includes(store.get(THEME_KEY)) ? store.get(THEME_KEY) : '';
function applyTheme() {
  const t = themePref(), root = document.documentElement;
  t ? root.setAttribute('data-theme', t) : root.removeAttribute('data-theme');
  const light = t === 'light' || (!t && matchMedia('(prefers-color-scheme: light)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f5f6f8' : '#0a0d13');
  $('#themeToggle')?.setAttribute('aria-label', light ? 'Koyu temaya geç' : 'Açık temaya geç');
}
document.querySelectorAll('#themeOpts input').forEach(i => { i.onchange = () => { i.value ? store.set(THEME_KEY, i.value) : store.del(THEME_KEY); applyTheme(); }; });
const themeIsLight = () => themePref() === 'light' || (!themePref() && matchMedia('(prefers-color-scheme: light)').matches);
// Başlıktaki ☀/☾: tek dokunuşla açık ↔ koyu (açık seçim olarak kaydedilir; "Sistem" İlerleme → Görünüm'de).
$('#themeToggle').onclick = () => {
  store.set(THEME_KEY, themeIsLight() ? 'dark' : 'light'); applyTheme();
  document.querySelectorAll('#themeOpts input').forEach(i => { i.checked = i.value === themePref(); });
};
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', applyTheme);

function render() {
  document.documentElement.style.setProperty('--lang-base', languages[active].color);
  document.querySelectorAll('#themeOpts input').forEach(i => { i.checked = i.value === themePref(); });
  renderLangs(); renderToday();
  renderRes('#audioRes', window.MEDIA?.[active]?.audio); renderRes('#videoRes', window.MEDIA?.[active]?.video);
  if (!drill.playing) { $('#drillInfo').textContent = `Bugün: ${drillItems().length} ifade · yaklaşık ${Math.ceil(drillItems().length * 9 / 60)} dakika. Ekranın açık kalması gerekir.`; }
  $('#appVersion').textContent = `Sürüm ${APP_VERSION}`;
  renderProgress(); renderPlan(); renderStats(); renderVoiceSettings(); renderFreqCard(); renderRead();
}

// ---------- Odak sayacı ----------
const durations = [25, 45, 60];
// Kalan süre bitiş anından hesaplanır; telefon kilitlenince ya da sekme arka plana geçince sayaç kaymaz.
let duration = durations.includes(+store.get('dil-atlasi-timer')) ? +store.get('dil-atlasi-timer') : 25, seconds = duration * 60, timerId = null, deadline = 0;
function updateTimer() {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0'), s = String(seconds % 60).padStart(2, '0');
  $('#timerDisplay').textContent = `${m}:${s}`; document.title = timerId ? `${m}:${s} · Dil Atlası` : 'Dil Atlası';
  document.querySelectorAll('#timerDuration input').forEach(i => { i.checked = +i.value === duration; i.disabled = !!timerId; });
}
function resetTimer() { clearInterval(timerId); timerId = null; seconds = duration * 60; $('#timerToggle').textContent = 'Başlat'; updateTimer(); }
$('#timerToggle').onclick = () => {
  if (seconds <= 0) resetTimer();
  if (timerId) { clearInterval(timerId); timerId = null; seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); $('#timerToggle').textContent = 'Devam et'; }
  else {
    deadline = Date.now() + seconds * 1000;
    timerId = setInterval(() => {
      seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); updateTimer();
      if (seconds <= 0) { clearInterval(timerId); timerId = null; $('#timerToggle').textContent = 'Yeniden başlat'; updateTimer(); logAdd(active, 'm', duration); renderStats(); navigator.vibrate?.([200, 100, 200]); $('#timerDisplay').textContent = 'Bitti ✓'; }
    }, 500);
    $('#timerToggle').textContent = 'Duraklat';
  }
  updateTimer();
};
$('#timerReset').onclick = resetTimer;
$('#timerDuration').onchange = e => { const v = +e.target.value; if (!durations.includes(v) || timerId) return; duration = v; store.set('dil-atlasi-timer', String(v)); resetTimer(); };

// ---------- Yedekleme ----------
const TASK_KEY = /^da:(review|lesson|shadow|speak):(en|fr|it|de):\d{4}-\d{2}-\d{2}$/;
function setDataStatus(text, isError = false) { const e = $('#dataStatus'); e.textContent = text; e.classList.toggle('error', isError); }
$('#exportData').onclick = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (TASK_KEY.test(k) && store.get(k) === '1') data[k] = '1'; }
  // Yedek biçimi 2: 1'e ek olarak hatırlama ölçüsü, haftalık plan ve günlük istatistik. 1 ve 2 geri yüklenebilir.
  const s = loadSrs(), srs = s.cards, backup = {app:'dil-atlasi', schemaVersion:2, exportedAt:new Date().toISOString(), settings:{active, timer:duration, rate:rateFactor()}, tasks:data, srs, srsVersion:2, srsStats:s.stats || {}, notes:loadNotes().items, freq: readJson(FREQ_KEY) || {}, plan:loadPlan().langs, log:loadLog().d, reading:loadRead()};
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'}));
  const a = el('a', {href:url, download:`dil-atlasi-yedek-${localDate()}.json`}); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  setDataStatus(`${Object.keys(data).length} görev kaydı ve ${Object.keys(srs).length} tekrar kartı indirildi.`);
};
$('#importData').onclick = () => $('#importFile').click();
$('#importFile').onchange = async e => {
  const file = e.target.files[0]; e.target.value = ''; if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('Dosya çok büyük.');
    let backup; try { backup = JSON.parse(await file.text()); } catch { throw new Error('Dosya okunamadı; geçerli bir JSON değil.'); }
    if (backup?.app !== 'dil-atlasi' || ![1, 2].includes(backup.schemaVersion) || typeof backup.tasks !== 'object' || backup.tasks === null) throw new Error('Bu dosya bir Dil Atlası yedeği değil veya sürümü desteklenmiyor.');
    const keys = Object.keys(backup.tasks).filter(k => TASK_KEY.test(k) && backup.tasks[k] === '1'), fresh = keys.filter(k => store.get(k) !== '1').length;
    if (!confirm(`Yedekte ${keys.length} görev kaydı var; ${fresh} tanesi bu cihazda yeni.\nMevcut kayıtlar silinmeyecek. Devam edilsin mi?`)) { setDataStatus('Geri yükleme iptal edildi.'); return; }
    keys.forEach(k => store.set(k, '1'));
    // Tekrar kartları yalnızca v2 biçimindeyse alınır; aynı kartta daha ileri kutu kazanır.
    if (backup.srsVersion === 2 && backup.srs && typeof backup.srs === 'object') {
      const s = loadSrs();
      for (const [id, c] of Object.entries(backup.srs)) { if (!CARD_ID.test(id) || !c || !Number.isInteger(c.b) || c.b < 0 || c.b >= INTERVALS.length || !DATE.test(c.d)) continue; if (!s.cards[id] || c.b > s.cards[id].b) s.cards[id] = {b:c.b, d:c.d}; }
      // Hatırlama ölçüsü: dil başına daha çok ölçüm içeren taraf kazanır.
      if (backup.srsStats && typeof backup.srsStats === 'object') for (const lang of Object.keys(languages)) { const x = backup.srsStats[lang]; if (!x || !Number.isInteger(x.n) || !Number.isInteger(x.ok) || x.ok < 0 || x.ok > x.n || x.n > 1e6) continue; if (x.n > (s.stats?.[lang]?.n || 0)) (s.stats ||= {})[lang] = {ok:x.ok, n:x.n}; }
      saveSrs(s);
    }
    if (backup.freq && typeof backup.freq === 'object') {
      for (const lang of Object.keys(languages)) { const x = backup.freq[lang]; if (!x || !Number.isInteger(x.done) || x.done < 0 || x.done > 200) continue; const st = freqState(lang); if (x.done > st.done) saveFreqState(lang, {on: x.on !== false, done: x.done, last: DATE_RE.test(x.last || '') ? x.last : ''}); }
    }
    if (backup.notes && typeof backup.notes === 'object') {
      const n = loadNotes();
      for (const [id, x] of Object.entries(backup.notes)) { if (!/^(en|fr|it|de):n:[a-z0-9]{4,14}$/.test(id) || !x || !DATE.test(x.d) || !cleanText(x.t)) continue; if (!n.items[id]) n.items[id] = {t:cleanText(x.t), tr:cleanText(x.tr), d:x.d}; }
      saveNotes(n);
    }
    // Plan: bu cihazda plan yoksa yedektekini al. Günlük istatistik: her alan için büyük değer kalır.
    if (backup.plan && typeof backup.plan === 'object') for (const lang of Object.keys(languages)) { if (backup.plan[lang] && !planFor(lang).days.length) { const p = cleanPlan(backup.plan[lang]); if (p.days.length) savePlan(lang, p); } }
    if (backup.log && typeof backup.log === 'object') {
      const l = loadLog();
      for (const [d, day] of Object.entries(backup.log)) { if (!DATE_RE.test(d) || !day || typeof day !== 'object') continue; for (const lang of Object.keys(languages)) { const x = day[lang]; if (!x || typeof x !== 'object') continue; const cur = ((l.d[d] ||= {})[lang] ||= {}); LOG_FIELDS.forEach(f => { const v = x[f]; if (Number.isInteger(v) && v > 0 && v < 1e5 && v > (cur[f] || 0)) cur[f] = v; }); if (!Object.keys(cur).length) delete l.d[d][lang]; } if (!Object.keys(l.d[d] || {}).length) delete l.d[d]; }
      saveLog(l);
    }
    // Okuma: bu cihazda olmayan kayıtlar eklenir; testte daha iyi sonuç kalır.
    if (backup.reading?.v === 1) {
      const rd = loadRead(), RID = /^(en|fr|it|de):\d{1,2}$/;
      for (const [id, x] of Object.entries(backup.reading.done || {})) { if (!RID.test(id) || !x || !DATE.test(x.d) || !Number.isInteger(x.s) || x.s < 0 || x.s > 10) continue; if (!rd.done[id] || x.s > rd.done[id].s) rd.done[id] = {d:x.d, s:x.s}; }
      for (const [id, d] of Object.entries(backup.reading.cards || {})) { if (RID.test(id) && DATE.test(d) && !rd.cards[id]) rd.cards[id] = d; }
      saveRead(rd);
    }
    const st = backup.settings || {};
    if ([0.8, 1, 1.15].includes(st.rate)) store.set(RATE_KEY, String(st.rate));
    if (languages[st.active]) { active = st.active; store.set('dil-atlasi-active', active); }
    if (durations.includes(st.timer) && !timerId) { duration = st.timer; store.set('dil-atlasi-timer', String(duration)); resetTimer(); }
    dayCache.clear(); render(); setDataStatus(`${fresh} yeni görev kaydı eklendi.`);
  } catch (err) { setDataStatus(err.message || 'Geri yükleme başarısız.', true); }
};

// ---------- Dili sıfırlama ----------
// Yalnızca seçili dilin aşama kayıtlarını ve tekrar kartlarını siler (kullanıcı onayıyla).
$('#resetLang').onclick = () => {
  const l = languages[active], prefix = new RegExp(`^da:(${tasks.join('|')}):${active}:`);
  if (!confirm(`${l.name} için tüm çalışma geçmişi, tekrar kartları ve istatistikleri silinecek; ders 1'den başlayacaksın.\nDiğer diller etkilenmez. Emin misin?`)) return;
  const keys = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (prefix.test(k)) keys.push(k); }
  keys.forEach(store.del);
  const s = loadSrs(); Object.keys(s.cards).forEach(id => { if (id.startsWith(active + ':')) delete s.cards[id]; }); saveSrs(s);
  const n = loadNotes(); Object.keys(n.items).forEach(id => { if (id.startsWith(active + ':')) delete n.items[id]; }); saveNotes(n);
  saveFreqState(active, {on: freqState().on, done: 0, last: ''});
  const rd = loadRead(); ['done', 'cards'].forEach(f => Object.keys(rd[f]).forEach(id => { if (id.startsWith(active + ':')) delete rd[f][id]; })); saveRead(rd); readOpen = null;
  const l2 = loadLog(); Object.values(l2.d).forEach(day => { delete day[active]; }); saveLog(l2);
  dayCache.clear(); openStep = null; render(); switchTab('bugun');
};

// ---------- Kurulum, tarayıcı ajan araçları, Service Worker ----------
let installPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
$('#installApp').onclick = async () => { if (installPrompt) { await installPrompt.prompt(); installPrompt = null; return; } alert('iPhone/iPad: Safari\'de Paylaş düğmesine, ardından "Ana Ekrana Ekle"ye dokun.\n\nAndroid: Chrome menüsünden "Uygulamayı yükle"yi seç.'); };
if (matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) $('#installCard').hidden = true;

function registerAgentTools() {
  const ctx = document.modelContext; if (!ctx?.registerTool) return;
  const reg = t => { try { void Promise.resolve(ctx.registerTool(t)).catch(() => {}); } catch {} };
  reg({name:'get_today_language_plan', title:'Bugünün dil planını oku', description:'Seçili dil, bugünkü ders ve tamamlanan aşamaları döndürür. Hiçbir veriyi değiştirmez.', inputSchema:{type:'object', properties:{}, additionalProperties:false}, annotations:{readOnlyHint:true, untrustedContentHint:false},
    execute() { const done = tasks.filter(t => isDone(t)); return {language:active, languageName:languages[active].name, date:localDate(), lesson:todayLesson().t, lessonDay:getLessonDay(), completedTasks:done, totalTasks:tasks.length, progressPercent:Math.round(done.length / tasks.length * 100), plannedToday:plannedToday(active), dailyGoal:planFor().goal}; }});
  reg({name:'set_language_task_status', title:'Dil görevini güncelle', description:'Belirtilen dilde bugünün tekrar, ders, dinleme veya konuşma aşamasını tamamlandı ya da bekliyor olarak işaretler.', inputSchema:{type:'object', properties:{language:{type:'string', enum:Object.keys(languages)}, task:{type:'string', enum:tasks}, completed:{type:'boolean'}}, required:['language', 'task', 'completed'], additionalProperties:false}, annotations:{readOnlyHint:false, untrustedContentHint:false},
    execute(input) { if (!input || !languages[input.language] || !tasks.includes(input.task) || typeof input.completed !== 'boolean') throw new Error('Geçersiz dil, görev veya durum.'); if (input.language !== active) switchLang(input.language); if (isDone(input.task) !== input.completed) setDone(input.task, input.completed); return {language:active, task:input.task, completed:input.completed, date:localDate()}; }});
}

// "Yenile ve devam et" sonrası: Konuş adımını aç ve telaffuz testine kaydır.
let reopenSpeak = null; try { const raw = sessionStorage.getItem(ASR_REOPEN_KEY); sessionStorage.removeItem(ASR_REOPEN_KEY); if (raw) { try { reopenSpeak = JSON.parse(raw); } catch { reopenSpeak = {row: raw, kind: 'mic'}; } if (typeof reopenSpeak !== 'object' || !reopenSpeak) reopenSpeak = {row: '', kind: 'mic'}; } } catch {}
if (reopenSpeak) { tab = 'bugun'; openStep = STEPS.findIndex(s => s.task === 'speak'); }
applyTheme(); switchTab(tab); render(); updateTimer(); registerAgentTools();
if (reopenSpeak) {
  const row = [...document.querySelectorAll('#pronTest .pron-item')].find(r => r.dataset.t === reopenSpeak.row);
  (row || $('#pronTest'))?.scrollIntoView({block:'center'});
  const panel = row?.querySelector('.check');
  if (panel) { row.classList.add('ready'); panel.textContent = `${reopenSpeak.kind === 'listen' ? 'Dinledin.' : 'Mikrofon hazır.'} Şimdi ✓ Kontrol et'e dokun ve söyle.`; }
}

if ('serviceWorker' in navigator) {
  let reloading = false;
  const showUpdate = w => { $('#updateBanner').hidden = false; $('#updateReload').onclick = () => w.postMessage('SKIP_WAITING'); };
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading) return; reloading = true; location.reload(); });
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').then(reg => {
    if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
    reg.addEventListener('updatefound', () => { const w = reg.installing; w?.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdate(w); }); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
  }).catch(() => {}));
}
