(function () {
  'use strict';

  const siteHeader = document.querySelector('.site-header');
  const heroContent = document.querySelector('.hero__content-wrap');
  const heroText = document.querySelector('.hero__text');
  const heroSection = document.querySelector('.hero');
  const featuredWork = document.querySelector('.featured-work');
  const workItems = document.querySelectorAll('.featured-work__item');
  const footer = document.querySelector('.site-footer');
  const footerSpacer = document.getElementById('footer-spacer');
  const menuToggles = document.querySelectorAll('.site-header__menu-toggle');
  const lightSections = document.querySelectorAll('.section--light');
  const reveals = document.querySelectorAll('.reveal');

  const isMobile = () => window.innerWidth < 992;
  const isNarrow = () => window.innerWidth < 768;

  function clearMenuScrollLock() {
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.touchAction = '';
  }

  clearMenuScrollLock();

  /* ── Scroll reveal ── */
  function initReveals() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: isMobile() ? 0.08 : 0.15,
        rootMargin: isMobile() ? '0px 0px -20px 0px' : '0px 0px -40px 0px',
      }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  /* ── Sticky header ── */
  function initStickyHeader() {
    const menuBar = document.querySelector('.site-header__menu-bar');
    const primaryLogo = menuBar && menuBar.querySelector('.site-header__logo');
    const stickyThreshold = isNarrow() ? 36 : 64;

    function update() {
      const isSticky = window.scrollY > stickyThreshold;
      siteHeader.classList.toggle('site-header--sticky', isSticky);
      if (primaryLogo) {
        primaryLogo.classList.toggle('site-header__logo--hidden', isSticky);
      }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ── Hero fade on scroll ── */
  function initHeroFade() {
    if (!heroContent || !heroSection) return;

    function updateHeroFade() {
      const rect = heroSection.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const ratio = visible / rect.height;
      const fading = ratio < 0.15;
      heroContent.classList.toggle('fade', fading);
      if (heroText) heroText.classList.toggle('fade', fading);
    }

    updateHeroFade();
    window.addEventListener('scroll', updateHeroFade, { passive: true });
    window.addEventListener('resize', updateHeroFade);
  }

  /* ── Featured work background color ── */
  function initWorkScrollColors() {
    if (!featuredWork || !workItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const color = entry.target.dataset.scrollcolor;
            if (color) {
              featuredWork.style.backgroundColor = color;
              featuredWork.classList.add('active');
            }
          }
        });
      },
      {
        threshold: isMobile() ? 0.25 : 0.4,
        rootMargin: isMobile() ? '-10% 0px -10% 0px' : '-20% 0px -20% 0px',
      }
    );

    workItems.forEach((item) => observer.observe(item));
  }

  /* ── Header theme (dark text on light sections) ── */
  function initHeaderTheme() {
    if (!lightSections.length) return;

    lightSections.forEach((section) => {
      section.dataset.inView = 'false';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.inView = entry.isIntersecting ? 'true' : 'false';
        });
        const onLight = [...lightSections].some((section) => section.dataset.inView === 'true');
        document.body.setAttribute('data-header-theme', onLight ? 'dark' : 'light');
        siteHeader.classList.toggle('site-header--white-background', onLight);
      },
      { threshold: 0.05, rootMargin: '-80px 0px 0px 0px' }
    );

    lightSections.forEach((section) => observer.observe(section));
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    const MENU_ANIM_MS = 500;
    let menuAnimating = false;
    let savedScrollY = 0;

    function updateMenuAria(open) {
      menuToggles.forEach((btn) => {
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    function lockBodyScroll() {
      savedScrollY = window.scrollY;
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.position = 'fixed';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }

    function unlockBodyScroll() {
      clearMenuScrollLock();
      window.scrollTo(0, savedScrollY);
    }

    function isMenuOpen() {
      return (
        siteHeader.classList.contains('site-header--menu-open') &&
        !siteHeader.classList.contains('site-header--menu-closing')
      );
    }

    function finishMenuClose() {
      siteHeader.classList.remove('site-header--menu-open', 'site-header--menu-closing');
      unlockBodyScroll();
      menuAnimating = false;
      updateMenuAria(false);
    }

    function setMenuOpen(open, immediate) {
      if (!isNarrow()) {
        if (!open) finishMenuClose();
        return;
      }

      if (open) {
        if (menuAnimating || isMenuOpen()) return;
        siteHeader.classList.remove('site-header--menu-closing');
        siteHeader.classList.add('site-header--menu-open');
        lockBodyScroll();
        updateMenuAria(true);
        return;
      }

      if (!siteHeader.classList.contains('site-header--menu-open')) return;

      if (immediate) {
        finishMenuClose();
        return;
      }

      menuAnimating = true;
      updateMenuAria(false);
      siteHeader.classList.add('site-header--menu-closing');
      window.setTimeout(finishMenuClose, MENU_ANIM_MS);
    }

    menuToggles.forEach((toggle) => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(!isMenuOpen());
      });
    });

    document.querySelectorAll('.site-header__menu-item a').forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href') || '';
        const isHashOnly = href.startsWith('#');
        const isCrossPageHash = href.includes('#') && !isHashOnly;

        if (!isHashOnly && !isCrossPageHash) {
          setMenuOpen(false, true);
          return;
        }

        if (isCrossPageHash) {
          setMenuOpen(false, true);
          return;
        }

        event.preventDefault();
        const targetId = href === '#' ? 'top' : href.slice(1);
        const scrollTarget = targetId === 'top' ? null : document.getElementById(targetId);

        setMenuOpen(false, true);

        window.requestAnimationFrame(() => {
          if (targetId === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (scrollTarget) {
            const top = scrollTarget.getBoundingClientRect().top + window.scrollY - 64;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) setMenuOpen(false, true);
    });
  }

  /* ── Anchor navigation (desktop + in-page links) ── */
  function initAnchorNav() {
    const headerOffset = () => (isNarrow() ? 52 : 72);

    document.querySelectorAll('a[href*="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (link.closest('.site-header__menu') && window.innerWidth < 768) return;

        const href = link.getAttribute('href') || '';
        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) return;

        const path = href.slice(0, hashIndex) || window.location.pathname.split('/').pop() || 'index.html';
        const hash = href.slice(hashIndex);
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (path !== currentPage && path !== '') return;

        if (hash === '#') {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const target = document.querySelector(hash);
        if (!target) return;

        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ── Menu item hover dimming ── */
  function initMenuHover() {
    const items = document.querySelectorAll('.site-header__menu-item');
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => siteHeader.classList.add('site-header--menu-item-hovered'));
      item.addEventListener('mouseleave', () => siteHeader.classList.remove('site-header--menu-item-hovered'));
    });
  }

  /* ── Footer spacer for fixed footer reveal ── */
  function initFooterSpacer() {
    if (!footer || !footerSpacer) return;
    function update() {
      footerSpacer.style.height = '0';
    }
    update();
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
  }

  /* ── Nav active state from current page ── */
  function initNavActive() {
    const items = document.querySelectorAll('.site-header__menu-item');
    const pageType = document.body.dataset.page; // 'Home' or 'Careers'
    let currentActiveSection = pageType;

    // Define helper to apply active class
    function applyActiveState(activePage) {
      items.forEach((item) => {
        const isCurrent = item.dataset.toPage === activePage;
        item.classList.toggle('active', isCurrent);
        const link = item.querySelector('a');
        if (link) {
          if (isCurrent) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        }
      });
    }

    // Initialize state
    applyActiveState(currentActiveSection);

    // Mouse hover behaviors
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        items.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
      });
      item.addEventListener('mouseleave', () => {
        applyActiveState(currentActiveSection);
      });
    });

    // Scroll spy (only on homepage)
    if (pageType === 'Home') {
      const sections = [
        { id: 'top', page: 'Home' },
        { id: 'mission', page: 'Mission' },
        { id: 'problem', page: 'Problem' },
        { id: 'process', page: 'Process' },
        { id: 'join-team', page: 'Careers' },
        { id: 'contact', page: 'Contact' }
      ];

      const sectionElements = sections.map(sec => {
        return {
          page: sec.page,
          el: sec.id === 'top' ? document.getElementById('top') : document.getElementById(sec.id)
        };
      }).filter(sec => sec.el !== null);

      function updateActiveSection() {
        let activePage = 'Home';
        const scrollPosition = window.scrollY;
        const headerHeight = isNarrow() ? 62 : 75;
        const threshold = scrollPosition + headerHeight + 120; // trigger check

        // Check if we are near the bottom of the page
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 120);

        if (isAtBottom) {
          activePage = 'Contact';
        } else {
          for (let i = 0; i < sectionElements.length; i++) {
            const sec = sectionElements[i];
            if (sec.page === 'Home') continue;
            
            // Get section top position relative to document
            const sectionTop = sec.el.offsetTop;
            if (threshold >= sectionTop) {
              activePage = sec.page;
            }
          }
        }

        if (currentActiveSection !== activePage) {
          currentActiveSection = activePage;
          // Only update elements if the user is not currently hovering over the menu
          const isHovering = siteHeader.classList.contains('site-header--menu-item-hovered');
          if (!isHovering) {
            applyActiveState(currentActiveSection);
          }
        }
      }

      window.addEventListener('scroll', updateActiveSection, { passive: true });
      window.addEventListener('resize', updateActiveSection);
      window.addEventListener('load', updateActiveSection);
      updateActiveSection();
    }
  }

  /* ── Page scroll nudge cue on load ── */
  function initScrollNudge() {
    if (window.scrollY > 10) return;

    function smoothScrollTo(targetY, duration) {
      const startY = window.scrollY;
      const difference = targetY - startY;
      const startTime = performance.now();

      function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      return new Promise((resolve) => {
        function step(currentTime) {
          const timeElapsed = currentTime - startTime;
          if (timeElapsed < duration) {
            window.scrollTo(0, easeInOutQuad(timeElapsed, startY, difference, duration));
            requestAnimationFrame(step);
          } else {
            window.scrollTo(0, targetY);
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }

    window.addEventListener('load', () => {
      if (window.scrollY > 10) return;

      setTimeout(async () => {
        if (window.scrollY > 10) return;

        // Smooth scroll down slightly (1000ms duration)
        await smoothScrollTo(80, 1000);

        // Pause for 600ms
        setTimeout(async () => {
          // Only scroll back if the user has not scrolled manually further down
          if (window.scrollY < 120) {
            await smoothScrollTo(0, 900);
          }
        }, 600);
      }, 1500); // Delay before nudge starts
    });
  }

  initReveals();
  initStickyHeader();
  initHeroFade();
  initWorkScrollColors();
  initHeaderTheme();
  initMobileMenu();
  initAnchorNav();
  initMenuHover();
  initFooterSpacer();
  initNavActive();
  initScrollNudge();
})();
