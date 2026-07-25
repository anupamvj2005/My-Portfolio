/* =========================================================
   ANUPAM JADHAV — PORTFOLIO SCRIPT
   Vanilla JS: nav, canvas circuit bg, typing effect, scroll reveal,
   counters, skill bars, project filters, project modal, GitHub repo
   buttons, working contact form, back-to-top, mouse glow.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. NAVBAR: scroll style + active link ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');
  const sections = document.querySelectorAll('main section[id]');

  function onScrollNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let current = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- 2. MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksWrap.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinksWrap.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksWrap.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. SCROLL PROGRESS BAR ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function onScrollProgress() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
  }
  window.addEventListener('scroll', onScrollProgress, { passive: true });
  onScrollProgress();

  /* ---------- 4. MOUSE GLOW ---------- */
  const mouseGlow = document.getElementById('mouseGlow');
  window.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = `${e.clientX}px`;
    mouseGlow.style.top = `${e.clientY}px`;
  });

  /* ---------- 5. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const scrollCue = document.getElementById('scrollCue');
  scrollCue?.addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- 6. TYPING EFFECT ---------- */
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'Embedded Systems Developer',
    'IoT & Sensor Fusion Engineer',
    'AI/ML Explorer',
    'Automotive Firmware Enthusiast'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIdx--;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 70);
  }
  if (typedEl) typeLoop();

  /* ---------- 7. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 8. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.counter-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        current = Math.min(target, current + step);
        el.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- 9. SKILL PROGRESS BARS ---------- */
  const bars = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.width = `${el.dataset.level}%`;
      barObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  bars.forEach(b => barObserver.observe(b));

  /* ---------- 10. PROJECT FILTERING ---------- */
  const filterBtns = document.querySelectorAll('#projectFilters .filter-btn');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const cats = card.dataset.cat.split(' ');
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- 11. PROJECT "READ MORE" MODAL ---------- */
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const title = card.querySelector('h3').textContent;
      const desc = card.querySelector('.project-desc').textContent;
      const features = [...card.querySelectorAll('.feature-list li')].map(li => li.textContent).join(', ');
      const tech = [...card.querySelectorAll('.chip')].map(c => c.textContent).join(', ');
      const app = card.querySelector('.project-app')?.textContent || '';

      modalContent.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        <p><strong>Features:</strong> ${features}</p>
        <p><strong>Tech Stack:</strong> ${tech}</p>
        <p>${app}</p>
      `;
      modal.classList.add('open');
    });
  });
  modalClose.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

  /* ---------- 12. PROJECT "GITHUB" BUTTONS ----------
     Only the WiFi Heatmapper project has a real repo attached
     (data-repo set on that button). All others show a small
     "repo coming soon" toast instead of navigating anywhere. */
  document.querySelectorAll('.github-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const repo = btn.dataset.repo;
      if (repo) {
        window.open(repo, '_blank', 'noopener');
      } else {
        showToast('Repo coming soon — this project isn\'t public on GitHub yet.');
      }
    });
  });

  function showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  /* ---------- 13. CONTACT FORM ----------
     Submits to FormSubmit.co (free, no signup, no submission cap) via
     its AJAX endpoint so the page never has to redirect or reload.
     NOTE: the very first message ever sent triggers a one-time
     confirmation email from FormSubmit to activate the address —
     that's normal and only happens once. */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const cfSubmitBtn = document.getElementById('cfSubmitBtn');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalLabel = cfSubmitBtn.textContent;
    cfSubmitBtn.textContent = 'Sending...';
    cfSubmitBtn.disabled = true;
    formStatus.style.color = '';
    formStatus.textContent = '';

    const email = contactForm.action.split('/').pop();
    const formData = new FormData(contactForm);

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      if (!res.ok) throw new Error('Request failed');
      formStatus.textContent = 'Thanks! Your message has been sent — I\'ll get back to you soon.';
      contactForm.reset();
    } catch (err) {
      formStatus.style.color = '#F87171';
      formStatus.textContent = 'Something went wrong sending that. Please email me directly at anupamjadhav2005@gmail.com.';
    } finally {
      cfSubmitBtn.textContent = originalLabel;
      cfSubmitBtn.disabled = false;
    }
  });

  /* ---------- 14. ESC CLOSES OVERLAYS ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('open');
    }
  });

  /* ---------- 15. CIRCUIT BOARD CANVAS BACKGROUND ---------- */
  initCircuitCanvas();
});

/* ===================================================================
   Animated PCB / circuit-trace background for the hero section.
   Draws a grid of right-angle "traces" with small node points and a
   pulse of light traveling along a subset of paths — an ETC-themed
   ambient animation rather than generic particles.
   =================================================================== */
function initCircuitCanvas() {
  const canvas = document.getElementById('circuitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, dpr;
  let nodes = [];
  let paths = [];
  let pulses = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGrid();
  }

  function buildGrid() {
    nodes = [];
    paths = [];
    const cols = Math.max(6, Math.floor(width / 130));
    const rows = Math.max(4, Math.floor(height / 130));
    const spacingX = width / cols;
    const spacingY = height / rows;

    const grid = [];
    for (let r = 0; r <= rows; r++) {
      grid[r] = [];
      for (let c = 0; c <= cols; c++) {
        const jitterX = (Math.random() - 0.5) * spacingX * 0.3;
        const jitterY = (Math.random() - 0.5) * spacingY * 0.3;
        const node = { x: c * spacingX + jitterX, y: r * spacingY + jitterY, isChip: Math.random() < 0.06 };
        grid[r][c] = node;
        nodes.push(node);
      }
    }

    // Build right-angle connections (skip randomly so it isn't a full mesh)
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        if (c < cols && Math.random() < 0.55) {
          paths.push({ a: grid[r][c], b: grid[r][c + 1] });
        }
        if (r < rows && Math.random() < 0.55) {
          paths.push({ a: grid[r][c], b: grid[r + 1][c] });
        }
      }
    }

    // Seed a few traveling pulses
    pulses = [];
    const pulseCount = Math.min(10, Math.floor(paths.length / 12));
    for (let i = 0; i < pulseCount; i++) {
      pulses.push(makePulse());
    }
  }

  function makePulse() {
    const path = paths[Math.floor(Math.random() * paths.length)];
    return { path, t: Math.random(), speed: 0.002 + Math.random() * 0.003 };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Traces
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.16)';
    ctx.lineWidth = 1;
    paths.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(p.a.x, p.a.y);
      ctx.lineTo(p.b.x, p.b.y);
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.isChip ? 3.4 : 1.6, 0, Math.PI * 2);
      ctx.fillStyle = n.isChip ? 'rgba(6, 182, 212, 0.55)' : 'rgba(148, 163, 184, 0.35)';
      ctx.fill();
    });

    // Traveling pulses (signal along traces)
    ctx.fillStyle = '#06B6D4';
    pulses.forEach(pulse => {
      const { a, b } = pulse.path;
      const x = a.x + (b.x - a.x) * pulse.t;
      const y = a.y + (b.y - a.y) * pulse.t;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.9)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      pulse.t += pulse.speed;
      if (pulse.t >= 1) Object.assign(pulse, makePulse());
    });
  }

  function animate() {
    draw();
    if (!reduceMotion) requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  if (reduceMotion) {
    draw();
  } else {
    animate();
  }
}

/* Global helper used by the visualizer / any inline components, if needed */
function sendPrompt(text) {
  // no-op placeholder outside the widget iframe context
  console.log('sendPrompt called with:', text);
}