const qs=(s,c=document)=>c.querySelector(s);
const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
const cfg=window.AVELAR_CONFIG||{};
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData=navigator.connection?.saveData===true;

function applyConfig(){
  qsa('[data-config-email]').forEach(el=>{
    el.textContent=cfg.email||'';
    if(el.tagName==='A') el.href=`mailto:${cfg.email||''}`;
  });
  qsa('[data-config-city]').forEach(el=>el.textContent=[cfg.city,cfg.state].filter(Boolean).join(' · '));
  qsa('[data-config-address]').forEach(el=>el.textContent=cfg.address||'');
  qsa('[data-whatsapp-link]').forEach(el=>{
    const msg=el.dataset.message||'Olá, vim pelo site e gostaria de falar sobre uma demanda.';
    el.href=`https://wa.me/${cfg.whatsapp||''}?text=${encodeURIComponent(msg)}`;
  });
}

function initMenu(){
  const header=qs('[data-header]');
  const progress=qs('.progress span');
  const button=qs('[data-menu-button]');
  const menu=qs('[data-mobile-menu]');
  const close=()=>{
    menu?.classList.remove('open');
    menu?.setAttribute('aria-hidden','true');
    button?.setAttribute('aria-expanded','false');
    button?.classList.remove('active');
  };
  button?.addEventListener('click',()=>{
    const open=menu.classList.toggle('open');
    menu.setAttribute('aria-hidden',String(!open));
    button.setAttribute('aria-expanded',String(open));
    button.classList.toggle('active',open);
  });
  qsa('.mobile-menu a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  const update=()=>{
    const y=scrollY;
    const max=document.documentElement.scrollHeight-innerHeight;
    header?.classList.toggle('scrolled',y>18);
    if(progress)progress.style.transform=`scaleX(${max>0?y/max:0})`;
  };
  addEventListener('scroll',update,{passive:true});
  update();
}

function initScrollSpy(){
  const links=qsa('.desktop-nav a[href^="#"]');
  if(!links.length||!('IntersectionObserver'in window))return;
  const sections=links.map(a=>qs(a.getAttribute('href'))).filter(Boolean);
  if(!sections.length)return;
  const setActive=id=>links.forEach(a=>{
    if(a.getAttribute('href')===`#${id}`)a.setAttribute('aria-current','true');
    else a.removeAttribute('aria-current');
  });
  const io=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    if(visible[0])setActive(visible[0].target.id);
  },{rootMargin:'-45% 0px -45% 0px',threshold:[0,.25,.5,.75,1]});
  sections.forEach(s=>io.observe(s));
}

function initVideos(){
  const videos=qsa('video[data-video-src]');
  const hero=qs('.hero-video');
  const closing=qs('.closing-video');
  if(closing&&hero)closing.dataset.videoSrc=hero.dataset.videoSrc;

  const containerOf=v=>v.closest('.hero-video-wrap,.closing-media');
  const show=v=>{
    v.hidden=false;
    v.classList.add('media-ready');
    containerOf(v)?.classList.remove('media-error');
  };
  const fail=v=>{
    v.hidden=true;
    v.classList.remove('media-ready');
    containerOf(v)?.classList.add('media-error');
    try{v.pause();}catch{}
  };

  // Desktop and mobile use exactly the same media source and behavior.
  videos.forEach(v=>{
    v.hidden=true;
    v.muted=true;
    v.loop=true;
    v.playsInline=true;
    v.setAttribute('muted','');
    v.setAttribute('loop','');
    v.setAttribute('playsinline','');
    v.addEventListener('loadeddata',()=>show(v),{once:true});
    v.addEventListener('canplay',()=>show(v),{once:true});
    v.addEventListener('error',()=>fail(v));
  });

  const load=v=>{
    if(v.dataset.loaded==='true')return;
    v.src=v.dataset.videoSrc;
    v.dataset.loaded='true';
    v.load();
  };
  const play=v=>{
    load(v);
    const attempt=()=>v.play()?.catch?.(()=>{});
    if(v.readyState>=2){show(v);attempt();}
    else v.addEventListener('canplay',attempt,{once:true});
  };

  if(hero)play(hero);

  const lazyVideos=videos.filter(v=>v!==hero);
  if(!('IntersectionObserver'in window)){
    lazyVideos.forEach(play);
  }else{
    const io=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
      if(isIntersecting)play(target);
      else if(target.dataset.loaded==='true')target.pause();
    }),{rootMargin:'300px 0px',threshold:.02});
    lazyVideos.forEach(v=>io.observe(v));
  }

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){videos.forEach(v=>v.pause());return;}
    if(hero)play(hero);
  });
}
function initRevealFallback(){
  const items=qsa('[data-reveal]');
  qsa('.hero-line > span').forEach(el=>el.style.transform='none');
  if(!('IntersectionObserver'in window)){items.forEach(el=>{el.style.opacity='1';el.style.transform='none';});return;}
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity='1';entry.target.style.transform='none';io.unobserve(entry.target);
    }
  }),{threshold:.08,rootMargin:'0px 0px -5%'});
  items.forEach(el=>{el.style.transition='opacity .7s var(--ease), transform .7s var(--ease)';io.observe(el);});
}

function initLenis(){
  if(!window.Lenis||reduce)return;
  const lenis=new Lenis({duration:1.05,smoothWheel:true,wheelMultiplier:.92,touchMultiplier:1.02,lerp:.085});
  const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
  qsa('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const href=a.getAttribute('href'), target=href&&qs(href);
    if(!target)return;
    e.preventDefault();lenis.scrollTo(target,{offset:-72,duration:1});
  }));
}

function initGsap(){
  if(!window.gsap||!window.ScrollTrigger||reduce)return;
  try{
    document.documentElement.classList.add('motion-ready');
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('.hero-line > span',{yPercent:105,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:1.05,ease:'power3.out',stagger:.08,delay:.06,clearProps:'transform,opacity,visibility'});
    gsap.utils.toArray('[data-reveal]').forEach(el=>gsap.fromTo(el,{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:.75,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true},clearProps:'transform,opacity,visibility'}));
    if(qs('[data-image-parallax] img'))gsap.to('[data-image-parallax] img',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.image-break',start:'top bottom',end:'bottom top',scrub:true}});
    const track=qs('[data-horizontal-track]');
    if(track&&innerWidth>1120){
      const progress=qs('[data-horizontal-progress]');
      const dist=()=>Math.max(0,track.scrollWidth-innerWidth);
      gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.horizontal-pin',start:'top top',end:()=>`+=${dist()+innerHeight*.55}`,pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:s=>{if(progress)progress.style.transform=`scaleX(${s.progress})`;}}});
    }
    if(qs('.closing-video'))gsap.to('.closing-video',{yPercent:-5,scale:1.03,ease:'none',scrollTrigger:{trigger:'.closing',start:'top bottom',end:'bottom top',scrub:true}});
  }catch(err){console.warn('Motion disabled.',err);}
}

function initContactForms(){
  qsa('form[data-contact-form]').forEach(form=>{
    const status=qs('[data-form-status]',form);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const fd=new FormData(form);
      const name=(fd.get('nome')||'').toString().trim();
      const phone=(fd.get('telefone')||'').toString().trim();
      const email=(fd.get('email')||'').toString().trim();
      const subject=(fd.get('assunto')||'').toString().trim();
      const message=(fd.get('mensagem')||'').toString().trim();
      if(!name||!message){
        if(status){status.textContent='Preencha seu nome e explique brevemente a demanda.';status.className='form-status error';}
        return;
      }
      const body=[
        'Olá, vim pelo site Avelar Nunes.',
        '',`Nome: ${name}`,
        phone?`Telefone: ${phone}`:'',
        email?`E-mail: ${email}`:'',
        subject?`Assunto: ${subject}`:'',
        '',`Mensagem: ${message}`
      ].filter(Boolean).join('\n');
      if(status){status.textContent='Abrindo o WhatsApp com sua mensagem...';status.className='form-status success';}
      const url=`https://wa.me/${cfg.whatsapp||''}?text=${encodeURIComponent(body)}`;
      setTimeout(()=>window.open(url,'_blank','noopener'),180);
    });
  });
}

function initCookieConsent(){
  const id=(cfg.gaMeasurementId||'').trim();
  if(!id)return;
  const key='avelar-consent';
  const loadGA=()=>{
    if(window.__gaLoaded)return;window.__gaLoaded=true;
    const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${id}`;document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',id,{anonymize_ip:true});
  };
  const consent=localStorage.getItem(key);
  if(consent==='accepted'){loadGA();return;}
  if(consent==='rejected')return;
  const bar=document.createElement('div');bar.className='cookie-banner';bar.innerHTML=`<p>Usamos cookies analíticos opcionais para entender o uso do site. Você pode aceitar ou continuar sem eles.</p><div><button type="button" data-cookie-reject>Continuar sem cookies</button><button type="button" class="cookie-accept" data-cookie-accept>Aceitar</button></div>`;document.body.appendChild(bar);
  qs('[data-cookie-accept]',bar).onclick=()=>{localStorage.setItem(key,'accepted');loadGA();bar.remove();};
  qs('[data-cookie-reject]',bar).onclick=()=>{localStorage.setItem(key,'rejected');bar.remove();};
}

document.addEventListener('DOMContentLoaded',()=>{
  applyConfig();initMenu();initScrollSpy();initRevealFallback();initVideos();initContactForms();initCookieConsent();
});
addEventListener('load',()=>{initLenis();initGsap();});
