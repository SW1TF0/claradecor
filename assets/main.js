document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Languages ----------
(() => {
  const LANGS = ['bg', 'en', 'tr', 'ru'];
  const dict = window.I18N || {};
  const textEls = document.querySelectorAll('[data-i18n]');
  const ariaEls = document.querySelectorAll('[data-i18n-aria]');
  const metaDesc = document.querySelector('meta[name="description"]');
  // Bulgarian is the page's own text; keep it so we can switch back.
  dict.bg = { 'meta.title': document.title, 'meta.description': metaDesc.content };
  textEls.forEach(el => { dict.bg[el.dataset.i18n] = el.innerHTML; });
  ariaEls.forEach(el => { dict.bg[el.dataset.i18nAria] = el.getAttribute('aria-label'); });

  const buttons = document.querySelectorAll('.lang-switch button');

  function apply(lang) {
    const t = dict[lang] || dict.bg;
    const get = k => t[k] ?? dict.bg[k];
    textEls.forEach(el => { el.innerHTML = get(el.dataset.i18n); });
    ariaEls.forEach(el => el.setAttribute('aria-label', get(el.dataset.i18nAria)));
    document.title = get('meta.title');
    metaDesc.content = get('meta.description');
    document.documentElement.lang = lang;
    buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  }

  function initial() {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
    try { const saved = localStorage.getItem('lang'); if (LANGS.includes(saved)) return saved; } catch (e) {}
    const nav = (navigator.language || 'bg').slice(0, 2).toLowerCase();
    return LANGS.includes(nav) ? nav : 'bg';
  }

  buttons.forEach(b => b.addEventListener('click', () => {
    const lang = b.dataset.lang;
    apply(lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
    const url = new URL(location.href);
    if (lang === 'bg') url.searchParams.delete('lang'); else url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }));

  apply(initial());
})();

// ---------- Falling petals ----------
(() => {
  const canvas = document.getElementById('petals');
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.remove(); return; }
  const ctx = canvas.getContext('2d');
  const COLORS = ['#f3c6cf', '#eeb3bf', '#f7d9de', '#e9a3a9', '#f5cdb8', '#fbe3e8'];
  let w, h, dpr, petals = [], last = 0, running = true;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.round(innerWidth * dpr);
    h = canvas.height = Math.round(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    const target = innerWidth < 700 ? 12 : 22;
    while (petals.length < target) petals.push(make(true));
    petals.length = target;
  }

  function make(anywhere) {
    const size = (8 + Math.random() * 9) * dpr;
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -size * 2,
      size,
      speed: (18 + Math.random() * 28) * dpr,     // px per second
      drift: (Math.random() - .5) * 20 * dpr,
      sway: 20 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * 1.6,
      flip: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: .55 + Math.random() * .35
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.abs(Math.cos(p.flip)) * .7 + .3);   // tumbling
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    const s = p.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * .9, -s * .6, s * .7, s * .6, 0, s);
    ctx.bezierCurveTo(-s * .7, s * .6, -s * .9, -s * .6, 0, -s);
    ctx.fill();
    ctx.restore();
  }

  function frame(t) {
    if (!running) return;
    const dt = Math.min((t - last) / 1000 || 0, .05);
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.phase += dt;
      p.y += p.speed * dt;
      p.x += (p.drift + Math.sin(p.phase) * p.sway * dpr * .6) * dt;
      p.rot += p.spin * dt;
      p.flip += dt * 1.5;
      if (p.y > h + p.size * 2 || p.x < -50 * dpr || p.x > w + 50 * dpr) petals[i] = make(false);
      drawPetal(p);
    }
    requestAnimationFrame(frame);
  }

  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(frame); }
  });
  resize();
  requestAnimationFrame(frame);
})();
