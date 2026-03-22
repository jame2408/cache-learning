/* ===== Cache Koans - Auto Scroll on Reveal ===== */
(function () {
  'use strict';

  const SCROLL_DELAY = 150;
  const BOTTOM_PAD = 80;
  const TOP_PAD = 60;

  function scrollToElement(el) {
    const rect = el.getBoundingClientRect();
    const absTop = rect.top + window.scrollY;
    const absBottom = rect.bottom + window.scrollY;
    const viewH = window.innerHeight;
    const threshold = viewH * 0.65;

    // If element bottom is below 65% of viewport or top is above viewport
    if (rect.bottom > threshold || rect.top < 0) {
      const targetY = absBottom - viewH + BOTTOM_PAD;
      const topY = absTop - TOP_PAD;
      const scrollTo = Math.max(0, Math.min(targetY, topY));
      window.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }
  }

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type !== 'attributes' || m.attributeName !== 'class') continue;
      const el = m.target;
      if (!el.classList.contains('visible')) continue;

      // For expanding elements (max-height transition), wait for transitionend
      if (el.offsetHeight < 30) {
        el.addEventListener('transitionend', function handler() {
          el.removeEventListener('transitionend', handler);
          setTimeout(() => scrollToElement(el), SCROLL_DELAY);
        });
      } else {
        setTimeout(() => scrollToElement(el), SCROLL_DELAY);
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
  });
})();
