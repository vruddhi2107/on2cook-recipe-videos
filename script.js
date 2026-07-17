gsap.registerPlugin(ScrollTrigger);

const FN_META = {
  bake:      { label: 'Bake',      color: '#E63946' },
  steam:     { label: 'Steam',     color: '#111111' },
  grill:     { label: 'Grill',     color: '#E63946' },
  microwave: { label: 'Microwave', color: '#111111' },
  induction: { label: 'Induction', color: '#E63946' },
  fry:       { label: 'Fry',       color: '#111111' }
};
const FN_ORDER = ['bake', 'steam', 'grill', 'microwave', 'induction', 'fry'];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Lenis smooth scroll ---------------- */
let lenis = null;
if (!reduceMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -20 });
      }
    });
  });
}

/* ---------------- progress bar ---------------- */
const progressBar = document.getElementById('progressBar');
gsap.to(progressBar, {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
});

/* ---------------- nav glass on scroll ---------------- */
const nav = document.getElementById('siteNav');
ScrollTrigger.create({
  start: 100,
  onUpdate: self => nav.classList.toggle('scrolled', self.scroll() > 80)
});

/* ---------------- helpers: split text into lines/words ---------------- */
function splitLines(el){
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  const frag = document.createDocumentFragment();
  words.forEach((w, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'line-mask';
    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.textContent = w + (i < words.length - 1 ? '\u00A0' : '');
    wrap.appendChild(inner);
    frag.appendChild(wrap);
  });
  el.appendChild(frag);
  return el.querySelectorAll('.line-inner');
}

/* ================================================================
   HERO
   ================================================================ */
const heroWords = splitLines(document.getElementById('heroHeadline'));

const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
heroTl
  .set('.hero', { autoAlpha: 1 })
  .from('.hero-eyebrow', { opacity: 0, y: 14, duration: 0.6 })
  .from(heroWords, { yPercent: 130, duration: 1, stagger: 0.07 }, '-=0.3')
  .from('.hero-sub', { opacity: 0, y: 16, duration: 0.7 }, '-=0.5')
  .from('.hero-ctas .btn', { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, '-=0.5')
  .from('.hero-scrollcue', { opacity: 0, duration: 0.6 }, '-=0.3')
  .from('.hero-visual-glow', { opacity: 0, scale: 0.7, duration: 1, ease: 'power2.out' }, '-=1.1')
  .from('.hero-device-img', { opacity: 0, scale: 1.12, y: 50, duration: 1.2, ease: 'power3.out' }, '-=0.9')
  .from('.hero-ring', { opacity: 0, scale: 0.5, duration: 0.9, ease: 'back.out(1.6)' }, '-=0.6')
  .from('.hero-shape', { opacity: 0, scale: 0.6, duration: 1, stagger: 0.1, ease: 'back.out(1.6)' }, '-=1');

if (!reduceMotion) {
  gsap.to('.hero-shape.s1', { y: -30, x: 10, rotate: 12, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.hero-shape.s3', { y: -18, x: -8, rotate: 8, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.hero-ring', { y: 14, x: -6, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  // gentle idle float on the (now larger) device, once its entrance is done
  gsap.to('.hero-device-img', { y: -18, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.9 });

  // rising steam wisps above the device
  const steamEls = gsap.utils.toArray('.hero-steam');
  steamEls.forEach((el, i) => {
    gsap.timeline({ repeat: -1, delay: 1.4 + i * 0.9, repeatDelay: 0.4 })
      .fromTo(el, { y: 0, opacity: 0, scaleY: 0.6 }, { y: -110, opacity: 0.5, scaleY: 1, duration: 2.4, ease: 'sine.out' })
      .to(el, { opacity: 0, duration: 1, ease: 'sine.in' }, '-=0.6');
  });

  gsap.to('.hero-shape', {
    yPercent: -40,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
  gsap.to('.hero-visual', {
    yPercent: -14,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
  gsap.to('.hero-headline', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
}

/* ================================================================
   GENERIC SECTION REVEALS  (applies to any element with .reveal)
   ================================================================ */
gsap.utils.toArray('.reveal').forEach(el => {
  if (reduceMotion) { gsap.set(el, { opacity: 1, y: 0 }); return; }
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

gsap.utils.toArray('.reveal-mask').forEach(el => {
  const inners = splitLines(el);
  if (reduceMotion) { gsap.set(inners, { yPercent: 0 }); return; }
  gsap.from(inners, {
    yPercent: 120,
    duration: 0.9,
    stagger: 0.05,
    ease: 'power4.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

gsap.utils.toArray('.stagger-group').forEach(group => {
  const items = group.querySelectorAll('.stagger-item');
  if (reduceMotion) { gsap.set(items, { opacity: 1, y: 0 }); return; }
  gsap.from(items, {
    opacity: 0,
    y: 32,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: group, start: 'top 85%' }
  });
});

/* ================================================================
   STORY — reveal for the real Combination Cooking render
   ================================================================ */
gsap.utils.toArray('.reveal-img').forEach(el => {
  if (reduceMotion) { gsap.set(el, { opacity: 1, scale: 1, y: 0 }); return; }
  gsap.from(el, {
    opacity: 0,
    scale: 1.05,
    y: 50,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 82%' }
  });
});

/* ================================================================
   FUNCTIONS — auto-scrolling overlay deck
   The track holds two identical copies of the six cards back to
   back and scrolls left forever; because the copies are identical
   the loop point is invisible. As cards drift through the centre
   of the viewport, the nearest one lifts out of the deck, straightens,
   and opens its description — like a card being pulled forward from
   a fanned stack. Tapping a card pins it open and overlays the rest
   of the deck with a soft scrim; hovering pauses the drift.
   ================================================================ */
(function initFunctionsDeck(){
  const carousel = document.getElementById('fnCarousel');
  const track = document.getElementById('fnTrack');
  const backdrop = document.getElementById('fnBackdrop');
  if (!carousel || !track) return;

  const ROT = [-3, 2.2, -2.4, 3, -1.8, 2.6];

  // Duplicate the card set once so the track can scroll seamlessly.
  const originalCards = Array.from(track.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    track.appendChild(clone);
  });

  const allCards = Array.from(track.children);
  allCards.forEach((card, i) => {
    gsap.set(card, { rotation: ROT[i % ROT.length] });
  });

  let loopTween = null;
  let pinned = null;      // card currently pinned open by click/tap
  let activeCard = null;  // card currently nearest centre

  function setActive(card){
    if (activeCard === card) return;
    if (activeCard && activeCard !== pinned) {
      const idx = allCards.indexOf(activeCard);
      activeCard.classList.remove('is-active');
      gsap.to(activeCard, { scale: 1, y: 0, rotation: ROT[idx % ROT.length], zIndex: 1, duration: 0.5, ease: 'power3.out' });
    }
    activeCard = card;
    if (card && card !== pinned) {
      card.classList.add('is-active');
      gsap.to(card, { scale: 1.08, y: -14, rotation: 0, zIndex: 5, duration: 0.5, ease: 'back.out(1.6)' });
    }
  }

  function buildLoop(){
    if (loopTween) loopTween.kill();
    gsap.set(track, { x: 0 });
    const halfWidth = track.scrollWidth / 2;
    const pxPerSecond = window.innerWidth < 620 ? 354 :156;
    loopTween = gsap.to(track, {
      x: -halfWidth,
      duration: halfWidth / pxPerSecond,
      ease: 'none',
      repeat: -1
    });
  }

  function updateActiveFromPositions(){
    if (pinned) return;
    const viewportCenter = window.innerWidth / 2;
    let closest = null;
    let closestDist = Infinity;
    allCards.forEach(card => {
      const r = card.getBoundingClientRect();
      if (r.right < 0 || r.left > window.innerWidth) return;
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      if (dist < closestDist) { closestDist = dist; closest = card; }
    });
    setActive(closest);
  }

  function pinCard(card){
    if (pinned === card) { unpinCard(); return; }
    if (pinned) unpinCard();
    pinned = card;
    if (loopTween) loopTween.pause();
    carousel.classList.add('is-paused');
    card.classList.add('is-active', 'is-pinned');
    gsap.to(card, { scale: 1.14, y: -18, rotation: 0, zIndex: 10, duration: 0.5, ease: 'back.out(1.6)' });
    if (backdrop) backdrop.classList.add('is-visible');
  }

  function unpinCard(){
    if (!pinned) return;
    const card = pinned;
    const idx = allCards.indexOf(card);
    card.classList.remove('is-pinned');
    pinned = null;
    if (activeCard === card) {
      // keep it looking active until the position check reassigns
      gsap.to(card, { scale: 1.08, y: -14, rotation: 0, zIndex: 5, duration: 0.4, ease: 'power2.out' });
    } else {
      card.classList.remove('is-active');
      gsap.to(card, { scale: 1, y: 0, rotation: ROT[idx % ROT.length], zIndex: 1, duration: 0.4, ease: 'power2.out' });
    }
    if (loopTween && !reduceMotion) loopTween.resume();
    carousel.classList.remove('is-paused');
    if (backdrop) backdrop.classList.remove('is-visible');
  }

  if (backdrop) backdrop.addEventListener('click', unpinCard);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pinned) unpinCard(); });

  allCards.forEach(card => {
    card.addEventListener('mouseenter', () => { if (loopTween) loopTween.pause(); });
    card.addEventListener('mouseleave', () => { if (loopTween && !pinned) loopTween.resume(); });
    card.addEventListener('click', () => pinCard(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pinCard(card); }
    });
  });

  carousel.addEventListener('mouseleave', () => { if (loopTween && !pinned) loopTween.resume(); });

  if (reduceMotion) {
    // No drift: just space cards out normally and let people tab through them.
    gsap.set(allCards, { rotation: 0 });
    carousel.style.overflowX = 'auto';
    carousel.style.maskImage = 'none';
    carousel.style.webkitMaskImage = 'none';
  } else {
    buildLoop();
    gsap.ticker.add(updateActiveFromPositions);
    window.addEventListener('resize', () => { buildLoop(); });
  }
})();

/* ================================================================
   RECIPES — data-driven grid + filters + lightbox
   ================================================================ */
const grid = document.getElementById('recipeGrid');
const countEl = document.getElementById('recipeCount');
let activeFn = null;
const DATA = (typeof RECIPE_VIDEOS !== 'undefined') ? RECIPE_VIDEOS : [];

function embedFor(url){
  if (!url) return null;

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let id = '';

    if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1].split(/[?&]/)[0];
    } else if (url.includes('v=')) {
      id = url.split('v=')[1].split('&')[0];
    }

    if (id) {
      return {
        type: 'iframe',
        src: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`
      };
    }
  }

  // Vimeo (supports vimeo.com/ID, player.vimeo.com/video/ID, and private
  // videos that need a share hash, e.g. .../video/12345?h=abcdef)
  if (url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);

    if (match) {
      const id = match[1];
      let hash = '';
      try {
        hash = new URL(url).searchParams.get('h') || '';
      } catch (e) { /* url wasn't a valid absolute URL, ignore */ }

      let src = `https://player.vimeo.com/video/${id}?autoplay=1&muted=1`;
      if (hash) src += `&h=${hash}`;

      return { type: 'iframe', src };
    }
  }

  // Self-hosted video
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) {
    return {
      type: 'video',
      src: url
    };
  }

  return null;
}

function ghostCard(fn){
  const meta = FN_META[fn];
  const card = document.createElement('div');
  card.className = 'r-card ghost';
  card.innerHTML = `
    <div class="r-media ghost-media" style="border-color:${meta.color}">
      <span style="color:${meta.color}">${meta.label}</span>
    </div>
    <div class="r-body">
      <div class="r-fn" style="color:${meta.color}">${meta.label}</div>
      <div class="r-title">Coming soon</div>
    </div>`;
  return card;
}

function realCard(r){
  const meta = FN_META[r.function] || { label: r.function, color: '#111111' };
  const card = document.createElement('div');
  card.className = 'r-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Play ' + r.title);

  const posterStyle = r.thumbnail ? `background-image:url('${r.thumbnail}')` : '';
  card.innerHTML = `
    <div class="r-media" style="${posterStyle}">
      ${!r.thumbnail ? `<div class="r-media-fallback" style="background:${meta.color}22;color:${meta.color}">${meta.label}</div>` : ''}
      <div class="r-play"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M19 15L34 24L19 33V15Z" fill="#fff"/></svg></div>
    </div>
    <div class="r-body">
      <div class="r-fn" style="color:${meta.color}">${meta.label}</div>
      <div class="r-title">${escapeHtml(r.title)}</div>
      <div class="r-meta"><span>${escapeHtml(r.chef || '')}</span><span>${escapeHtml(r.duration || '')}</span></div>
    </div>`;

  const open = () => openLightbox(r);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  return card;
}

function escapeHtml(s){
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function renderRecipes(){
  grid.innerHTML = '';
  const list = activeFn ? DATA.filter(r => r.function === activeFn) : DATA;

  if (DATA.length === 0) {
    FN_ORDER.forEach(fn => grid.appendChild(ghostCard(fn)));
    countEl.textContent = 'Recipes land here as soon as the video links come in.';
  } else if (list.length === 0) {
    grid.appendChild(ghostCard(activeFn));
    countEl.textContent = 'No ' + FN_META[activeFn].label.toLowerCase() + ' videos yet.';
  } else {
    list.forEach(r => grid.appendChild(realCard(r)));
    countEl.textContent = list.length + (list.length === 1 ? ' recipe' : ' recipes');
  }

  const items = grid.querySelectorAll('.r-card');
  if (reduceMotion) { gsap.set(items, { opacity: 1, y: 0 }); return; }
  gsap.from(items, { opacity: 0, y: 26, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
}

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFn = chip.dataset.fn === 'all' ? null : chip.dataset.fn;
    renderRecipes();
  });
});

renderRecipes();

/* ---------------- lightbox ---------------- */
const lightbox = document.getElementById('lightbox');
const lightboxInner = document.getElementById('lightboxInner');

function openLightbox(recipe){
  const embed = embedFor(recipe.videoUrl);
  lightboxInner.innerHTML = '';
  if (embed && embed.type === 'iframe') {
  lightboxInner.innerHTML = `<iframe src="${embed.src}" width="100%" height="100%" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" allowfullscreen></iframe>`;
  }else if (embed && embed.type === 'video') {
    lightboxInner.innerHTML = `<video src="${embed.src}" controls autoplay></video>`;
  } else {
    lightboxInner.innerHTML = `<div class="lightbox-fallback"><p>${escapeHtml(recipe.title)}</p><a href="${recipe.videoUrl}" target="_blank" rel="noopener">Open video ↗</a></div>`;
  }
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  gsap.fromTo(lightbox.querySelector('.lightbox-box'), { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightboxInner.innerHTML = '';
  document.body.style.overflow = '';
}
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ================================================================
   FACTS — count-up numbers
   ================================================================ */
document.querySelectorAll('.fact-num').forEach(el => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (reduceMotion) { el.textContent = target + suffix; return; }
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
      });
    }
  });
});

if (!reduceMotion) {
  gsap.to('.facts-shape', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: { trigger: '.facts', start: 'top bottom', end: 'bottom top', scrub: 0.6 }
  });
}

/* ================================================================
   MAGNETIC BUTTONS
   ================================================================ */
if (!reduceMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    const strength = 22;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: (x / r.width) * strength, y: (y / r.height) * strength, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' }));
  });
}

/* ---------------- CTA reveal ---------------- */
if (!reduceMotion) {
  gsap.from('.cta-shape', {
    scale: 0.7,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.cta', start: 'top 75%' }
  });
}

ScrollTrigger.refresh();
