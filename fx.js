// Decorative motion, on every page: embers and aether motes rising behind the page, and a foil tilt
// that follows the mouse over card art. Nothing here runs under prefers-reduced-motion.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'embers';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const DARK = ['246,221,150', '232,105,46', '154,124,245', '76,201,195'];
  const LIGHT = ['138,100,32', '181,134,46', '106,79,208'];
  let w = 0, h = 0, dpr = 1, motes = [];
  const mote = (anywhere) => ({
    x: Math.random() * w, y: anywhere ? Math.random() * h : h + 10,
    r: (Math.random() * 1.5 + 0.5) * dpr, vy: (Math.random() * 0.4 + 0.15) * dpr,
    phase: Math.random() * 6.28, k: Math.random(), life: Math.random() * 0.5 + 0.5,
  });
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    motes = Array.from({ length: Math.min(70, Math.round(innerWidth / 20)) }, () => mote(true));
  };
  const frame = () => {
    ctx.clearRect(0, 0, w, h);
    const light = document.documentElement.dataset.theme === 'light';
    const colors = light ? LIGHT : DARK;
    ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
    for (const m of motes) {
      m.y -= m.vy; m.phase += 0.012; m.x += Math.sin(m.phase) * 0.35 * dpr;
      if (m.y < -10) Object.assign(m, mote(false));
      const a = Math.min(1, m.y / (h * 0.35)) * m.life * (0.6 + 0.4 * Math.sin(m.phase * 3));
      const c = colors[Math.floor(m.k * colors.length)];
      ctx.fillStyle = `rgba(${c},${(a * 0.18).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 4, 0, 6.283); ctx.fill();
      ctx.fillStyle = `rgba(${c},${(a * 0.9).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill();
    }
    if (!document.hidden) requestAnimationFrame(frame);
  };
  resize();
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(frame); });
  requestAnimationFrame(frame);

  // Foil tilt: --rx/--ry turn the card, --mx/--my place the shine. Mouse only; touch keeps the card flat.
  let current = null;
  document.addEventListener('pointermove', (e) => {
    const art = e.pointerType === 'mouse' && e.target.closest ? e.target.closest('.card .art, .commander-art') : null;
    if (current && current !== art) { current.removeAttribute('style'); current.classList.remove('tilt'); }
    current = art;
    if (!art) return;
    const r = art.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    art.classList.add('tilt');
    art.style.setProperty('--rx', ((0.5 - py) * 14).toFixed(2) + 'deg');
    art.style.setProperty('--ry', ((px - 0.5) * 14).toFixed(2) + 'deg');
    art.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    art.style.setProperty('--my', (py * 100).toFixed(1) + '%');
  });
})();
