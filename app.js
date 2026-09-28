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
const tasks = ['review', 'lesson', 'shadow', 'speak'];
const TABS = ['bugun', 'yuru', 'izle', 'ilerleme'];

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
function voiceScore(v, lang) {
  let s = 0;
  if (/premium|enhanced|geliştirilmiş|natural|neural|wavenet|siri/i.test(v.name)) s += 6;
  if (/google/i.test(v.name)) s += 3;
  if (v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase()) s += 2;
  if (ROBOTIC.test(v.name)) s -= 10;
  if (v.default) s += 1;
  return s;
}
const chosenVoices = () => { try { return JSON.parse(store.get(VOICE_KEY)) || {}; } catch { return {}; } };
function voiceFor(lang) {
  const list = voiceList(lang), pick = chosenVoices()[lang.slice(0, 2)];
  return list.find(v => v.voiceURI === pick) || list.sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang))[0] || null;
}
const rateFactor = () => [0.8, 1, 1.15].includes(+store.get(RATE_KEY)) ? +store.get(RATE_KEY) : 1;
function utter(text, lang, rate) {
  const u = new SpeechSynthesisUtterance(text), v = voiceFor(lang);
  u.lang = v?.lang || lang; if (v) u.voice = v; u.rate = rate * rateFactor();
  return u;
}
function speak(text, lang = languages[active].voice, rate = .85) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel(); speechSynthesis.speak(utter(text, lang, rate));
}
const speakBtn = (text, lang) => el('button', {type:'button', className:'speak', textContent:'▶', ariaLabel:`Seslendir: ${text}`, onclick: () => speak(text, lang)});

// ---------- Aralıklı tekrar (Leitner kutuları) ----------
// Önceki derslerin kelime (w) ve cümleleri (s) karta dönüşür. Bildim → kutu +1 (1/3/7/14/30 gün), Tekrar → yarın.
const SRS_KEY = 'dil-atlasi-srs', INTERVALS = [1, 3, 7, 14, 30];
const CARD_ID = /^(en|fr|it|de):(\d{1,3}:[ws]\d{1,2}|n:[a-z0-9]{4,14}|f:\d{1,4})$/, DATE = /^\d{4}-\d{2}-\d{2}$/;
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
function switchLang(id) { stopDrill(); active = id; store.set('dil-atlasi-active', id); openStep = null; render(); }
function switchTab(id) {
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
  {task:'speak', title:'Konuş', sub:'Sesli söyle, yapay zekâyla pratik', min:5}
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
      el('p', {className:'small', textContent:'Ses çalışması bugünün kelime ve cümlelerini sırayla okur: önce Türkçesi, sonra kısa bir ara (sen söyle), sonra doğrusu. Bittiğinde bu adım kendiliğinden işaretlenir.'}),
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
  const playAll = list => { let k = 0; const next = () => { if (k >= list.length) return; const u = utter(list[k++][0], voice, .8); u.onend = () => setTimeout(next, 700); speechSynthesis.speak(u); }; speechSynthesis.cancel(); next(); };
  return [
    el('div', {className:'eyebrow', textContent:'1 · Kelimeler'}), el('p', {className:'small', textContent:'Her kelimeyi dinle ve iki kez yüksek sesle söyle. Köşeli parantez Türkçe okunuştur; BÜYÜK hece vurguludur' + (active === 'fr' ? ', ñ: n\'yi söyleme, sesi burundan ver.' : '.')}),
    el('button', {type:'button', className:'btn secondary', textContent:'▶ Hepsini dinle', onclick: () => playAll(lesson.w)}), words,
    el('div', {className:'eyebrow mt', textContent:'2 · Cümleler'}), el('p', {className:'small', textContent:'Aynı kelimeler cümle içinde. Dinle, sonra ekrana bakmadan söylemeyi dene.'}),
    el('button', {type:'button', className:'btn secondary', textContent:'▶ Hepsini dinle', onclick: () => playAll(lesson.p)}), sentences,
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
function sentenceBuilder(sentences, voice) {
  let idx = 0; const box = el('div');
  const draw = () => {
    const [target, tr] = sentences[idx], tokens = target.split(/\s+/);
    // Karışık sıra, doğru cümleyle aynı çıkmasın.
    let order = shuffle(tokens.map((t, k) => k)); for (let n = 0; n < 10 && tokens.length > 1 && order.every((k, p) => tokens[k] === tokens[p]); n++) order = shuffle(order);
    const picked = [], tgt = el('div', {className:'build-target', ariaLabel:'Kurduğun cümle'}), pool = el('div', {className:'build-pool'}), res = el('div', {className:'result', role:'status'});
    const update = () => { tgt.replaceChildren(...picked.map((k, p) => el('button', {type:'button', className:'chip', textContent:tokens[k], onclick: () => { picked.splice(p, 1); update(); }}))); pool.replaceChildren(...order.filter(k => !picked.includes(k)).map(k => el('button', {type:'button', className:'chip', textContent:tokens[k], onclick: () => { picked.push(k); update(); if (picked.length === tokens.length) check(); }}))); };
    const check = () => { const ok = picked.map(k => tokens[k]).join(' ') === target; res.className = `result ${ok ? 'ok' : 'no'}`; res.textContent = ok ? `Doğru! ${idx < sentences.length - 1 ? 'Sıradakine geç.' : 'Hepsi bitti.'}` : `Tam değil. Doğrusu: ${target}`; speak(target, voice); };
    box.replaceChildren(el('p', {className:'small', textContent:`${idx + 1}/${sentences.length} · “${tr}”`}), tgt, pool, res,
      el('div', {className:'step-actions'}, el('button', {type:'button', className:'btn secondary', textContent:'Baştan', onclick: draw}), el('button', {type:'button', className:'btn secondary', textContent:'Sıradaki →', onclick: () => { idx = (idx + 1) % sentences.length; draw(); }})));
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
    const d = el('details', {className:'item'}); d.append(el('summary', {textContent:tr}), el('div', {className:'say-row'}, el('strong', {textContent:t}), speakBtn(t, voice)), canRecord() ? recorder(t, voice) : '');
    return d;
  }));
  return [
    el('div', {className:'eyebrow', textContent:'1 · Kendi kendine'}),
    el('p', {className:'small', textContent:'Türkçesini oku, cümleyi yüksek sesle söyle, sonra dokunup kontrol et.' + (canRecord() ? ' 🎙 ile kendini kaydedip doğrusuyla karşılaştırabilirsin: mikrofon yalnızca dokununca açılır, kayıt bu cihazda geçici olarak durur, saklanmaz ve hiçbir yere gönderilmez.' : '')}), say,
    el('div', {className:'eyebrow mt', textContent:'2 · Yapay zekâyla sesli sohbet (isteğe bağlı)'}),
    el('p', {className:'small', textContent:'"ChatGPT\'de aç" bugünkü dersle hazırlanmış mesajı ChatGPT\'ye gönderir ve öğretmen gibi yazmaya başlar. Konuşarak devam etmek için sağ alttaki ses dalgası simgesine dokun. "Claude\'da aç" mesajı kopyalar ve Claude\'u açar; mesajı yapıştırıp gönder, sonra ses simgesine dokun. Mesajda kişisel bilgin yok; yalnızca bugünkü ders gider. Hesap gerekir.'}),
    el('div', {className:'step-actions'},
      el('a', {className:'btn link-btn', href:`https://chatgpt.com/?q=${q}`, target:'_blank', rel:'noopener noreferrer', textContent:'ChatGPT\'de aç'}),
      el('button', {type:'button', className:'btn', textContent:'Claude\'da aç', onclick: async () => { try { await navigator.clipboard.writeText(prompt); status.textContent = 'Mesaj kopyalandı — Claude\'da yapıştırıp gönder.'; } catch { status.textContent = 'Kopyalanamadı; aşağıdaki düğmeyi dene.'; } window.open('https://claude.ai/new', '_blank', 'noopener,noreferrer'); }}),
      el('button', {type:'button', className:'btn secondary', textContent:'Mesajı kopyala', onclick: async () => { try { await navigator.clipboard.writeText(prompt); status.textContent = 'Kopyalandı — ChatGPT veya Claude uygulamasına yapıştır.'; } catch { status.textContent = 'Kopyalanamadı.'; } }})),
    el('p', {className:'small', textContent:'Köpek gezdirirken: ChatGPT uygulamasında Ayarlar → Voice → "Background conversations" açıksa telefon kilitliyken de sohbet sürer. Claude\'un ses modu da eller serbest dinler.'}),
    status,
    el('div', {className:'eyebrow mt', textContent:'3 · Hata defteri'}),
    noteForm(),
    doneRow('speak', -1)
  ];
}

// ---------- Telaffuz kaydı (mikrofon) ----------
// İzin yalnızca kullanıcı dokununca istenir. Kayıt bellekte kalır (blob), saklanmaz, gönderilmez; kayıt bitince mikrofon kapatılır.
// Aynı anda tek kayıt tutulur: yenisi yapılınca öncekinin adresi silinir. Bir kayıt en fazla REC_MAX_MS sürer.
const REC_MAX_MS = 10000;
const canRecord = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
let lastRec = null; // {url, player}
function recorder(text, voice) {
  const btn = el('button', {type:'button', className:'btn secondary', textContent:'🎙 Kendini kaydet'});
  const status = el('span', {className:'small muted', role:'status'}), player = el('div', {className:'rec-player'});
  let rec = null, stream = null, timer = null;
  const release = () => { clearTimeout(timer); stream?.getTracks().forEach(t => t.stop()); stream = null; };
  btn.onclick = async () => {
    if (rec?.state === 'recording') { rec.stop(); return; }
    try { stream = await navigator.mediaDevices.getUserMedia({audio:true}); }
    catch (e) { status.textContent = e?.name === 'NotAllowedError' ? 'Mikrofon izni verilmedi. İstersen tarayıcı ayarlarından izin verebilirsin.' : 'Mikrofon açılamadı.'; return; }
    const chunks = [];
    try { rec = new MediaRecorder(stream); } catch { release(); status.textContent = 'Bu tarayıcı ses kaydını desteklemiyor.'; return; }
    rec.ondataavailable = e => { if (e.data?.size) chunks.push(e.data); };
    rec.onstop = () => {
      release(); btn.textContent = '🎙 Yeniden kaydet';
      if (lastRec) { URL.revokeObjectURL(lastRec.url); lastRec.player.replaceChildren(); }
      const url = URL.createObjectURL(new Blob(chunks, {type: rec.mimeType || 'audio/webm'})); lastRec = {url, player};
      const audio = el('audio', {controls:true, preload:'auto', src:url, ariaLabel:'Senin kaydın'});
      const both = () => { window.speechSynthesis?.cancel(); audio.currentTime = 0; audio.onended = () => { audio.onended = null; speak(text, voice); }; audio.play().catch(() => {}); };
      player.replaceChildren(audio, el('div', {className:'row'},
        el('button', {type:'button', className:'btn secondary', textContent:'▶ Ben, sonra doğrusu', onclick: both}),
        el('button', {type:'button', className:'btn secondary', textContent:'▶ Doğrusu', onclick: () => speak(text, voice)})));
      status.textContent = 'Kaydını dinle ve doğrusuyla karşılaştır. Farklı duyduğun heceyi tekrar söyle.';
    };
    rec.start(); btn.textContent = '■ Kaydı bitir'; status.textContent = `Kaydediliyor… cümleyi söyle (en fazla ${REC_MAX_MS / 1000} sn).`;
    timer = setTimeout(() => { if (rec.state === 'recording') rec.stop(); }, REC_MAX_MS);
  };
  return el('div', {className:'rec'}, btn, status, player);
}

// ---------- Dinle: eller serbest ses çalışması ----------
// Sıra: Türkçe → ara (sen söyle) → hedef dil → kısa ara → hedef dil tekrar. Sonra günün tekrar kartları.
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
  drill.playing = true; $('#drillPlay').textContent = '⏸ Durdur'; speechSynthesis.cancel();
  try { wakeLock = await navigator.wakeLock?.request('screen'); } catch {}
  for (let k = 0; k < items.length && drill.run === run; k++) {
    const it = items[k];
    $('#drillLabel').textContent = `${k + 1}/${items.length}`; $('#drillL1').textContent = it.tr; $('#drillL2').textContent = '…';
    await sayAsync(it.tr.replace(/^\S+\s(?=\p{L})/u, m => /\p{L}/u.test(m) ? m : ''), 'tr-TR', 1, run); await sleep(gap());
    if (drill.run !== run) break;
    $('#drillL2').textContent = it.t; $('#drillPron').textContent = it.pron ? `[${it.pron}]` : '';
    await sayAsync(it.t, voice, .8, run); await sleep(900);
    await sayAsync(it.t, voice, .8, run); await sleep(1200);
  }
  if (drill.run === run) { $('#drillL1').textContent = 'Bitti! Aferin.'; $('#drillL2').textContent = ''; $('#drillLabel').textContent = 'Bugünün ses çalışması'; store.set(key('shadow'), '1'); render(); }
  drill.playing = false; $('#drillPlay').textContent = '▶ Başlat'; wakeLock?.release?.().catch(() => {}); wakeLock = null;
}
function stopDrill() { drill.run++; drill.playing = false; if ('speechSynthesis' in window) speechSynthesis.cancel(); $('#drillPlay').textContent = '▶ Başlat'; wakeLock?.release?.().catch(() => {}); wakeLock = null; }
$('#drillPlay').onclick = startDrill;
$('#drillStop').onclick = () => { stopDrill(); $('#drillL1').textContent = 'Durduruldu.'; $('#drillL2').textContent = ''; };
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
  $('#lessonList').replaceChildren(...lessonsFor().map((ls, k) => el('li', {className: k < day - 1 ? 'done' : k === day - 1 ? 'current' : '', textContent:ls.t})));
}

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
  const l = languages[active], sel = $('#voiceSelect'), trSel = $('#trVoiceSelect');
  if (!sel) return;
  const fill = (select, lang) => {
    const list = voiceList(lang).sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang)), pick = chosenVoices()[lang.slice(0, 2)];
    select.replaceChildren(el('option', {value:'', textContent:`Otomatik (en doğal: ${voiceFor(lang)?.name || 'cihaz sesi yok'})`}), ...list.map(v => el('option', {value:v.voiceURI, textContent:`${v.name} · ${v.lang}${voiceScore(v, lang) >= 6 ? ' ★' : ''}`, selected: v.voiceURI === pick})));
  };
  $('#voiceLangLabel').textContent = `${l.name} sesi`; fill(sel, l.voice); fill(trSel, 'tr-TR');
  document.querySelectorAll('input[name=rate]').forEach(i => { i.checked = +i.value === rateFactor(); });
  const good = voiceList(l.voice).some(v => voiceScore(v, l.voice) >= 6);
  $('#voiceHint').textContent = good ? 'Cihazında doğal (★) bir ses var ve otomatik seçildi.' : 'Cihazında bu dil için doğal bir ses bulunamadı. Aşağıdaki adımlarla ücretsiz indirebilirsin.';
}
const saveVoice = (lang, uri) => { const v = chosenVoices(); if (uri) v[lang] = uri; else delete v[lang]; store.set(VOICE_KEY, JSON.stringify(v)); renderVoiceSettings(); };
$('#voiceSelect').onchange = e => { saveVoice(active, e.target.value); speak(todayLesson().p[0][0]); };
$('#trVoiceSelect').onchange = e => { saveVoice('tr', e.target.value); speak('Merhaba, bugün birlikte çalışalım.', 'tr-TR', 1); };
$('#voiceTest').onclick = () => speak(todayLesson().p[0][0]);
document.querySelectorAll('input[name=rate]').forEach(i => { i.onchange = () => { store.set(RATE_KEY, i.value); speak(todayLesson().p[0][0]); }; });
if ('speechSynthesis' in window) speechSynthesis.addEventListener?.('voiceschanged', renderVoiceSettings);

function render() {
  document.documentElement.style.setProperty('--lang', languages[active].color);
  renderLangs(); renderToday();
  renderRes('#audioRes', window.MEDIA?.[active]?.audio); renderRes('#videoRes', window.MEDIA?.[active]?.video);
  if (!drill.playing) { $('#drillInfo').textContent = `Bugün: ${drillItems().length} ifade · yaklaşık ${Math.ceil(drillItems().length * 12 / 60)} dakika. Ekranın açık kalması gerekir.`; }
  renderProgress(); renderPlan(); renderStats(); renderVoiceSettings(); renderFreqCard();
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
      if (seconds <= 0) { clearInterval(timerId); timerId = null; $('#timerToggle').textContent = 'Yeniden başlat'; updateTimer(); logAdd(active, 'm', duration); renderStats(); speak('Çalışma tamamlandı', 'tr-TR'); }
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
  const s = loadSrs(), srs = s.cards, backup = {app:'dil-atlasi', schemaVersion:2, exportedAt:new Date().toISOString(), settings:{active, timer:duration, rate:rateFactor()}, tasks:data, srs, srsVersion:2, srsStats:s.stats || {}, notes:loadNotes().items, freq: readJson(FREQ_KEY) || {}, plan:loadPlan().langs, log:loadLog().d};
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

switchTab(tab); render(); updateTimer(); registerAgentTools();

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
