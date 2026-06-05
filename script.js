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
      '  from { box-shadow: 0 0 0 0 rgba(0,212,160,0.8); transform: scale(0.5); opacity: 0; }',
      '  60%  { box-shadow: 0 0 0 12px rgba(0,212,160,0); transform: scale(1.2); opacity: 1; }',
      '  to   { box-shadow: 0 0 14px rgba(0,212,160,0.4), 0 0 28px rgba(0,212,160,0.15); transform: scale(1); opacity: 1; }',
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
          'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(0,212,160,0.15), transparent 60%)';
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

})();
