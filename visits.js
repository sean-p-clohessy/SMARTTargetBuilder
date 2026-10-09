// Request once per page load. Loading the image records a hit; never poll it.
(() => {
  if (location.hostname !== 'sean-p-clohessy.github.io' ||
      !(location.pathname === '/SMARTTargetBuilder' || location.pathname.startsWith('/SMARTTargetBuilder/'))) return;
  const counter = document.querySelector('[data-visits]');
  const badge = document.querySelector('[data-visits-badge]');
  if (!counter || !badge) return;
  badge.addEventListener('load', () => { counter.hidden = false; }, { once: true });
  badge.addEventListener('error', () => { counter.hidden = true; }, { once: true });
  badge.src = 'https://hits.sh/sean-p-clohessy.github.io/SMARTTargetBuilder.svg?label=Visits&color=6950d8&labelColor=201946';
})();
