// One-stop support dock (every page except the contact page): links to the contact page and can be
// minimised to a small button; the choice is remembered across pages. It steps aside while the homepage
// hero fills the screen and while the contact panel, which shows the same channels, is in view.
// On phones it is a small icons-only button (CSS) that slides away while the visitor scrolls down.
const dock = document.querySelector('.support-dock');
if (dock) {
  const key = 'hiwin-support-collapsed';
  try { dock.classList.toggle('is-collapsed', localStorage.getItem(key) === '1'); } catch {}
  const setCollapsed = collapsed => {
    dock.classList.toggle('is-collapsed', collapsed);
    try { if (collapsed) localStorage.setItem(key, '1'); else localStorage.removeItem(key); } catch {}
    dock.querySelector(collapsed ? '.support-show' : '.support-link').focus();
  };
  dock.querySelector('.support-hide').addEventListener('click', () => setCollapsed(true));
  dock.querySelector('.support-show').addEventListener('click', () => setCollapsed(false));
  const phone = matchMedia('(max-width:760px)');
  let lastY = scrollY, ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY, delta = y - lastY;
      // Ignore tiny movements so the button does not flicker; any real scroll up brings it back.
      if (Math.abs(delta) > 6) {
        dock.classList.toggle('is-tucked', phone.matches && delta > 0 && y > 120);
        lastY = y;
      }
      ticking = false;
    });
  }, {passive: true});
  if ('IntersectionObserver' in window) {
    const covering = new Set();
    const update = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) covering.add(entry.target); else covering.delete(entry.target);
      }
      dock.classList.toggle('is-away', covering.size > 0);
    };
    // The hero counts until its bottom edge rises above 40% of the screen height.
    // It starts hidden there, so it does not flash over the hero's bottom strip before the first check.
    const hero = document.querySelector('.hero');
    if (hero) {
      dock.classList.add('is-away');
      new IntersectionObserver(update, {rootMargin: '-40% 0px -59% 0px'}).observe(hero);
    }
    const panel = document.querySelector('.contact-panel');
    if (panel) new IntersectionObserver(update, {rootMargin: '0px 0px -12% 0px'}).observe(panel);
  }
}
