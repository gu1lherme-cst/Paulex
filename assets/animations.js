/* ==========================================================================
   Paulex Advanced — animations.js
   Optional, lightweight micro-interactions. Loaded only when
   "Revelar ao rolar" is enabled. Respects prefers-reduced-motion.
   Scroll reveals themselves are handled in theme.js; this layer adds
   subtle parallax to the hero composition only.
   ========================================================================== */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.px-hero__scene');
  if (!hero) return;

  const tiles = Array.from(hero.querySelectorAll('.px-hero__tile'));
  if (!tiles.length) return;

  let raf = null;
  const onMove = (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      tiles.forEach((tile, i) => {
        const depth = (i % 3 + 1) * 4;
        tile.style.transform = 'translate3d(' + (cx * depth) + 'px,' + (cy * depth) + 'px,0)';
      });
      raf = null;
    });
  };
  const reset = () => tiles.forEach((t) => { t.style.transform = ''; });

  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseleave', reset);
})();
