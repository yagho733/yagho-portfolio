const qs=(s,c=document)=>c.querySelector(s),qsa=(s,c=document)=>[...c.querySelectorAll(s)];
const nav=qs('[data-nav]'),menu=qs('.menu'),panel=qs('.mobile-panel'),progress=qs('.scroll-progress span'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches,pageRegions=qsa('main,footer');
requestAnimationFrame(()=>document.body.classList.add('ready'));

const setPageInert=open=>pageRegions.forEach(region=>{if('inert' in region)region.inert=open});
const closeMenu=()=>{nav?.classList.remove('open');document.body.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Abrir menu');panel?.setAttribute('aria-hidden','true');setPageInert(false)};
menu?.addEventListener('click',()=>{const open=!nav?.classList.contains('open');nav?.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');panel?.setAttribute('aria-hidden',String(!open));setPageInert(open)});
qsa('.mobile-panel a,.nav-links a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
addEventListener('resize',()=>{if(innerWidth>1120&&nav?.classList.contains('open'))closeMenu()},{passive:true});

let scrollTick=false;
const updateScroll=()=>{const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;nav?.classList.toggle('scrolled',y>18);if(progress)progress.style.transform=`scaleX(${max>0?Math.min(1,y/max):0})`;scrollTick=false};
addEventListener('scroll',()=>{if(!scrollTick){scrollTick=true;requestAnimationFrame(updateScroll)}},{passive:true});
updateScroll();

const revealEls=qsa('[data-reveal]');
if(reduce){revealEls.forEach(el=>el.classList.add('visible'))}else{const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5%'});revealEls.forEach((el,i)=>{el.style.transitionDelay=`${Math.min((i%4)*55,165)}ms`;revealObserver.observe(el)})}

const sectionLinks=new Map(qsa('.nav-links a').map(a=>[a.getAttribute('href')?.slice(1),a]));
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){qsa('.nav-links a').forEach(a=>{a.classList.remove('active');a.removeAttribute('aria-current')});const active=sectionLinks.get(entry.target.id);active?.classList.add('active');active?.setAttribute('aria-current','page')}}),{rootMargin:'-35% 0px -55%',threshold:0});
qsa('[data-section][id]').forEach(s=>sectionObserver.observe(s));

const process=qs('.process');
if(process){const po=new IntersectionObserver(([e])=>{if(e.isIntersecting){process.classList.add('in-view');po.disconnect()}},{threshold:.25});po.observe(process)}

if(fine&&!reduce){
  document.addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--pointer-x',`${e.clientX}px`);document.documentElement.style.setProperty('--pointer-y',`${e.clientY}px`)},{passive:true});
  qsa('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate3d(${x*.08}px,${y*.12}px,0)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
  const stage=qs('.hero-stage');if(stage){const depthEls=qsa('[data-depth]',stage);stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;depthEls.forEach(el=>{const d=Number(el.dataset.depth||.3);el.style.translate=`${nx*18*d}px ${ny*14*d}px`})});stage.addEventListener('pointerleave',()=>depthEls.forEach(el=>el.style.translate='0 0'))}
  qsa('[data-case] .case-media').forEach(media=>{const img=qs('img',media);if(!img)return;media.addEventListener('pointermove',e=>{const r=media.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;img.style.translate=`${nx*-8}px ${ny*-5}px`});media.addEventListener('pointerleave',()=>img.style.translate='0 0')});
}

qsa('.faq-list details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)qsa('.faq-list details').forEach(other=>{if(other!==d)other.open=false})}));
const year=qs('#year');if(year)year.textContent=new Date().getFullYear();
qs('#leadForm')?.addEventListener('submit',e=>{e.preventDefault();const name=qs('#name')?.value.trim()||'',type=qs('#type')?.value||'',msg=qs('#message')?.value.trim()||'';const text=`Olá Yagho, vim pelo seu site.\n\nMeu nome: ${name}\nTipo de negócio: ${type}\n\nProjeto: ${msg}`;window.open(`https://wa.me/5553999563554?text=${encodeURIComponent(text)}`,'_blank','noopener')});

// Loop contínuo do letreiro de contato sem desrespeitar a preferência de reduzir movimento.
const contactTrack=qs('.contact-track');
if(contactTrack&&!reduce){
  contactTrack.style.setProperty('animation','none','important');
  let marqueeOffset=0,marqueeLast=0,marqueeWidth=0;
  const measureMarquee=()=>{marqueeWidth=contactTrack.scrollWidth/2};
  measureMarquee();
  if('ResizeObserver' in window)new ResizeObserver(measureMarquee).observe(contactTrack);else addEventListener('resize',measureMarquee,{passive:true});
  const runMarquee=now=>{if(!marqueeLast)marqueeLast=now;const dt=Math.min((now-marqueeLast)/1000,.05);marqueeLast=now;const speed=innerWidth<=720?44:32;if(marqueeWidth>0){marqueeOffset=(marqueeOffset+speed*dt)%marqueeWidth;contactTrack.style.setProperty('transform',`translate3d(${-marqueeOffset}px,0,0)`,'important')}requestAnimationFrame(runMarquee)};
  requestAnimationFrame(runMarquee);
}

// No celular, o ticker superior fica estático para preservar cada rótulo inteiro no Safari/iPhone.
const topTicker=qs('.ticker');
if(topTicker){
  topTicker.classList.add('mobile-static-ticker');
  const tickerStyle=document.createElement('style');
  tickerStyle.textContent=`@media(max-width:720px){.ticker.mobile-static-ticker{padding:0 14px}.ticker.mobile-static-ticker::before,.ticker.mobile-static-ticker::after{display:none}.ticker.mobile-static-ticker .ticker-track{animation:none!important;transform:none!important;width:100%;justify-content:space-between;gap:6px;font-size:6.4px;letter-spacing:.06em;will-change:auto}.ticker.mobile-static-ticker .ticker-track i{margin:0}.ticker.mobile-static-ticker .ticker-track>:nth-child(n+8){display:none}}`;
  document.head.appendChild(tickerStyle);
}
