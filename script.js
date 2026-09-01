/* ═══════════════════════════════════════════════════════════
   GOVIND KUMAR — PORTFOLIO SCRIPTS
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. NAV — shrink padding on scroll
  ─────────────────────────────────────────── */
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  /* ─────────────────────────────────────────
     2. SMOOTH SCROLL for anchor nav links
  ─────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────
     3. SCROLL REVEAL — IntersectionObserver
  ─────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger sibling reveals for a sequential feel
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const index = siblings.indexOf(entry.target);
          const delay = Math.min(index * 80, 240); // max 240ms stagger

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────
     4. ACTIVE NAV LINK — highlight on scroll
  ─────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function setActiveNavLink() {
    const scrollY = window.scrollY;
    const navHeight = nav ? nav.offsetHeight : 72;

    let currentSection = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 60;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });

  /* ─────────────────────────────────────────
     5. TIMELINE DOTS — teal/blue alternation
        (subtle entrance glow on scroll)
  ─────────────────────────────────────────── */
  const timelineEntries = document.querySelectorAll('.timeline__entry');

  const timelineObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const dot = entry.target.querySelector('.timeline__dot');
          if (dot) {
            dot.style.animation = 'none';
            // Trigger reflow so the next animation restart is clean
            void dot.offsetWidth;
            dot.style.animation = 'dotGlow 0.6s ease forwards';
          }
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  timelineEntries.forEach(function (entry) {
    timelineObserver.observe(entry);
  });

  // Inject keyframe for dot glow if not already present
  if (!document.getElementById('gk-dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'gk-dynamic-styles';
    style.textContent = [
      '@keyframes dotGlow {',
      '  from { box-shadow: 0 0 0 0 rgba(10,10,10,0.7); transform: scale(0.5); opacity: 0; }',
      '  60%  { box-shadow: 0 0 0 12px rgba(10,10,10,0); transform: scale(1.2); opacity: 1; }',
      '  to   { box-shadow: 0 0 14px rgba(10,10,10,0.3), 0 0 28px rgba(10,10,10,0.1); transform: scale(1); opacity: 1; }',
      '}',
      '.nav__link.active { color: var(--teal); }',
      '.nav__link.active::after { right: 0; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────
     6. STAT CARDS — sequential entry delay
  ─────────────────────────────────────────── */
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(function (card, i) {
    card.style.transitionDelay = (i * 60) + 'ms';
  });

  /* ─────────────────────────────────────────
     7. SKILL TAGS — staggered hover-in
  ─────────────────────────────────────────── */
  document.querySelectorAll('.tags').forEach(function (tagGroup) {
    const tags = tagGroup.querySelectorAll('.tag');
    tags.forEach(function (tag, i) {
      tag.style.transitionDelay = (i * 18) + 'ms';
    });
  });

  /* ─────────────────────────────────────────
     8. CERT CARDS — teal glow track mouse
  ─────────────────────────────────────────── */
  document.querySelectorAll('.cert-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const glow = card.querySelector('.cert-card__glow');
      if (glow) {
        glow.style.background =
          'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(10,10,10,0.08), transparent 60%)';
      }
    });
  });

  /* ─────────────────────────────────────────
     9. PROJECT CARDS — subtle tilt on hover
  ─────────────────────────────────────────── */
  document.querySelectorAll('.project-card:not(.project-card--placeholder)').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 3;
      const rotY = dx * 3;
      card.style.transform =
        'translateY(-6px) perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.25s, box-shadow 0.3s';
      setTimeout(function () {
        card.style.transition = '';
      }, 400);
    });
  });

  /* ─────────────────────────────────────────
     10. CUSTOM CURSOR — dot + trailing ring,
         morphs on hover of interactive/text elements
  ─────────────────────────────────────────── */
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch) {
    document.documentElement.classList.add('has-custom-cursor');

    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
      }
    });

    // Smoothly trail the ring behind the dot
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRing) {
        cursorRing.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
      }
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      if (cursorDot) cursorDot.classList.add('is-hidden');
      if (cursorRing) cursorRing.classList.add('is-hidden');
    });
    document.addEventListener('mouseenter', function () {
      if (cursorDot) cursorDot.classList.remove('is-hidden');
      if (cursorRing) cursorRing.classList.remove('is-hidden');
    });

    // Morph ring on hover of interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .cert-card, .stat-card, .tag');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (cursorRing) cursorRing.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', function () {
        if (cursorRing) cursorRing.classList.remove('is-hover');
      });
    });

    // Thin "text caret" style ring on paragraphs/headings
    const textTargets = document.querySelectorAll('p, h1, h2, h3');
    textTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (cursorRing) cursorRing.classList.add('is-text');
      });
      el.addEventListener('mouseleave', function () {
        if (cursorRing) cursorRing.classList.remove('is-text');
      });
    });

    /* ─────────────────────────────────────────
       11. MAGNETIC BUTTONS — pull toward cursor
    ─────────────────────────────────────────── */
    document.querySelectorAll('.btn, .nav__logo').forEach(function (el) {
      let raf = null;

      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        const strength = 0.28;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transform = 'translate(' + (relX * strength) + 'px,' + (relY * strength) + 'px)';
        });
      });

      el.addEventListener('mouseleave', function () {
        if (raf) cancelAnimationFrame(raf);
        el.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform = 'translate(0,0)';
        setTimeout(function () { el.style.transition = ''; }, 450);
      });
    });

    /* ─────────────────────────────────────────
       12. HERO GLOW — soft light tracks the cursor
    ─────────────────────────────────────────── */
    const hero = document.getElementById('hero');
    const heroGlow = document.getElementById('heroGlow');

    if (hero && heroGlow) {
      hero.addEventListener('mousemove', function (e) {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        heroGlow.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
        heroGlow.classList.add('is-visible');
      });
      hero.addEventListener('mouseleave', function () {
        heroGlow.classList.remove('is-visible');
      });
    }
  }

})();
