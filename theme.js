'use strict';
// Tema, sayfa çizilmeden önce uygulanır (açılışta renk yanıp sönmesin): dil-atlasi-tema = 'light' | 'dark', yoksa sistem.
// CSP satır içi betiğe izin vermediği için ayrı dosya; <head> içinde, styles.css'ten sonra yüklenir.
(function () {
  var t = null; try { t = localStorage.getItem('dil-atlasi-tema'); } catch (e) {}
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  var light = t === 'light' || (t !== 'dark' && window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
  var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', light ? '#f5f6f8' : '#0a0d13');
})();
