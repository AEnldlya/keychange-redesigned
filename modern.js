/* ============================================================
   KEY CHANGE — Modern Animated Site JS
   ============================================================ */

(function () {
  'use strict';

  /* ── NAV: hide/show on scroll direction ── */
  const nav = document.getElementById('mNav');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNav() {
    const currentY = window.scrollY;
    if (currentY > 80) {
      nav.classList.add('scrolled');
      if (currentY > lastScrollY + 5) {
        nav.classList.add('hidden');
      } else if (currentY < lastScrollY - 5) {
        nav.classList.remove('hidden');
      }
    } else {
      nav.classList.remove('scrolled', 'hidden');
    }
    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  /* ── HAMBURGER ── */
  const hamburger = document.getElementById('mHamburger');
  const mobileMenu = document.getElementById('mMobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      const bars = hamburger.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        const bars = hamburger.querySelectorAll('span');
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      });
    });
  }

  /* ── HERO: Parallax ── */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        heroBg.style.transform = 'translateY(' + (y * 0.4) + 'px)';
      }
    }, { passive: true });
  }

  /* ── HERO: Headline is hardcoded with .m-hero__line spans, no JS needed ── */

  /* ── HERO: Floating music notes ── */
  const notesContainer = document.getElementById('heroNotes');
  if (notesContainer) {
    const noteChars = ['♩', '♪', '♫', '♬', '𝅗𝅥'];
    const noteCount = 18;

    for (let i = 0; i < noteCount; i++) {
      const note = document.createElement('span');
      note.className = 'm-hero__note';
      note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
      note.style.setProperty('--note-x', (Math.random() * 95 + 2) + '%');
      note.style.setProperty('--note-size', (0.9 + Math.random() * 1.8) + 'rem');
      note.style.setProperty('--note-dur', (6 + Math.random() * 8) + 's');
      note.style.setProperty('--note-delay', (Math.random() * 8) + 's');
      notesContainer.appendChild(note);
    }
  }

  /* ── STAT: Counter animation ── */
  const statEl = document.getElementById('statNumber');
  const statSection = document.querySelector('.m-stat');
  let statTriggered = false;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, target, duration) {
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  if (statEl && statSection) {
    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statTriggered) {
          statTriggered = true;
          statSection.classList.add('visible');
          animateCounter(statEl, parseInt(statEl.dataset.target), 2500);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statObserver.observe(statSection);
  }

  /* ── STORY: Slide-in on scroll ── */
  const storyImage = document.getElementById('storyImage');
  const storyText  = document.getElementById('storyText');

  if (storyImage && storyText) {
    const storyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          storyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    storyObserver.observe(storyImage);
    storyObserver.observe(storyText);
  }

  /* ── CARDS: Staggered reveal ── */
  const cards = document.querySelectorAll('.m-card');
  if (cards.length > 0) {
    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.15) + 's';
      cardObserver.observe(card);
    });
  }

  /* ── SOCIAL GRID: Stagger reveal ── */
  const socialItems = document.querySelectorAll('.m-social__item');
  if (socialItems.length > 0) {
    const socialObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          socialObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    socialItems.forEach(function (item, i) {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.95)';
      item.style.transition = 'opacity 0.5s ease ' + (i * 0.1) + 's, transform 0.5s ease ' + (i * 0.1) + 's';
      socialObserver.observe(item);
    });
  }

  // Add visible handling for social items
  document.addEventListener('animateVisible', function () {});
  // Handle via the existing observer: add visible class
  const origSocialObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
        origSocialObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  socialItems.forEach(function (item) {
    origSocialObserver.observe(item);
  });

  /* ── CONTACT: Slide-in ── */
  const contactLeft  = document.getElementById('contactLeft');
  const contactRight = document.getElementById('contactRight');

  if (contactLeft && contactRight) {
    const contactObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          contactObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    contactObserver.observe(contactLeft);
    contactObserver.observe(contactRight);
  }

  /* ── Generic section reveal (.m-reveal) ── */
  const revealEls = document.querySelectorAll('.m-reveal');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Form: reply-to helper ── */
  document.querySelectorAll('form').forEach(function (form) {
    const emailInput = form.querySelector('input[type="email"]');
    const replyTo = form.querySelector('input[name="_replyto"]');
    if (emailInput && replyTo) {
      emailInput.addEventListener('input', function () {
        replyTo.value = emailInput.value;
      });
    }
  });

})();
