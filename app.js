'use strict';
// Dil Atlası — bağımlılıksız uygulama mantığı.
// Korunan localStorage anahtarları: dil-atlasi-active, da:{task}:{lang}:{date}, dil-atlasi-timer, dil-atlasi-srs.

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
const isDone = (t, lang = active, date = localDate()) => store.get(key(t, lang, date)) === '1';
function setDone(t, on = true) { on ? store.set(key(t), '1') : store.del(key(t)); render(); }

let active = languages[store.get('dil-atlasi-active')] ? store.get('dil-atlasi-active') : 'en';
let tab = TABS.includes(store.get('dil-atlasi-tab')) ? store.get('dil-atlasi-tab') : 'bugun';
let openStep = null;

// ---------- Ders içeriği ----------
const lessonsFor = (lang = active) => window.LESSONS?.[lang] || [];
// Ders günü = bu dilde bugünden önce çalışılan gün sayısı + 1. Bugün aşama işaretlemek dersi değiştirmez.
function getLessonDay(lang = active) {
  let count = 0;
  for (let i = 1; i <= 365; i++) if (tasks.some(t => isDone(t, lang, localDate(-i)))) count++;
  return Math.max(1, Math.min(count + 1, lessonsFor(lang).length));
}
const todayLesson = () => lessonsFor()[getLessonDay() - 1];

// ---------- Seslendirme ----------
function speak(text, lang = languages[active].voice, rate = .85) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = rate; speechSynthesis.speak(u);
}
const speakBtn = (text, lang) => el('button', {type:'button', className:'speak', textContent:'▶', ariaLabel:`Seslendir: ${text}`, onclick: () => speak(text, lang)});

// ---------- Aralıklı tekrar (Leitner kutuları) ----------
// Önceki derslerin kelime (w) ve cümleleri (s) karta dönüşür. Bildim → kutu +1 (1/3/7/14/30 gün), Tekrar → yarın.
const SRS_KEY = 'dil-atlasi-srs', INTERVALS = [1, 3, 7, 14, 30];
const CARD_ID = /^(en|fr|it|de):\d{1,3}:[ws]\d{1,2}$/, DATE = /^\d{4}-\d{2}-\d{2}$/;
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
    const add = (kind, [target, tr], i) => { const id = `${lang}:${li}:${kind}${i}`, c = cards[id]; if (!c || c.d <= today) out.push({id, target, tr, box: c ? c.b : -1, due: c ? c.d : ''}); };
    all[li].w.forEach((x, i) => add('w', x, i)); all[li].p.forEach((x, i) => add('s', x, i));
  }
  return out.sort((a, b) => a.due.localeCompare(b.due)).slice(0, limit);
}
function gradeCard(id, box, ok) {
  const s = loadSrs(), b = ok ? Math.min(box + 1, INTERVALS.length - 1) : 0;
  s.cards[id] = {b, d: localDate(ok ? INTERVALS[b] : 1)}; saveSrs(s);
}
const learnedCount = (lang = active) => Object.entries(loadSrs().cards).filter(([id, c]) => id.startsWith(lang + ':') && c.b >= 2).length;

// ---------- Dil ve sekme ----------
function renderLangs() {
  const nav = $('#langs'); nav.replaceChildren();
  Object.entries(languages).forEach(([id, l]) => {
    const b = el('button', {type:'button', className:'lang-chip', onclick: () => switchLang(id)}, el('span', {textContent:l.code}), el('span', {className:'full', textContent:l.name}));
    b.style.setProperty('--c', l.color); b.setAttribute('aria-pressed', id === active); b.setAttribute('aria-label', l.name);
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
  if (openStep === null) openStep = STEPS.findIndex(s => !(isDone(s.task) || (s.task === 'review' && !due.length)));
  const box = $('#steps'); box.replaceChildren();
  STEPS.forEach((s, i) => {
    const done = isDone(s.task) || (s.task === 'review' && !due.length && getLessonDay() > 1), open = i === openStep;
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
  const q = el('div', {className:'q', textContent:c.tr});
  const reveal = el('button', {type:'button', className:'btn big', textContent:'Cevabı göster'});
  box.append(meta, q, el('p', {className:'small', textContent:'Önce yüksek sesle söyle, sonra aç.'}), reveal);
  reveal.onclick = () => {
    speak(c.target, voice);
    const grade = ok => { gradeCard(c.id, c.box, ok); if (dueCards().length === 0) { store.set(key('review'), '1'); openStep = i + 1; } render(); $('#steps .flash .btn, #steps .step.open .btn')?.focus(); };
    reveal.replaceWith(el('div', {className:'a'}, el('span', {textContent:c.target}), speakBtn(c.target, voice)),
      el('div', {className:'actions'}, el('button', {type:'button', className:'btn secondary', textContent:'Tekrar et', onclick: () => grade(false)}), el('button', {type:'button', className:'btn', textContent:'Bildim', onclick: () => grade(true)})));
    box.querySelector('.actions .btn:last-child').focus();
  };
  return box;
}
function lessonBody(lesson, voice, i) {
  const words = el('div', {className:'items'}, ...lesson.w.map(([t, tr]) => el('div', {className:'item'}, el('div', {}, el('strong', {textContent:t}), el('span', {textContent:tr})), speakBtn(t, voice))));
  const sentences = el('div', {className:'items'}, ...lesson.p.map(([t, tr]) => el('div', {className:'item'}, el('div', {}, el('strong', {textContent:t}), el('span', {textContent:tr})), speakBtn(t, voice))));
  const playAll = list => { let k = 0; const next = () => { if (k >= list.length) return; const u = new SpeechSynthesisUtterance(list[k++][0]); u.lang = voice; u.rate = .8; u.onend = () => setTimeout(next, 700); speechSynthesis.speak(u); }; speechSynthesis.cancel(); next(); };
  return [
    el('div', {className:'eyebrow', textContent:'1 · Kelimeler'}), el('p', {className:'small', textContent:'Her kelimeyi dinle ve iki kez yüksek sesle söyle.'}),
    el('button', {type:'button', className:'btn secondary', textContent:'▶ Hepsini dinle', onclick: () => playAll(lesson.w)}), words,
    el('div', {className:'eyebrow', style:'margin-top:18px', textContent:'2 · Cümleler'}), el('p', {className:'small', textContent:'Aynı kelimeler cümle içinde. Dinle, sonra ekrana bakmadan söylemeyi dene.'}),
    el('button', {type:'button', className:'btn secondary', textContent:'▶ Hepsini dinle', onclick: () => playAll(lesson.p)}), sentences,
    el('div', {className:'tip', textContent:`💡 ${lesson.n}`}),
    el('div', {className:'eyebrow', style:'margin-top:18px', textContent:'3 · Cümle kur'}), sentenceBuilder(lesson.p, voice),
    doneRow('lesson', i + 1)
  ];
}
// Cümle kurma: Türkçesini gör, karışık kelimeleri doğru sıraya diz.
function sentenceBuilder(sentences, voice) {
  let idx = 0; const box = el('div');
  const draw = () => {
    const [target, tr] = sentences[idx], tokens = target.split(/\s+/), order = tokens.map((t, k) => k).sort(() => Math.random() - .5);
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
    `Kurallar: 1) Çok kısa ve yavaş ${l.name} cümleler kur, sadece bu kelimeleri ve çok basit ifadeleri kullan. 2) Her seferinde tek soru sor. ` +
    `3) Hata yaparsam önce doğru cümleyi söyle, sonra tekrar etmemi iste; açıklamayı tek kısa Türkçe cümleyle yap. 4) Bu konuda 5 dakikalık basit bir rol oyunu yap. ` +
    `${l.name} bir selamla başla.`;
}
function speakBody(lesson, voice, i) {
  const prompt = coachPrompt(lesson), q = encodeURIComponent(prompt), status = el('span', {className:'small muted', role:'status'});
  const say = el('div', {className:'items'}, ...lesson.p.map(([t, tr]) => {
    const d = el('details', {className:'item'}); d.append(el('summary', {textContent:tr}), el('div', {style:'display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px'}, el('strong', {textContent:t}), speakBtn(t, voice)));
    return d;
  }));
  return [
    el('div', {className:'eyebrow', textContent:'1 · Kendi kendine'}),
    el('p', {className:'small', textContent:'Türkçesini oku, cümleyi yüksek sesle söyle, sonra dokunup kontrol et.'}), say,
    el('div', {className:'eyebrow', style:'margin-top:18px', textContent:'2 · Yapay zekâyla sesli sohbet (isteğe bağlı)'}),
    el('p', {className:'small', textContent:'"ChatGPT\'de aç" bugünkü dersle hazırlanmış mesajı ChatGPT\'ye gönderir ve öğretmen gibi yazmaya başlar. Konuşarak devam etmek için sağ alttaki ses dalgası simgesine dokun. "Claude\'da aç" mesajı kopyalar ve Claude\'u açar; mesajı yapıştırıp gönder, sonra ses simgesine dokun. Mesajda kişisel bilgin yok; yalnızca bugünkü ders gider. Hesap gerekir.'}),
    el('div', {className:'step-actions'},
      el('a', {className:'btn link-btn', href:`https://chatgpt.com/?q=${q}`, target:'_blank', rel:'noopener noreferrer', textContent:'ChatGPT\'de aç'}),
      el('button', {type:'button', className:'btn', textContent:'Claude\'da aç', onclick: async () => { try { await navigator.clipboard.writeText(prompt); status.textContent = 'Mesaj kopyalandı — Claude\'da yapıştırıp gönder.'; } catch { status.textContent = 'Kopyalanamadı; aşağıdaki düğmeyi dene.'; } window.open('https://claude.ai/new', '_blank', 'noopener,noreferrer'); }}),
      el('button', {type:'button', className:'btn secondary', textContent:'Mesajı kopyala', onclick: async () => { try { await navigator.clipboard.writeText(prompt); status.textContent = 'Kopyalandı — ChatGPT veya Claude uygulamasına yapıştır.'; } catch { status.textContent = 'Kopyalanamadı.'; } }})),
    el('p', {className:'small', textContent:'Köpek gezdirirken: ChatGPT uygulamasında Ayarlar → Voice → "Background conversations" açıksa telefon kilitliyken de sohbet sürer. Claude\'un ses modu da eller serbest dinler.'}),
    status,
    doneRow('speak', -1)
  ];
}

// ---------- Dinle: eller serbest ses çalışması ----------
// Sıra: Türkçe → ara (sen söyle) → hedef dil → kısa ara → hedef dil tekrar. Sonra günün tekrar kartları.
let drill = {run:0, playing:false}, wakeLock = null;
const sleep = ms => new Promise(r => setTimeout(r, ms));
function sayAsync(text, lang, rate, run) {
  return new Promise(res => {
    if (drill.run !== run) return res();
    const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = rate;
    const t = setTimeout(res, Math.max(4000, text.length * 180)); // onend bazı tarayıcılarda gelmeyebilir
    u.onend = u.onerror = () => { clearTimeout(t); res(); };
    speechSynthesis.speak(u);
  });
}
function drillItems() {
  const lesson = todayLesson();
  return [...lesson.w.map(x => ({tr:x[1], t:x[0]})), ...lesson.p.map(x => ({tr:x[1], t:x[0]})), ...dueCards(active, 10).map(c => ({tr:c.tr, t:c.target}))];
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
    await sayAsync(it.tr, 'tr-TR', 1, run); await sleep(gap());
    if (drill.run !== run) break;
    $('#drillL2').textContent = it.t;
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
function renderProgress() {
  const l = languages[active], day = getLessonDay();
  $('#progressTitle').textContent = `${l.name} ilerlemesi`;
  let days = 0; for (let i = 0; i < 365; i++) if (studiedOn(localDate(-i))) days++;
  $('#statDays').textContent = days; $('#statStreak').textContent = getStreak(); $('#statCards').textContent = learnedCount();
  const h = $('#history'); h.replaceChildren();
  for (let i = 27; i >= 0; i--) { const n = tasks.filter(t => isDone(t, active, localDate(-i))).length; h.append(el('span', {className:`history-day ${n === 4 ? 'full' : n ? 'some' : ''}`, title:`${localDate(-i)} · ${n}/4`})); }
  $('#lessonList').replaceChildren(...lessonsFor().map((ls, k) => el('li', {className: k < day - 1 ? 'done' : k === day - 1 ? 'current' : '', textContent:ls.t})));
}

function render() {
  document.documentElement.style.setProperty('--lang', languages[active].color);
  renderLangs(); renderToday();
  renderRes('#audioRes', window.MEDIA?.[active]?.audio); renderRes('#videoRes', window.MEDIA?.[active]?.video);
  if (!drill.playing) { $('#drillInfo').textContent = `Bugün: ${drillItems().length} ifade · yaklaşık ${Math.ceil(drillItems().length * 12 / 60)} dakika. Ekranın açık kalması gerekir.`; }
  renderProgress();
}

// ---------- Odak sayacı ----------
const durations = [25, 45, 60];
let duration = durations.includes(+store.get('dil-atlasi-timer')) ? +store.get('dil-atlasi-timer') : 25, seconds = duration * 60, timerId = null;
function updateTimer() {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0'), s = String(seconds % 60).padStart(2, '0');
  $('#timerDisplay').textContent = `${m}:${s}`; document.title = timerId ? `${m}:${s} · Dil Atlası` : 'Dil Atlası';
  document.querySelectorAll('#timerDuration input').forEach(i => { i.checked = +i.value === duration; i.disabled = !!timerId; });
}
function resetTimer() { clearInterval(timerId); timerId = null; seconds = duration * 60; $('#timerToggle').textContent = 'Başlat'; updateTimer(); }
$('#timerToggle').onclick = () => {
  if (seconds <= 0) resetTimer();
  if (timerId) { clearInterval(timerId); timerId = null; $('#timerToggle').textContent = 'Devam et'; }
  else { timerId = setInterval(() => { seconds--; updateTimer(); if (seconds <= 0) { clearInterval(timerId); timerId = null; $('#timerToggle').textContent = 'Yeniden başlat'; updateTimer(); speak('Çalışma tamamlandı', 'tr-TR'); } }, 1000); $('#timerToggle').textContent = 'Duraklat'; }
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
  const srs = loadSrs().cards, backup = {app:'dil-atlasi', schemaVersion:1, exportedAt:new Date().toISOString(), settings:{active, timer:duration}, tasks:data, srs, srsVersion:2};
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
    if (backup?.app !== 'dil-atlasi' || backup.schemaVersion !== 1 || typeof backup.tasks !== 'object' || backup.tasks === null) throw new Error('Bu dosya bir Dil Atlası yedeği değil veya sürümü desteklenmiyor.');
    const keys = Object.keys(backup.tasks).filter(k => TASK_KEY.test(k) && backup.tasks[k] === '1'), fresh = keys.filter(k => store.get(k) !== '1').length;
    if (!confirm(`Yedekte ${keys.length} görev kaydı var; ${fresh} tanesi bu cihazda yeni.\nMevcut kayıtlar silinmeyecek. Devam edilsin mi?`)) { setDataStatus('Geri yükleme iptal edildi.'); return; }
    keys.forEach(k => store.set(k, '1'));
    // Tekrar kartları yalnızca v2 biçimindeyse alınır; aynı kartta daha ileri kutu kazanır.
    if (backup.srsVersion === 2 && backup.srs && typeof backup.srs === 'object') {
      const s = loadSrs();
      for (const [id, c] of Object.entries(backup.srs)) { if (!CARD_ID.test(id) || !c || !Number.isInteger(c.b) || c.b < 0 || c.b >= INTERVALS.length || !DATE.test(c.d)) continue; if (!s.cards[id] || c.b > s.cards[id].b) s.cards[id] = {b:c.b, d:c.d}; }
      saveSrs(s);
    }
    const st = backup.settings || {};
    if (languages[st.active]) { active = st.active; store.set('dil-atlasi-active', active); }
    if (durations.includes(st.timer) && !timerId) { duration = st.timer; store.set('dil-atlasi-timer', String(duration)); resetTimer(); }
    render(); setDataStatus(`${fresh} yeni görev kaydı eklendi.`);
  } catch (err) { setDataStatus(err.message || 'Geri yükleme başarısız.', true); }
};

// ---------- Kurulum, tarayıcı ajan araçları, Service Worker ----------
let installPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
$('#installApp').onclick = async () => { if (installPrompt) { await installPrompt.prompt(); installPrompt = null; return; } alert('iPhone/iPad: Safari\'de Paylaş düğmesine, ardından "Ana Ekrana Ekle"ye dokun.\n\nAndroid: Chrome menüsünden "Uygulamayı yükle"yi seç.'); };
if (matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) $('#installApp').closest('.card').hidden = true;

function registerAgentTools() {
  const ctx = document.modelContext; if (!ctx?.registerTool) return;
  const reg = t => { try { void Promise.resolve(ctx.registerTool(t)).catch(() => {}); } catch {} };
  reg({name:'get_today_language_plan', title:'Bugünün dil planını oku', description:'Seçili dil, bugünkü ders ve tamamlanan aşamaları döndürür. Hiçbir veriyi değiştirmez.', inputSchema:{type:'object', properties:{}, additionalProperties:false}, annotations:{readOnlyHint:true, untrustedContentHint:false},
    execute() { const done = tasks.filter(t => isDone(t)); return {language:active, languageName:languages[active].name, date:localDate(), lesson:todayLesson().t, lessonDay:getLessonDay(), completedTasks:done, totalTasks:tasks.length, progressPercent:Math.round(done.length / tasks.length * 100)}; }});
  reg({name:'set_language_task_status', title:'Dil görevini güncelle', description:'Belirtilen dilde bugünün tekrar, ders, dinleme veya konuşma aşamasını tamamlandı ya da bekliyor olarak işaretler.', inputSchema:{type:'object', properties:{language:{type:'string', enum:Object.keys(languages)}, task:{type:'string', enum:tasks}, completed:{type:'boolean'}}, required:['language', 'task', 'completed'], additionalProperties:false}, annotations:{readOnlyHint:false, untrustedContentHint:false},
    execute(input) { if (!input || !languages[input.language] || !tasks.includes(input.task) || typeof input.completed !== 'boolean') throw new Error('Geçersiz dil, görev veya durum.'); active = input.language; store.set('dil-atlasi-active', active); input.completed ? store.set(key(input.task), '1') : store.del(key(input.task)); render(); return {language:active, task:input.task, completed:input.completed, date:localDate()}; }});
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
