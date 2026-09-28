// İçerik ve yapı testleri. Bağımlılık yok: `node tests/content.test.mjs`
import {readFileSync, existsSync} from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const read = f => readFileSync(root + f, 'utf8');
let fails = 0, passes = 0;
const check = (ok, msg) => { if (ok) passes++; else { fails++; console.error('✗ ' + msg); } };

// İçerik dosyalarını tarayıcıdaki gibi tek bir window nesnesine yükle.
const ctx = {window: {}}; vm.createContext(ctx);
for (const f of ['en', 'fr', 'it', 'de', 'media']) vm.runInContext(read(`content/${f}.js`), ctx, {filename: f});
const {LESSONS, MEDIA} = ctx.window;
const LANGS = ['en', 'fr', 'it', 'de'];

// 1) Dersler: dört dilde 30 ders, aynı başlık sırası, 8 kelime, 5 cümle.
const titles = LESSONS.en.map(l => l.t).join('|');
for (const lang of LANGS) {
  const L = LESSONS[lang];
  check(Array.isArray(L) && L.length === 30, `${lang}: 30 ders olmalı (${L?.length})`);
  check(L.map(l => l.t).join('|') === titles, `${lang}: ders başlıkları İngilizce ile aynı sırada olmalı`);
  L.forEach((l, i) => {
    const where = `${lang} ders ${i + 1}`;
    check(typeof l.n === 'string' && l.n.length > 10 && l.n.length <= 160, `${where}: ipucu 10–160 karakter olmalı`);
    check(l.w.length === 8, `${where}: 8 kelime olmalı`);
    check(l.p.length === 5, `${where}: 5 cümle olmalı`);
    [...l.w, ...l.p].forEach(x => check(x.length === 2 && x.every(s => typeof s === 'string' && s.trim()), `${where}: boş öğe var`));
    check(new Set(l.w.map(w => w[0])).size === 8, `${where}: tekrarlanan kelime var`);
    l.p.forEach(([s]) => {
      check(s.split(/\s+/).length >= 2, `${where}: cümle kurma için en az 2 kelime gerekli ("${s}")`);
      check(!/[<>]/.test(s), `${where}: cümlede HTML karakteri olmamalı`);
    });
  });
}

// 2) Kaynaklar: her dilde ses ve video; yalnızca https; tekrar yok.
for (const lang of LANGS) {
  const m = MEDIA[lang];
  check(m?.audio?.length >= 2 && m?.video?.length >= 2, `${lang}: en az 2 ses ve 2 video kaynağı olmalı`);
  const all = [...m.audio, ...m.video];
  all.forEach(r => check(/^https:\/\//.test(r.u) && r.n && r.d && r.c, `${lang}: eksik ya da https olmayan kaynak (${r.n})`));
  check(new Set(all.map(r => r.u)).size === all.length, `${lang}: tekrarlanan kaynak adresi var`);
}

// 3) Uygulama kabuğu: Service Worker'daki her dosya var olmalı.
const shell = read('sw.js').match(/APP_SHELL = \[(.*?)\]/s)[1].match(/'([^']+)'/g).map(s => s.slice(1, -1));
shell.filter(p => p !== './').forEach(p => check(existsSync(root + p.slice(2)), `sw.js: ${p} bulunamadı`));
['app.js', 'styles.css', 'content/media.js'].forEach(f => check(shell.includes('./' + f), `sw.js APP_SHELL ${f} içermeli`));

// 4) Güvenlik: CSP var, satır içi betik/stil yok, innerHTML kullanılmıyor, dış bağlantılar noopener.
const html = read('index.html'), app = read('app.js');
check(/http-equiv="Content-Security-Policy"/.test(html), 'index.html CSP içermeli');
check(!/<script>(?!\s*<\/script>)/.test(html) && !/<script(?![^>]*src=)[^>]*>/.test(html), 'index.html satır içi betik içermemeli');
check(!/\sstyle="/.test(html) && !/<style/.test(html), 'index.html satır içi stil içermemeli');
check(!/innerHTML/.test(app), 'app.js innerHTML kullanmamalı (XSS riski)');
(html.match(/<a [^>]*target="_blank"[^>]*>/g) || []).forEach(a => check(/rel="noopener noreferrer"/.test(a), `noopener eksik: ${a}`));
check((app.match(/target:'_blank'/g) || []).length === (app.match(/target:'_blank', rel:'noopener noreferrer'/g) || []).length, 'app.js: her _blank bağlantı noopener noreferrer almalı');

// 5) Korunan localStorage anahtarları kodda duruyor olmalı.
['dil-atlasi-active', 'dil-atlasi-timer', 'dil-atlasi-srs', 'da:${type}:${lang}:${date}'].forEach(k => check(app.includes(k), `app.js korunan anahtarı içermeli: ${k}`));
check(/const tasks = \['review', 'lesson', 'shadow', 'speak'\]/.test(app), 'görev kodları değişmemeli');

console.log(`${passes} kontrol geçti, ${fails} başarısız.`);
process.exit(fails ? 1 : 0);
