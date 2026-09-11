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

// Media guard: keep the browser's native video error UI hidden.
// The fallback image remains visible underneath until the video is actually ready.
(() => {
  const videos = [...document.querySelectorAll('video[data-video-src]')];

  videos.forEach((video) => {
    const wrapper = video.closest('.hero-video-wrap,.closing-media');

    video.style.opacity = '0';
    video.style.transition = 'opacity .35s ease';

    const showVideo = () => {
      if (!wrapper) return;
      wrapper.classList.remove('media-error');
      wrapper.classList.add('media-ready');
      video.style.display = 'block';
      video.style.opacity = '1';
    };

    const useFallback = () => {
      if (wrapper) {
        wrapper.classList.remove('media-ready');
        wrapper.classList.add('media-error');
      }
      video.style.opacity = '0';
      video.style.display = 'none';
    };

    video.addEventListener('loadeddata', showVideo, { once: true });
    video.addEventListener('canplay', showVideo, { once: true });
    video.addEventListener('playing', showVideo, { once: true });
    video.addEventListener('error', useFallback);
    video.addEventListener('abort', () => {
      if (video.error) useFallback();
    });
  });
})();
