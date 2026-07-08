// Mouse parallax for hero blobs
(function() {
  const blobs = document.querySelectorAll('.hero-blob');
  const wrappers = [];
  blobs.forEach(blob => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;inset:0;will-change:transform;pointer-events:none;';
    blob.parentNode.insertBefore(wrap, blob);
    wrap.appendChild(blob);
    wrappers.push(wrap);
  });
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    wrappers.forEach((wrap, i) => {
      const factor = (i + 1) * 8;
      wrap.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
})();

// Nav scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Counter animation
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          entry.target.textContent = target + '+';
          clearInterval(timer);
        } else {
          entry.target.textContent = current;
        }
      }, 40);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
counters.forEach(el => counterObserver.observe(el));

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.section-head, .work-card, .service-card, .about-content, .about-visual, .contact-info, .contact-form');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.05 });
fadeEls.forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const orig = btn.innerHTML;
  btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
  btn.style.pointerEvents = 'none';
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.pointerEvents = 'auto';
    e.target.reset();
  }, 2500);
});
