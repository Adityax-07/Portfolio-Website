(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const impactNumbers = [...document.querySelectorAll('.impact-stat [data-count]')];
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const numberObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        numberObserver.unobserve(entry.target);
        const end = Number(entry.target.dataset.count);
        const started = performance.now();
        function frame(now) {
          const t = Math.min(1, (now - started) / 850);
          const eased = 1 - Math.pow(1 - t, 3);
          entry.target.textContent = String(Math.round(end * eased));
          if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }
    }, {threshold:.65});
    impactNumbers.forEach(number => numberObserver.observe(number));
  }

  const visualImages = [...document.querySelectorAll('.case-visual--image img')];
  if (visualImages.length && !reducedMotion.matches) {
    let scheduled = false;
    function updateParallax() {
      scheduled = false;
      for (const image of visualImages) {
        const rect = image.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const center = rect.top + rect.height / 2;
        const displacement = (center - window.innerHeight / 2) / window.innerHeight;
        image.style.setProperty('--visual-parallax', `${Math.max(-14, Math.min(14, displacement * -24)).toFixed(1)}px`);
      }
    }
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateParallax);
    }
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule);
    updateParallax();
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
    document.querySelectorAll('.domain-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height * 100).toFixed(1)}%`);
      }, {passive:true});
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }
})();
