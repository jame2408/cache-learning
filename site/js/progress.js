/* ===== Cache Koans - Progress Navigation ===== */
(function () {
  'use strict';

  const KOAN_ORDER = [
    'index',
    '01-what-is-cache',
    '02-cache-hit-miss',
    '03-cache-aside',
    '04-read-through',
    '05-write-strategies',
    '06-write-through',
    '07-write-behind',
    '08-write-around',
    '09-ttl',
    '10-invalidation',
    '11-cache-stampede',
    '12-cache-penetration',
    '13-cache-breakdown',
    '14-cache-avalanche',
    '15-eviction-lru',
    '16-eviction-lfu-fifo',
    '17-memory-pressure',
    '18-local-vs-distributed',
    '19-consistency',
    '20-partitioning',
    '21-cache-security',
    '22-hot-key',
    '23-concurrency',
    '24-cache-patterns',
    '25-real-world'
  ];

  function getCurrentIdx() {
    const path = location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    const idx = KOAN_ORDER.indexOf(filename);
    return idx >= 0 ? idx : 0;
  }

  function getHref(idx) {
    if (idx < 0 || idx >= KOAN_ORDER.length) return null;
    const name = KOAN_ORDER[idx];
    if (name === 'index') {
      const path = location.pathname;
      return path.includes('/koans/') ? '../index.html' : 'index.html';
    }
    const path = location.pathname;
    const prefix = path.includes('/koans/') ? '' : 'koans/';
    return `${prefix}${name}.html`;
  }

  function buildNav() {
    const currentIdx = getCurrentIdx();
    const nav = document.createElement('nav');
    nav.className = 'progress-nav';

    // Prev arrow
    const prev = document.createElement('button');
    prev.className = 'nav-arrow' + (currentIdx <= 0 ? ' disabled' : '');
    prev.innerHTML = '&#8592;';
    prev.title = 'Previous';
    if (currentIdx > 0) {
      prev.onclick = () => { location.href = getHref(currentIdx - 1); };
    }
    nav.appendChild(prev);

    // Dots
    const dots = document.createElement('div');
    dots.className = 'nav-dots';
    // Skip index (0), show koans 1..N
    for (let k = 1; k < KOAN_ORDER.length; k++) {
      const dot = document.createElement('button');
      dot.className = 'nav-dot';
      dot.title = KOAN_ORDER[k];
      if (k <= currentIdx) dot.classList.add('reached');
      if (k === currentIdx) dot.classList.add('current');
      dot.onclick = () => { location.href = getHref(k); };
      dots.appendChild(dot);
    }
    nav.appendChild(dots);

    // Separator
    const sep = document.createElement('div');
    sep.className = 'nav-separator';
    nav.appendChild(sep);

    // Language toggle
    const langBtn = document.createElement('button');
    langBtn.className = 'nav-lang-btn';
    const savedLang = localStorage.getItem('cache-koans-lang') || 'zh-TW';
    langBtn.textContent = savedLang === 'zh-TW' ? 'EN' : '中文';
    langBtn.onclick = () => {
      if (window.I18n) window.I18n.toggleLang();
    };
    nav.appendChild(langBtn);

    // Next arrow
    const next = document.createElement('button');
    next.className = 'nav-arrow' + (currentIdx >= KOAN_ORDER.length - 1 ? ' disabled' : '');
    next.innerHTML = '&#8594;';
    next.title = 'Next';
    if (currentIdx < KOAN_ORDER.length - 1) {
      next.onclick = () => { location.href = getHref(currentIdx + 1); };
    }
    nav.appendChild(next);

    document.body.appendChild(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }

  window.KoanProgress = { KOAN_ORDER, getCurrentIdx, getHref };
})();
