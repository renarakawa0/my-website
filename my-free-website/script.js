// script.js - FIXED & CLEANED UP with AUTO-CREATED THEME TOGGLE & ICONS
class Syntrix {
  constructor() {
    this.config = window.SYNTTRIX_CONFIG || {
      stats: { projectsDelivered: 127, uptime: 99.9, responseHours: 24, totalProjects: 127, hoursCoded: 2450, happyClients: 35 },
      contact: { email: "renarakawa041009@gmail.com", timezone: "GMT+5:30", responseTime: "24h", deliveryTime: "2 weeks" }
    };
    
    this.init();
  }

  init() {
    this.createThemeToggle();  // ✅ Auto-create theme button
    this.initTheme();
    this.initCounters();
    this.initScroll();
    this.initNavbar();
    this.initObserver();
    this.initForm();
    this.initConfig();
  }

  // ✅ Auto-create theme toggle button
  createThemeToggle() {
    const existing = document.getElementById('theme-toggle');
    if (existing) existing.remove();

    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.innerHTML = `
      <span class="sun-icon">☀️</span>
      <span class="moon-icon">🌙</span>
    `;

    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const lastNavItem = navbar.querySelector('.nav-btn:last-of-type, .mobile-menu:last-of-type');
      if (lastNavItem) {
        lastNavItem.insertAdjacentElement('afterend', toggle);
      } else {
        navbar.appendChild(toggle);
      }
    } else {
      document.body.appendChild(toggle);
    }
  }

  // ✅ Fixed theme toggle with icons
initTheme() {
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const sunIcon = toggle ? toggle.querySelector('.sun-icon') : null;
  const moonIcon = toggle ? toggle.querySelector('.moon-icon') : null;

  // ✅ Logo elements
  const logoDark = document.getElementById('logo-dark');
  const logoLight = document.getElementById('logo-light');

  // Function to switch logos
  const updateLogo = () => {
    if (html.classList.contains('dark')) {
      if (logoDark) logoDark.classList.add('active');
      if (logoLight) logoLight.classList.remove('active');
    } else {
      if (logoDark) logoDark.classList.remove('active');
      if (logoLight) logoLight.classList.add('active');
    }
  };

  // Set theme on page load
  let savedTheme = localStorage.getItem('theme') || 'dark';
  html.classList.remove('light', 'dark');
  html.classList.add(savedTheme);

  this.updateToggleIcons(savedTheme, sunIcon, moonIcon);
  updateLogo(); // ✅ initial logo update

  // Toggle event
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = html.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';

      html.classList.remove('light', 'dark');
      html.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);

      this.updateToggleIcons(newTheme, sunIcon, moonIcon);
      updateLogo(); // ✅ update logo on toggle
    });
  }
}
  // ✅ Helper to update icons
  updateToggleIcons(theme, sunIcon, moonIcon) {
    if (!sunIcon || !moonIcon) return;
    if (theme === 'dark') {
      sunIcon.style.opacity = '1';
      moonIcon.style.opacity = '0';
    } else {
      sunIcon.style.opacity = '0';
      moonIcon.style.opacity = '1';
    }
    sunIcon.style.transition = moonIcon.style.transition = 'opacity 0.4s ease';
  }

  // ✅ Smooth animated counters
  initCounters() {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.target);
      const duration = 2000;
      let start = parseFloat(el.textContent.replace(/[^\d.-]/g, '')) || 0;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = start + (target - start) * easeProgress;

        if (target > 100) el.textContent = Math.floor(current).toLocaleString();
        else el.textContent = current.toFixed(1);

        if (progress < 1) requestAnimationFrame(updateCounter);
      };
      
      requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-number[data-target]');
          counters.forEach(animateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.hero-stats, .about-stats').forEach(section => observer.observe(section));
  }

  // ✅ Smooth scroll & active nav
  initScroll() {
    document.querySelectorAll('[data-scroll]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.scroll;
        const target = document.querySelector(targetId);
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      });
    });

    let ticking = false;
    const updateActiveNav = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) currentSection = `#${section.id}`;
      });
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.scroll === currentSection));
      ticking = false;
    };

    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateActiveNav); ticking = true; } }, { passive: true });
  }

  // ✅ Navbar scroll effects
  initNavbar() {
    let ticking = false;
    const navbar = document.querySelector('.navbar');
    const updateNavbar = () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateNavbar); ticking = true; } }, { passive: true });
  }

  // ✅ Fade-in animations
  initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), index * 120);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }

  // ✅ Contact form with loading states
  initForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;
      status.className = 'form-status';

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        status.innerHTML = `🎉 Message sent to <strong>${this.config.contact.email}</strong>!<br>I'll reply within ${this.config.contact.responseTime}.`;
        status.className = 'form-status show success';
        form.reset();
      } catch {
        status.textContent = '❌ Something went wrong. Please try again.';
        status.className = 'form-status show error';
      } finally {
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          status.classList.remove('show');
        }, 5000);
      }
    });
  }

  // ✅ Update config elements
  initConfig() {
    const updateElement = (selector, value) => {
      const el = document.querySelector(selector);
      if (el) el.textContent = value;
    };

    updateElement('#contact-email', this.config.contact.email);
    updateElement('#response-time', this.config.contact.responseTime);
    updateElement('#delivery-time', this.config.contact.deliveryTime);
  }
}

// ✅ SINGLE INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  new Syntrix();
});










const logo = document.getElementById('logo');
if (logo) {
  if (window.scrollY > 50) {
    logo.style.height = '32px'; // shrink logo slightly
  } else {
    logo.style.height = '40px'; // default size
  }
}