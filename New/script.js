// ===== Navigation =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== Particle System =====
const canvas = document.getElementById('particles-canvas');
let ctx, particles, animFrame;

function initParticles() {
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];

  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.3 + 0.1,
    });
  }
  drawParticles();
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108, 99, 255, ${p.a})`;
    ctx.fill();
  });

  drawConnections();
  animFrame = requestAnimationFrame(drawParticles);
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    cancelAnimationFrame(animFrame);
    initParticles();
  }, 300);
});

initParticles();

// ===== Mouse-Reactive Glow =====
const mouseGlow = document.getElementById('mouse-glow');

if (mouseGlow) {
  let mouseX = -300;
  let mouseY = -300;
  let currentX = -300;
  let currentY = -300;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    mouseGlow.style.left = currentX + 'px';
    mouseGlow.style.top = currentY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ===== Counter Animation (hero + about) =====
const statNumbers = document.querySelectorAll('.hero-stat-number, .about-stat-number');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(element, target) {
  let current = 0;
  const increment = Math.ceil(target / 50);
  const stepTime = Math.floor(2000 / 50);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
      return;
    }
    element.textContent = current;
  }, stepTime);
}

// ===== Video Modal =====
const modal = document.getElementById('videoModal');
const modalIframe = document.getElementById('videoModalIframe');
const modalOverlay = document.getElementById('videoModalOverlay');
const modalClose = document.getElementById('videoModalClose');

document.querySelectorAll('.portfolio-item[data-video-id], .ai-card[data-video-id]').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.videoId;
    const type = item.dataset.videoType;
    if (type === 'drive') {
      modalIframe.src = `https://drive.google.com/file/d/${id}/preview`;
    } else {
      modalIframe.src = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`;
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  modalIframe.src = '';
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
  btn.style.pointerEvents = 'none';
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.pointerEvents = 'auto';
    contactForm.reset();
  }, 3000);
});
