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
