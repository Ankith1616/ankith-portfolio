const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
});

/* ---------- SCROLL PROGRESS RAIL ---------- */
const progressFill = document.getElementById('progressFill');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressFill) progressFill.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ---------- BACK TO TOP ---------- */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 700);
}, { passive: true });

/* ---------- CUSTOM CURSOR ---------- */
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.classList.add('active');
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .compact-card, .featured-project').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
  });
  document.addEventListener('mouseleave', () => cursorDot.classList.remove('active'));
}

/* ---------- MANUSCRIPT INDEX ACTIVE STATE ---------- */
const miLinks = document.querySelectorAll('.manuscript-index a');
const trackedSections = document.querySelectorAll('section[id], header[id]');

function updateActiveIndex() {
  let current = 'top';
  trackedSections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 160) current = section.getAttribute('id');
  });
  miLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  // main nav highlight
  document.querySelectorAll('nav ul a').forEach((link) => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--amber)' : '';
  });
}
window.addEventListener('scroll', updateActiveIndex, { passive: true });
updateActiveIndex();

/* ---------- TYPEWRITER ---------- */
const typewriterEl = document.getElementById('typewriter');
const roles = ['Full-Stack Developer', 'AI / ML Researcher', 'IEEE Published Author', 'Computer Vision Engineer'];

function typewriterLoop() {
  if (!typewriterEl || prefersReducedMotion) {
    if (typewriterEl) typewriterEl.textContent = roles[0];
    return;
  }
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
      setTimeout(tick, 55);
    } else {
      charIndex--;
      typewriterEl.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 30);
    }
  }
  tick();
}
typewriterLoop();

/* ---------- COUNT-UP FOR METRICS ---------- */
function animateCountUp(el) {
  const raw = el.textContent.trim();
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return;
  const target = parseFloat(match[1]);
  const suffix = match[2];
  const decimals = (match[1].split('.')[1] || '').length;
  const duration = 1300;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  if (prefersReducedMotion) {
    el.textContent = target.toFixed(decimals) + suffix;
  } else {
    requestAnimationFrame(frame);
  }
}

const countTargets = document.querySelectorAll('.metric-num, .stat-val');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCountUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
countTargets.forEach((el) => countObserver.observe(el));

/* ---------- SCROLL REVEAL ---------- */
const revealTargets = document.querySelectorAll(
  '.entry, .paper-card, .index-block, .featured-project, .compact-card, .cert-list li, .contact-item'
);
revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = prefersReducedMotion ? '0s' : `${(i % 4) * 0.08}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealTargets.forEach((el) => revealObserver.observe(el));

/* ---------- TILT ON HERO STAMP CARD & PAPER CARD ---------- */
function applyTilt(el, intensity) {
  if (!el || prefersReducedMotion) return;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotate(${el.dataset.baseRotate || 0}deg) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = `rotate(${el.dataset.baseRotate || 0}deg) rotateX(0deg) rotateY(0deg)`;
  });
}

const stampCard = document.getElementById('stampCard');
if (stampCard) {
  stampCard.dataset.baseRotate = '1.4';
  applyTilt(stampCard, 8);
}
document.querySelectorAll('.tilt-subtle').forEach((el) => applyTilt(el, 2.5));

/* ---------- MAGNETIC BUTTONS ---------- */
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* ---------- FEATURED PROJECT INDEX GLOW ON HOVER ---------- */
document.querySelectorAll('.featured-project').forEach((card) => {
  const idx = card.querySelector('.fp-index');
  if (!idx) return;
  card.addEventListener('mouseenter', () => { idx.style.color = 'var(--amber)'; });
  card.addEventListener('mouseleave', () => { idx.style.color = ''; });
});
