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
