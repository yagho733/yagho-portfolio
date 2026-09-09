const nav=document.querySelector('.nav');const menu=document.querySelector('.menu');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20),{passive:true});
menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('leadForm').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim();const type=document.getElementById('type').value;const msg=document.getElementById('message').value.trim();const text=`Olá Yagho, vim pelo seu site.\n\nMeu nome: ${name}\nTipo de negócio: ${type}\n\nProjeto: ${msg}`;window.open(`https://wa.me/5553999563554?text=${encodeURIComponent(text)}`,'_blank','noopener')});
