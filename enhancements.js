(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const header = document.querySelector('.site-header');
  const sections = [...document.querySelectorAll('.content-section')];
  const navLinks = [...document.querySelectorAll('.header-inner nav a')];
  const sectionNav = {
    about: 'about',
    experience: 'about',
    work: 'work',
    'how-i-build': 'how-i-build',
    'more-work': 'work',
    activity: 'work',
    stack: 'how-i-build',
    contact: 'contact'
  };

  sections.forEach((section, index) => {
    section.querySelector('.section-bar')?.setAttribute('data-index', String(index + 1).padStart(2, '0'));
  });

  let scrollScheduled = false;
  function updateScroll() {
    scrollScheduled = false;
    const travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / travel))})`;
    header.classList.toggle('is-scrolled', window.scrollY > 16);

    let current = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 180) current = section;
      else break;
    }
    sections.forEach(section => section.classList.toggle('is-current', section === current));
    const currentNav = current ? sectionNav[current.id] : null;
    navLinks.forEach(link => {
      const active = currentNav && link.getAttribute('href') === `#${currentNav}`;
      link.classList.toggle('active', !!active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScrollUpdate() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', scheduleScrollUpdate, {passive:true});
  window.addEventListener('resize', scheduleScrollUpdate);
  updateScroll();

  const hero = document.querySelector('.hero-art');
  const bannerWords = [...document.querySelectorAll('.banner-sequence span')];
  if (bannerWords.length && !prefersReducedMotion.matches) {
    let activeWord = 0;
    window.setInterval(() => {
      if (document.hidden) return;
      bannerWords[activeWord].classList.remove('is-active');
      activeWord = (activeWord + 1) % bannerWords.length;
      bannerWords[activeWord].classList.add('is-active');
    }, 2400);
  }
  if (hero && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--spot-x', `${((event.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
      hero.style.setProperty('--spot-y', `${((event.clientY - rect.top) / rect.height * 100).toFixed(1)}%`);
    }, {passive:true});
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--spot-x', '50%');
      hero.style.setProperty('--spot-y', '48%');
    });
  }

  const revealTargets = [
    ...document.querySelectorAll('.section-bar, .about-body > h3, .impact-stat, .about-body > p, .facts > div, .role, .work-index a, .case-study, .case-visual, .build-lead, .trace, .principles article, .project-item, .open-source-body > p, .open-source-links a, .domain-card, .stack-list > div, .contact-body > h3, .contact-body > p, .terminal-form, .footer-scene blockquote, .availability')
  ];
  if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }, {threshold:.06,rootMargin:'0px 0px -5% 0px'});
    revealTargets.forEach((element, index) => {
      element.classList.add('reveal-ready');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4,3) * 55}ms`);
      revealObserver.observe(element);
    });
    const trace = document.querySelector('.trace');
    if (trace) {
      const traceObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          trace.classList.add('is-visible');
          traceObserver.disconnect();
        }
      }, {threshold:.22});
      traceObserver.observe(trace);
    }
  }
  document.querySelectorAll('.trace-row').forEach((row,index) => row.style.setProperty('--row-index',index));

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion.matches) {
    document.querySelectorAll('.primary-button, .search-button, .case-links .outline-button').forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const dx = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const dy = (event.clientY - rect.top - rect.height / 2) / rect.height;
        button.style.translate = `${(dx * 6).toFixed(1)}px ${(dy * 4).toFixed(1)}px`;
      }, {passive:true});
      button.addEventListener('pointerleave', () => button.style.removeProperty('translate'));
      button.addEventListener('blur', () => button.style.removeProperty('translate'));
    });
  }
})();
