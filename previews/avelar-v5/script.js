const qs=(s,c=document)=>c.querySelector(s);
const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
const header=qs('[data-header]');
const progress=qs('.progress span');
const menuButton=qs('[data-menu-button]');
const mobileMenu=qs('[data-mobile-menu]');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMenu=()=>{
  mobileMenu?.classList.remove('open');
  mobileMenu?.setAttribute('aria-hidden','true');
  menuButton?.setAttribute('aria-expanded','false');
  menuButton?.classList.remove('active');
};
menuButton?.addEventListener('click',()=>{
  const open=mobileMenu.classList.toggle('open');
  mobileMenu.setAttribute('aria-hidden',String(!open));
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.classList.toggle('active',open);
});
qsa('.mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

function updateUI(){
  const y=window.scrollY;
  const max=document.documentElement.scrollHeight-innerHeight;
  header?.classList.toggle('scrolled',y>18);
  if(progress)progress.style.transform=`scaleX(${max>0?y/max:0})`;
}
window.addEventListener('scroll',updateUI,{passive:true});
updateUI();

function playVideos(){
  qsa('video').forEach(v=>{const p=v.play();if(p&&p.catch)p.catch(()=>{});});
}

function initLenis(){
  if(!window.Lenis||reduce)return;
  const lenis=new Lenis({duration:1.08,smoothWheel:true,wheelMultiplier:.9,touchMultiplier:1.02,lerp:.085});
  const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};
  requestAnimationFrame(raf);
  qsa('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const target=qs(a.getAttribute('href'));
    if(!target)return;
    e.preventDefault();
    closeMenu();
    lenis.scrollTo(target,{offset:-72,duration:1.05});
  }));
}

function initGsap(){
  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion-ready');
  playVideos();
  if(reduce)return;

  gsap.to('.hero-line > span',{yPercent:-110,duration:1.15,ease:'power3.out',stagger:.1,delay:.12});
  gsap.utils.toArray('[data-reveal]').forEach(el=>{
    gsap.fromTo(el,{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}});
  });

  gsap.to('[data-image-parallax] img',{yPercent:-14,ease:'none',scrollTrigger:{trigger:'.image-break',start:'top bottom',end:'bottom top',scrub:true}});

  const mm=gsap.matchMedia();
  mm.add('(min-width:1121px)',()=>{
    const track=qs('[data-horizontal-track]');
    const getDistance=()=>Math.max(0,track.scrollWidth-window.innerWidth);
    const tween=gsap.to(track,{x:()=>-getDistance(),ease:'none',scrollTrigger:{
      trigger:'.horizontal-pin',start:'top top',end:()=>`+=${getDistance()+window.innerHeight*.4}`,pin:true,scrub:1,invalidateOnRefresh:true
    }});
    return()=>{tween.scrollTrigger?.kill();tween.kill();};
  });

  gsap.to('.closing-video',{yPercent:-8,scale:1.05,ease:'none',scrollTrigger:{trigger:'.closing',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo('.closing-copy h2',{y:60,autoAlpha:0},{y:0,autoAlpha:1,ease:'none',scrollTrigger:{trigger:'.closing',start:'top 68%',end:'top 35%',scrub:1}});
}

window.addEventListener('load',()=>{playVideos();initLenis();initGsap();});
