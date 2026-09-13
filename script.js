const qs=(s,c=document)=>c.querySelector(s),qsa=(s,c=document)=>[...c.querySelectorAll(s)];

// Forma Arquitetura — projeto em destaque no portfólio.
// Inserido via JS para preservar a estrutura visual existente sem reescrever o layout-base.
(()=>{
  const cases=qs('.cases');
  if(cases&&!qs('#forma-arquitetura',cases)){
    const forma=document.createElement('article');
    forma.id='forma-arquitetura';
    forma.className='case case-forma';
    forma.style.setProperty('--case-accent','#b87552');
    forma.setAttribute('data-reveal','');
    forma.setAttribute('data-case','');
    forma.innerHTML=`<a class="case-media" href="./forma-arquitetura/" target="_blank" rel="noopener"><div class="case-topline"><span>02 / ARQUITETURA</span><span>PORTFÓLIO INSTITUCIONAL</span></div><img src="https://images.pexels.com/photos/13752348/pexels-photo-13752348.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="Projeto Forma Arquitetura — site institucional e portfólio para arquitetura" width="1440" height="900" loading="lazy" decoding="async"><span class="case-open">Abrir projeto <i>↗︎</i></span></a><div class="case-info"><div class="case-heading"><span>02</span><h3>Forma Arquitetura</h3></div><p>Site institucional e portfólio com direção editorial, projetos em destaque, processo de trabalho e experiência responsiva pensada para escritórios de arquitetura.</p><a class="case-cta" href="./forma-arquitetura/" target="_blank" rel="noopener" aria-label="Ver projeto Forma Arquitetura ao vivo"><span>VER SITE</span><i>↗︎</i></a><dl><div><dt>FOCO</dt><dd>Portfólio + autoridade</dd></div><div><dt>STACK</dt><dd>HTML / CSS / JS</dd></div><div><dt>EXPERIÊNCIA</dt><dd>Editorial + responsiva</dd></div></dl></div>`;
    const firstCase=qs('.case',cases);
    if(firstCase)firstCase.insertAdjacentElement('afterend',forma);else cases.appendChild(forma);

    qsa('.case',cases).forEach((card,i)=>{
      const n=String(i+1).padStart(2,'0');
      const heading=qs('.case-heading > span',card);if(heading)heading.textContent=n;
      const top=qs('.case-topline > span:first-child',card);
      if(top){const label=(top.textContent.split('/')[1]||'').trim();top.textContent=`${n} / ${label}`;}
    });
  }
  const proof=qs('.hero-proof > div:first-child b');if(proof)proof.textContent='06';
  const stageCount=qs('.stage-index b');if(stageCount)stageCount.textContent='01—06';
})();

const nav=qs('[data-nav]'),menu=qs('.menu'),panel=qs('.mobile-panel'),progress=qs('.scroll-progress span'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches,pageRegions=qsa('main,footer'),ioSupported='IntersectionObserver'in window;
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
if(reduce||!ioSupported){revealEls.forEach(el=>el.classList.add('visible'))}else{const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5%'});revealEls.forEach((el,i)=>{el.style.transitionDelay=`${Math.min((i%4)*55,165)}ms`;revealObserver.observe(el)})}

if(ioSupported){
  const sectionLinks=new Map(qsa('.nav-links a').map(a=>[a.getAttribute('href')?.slice(1),a]));
  const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){qsa('.nav-links a').forEach(a=>{a.classList.remove('active');a.removeAttribute('aria-current')});const active=sectionLinks.get(entry.target.id);active?.classList.add('active');active?.setAttribute('aria-current','location')}}),{rootMargin:'-35% 0px -55%',threshold:0});
  qsa('[data-section][id]').forEach(s=>sectionObserver.observe(s));
}

const process=qs('.process');
if(process){if(!ioSupported||reduce)process.classList.add('in-view');else{const po=new IntersectionObserver(([e])=>{if(e.isIntersecting){process.classList.add('in-view');po.disconnect()}},{threshold:.25});po.observe(process)}}

if(fine&&!reduce){
  document.addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--pointer-x',`${e.clientX}px`);document.documentElement.style.setProperty('--pointer-y',`${e.clientY}px`)},{passive:true});
  qsa('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate3d(${x*.08}px,${y*.12}px,0)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
  const stage=qs('.hero-stage');if(stage){const depthEls=qsa('[data-depth]',stage);stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;depthEls.forEach(el=>{const d=Number(el.dataset.depth||.3);el.style.translate=`${nx*18*d}px ${ny*14*d}px`})});stage.addEventListener('pointerleave',()=>depthEls.forEach(el=>el.style.translate='0 0'))}
  qsa('[data-case] .case-media').forEach(media=>{const img=qs('img',media);if(!img)return;media.addEventListener('pointermove',e=>{const r=media.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;img.style.translate=`${nx*-8}px ${ny*-5}px`});media.addEventListener('pointerleave',()=>img.style.translate='0 0')});
}

qsa('.faq-list details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)qsa('.faq-list details').forEach(other=>{if(other!==d)other.open=false})}));
const year=qs('#year');if(year)year.textContent=new Date().getFullYear();
qs('#leadForm')?.addEventListener('submit',e=>{e.preventDefault();const name=qs('#name')?.value.trim()||'',type=qs('#type')?.value||'',msg=qs('#message')?.value.trim()||'';const text=`Olá Yagho, vim pelo seu site.\n\nMeu nome: ${name}\nTipo de negócio: ${type}\n\nProjeto: ${msg}`;window.open(`https://wa.me/5553999563554?text=${encodeURIComponent(text)}`,'_blank','noopener')});

// Letreiro final: rolagem horizontal real do contêiner, independente de transform/CSS e confiável no Safari/iPhone.
const contactMarquee=qs('.contact-marquee'),contactTrack=qs('.contact-track');
if(contactMarquee&&contactTrack){
  contactTrack.style.setProperty('animation','none','important');
  contactTrack.style.setProperty('transform','none','important');
  let marqueeOffset=0,marqueeLast=0,loopWidth=0;
  const measureMarquee=()=>{loopWidth=contactTrack.scrollWidth/2};
  const runMarquee=now=>{
    if(!marqueeLast)marqueeLast=now;
    const dt=Math.min((now-marqueeLast)/1000,.05);
    marqueeLast=now;
    const speed=innerWidth<=720?72:48;
    if(loopWidth>0){
      marqueeOffset=(marqueeOffset+speed*dt)%loopWidth;
      contactMarquee.scrollLeft=marqueeOffset;
    }
    requestAnimationFrame(runMarquee);
  };
  measureMarquee();
  if('ResizeObserver' in window)new ResizeObserver(measureMarquee).observe(contactTrack);else addEventListener('resize',measureMarquee,{passive:true});
  requestAnimationFrame(runMarquee);
}

// No celular, o ticker superior fica estático e legível para evitar cortes no Safari/iPhone.
const topTicker=qs('.ticker');
if(topTicker){
  topTicker.classList.add('mobile-static-ticker');
  const tickerStyle=document.createElement('style');
  tickerStyle.textContent=`@media(max-width:720px){.ticker.mobile-static-ticker{padding:0 14px}.ticker.mobile-static-ticker::before,.ticker.mobile-static-ticker::after{display:none}.ticker.mobile-static-ticker .ticker-track{animation:none!important;transform:none!important;width:100%;justify-content:space-between;gap:8px;font-size:7px;letter-spacing:.055em;will-change:auto}.ticker.mobile-static-ticker .ticker-track i{margin:0}.ticker.mobile-static-ticker .ticker-track>:nth-child(n+7){display:none}}`;
  document.head.appendChild(tickerStyle);
}
