window.AVELAR_CONFIG = {
  brand: 'Avelar Nunes Advocacia',
  domain: 'https://yagho-sites.vercel.app/avelar-nunes-advocacia',
  whatsapp: '5553999563554',
  email: 'contato@avelarnunes.adv.br',
  city: 'Pelotas',
  state: 'RS',
  address: 'Endereço do escritório',
  gaMeasurementId: ''
};

// Correção definitiva da mídia final: foto fixa, sem segundo vídeo.
(() => {
  const closingMedia = document.querySelector('.closing-media');
  if (closingMedia) {
    const closingVideo = closingMedia.querySelector('.closing-video');
    if (closingVideo) closingVideo.remove();

    closingMedia.classList.remove('media-ready', 'media-error');
    closingMedia.style.backgroundImage = 'linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.18)),url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2200&q=84")';
    closingMedia.style.backgroundPosition = 'center';
    closingMedia.style.backgroundSize = 'cover';
    closingMedia.style.backgroundRepeat = 'no-repeat';

    if (!closingMedia.querySelector('.closing-signature')) {
      const signature = document.createElement('div');
      signature.className = 'closing-signature';
      signature.innerHTML = '<strong>PRESENÇA JURÍDICA</strong><span>Relações construídas com clareza e continuidade.</span>';
      closingMedia.appendChild(signature);
    }
  }

  if (!document.getElementById('avelar-final-media-fix')) {
    const style = document.createElement('style');
    style.id = 'avelar-final-media-fix';
    style.textContent = `
      .closing-video{display:none!important;visibility:hidden!important;opacity:0!important}
      .closing-media::after,.closing-inner::before{content:none!important;display:none!important}
      .closing-signature{position:absolute;top:24%;right:var(--pad);z-index:1;width:min(390px,34vw);padding-top:14px;border-top:1px solid rgba(255,255,255,.34);color:rgba(255,255,255,.9);font-family:var(--sans);text-transform:uppercase;text-align:right;pointer-events:none}
      .closing-signature strong,.closing-signature span{display:block}
      .closing-signature strong{font-size:10px;line-height:1.7;letter-spacing:.12em;font-weight:500}
      .closing-signature span{margin-top:2px;font-size:10px;line-height:1.7;letter-spacing:.12em;font-weight:400}
      @media(max-width:720px){
        .hero-video-label{left:18px!important;right:18px!important;bottom:max(18px,env(safe-area-inset-bottom))!important;display:grid!important;grid-template-columns:1fr!important;gap:6px!important;max-width:calc(100% - 36px)!important;line-height:1.4!important}
        .hero-video-label span{display:block!important;width:100%!important;max-width:100%!important;white-space:normal!important;overflow:visible!important;overflow-wrap:anywhere!important;text-align:left!important}
        .hero-video-label span:last-child{max-width:28ch!important}
        .closing-signature{top:20%;left:20px;right:20px;width:auto;text-align:left}
        .closing-signature strong,.closing-signature span{font-size:8px;line-height:1.65}
      }
      @media(max-width:390px){.closing-signature{top:17%}}
    `;
    document.head.appendChild(style);
  }

  // Somente o vídeo principal pode ser exibido.
  const heroVideo = document.querySelector('.hero-video[data-video-src]');
  if (!heroVideo) return;

  const wrapper = heroVideo.closest('.hero-video-wrap');
  heroVideo.style.opacity = '0';
  heroVideo.style.transition = 'opacity .35s ease';

  const showVideo = () => {
    if (!wrapper) return;
    wrapper.classList.remove('media-error');
    wrapper.classList.add('media-ready');
    heroVideo.style.display = 'block';
    heroVideo.style.opacity = '1';
  };

  const useFallback = () => {
    if (wrapper) {
      wrapper.classList.remove('media-ready');
      wrapper.classList.add('media-error');
    }
    heroVideo.style.opacity = '0';
    heroVideo.style.display = 'none';
  };

  heroVideo.addEventListener('loadeddata', showVideo, { once: true });
  heroVideo.addEventListener('canplay', showVideo, { once: true });
  heroVideo.addEventListener('playing', showVideo, { once: true });
  heroVideo.addEventListener('error', useFallback);
  heroVideo.addEventListener('abort', () => {
    if (heroVideo.error) useFallback();
  });
})();
