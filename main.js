// Header scroll effect
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Fade-in on scroll
const fadeEls = document.querySelectorAll(
  '.work-card, .skill-group, .contact-item, .hero-inner > *'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${i * 0.05}s`;
  observer.observe(el);
});

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--fg)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
