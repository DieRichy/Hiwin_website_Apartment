// One-stop support dock (every page except the contact page): links to the contact page and can be
// minimised to a small button; the choice is remembered across pages. It sits bottom right and steps aside while
// the contact panel, which shows the same channels, is in view, and while it would cover the homepage hero's bottom
// strip: on wide screens while the hero fills the screen, on phones (where it shows from the first scroll) while
// the strip with the direct-booking link is at the bottom of the screen.
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
  // The back-to-top button sits above the dock, whose height changes when it is minimised and with the language.
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => document.body.style.setProperty('--dock-height', dock.offsetHeight+'px')).observe(dock);
  }
  if ('IntersectionObserver' in window) {
    const covering = new Set();
    const wide = matchMedia('(min-width:761px)');
    const hero = document.querySelector('.hero'), strip = hero?.querySelector('.hero-bottom');
    const update = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) covering.add(entry.target); else covering.delete(entry.target);
      }
      dock.classList.toggle('is-away', [...covering].some(target =>
        target === hero ? wide.matches : target === strip ? !wide.matches : true));
    };
    // The hero counts until its bottom edge rises above 40% of the screen height; the strip while it reaches
    // into the bottom 12% of the screen, where the dock sits on phones. The dock starts hidden on the homepage,
    // so it does not flash over the strip before the first check.
    if (hero) {
      dock.classList.add('is-away');
      new IntersectionObserver(update, {rootMargin: '-40% 0px -59% 0px'}).observe(hero);
      if (strip) new IntersectionObserver(update, {rootMargin: '-88% 0px 0px 0px'}).observe(strip);
      wide.addEventListener('change', () => update([]));
    }
    const panel = document.querySelector('.contact-panel');
    if (panel) new IntersectionObserver(update, {rootMargin: '0px 0px -12% 0px'}).observe(panel);
  }
}
// Back-to-top button, bottom right above the dock: appears once the visitor has scrolled past the first screen.
const toTop = document.querySelector('.to-top');
if (toTop) {
  const still = matchMedia('(prefers-reduced-motion:reduce)');
  const show = () => toTop.classList.toggle('is-shown', scrollY > innerHeight * 0.9);
  addEventListener('scroll', show, {passive: true});
  show();
  toTop.addEventListener('click', () => {
    scrollTo({top: 0, behavior: still.matches ? 'auto' : 'smooth'});
    // Keyboard users continue from the top of the page.
    document.querySelector('.site-header .brand')?.focus({preventScroll: true});
  });
}
