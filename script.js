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

/* ══════════════════════════════════════════════
   EASTER EGGS
═══════════════════════════════════════════════ */
(function () {

  /* ── 2. Console message ── */
  console.log('%c  GK.  ', 'background:#0a0a0a;color:#fff;font-size:16px;font-weight:bold;padding:6px 12px;border-radius:4px;');
  console.log('%cLooking for the source? → https://github.com/notgovindkumar', 'color:#0a0a0a;font-family:monospace;font-size:12px;');
  console.log('%cPS: there are a few easter eggs hidden on this site. Good luck.', 'color:#63636b;font-family:monospace;font-size:12px;');

  /* ── 3. Click logo x5 fast → spin + tooltip ── */
  const navLogo = document.getElementById('navLogo');
  if (navLogo) {
    let clickCount = 0;
    let clickTimer = null;
    let tooltip = null;

    navLogo.addEventListener('click', function (e) {
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(function () { clickCount = 0; }, 900);

      if (clickCount >= 5) {
        clickCount = 0;
        e.preventDefault();
        navLogo.classList.add('egg-spin');
        setTimeout(function () { navLogo.classList.remove('egg-spin'); }, 650);

        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.className = 'egg-logo-tip';
          tooltip.textContent = "okay, you found it. hi.";
          document.body.appendChild(tooltip);
        }
        const rect = navLogo.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 10) + 'px';
        tooltip.classList.add('show');
        setTimeout(function () { tooltip.classList.remove('show'); }, 2200);
      }
    });
  }

  /* ── 4. Type "sudo" → fake terminal command ── */
  (function () {
    const target = 'sudo';
    let buffer = '';
    const overlay = document.getElementById('eggTerminal');
    const textEl = document.getElementById('eggTerminalText');
    const fullCmd = 'sudo hire-govind --now';
    let typing = false;

    document.addEventListener('keydown', function (e) {
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-target.length);
      if (buffer === target && !typing && overlay) {
        typing = true;
        buffer = '';
        overlay.classList.add('show');
        textEl.textContent = '';
        let i = 0;
        const typeInterval = setInterval(function () {
          textEl.textContent += fullCmd[i];
          i++;
          if (i >= fullCmd.length) {
            clearInterval(typeInterval);
            setTimeout(function () {
              overlay.classList.remove('show');
              typing = false;
            }, 1600);
          }
        }, 55);
      }
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        overlay.classList.remove('show');
        typing = false;
      });
    }
  })();

  /* ── 5. Hold Shift → dotted cursor trail ── */
  (function () {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;

    let shiftHeld = false;
    let lastDrop = 0;

    document.addEventListener('keydown', function (e) { if (e.key === 'Shift') shiftHeld = true; });
    document.addEventListener('keyup', function (e) { if (e.key === 'Shift') shiftHeld = false; });

    document.addEventListener('mousemove', function (e) {
      if (!shiftHeld) return;
      const now = Date.now();
      if (now - lastDrop < 35) return;
      lastDrop = now;

      const dot = document.createElement('span');
      dot.className = 'egg-trail-dot';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      document.body.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 650);
    });
  })();

  /* ── 6. Reached bottom + waited → end message ── */
  (function () {
    const msg = document.getElementById('eggEndMsg');
    if (!msg) return;
    let timer = null;

    window.addEventListener('scroll', function () {
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 40;
      if (atBottom) {
        if (!timer) {
          timer = setTimeout(function () { msg.classList.add('show'); }, 1500);
        }
      } else {
        clearTimeout(timer);
        timer = null;
        msg.classList.remove('show');
      }
    }, { passive: true });
  })();

  /* ── 7. Double-click footer name → boot log ── */
  (function () {
    const nameEl = document.getElementById('footerName');
    const bootEl = document.getElementById('eggBoot');
    if (!nameEl || !bootEl) return;

    const lines = [
      'booting govind_os v2.6 ...',
      '[ok] loading salesforce runtime',
      '[ok] mounting trailhead badges (400+)',
      '[ok] initializing flow builder engine',
      '[ok] linking apex triggers',
      '[ok] syncing rental360.crm',
      '[ok] compiling intent-tab.extension',
      '[ok] deploying skit-football-trials.page',
      '[warn] caffeine levels critical',
      '[ok] caffeine restocked',
      '',
      'govind_os ready. press any key to exit.'
    ];

    nameEl.addEventListener('dblclick', function () {
      bootEl.innerHTML = '';
      bootEl.classList.add('show');
      document.body.style.overflow = 'hidden';

      lines.forEach(function (line, i) {
        setTimeout(function () {
          const div = document.createElement('div');
          div.className = 'egg-boot__line';
          div.textContent = line || '\u00A0';
          bootEl.appendChild(div);
        }, i * 180);
      });

      function exitBoot() {
        bootEl.classList.remove('show');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', exitBoot);
        bootEl.removeEventListener('click', exitBoot);
      }
      setTimeout(function () {
        document.addEventListener('keydown', exitBoot);
        bootEl.addEventListener('click', exitBoot);
      }, lines.length * 180 + 200);
    });
  })();

  /* ── 8. Type "invert" → toggle inverted colors ── */
  (function () {
    const target = 'invert';
    let buffer = '';

    document.addEventListener('keydown', function (e) {
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-target.length);
      if (buffer === target) {
        buffer = '';
        document.documentElement.classList.toggle('egg-inverted');
      }
    });
  })();

  /* ── 9. Rapid click x10 anywhere → mono particle burst ── */
  (function () {
    let clicks = 0;
    let resetTimer = null;

    document.addEventListener('click', function (e) {
      clicks++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () { clicks = 0; }, 1200);

      if (clicks >= 10) {
        clicks = 0;
        const count = 14;
        for (let i = 0; i < count; i++) {
          const p = document.createElement('span');
          p.className = 'egg-particle';
          const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
          const dist = 40 + Math.random() * 60;
          p.style.left = e.clientX + 'px';
          p.style.top = e.clientY + 'px';
          p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
          p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
          if (Math.random() > 0.6) p.style.borderRadius = '50%';
          document.body.appendChild(p);
          setTimeout(function () { p.remove(); }, 700);
        }
      }
    });
  })();

  /* ── 10. Type "whoami" → terminal-style overlay ── */
  (function () {
    const target = 'whoami';
    let buffer = '';
    const overlay = document.getElementById('eggTerminal');
    const textEl = document.getElementById('eggTerminalText');
    const whoamiLines = [
      'govind kumar',
      'salesforce builder · ai enthusiast · b.tech cse \'28'
    ];
    let typing = false;

    document.addEventListener('keydown', function (e) {
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-target.length);
      if (buffer === target && !typing && overlay) {
        typing = true;
        buffer = '';
        overlay.classList.add('show');
        textEl.innerHTML = '';
        const full = whoamiLines.join('\n');
        let i = 0;
        const typeInterval = setInterval(function () {
          textEl.innerHTML = full.slice(0, i + 1).replace(/\n/g, '<br>');
          i++;
          if (i >= full.length) {
            clearInterval(typeInterval);
            setTimeout(function () {
              overlay.classList.remove('show');
              typing = false;
            }, 1800);
          }
        }, 40);
      }
    });
  })();

  /* ── 11. Idle 30-45s → cursor ring breathing pulse ── */
  (function () {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const cursorRing = document.getElementById('cursorRing');
    if (isTouch || !cursorRing) return;

    let idleTimer = null;
    const IDLE_MS = 35000;

    function startIdleWatch() {
      clearTimeout(idleTimer);
      cursorRing.classList.remove('egg-idle-pulse');
      idleTimer = setTimeout(function () {
        cursorRing.classList.add('egg-idle-pulse');
      }, IDLE_MS);
    }

    ['mousemove', 'scroll', 'keydown', 'click'].forEach(function (evt) {
      document.addEventListener(evt, startIdleWatch, { passive: true });
    });
    startIdleWatch();
  })();

  /* ── 12. Project card long-press (1.5s) → flip reveals dev note ── */
  (function () {
    const notes = {
      '01': "built this for SIH at 2am, still not sure how the geolocation math worked",
      '02': "my family's actual rental business runs on this — zero excuses for bugs",
      '03': "the firebase backend died and I never had the heart to fix it",
      '04': "made this in one sitting because the trials were literally the next day",
      '05': "co-built this — half the commits at 1am arguing about manifest v3 permissions"
    };

    document.querySelectorAll('.project-card:not(.project-card--placeholder)').forEach(function (card) {
      const indexEl = card.querySelector('.project-card__index');
      const key = indexEl ? indexEl.textContent.trim() : null;
      const note = key && notes[key];
      if (!note) return;

      let pressTimer = null;
      let flipEl = null;

      function showFlip() {
        if (!flipEl) {
          flipEl = document.createElement('div');
          flipEl.className = 'egg-card-flip mono';
          flipEl.textContent = note;
          card.appendChild(flipEl);
        }
        requestAnimationFrame(function () { flipEl.classList.add('show'); });
      }
      function hideFlip() {
        if (flipEl) flipEl.classList.remove('show');
      }

      card.addEventListener('mousedown', function () {
        pressTimer = setTimeout(showFlip, 1500);
      });
      ['mouseup', 'mouseleave'].forEach(function (evt) {
        card.addEventListener(evt, function () {
          clearTimeout(pressTimer);
          hideFlip();
        });
      });
    });
  })();

  /* ── 13. Type "1410" → personal easter egg popup ── */
  (function () {
    const target = '1410';
    let buffer = '';
    let popup = null;

    document.addEventListener('keydown', function (e) {
      if (e.key.length !== 1 || !/[0-9]/.test(e.key)) return;
      buffer = (buffer + e.key).slice(-target.length);
      if (buffer === target) {
        buffer = '';
        if (!popup) {
          popup = document.createElement('div');
          popup.className = 'egg-logo-tip egg-1410-tip';
          popup.textContent = "hi. you know why this number matters. 🤍";
          document.body.appendChild(popup);
        }
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%,-50%)';
        popup.classList.add('show');
        setTimeout(function () { popup.classList.remove('show'); }, 2600);
      }
    });
  })();

  /* ── 14. Plain Arrow Up/Down → scroll to next/prev section ── */
  (function () {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!sections.length) return;
    const nav = document.getElementById('nav');

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 72;
      const scrollY = window.scrollY;

      let currentIdx = 0;
      sections.forEach(function (s, i) {
        if (scrollY >= s.offsetTop - navHeight - 60) currentIdx = i;
      });

      const targetIdx = e.key === 'ArrowDown'
        ? Math.min(currentIdx + 1, sections.length - 1)
        : Math.max(currentIdx - 1, 0);

      const top = sections[targetIdx].getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  })();

  /* ── 15. Right-click → custom minimal context menu ── */
  (function () {
    let menu = null;

    function closeMenu() {
      if (menu) { menu.remove(); menu = null; }
    }

    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      closeMenu();

      menu = document.createElement('div');
      menu.className = 'egg-context-menu mono';

      const items = [
        { label: 'View source on GitHub ↗', action: function () { window.open('https://github.com/notgovindkumar/notgovindkumar.github.io', '_blank', 'noopener'); } },
        { label: 'Say hi ↗', action: function () { window.location.href = 'mailto:baranwalgovind2007@gmail.com'; } }
      ];

      items.forEach(function (item) {
        const el = document.createElement('div');
        el.className = 'egg-context-menu__item';
        el.textContent = item.label;
        el.addEventListener('click', function () {
          item.action();
          closeMenu();
        });
        menu.appendChild(el);
      });

      document.body.appendChild(menu);
      const mw = menu.offsetWidth;
      const mh = menu.offsetHeight;
      menu.style.left = Math.min(e.clientX, window.innerWidth - mw - 12) + 'px';
      menu.style.top = Math.min(e.clientY, window.innerHeight - mh - 12) + 'px';
      requestAnimationFrame(function () { menu.classList.add('show'); });
    });

    document.addEventListener('click', closeMenu);
    window.addEventListener('scroll', closeMenu, { passive: true });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  })();

  /* ── 16. Type "eggs" → cheat sheet of hints ── */
  (function () {
    const target = 'eggs';
    let buffer = '';
    let sheet = null;

    const hints = [
      'console — check the console on load',
      'nav logo — click it 5 times, fast',
      '"sudo" — type it anywhere',
      'shift + mouse — hold and move (desktop)',
      'scroll to the bottom — and wait a beat',
      'footer name — double-click it',
      '"invert" — type it anywhere (again to undo)',
      '10 clicks — click anywhere, fast, 10 times',
      '"whoami" — type it anywhere',
      'idle — leave the cursor alone for a while',
      'project cards — press and hold one',
      'a certain number — type it anywhere',
      'arrow up/down — jump between sections',
      'right-click — anywhere',
      'this list — type "eggs" again to close'
    ];

    document.addEventListener('keydown', function (e) {
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-target.length);
      if (buffer !== target) return;
      buffer = '';

      if (sheet) {
        sheet.classList.remove('show');
        setTimeout(function () { if (sheet) { sheet.remove(); sheet = null; } }, 300);
        return;
      }

      sheet = document.createElement('div');
      sheet.className = 'egg-cheatsheet mono';
      const box = document.createElement('div');
      box.className = 'egg-cheatsheet__box';
      const title = document.createElement('div');
      title.className = 'egg-cheatsheet__title';
      title.textContent = 'egg hints — type "eggs" again to close';
      box.appendChild(title);
      hints.forEach(function (h) {
        const line = document.createElement('div');
        line.className = 'egg-cheatsheet__line';
        line.textContent = h;
        box.appendChild(line);
      });
      sheet.appendChild(box);
      sheet.addEventListener('click', function (e) {
        if (e.target === sheet) sheet.classList.remove('show');
      });
      document.body.appendChild(sheet);
      requestAnimationFrame(function () { sheet.classList.add('show'); });
    });
  })();

})();
