/* ===== Cache Koans - i18n Module ===== */
(function () {
  'use strict';

  const SUPPORTED = ['en', 'zh-TW'];
  const DEFAULT = 'zh-TW';
  let translations = {};
  let currentLang = DEFAULT;

  function detectLang() {
    const saved = localStorage.getItem('cache-koans-lang');
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = navigator.language || navigator.userLanguage || '';
    if (nav.startsWith('zh')) return 'zh-TW';
    return 'en';
  }

  async function loadTranslations(lang) {
    const base = getBasePath();
    try {
      const resp = await fetch(`${base}i18n/${lang}.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (e) {
      console.warn(`[i18n] Failed to load ${lang}:`, e);
      return {};
    }
  }

  function getBasePath() {
    const path = location.pathname;
    if (path.includes('/koans/')) {
      return '../';
    }
    return '';
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = translations[key];
      if (text) {
        if (el.tagName === 'INPUT' && el.type !== 'submit') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const text = translations[key];
      if (text) el.innerHTML = text;
    });
    document.documentElement.lang = currentLang;
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('cache-koans-lang', lang);
    translations = await loadTranslations(lang);
    applyTranslations();
    // Update lang button text
    const btn = document.querySelector('.nav-lang-btn');
    if (btn) btn.textContent = lang === 'zh-TW' ? 'EN' : '中文';
  }

  function toggleLang() {
    const next = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    setLang(next);
  }

  async function init() {
    currentLang = detectLang();
    translations = await loadTranslations(currentLang);
    applyTranslations();
  }

  // Expose global API
  window.I18n = { init, setLang, toggleLang, t: (key) => translations[key] || key };

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
