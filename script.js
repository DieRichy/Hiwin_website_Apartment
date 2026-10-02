const lang = document.documentElement.lang;
const ui = {en:{pause:'Pause video',play:'Play video'},ja:{pause:'動画を一時停止',play:'動画を再生'},'zh-Hant':{pause:'暫停影片',play:'播放影片'},ms:{pause:'Jeda video',play:'Mainkan video'},th:{pause:'หยุดวิดีโอชั่วคราว',play:'เล่นวิดีโอ'},id:{pause:'Jeda video',play:'Putar video'},fil:{pause:'I-pause ang video',play:'I-play ang video'}}[lang] || {pause:'Pause video',play:'Play video'};
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('open');menuButton.querySelector('.menu-symbol').textContent='＋';}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);menuButton.querySelector('.menu-symbol').textContent=open?'−':'＋';});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
matchMedia('(min-width:1281px)').addEventListener('change',closeMenu);
const languageButton=document.querySelector('.language-trigger');
const languageOptions=document.querySelector('#language-options');
function closeLanguages(){languageOptions.hidden=true;languageButton.setAttribute('aria-expanded','false');}
languageButton.addEventListener('click',()=>{if(languageOptions.hidden)languageReadingPosition=currentReadingPosition();languageOptions.hidden=!languageOptions.hidden;languageButton.setAttribute('aria-expanded',String(!languageOptions.hidden));});
let languageReadingPosition;
const languagePositionKey='hiwin-language-position-v2';
const readingBlocks=[...document.querySelectorAll('main > section, main .hero, main .about-copy, main .apartment-intro, main .section-heading, main .stats, main .coverage, main .gallery-heading, main .property-carousel, main .service-index, main .dining-intro, main .restaurant-grid, main .extras-heading, main .extras-grid, main .service-note, main .partner-models, main .process-heading, main .process, main .contact-panel, main footer')];
function currentReadingPosition(){
  const readingLine=document.querySelector('.site-header').getBoundingClientRect().bottom+16;
  let anchor=0,nearest=-Infinity;
  readingBlocks.forEach((block,index)=>{
    const rect=block.getBoundingClientRect();
    if(rect.height>0 && rect.top<=readingLine && rect.top>=nearest){anchor=index;nearest=rect.top;}
  });
  const block=readingBlocks[anchor];
  const rect=block.getBoundingClientRect();
  return {anchor,section:block.closest('section').id,progress:Math.max(0,Math.min(1,(readingLine-rect.top)/rect.height))};
}
for(const link of languageOptions.querySelectorAll('a'))link.addEventListener('click',event=>{
  const destination=new URL(link.href,location.href);
  if(destination.pathname===location.pathname){event.preventDefault();closeLanguages();return;}
  const position=languageReadingPosition || currentReadingPosition();
  // A stale fragment must never drive the browser's initial mobile scroll.
  destination.hash=position.section;
  try{
    sessionStorage.setItem(languagePositionKey,JSON.stringify({...position,pathname:destination.pathname}));
    destination.hash='';
  }catch{}
  link.href=destination.href;
});
function restoreLanguagePosition(){
  let position;
  try{
    position=JSON.parse(sessionStorage.getItem(languagePositionKey));
    sessionStorage.removeItem(languagePositionKey);
  }catch{return;}
  if(!position || position.pathname!==location.pathname || !Number.isInteger(position.anchor) || !Number.isFinite(position.progress))return;
  const block=readingBlocks[position.anchor];
  if(!block || block.closest('section').id!==position.section)return;
  let cancelled=false;
  const stop=()=>{cancelled=true;};
  const interactionEvents=['pointerdown','touchstart','wheel','keydown'];
  interactionEvents.forEach(name=>window.addEventListener(name,stop,{passive:true,once:true}));
  const root=document.documentElement;
  const previousBehavior=root.style.scrollBehavior;
  const previousAnchor=root.style.overflowAnchor;
  const previousRestoration=history.scrollRestoration;
  history.scrollRestoration='manual';
  root.style.scrollBehavior='auto';
  root.style.overflowAnchor='none';
  const restore=()=>{
    if(cancelled)return;
    const rect=block.getBoundingClientRect();
    const readingLine=document.querySelector('.site-header').getBoundingClientRect().bottom+16;
    window.scrollTo({top:Math.max(0,window.scrollY+rect.top+Math.max(0,Math.min(1,position.progress))*rect.height-readingLine),behavior:'auto'});
  };
  requestAnimationFrame(restore);
  const loaded=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));
  Promise.all([loaded,document.fonts?.ready || Promise.resolve()]).then(()=>requestAnimationFrame(()=>{
    restore();
    root.style.scrollBehavior=previousBehavior;
    root.style.overflowAnchor=previousAnchor;
    history.scrollRestoration=previousRestoration;
    interactionEvents.forEach(name=>window.removeEventListener(name,stop));
  }));
}
restoreLanguagePosition();
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.language-selector'))closeLanguages();if(!e.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!languageOptions.hidden){closeLanguages();languageButton.focus();}else if(menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)for(const link of navigation.querySelectorAll('a')){const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}},{rootMargin:'-20% 0px -60% 0px'});document.querySelectorAll('main > section').forEach(s=>observer.observe(s));}
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
if(!reduced.matches && 'IntersectionObserver' in window){const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.remove('pending');reveal.unobserve(entry.target);}},{threshold:0.08});document.querySelectorAll('.about-copy,.section-heading,.stats,.coverage,.gallery-heading,.dining-intro,.extras-heading,.partner-models,.process-heading,.contact-panel').forEach(el=>{el.classList.add('reveal','pending');reveal.observe(el);});}
const video=document.querySelector('.hero-video');
const motion=document.querySelector('.motion-toggle');
const mobile=matchMedia('(max-width:760px)');
const scenes=[...document.querySelectorAll('.scene')];
const sceneButtons=[...document.querySelectorAll('[data-scene]')];
const slideUI={en:{pause:'Pause slideshow',play:'Play slideshow'},ja:{pause:'スライドを一時停止',play:'スライドを再生'},'zh-Hant':{pause:'暫停輪播',play:'播放輪播'},ms:{pause:'Jeda tayangan slaid',play:'Mainkan tayangan slaid'},th:{pause:'หยุดภาพสไลด์ชั่วคราว',play:'เล่นภาพสไลด์'},id:{pause:'Jeda tayangan slide',play:'Putar tayangan slide'},fil:{pause:'I-pause ang slideshow',play:'I-play ang slideshow'}}[lang] || {pause:'Pause slideshow',play:'Play slideshow'};
let paused=reduced.matches||Boolean(navigator.connection?.saveData), index=0,timer;
function motionLabel(){const playing=mobile.matches?Boolean(timer):!video.paused;const labels=mobile.matches?slideUI:ui;motion.querySelector('.motion-label').textContent=playing?labels.pause:labels.play;motion.querySelector('span').textContent=playing?'Ⅱ':'▶';motion.setAttribute('aria-pressed',String(playing));}
function showScene(n){index=(n+scenes.length)%scenes.length;scenes.forEach((s,i)=>s.classList.toggle('current',i===index));sceneButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
function stopSlides(){clearInterval(timer);timer=undefined;}
function play(){if(mobile.matches){video.pause();stopSlides();timer=setInterval(()=>showScene(index+1),5500);motionLabel();}else{stopSlides();if(!video.src){video.src=video.dataset.videoSrc;video.load();}video.play().catch(motionLabel);}}
function pause(){stopSlides();video.pause();motionLabel();}
video.addEventListener('playing',()=>{video.classList.add('ready');motionLabel();});video.addEventListener('pause',motionLabel);video.addEventListener('error',()=>{video.classList.remove('ready');motion.hidden=!mobile.matches;});
motion.addEventListener('click',()=>{const playing=mobile.matches?Boolean(timer):!video.paused;paused=playing;if(playing)pause();else play();});
sceneButtons.forEach(b=>b.addEventListener('click',()=>{showScene(Number(b.dataset.scene));paused=true;pause();}));
let touchStart;
const hero=document.querySelector('.hero');
hero.addEventListener('touchstart',e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
hero.addEventListener('touchend',e=>{if(!mobile.matches||!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){showScene(index+(dx<0?1:-1));paused=true;pause();}touchStart=undefined;},{passive:true});
motionLabel();if(!paused)play();
mobile.addEventListener('change',()=>{pause();motion.hidden=false;if(!paused)play();motionLabel();});
reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;pause();document.querySelectorAll('.reveal.pending').forEach(el=>el.classList.remove('pending'));}});
if('IntersectionObserver' in window){const mediaObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)pause();else if(!paused)play();}},{threshold:0.05});mediaObserver.observe(hero);}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(!paused)play();});

const propertyGallery=document.querySelector('#property-gallery');
const propertyPrev=document.querySelector('.property-prev');
const propertyNext=document.querySelector('.property-next');
function updatePropertyArrows(){propertyPrev.disabled=propertyGallery.scrollLeft<=2;propertyNext.disabled=propertyGallery.scrollLeft+propertyGallery.clientWidth>=propertyGallery.scrollWidth-2;}
function shiftProperty(direction){const cards=[...propertyGallery.querySelectorAll('figure')];const positions=cards.map(card=>card.offsetLeft-cards[0].offsetLeft);const current=propertyGallery.scrollLeft;let target;if(direction>0)target=positions.find(position=>position>current+5)??propertyGallery.scrollWidth;else target=[...positions].reverse().find(position=>position<current-5)??0;propertyGallery.scrollTo({left:target,behavior:reduced.matches?'auto':'smooth'});}
propertyPrev.addEventListener('click',()=>shiftProperty(-1));propertyNext.addEventListener('click',()=>shiftProperty(1));propertyGallery.addEventListener('scroll',updatePropertyArrows,{passive:true});window.addEventListener('resize',updatePropertyArrows);updatePropertyArrows();
