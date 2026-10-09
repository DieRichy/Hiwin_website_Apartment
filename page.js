// Header menu and language picker for inner pages (the homepage uses script.js).
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const languageButton = document.querySelector('.language-trigger');
const languageOptions = document.querySelector('#language-options');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('open');menuButton.querySelector('.menu-symbol').textContent='＋';}
function closeLanguages(){languageOptions.hidden=true;languageButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);menuButton.querySelector('.menu-symbol').textContent=open?'−':'＋';});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
matchMedia('(min-width:1281px)').addEventListener('change',closeMenu);
languageButton.addEventListener('click',()=>{languageOptions.hidden=!languageOptions.hidden;languageButton.setAttribute('aria-expanded',String(!languageOptions.hidden));});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.language-selector'))closeLanguages();if(!e.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!languageOptions.hidden){closeLanguages();languageButton.focus();}else if(menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
// Osaka page on phones: dots under each swipeable row of property cards.
for (const row of document.querySelectorAll('.op-cards')) {
  const cards = [...row.querySelectorAll('.op-card')];
  if (cards.length < 2) continue;
  const dots = document.createElement('div');
  dots.className = 'op-dots';
  const buttons = cards.map(card => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', (card.querySelector('h4') || card.querySelector('span')).textContent);
    button.addEventListener('click', () => row.scrollTo({left: card.offsetLeft - cards[0].offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));
    dots.append(button);
    return button;
  });
  row.after(dots);
  const update = () => {
    const step = cards[1].offsetLeft - cards[0].offsetLeft || 1;
    const current = Math.min(cards.length - 1, Math.round(row.scrollLeft / step));
    buttons.forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
  };
  row.addEventListener('scroll', update, {passive: true});
  update();
}
// Osaka page building strip: drifts slowly and loops forever. The track holds the photos twice; when the
// scroll position passes one full set it jumps back by exactly that width, which looks seamless.
const strip = document.querySelector('.op-buildings');
if (strip) {
  const figures = strip.querySelector('.op-buildings-track').children;
  const half = figures.length / 2;
  const period = () => figures[half].offsetLeft - figures[0].offsetLeft;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const wrap = () => {
    const p = period();
    // Keep the position in (0, p]: past p jump back one set, at 0 jump forward one set.
    if (strip.scrollLeft > p) strip.scrollLeft -= p;
    else if (strip.scrollLeft <= 0) strip.scrollLeft += p;
  };
  strip.addEventListener('scroll', wrap, {passive: true});
  strip.scrollLeft = 1;
  for (const img of strip.querySelectorAll('img')) img.draggable = false;
  let paused = false, resume, carry = 0, last = performance.now();
  const pause = () => { paused = true; clearTimeout(resume); };
  const resumeLater = (ms) => { clearTimeout(resume); resume = setTimeout(() => { paused = false; }, ms); };
  strip.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') pause(); });
  strip.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') resumeLater(300); });
  strip.addEventListener('touchstart', pause, {passive: true});
  strip.addEventListener('touchend', () => resumeLater(2500), {passive: true});
  // Mouse drag on desktop (touch devices swipe natively).
  let dragX = null;
  strip.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dragX = e.clientX; strip.classList.add('dragging'); strip.setPointerCapture(e.pointerId); });
  strip.addEventListener('pointermove', e => { if (dragX === null) return; strip.scrollLeft -= e.clientX - dragX; dragX = e.clientX; });
  const endDrag = () => { dragX = null; strip.classList.remove('dragging'); };
  strip.addEventListener('pointerup', endDrag);
  strip.addEventListener('pointercancel', endDrag);
  const speed = () => (matchMedia('(max-width:760px)').matches ? 22 : 30); // px per second
  const tick = now => {
    const dt = Math.min(now - last, 100) / 1000; last = now;
    if (!paused && !still.matches && !document.hidden) {
      carry += speed() * dt;
      const step = Math.floor(carry);
      if (step) { strip.scrollLeft += step; carry -= step; }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
// Contact page on phones: WhatsApp / LINE / WeChat tabs show one group of QR cards at a time (CSS shows all
// groups on wider screens). LINE opens first for Japanese, Traditional Chinese and Thai, where it is the main chat app.
const chatGroups = document.querySelector('.cp-groups');
if (chatGroups) {
  const tabs = [...chatGroups.querySelectorAll('[role=tab]')];
  const select = (tab, focus) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-active', on);
    }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      const step = {ArrowRight: 1, ArrowLeft: -1}[e.key];
      if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
    });
  });
  const preferred = ['ja', 'zh-Hant', 'th'].includes(document.documentElement.lang) ? 'cp-tab-line' : 'cp-tab-whatsapp';
  select(document.getElementById(preferred));
  chatGroups.classList.add('cp-tabbed');
}
