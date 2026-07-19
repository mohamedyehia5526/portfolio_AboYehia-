/* ============================================
   MOHAMED YEHIA PORTFOLIO — JAVASCRIPT
   Modular, performance-focused interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  const DOM = {
    loader: document.getElementById('loader'),
    header: document.getElementById('header'),
    navMenu: document.getElementById('navMenu'),
    navToggle: document.getElementById('navToggle'),
    navLinks: document.querySelectorAll('.nav__link'),
    themeToggle: document.getElementById('themeToggle'),
    scrollProgressBar: document.getElementById('scrollProgressBar'),
    backToTop: document.getElementById('backToTop'),
    mouseGlow: document.getElementById('mouse-glow'),
    particlesCanvas: document.getElementById('particles-canvas'),
    typingText: document.getElementById('typingText'),
    timelineFill: document.getElementById('timelineFill'),
    contactForm: document.getElementById('contactForm'),
    formStatus: document.getElementById('formStatus'),
    testimonialsTrack: document.getElementById('testimonialsTrack'),
    testimonialPrev: document.getElementById('testimonialPrev'),
    testimonialNext: document.getElementById('testimonialNext'),
    testimonialsDots: document.getElementById('testimonialsDots'),
  };

  /* ---------- Constants ---------- */
  const TYPING_TITLES = [
    'Video Producer',
    'Video Editor',
    'Voice Over Artist',
    'Content Creator',
  ];

  const THEME_KEY = 'portfolio-theme';
  const AUTO_SLIDE_INTERVAL = 5000;

  /* ---------- Utility: Throttle ---------- */
  function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }

  /* ---------- Loading Screen ---------- */
  function initLoader() {
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
      setTimeout(() => {
        DOM.loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 2200);
    });
  }

  /* ---------- Theme Toggle (LocalStorage) ---------- */
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    DOM.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';

      if (next === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------- Navigation ---------- */
  function initNavigation() {
    /* Mobile menu toggle */
    DOM.navToggle.addEventListener('click', () => {
      const isOpen = DOM.navMenu.classList.toggle('open');
      DOM.navToggle.classList.toggle('active');
      DOM.navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close menu on link click */
    DOM.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        DOM.navMenu.classList.remove('open');
        DOM.navToggle.classList.remove('active');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Smooth scroll for anchor links */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- Scroll Handlers ---------- */
  function initScrollEffects() {
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      /* Progress bar */
      DOM.scrollProgressBar.style.width = scrollPercent + '%';

      /* Header blur on scroll */
      DOM.header.classList.toggle('scrolled', scrollY > 50);

      /* Back to top visibility */
      DOM.backToTop.classList.toggle('visible', scrollY > 400);

      /* Active nav link */
      let currentSection = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      DOM.navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.section === currentSection);
      });
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* Back to top click */
    DOM.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll Reveal (Intersection Observer) ---------- */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ---------- Typing Animation ---------- */
  function initTypingAnimation() {
    if (!DOM.typingText) return;

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentTitle = TYPING_TITLES[titleIndex];

      if (isDeleting) {
        DOM.typingText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
      } else {
        DOM.typingText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentTitle.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % TYPING_TITLES.length;
        delay = 500;
      }

      setTimeout(type, delay);
    }

    type();
  }

  /* ---------- Counter Animation ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-card__number');

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /* ---------- Skill Progress Bars ---------- */
  function initSkillBars() {
    const progressBars = document.querySelectorAll('.skill-card__progress');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progress = entry.target.dataset.progress;
            entry.target.style.width = progress + '%';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    progressBars.forEach((bar) => observer.observe(bar));
  }

  /* ---------- Timeline Fill Animation ---------- */
  function initTimeline() {
    if (!DOM.timelineFill) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            DOM.timelineFill.style.height = '100%';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const timeline = document.querySelector('.timeline');
    if (timeline) observer.observe(timeline);
  }

  /* ---------- Testimonials Slider ---------- */
  function initTestimonials() {
    const cards = DOM.testimonialsTrack.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoSlideTimer = null;

    /* Create pagination dots */
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonials__dot');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      DOM.testimonialsDots.appendChild(dot);
    });

    const dots = DOM.testimonialsDots.querySelectorAll('.testimonials__dot');

    function goToSlide(index) {
      cards[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');

      currentIndex = (index + cards.length) % cards.length;

      cards[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');

      resetAutoSlide();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideTimer);
      autoSlideTimer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    }

    DOM.testimonialNext.addEventListener('click', nextSlide);
    DOM.testimonialPrev.addEventListener('click', prevSlide);

    /* Pause on hover */
    DOM.testimonialsTrack.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    DOM.testimonialsTrack.addEventListener('mouseleave', resetAutoSlide);

    resetAutoSlide();
  }

  /* ---------- Contact Form ---------- */
  function initContactForm() {
    DOM.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(DOM.contactForm);
      const name = formData.get('fullName').trim();
      const email = formData.get('email').trim();
      const subject = formData.get('subject').trim();
      const message = formData.get('message').trim();

      if (!name || !email || !subject || !message) {
        DOM.formStatus.textContent = 'Please fill in all fields.';
        DOM.formStatus.style.color = '#e74c3c';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        DOM.formStatus.textContent = 'Please enter a valid email address.';
        DOM.formStatus.style.color = '#e74c3c';
        return;
      }

      /* Open mailto with form data */
      const mailBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      const mailSubject = encodeURIComponent(subject);
      window.location.href = `mailto:Mohamed.yehia5526@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      DOM.formStatus.textContent = 'Thank you! Your email client should open shortly.';
      DOM.formStatus.style.color = '';
      DOM.contactForm.reset();
    });
  }

  /* ---------- Ripple Effect ---------- */
  function initRipple() {
    document.querySelectorAll('.ripple').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        ripple.classList.add('ripple-effect');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* ---------- Mouse Glow Effect ---------- */
  function initMouseGlow() {
    if (!DOM.mouseGlow || window.matchMedia('(max-width: 768px)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      DOM.mouseGlow.style.left = glowX + 'px';
      DOM.mouseGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  /* ---------- Floating Particles (Canvas) ---------- */
  function initParticles() {
    const canvas = DOM.particlesCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor(window.innerWidth / 15), 80);
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim();

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = accentColor || '#D99B7F';
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', throttle(() => {
      resize();
      createParticles();
    }, 300));

    /* Pause particles when tab is hidden */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        draw();
      }
    });
  }

  /* ---------- Parallax on Home Image ---------- */
  function initParallax() {
    const imageWrapper = document.querySelector('.home__image-wrapper');
    if (!imageWrapper || window.matchMedia('(max-width: 992px)').matches) return;

    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      const offset = scrollY * 0.08;
      imageWrapper.style.transform = `translateY(${offset}px)`;
    }, 16), { passive: true });
  }

  /* ---------- Initialize All Modules ---------- */
  function init() {
    initLoader();
    initTheme();
    initNavigation();
    initScrollEffects();
    initScrollReveal();
    initTypingAnimation();
    initCounters();
    initSkillBars();
    initTimeline();
    initTestimonials();
    initContactForm();
    initRipple();
    initMouseGlow();
    initParticles();
    initParallax();
  }

  /* Run when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
