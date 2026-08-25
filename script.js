document.addEventListener('DOMContentLoaded', function () {
  // ===== Mobile Menu =====
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ===== Sticky Header =====
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // ===== Countdown to 14 Sept 2026 =====
  const targetDate = new Date('2026-09-14T00:00:00').getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) {
      document.getElementById('timerDays').textContent = '00';
      return;
    }
    document.getElementById('timerDays').textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
    document.getElementById('timerHours').textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    document.getElementById('timerMinutes').textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    document.getElementById('timerSeconds').textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== Animated Counters =====
  const counters = document.querySelectorAll('.counter');
  const observerOptions = { threshold: 0.5 };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const increment = target / 80;
        const update = () => {
          count += increment;
          if (count < target) {
            counter.textContent = Math.ceil(count);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        };
        update();
        counterObserver.unobserve(counter);
      }
    });
  }, observerOptions);
  counters.forEach(c => counterObserver.observe(c));

  // ===== Scroll Reveal =====
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => revealObserver.observe(el));

  // ===== Theme Filter =====
  const filterBtns = document.querySelectorAll('.theme-filter-btn');
  const themeCards = document.querySelectorAll('.theme-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.themeFilter;
      themeCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== Cost Estimator =====
  const sizeRange = document.getElementById('sizeRange');
  const typeBtns = document.querySelectorAll('.pill-btn');
  const durationSelect = document.getElementById('durationSelect');
  const lightSelect = document.getElementById('lightSelect');
  const sizeLabels = ['15×30', '20×40', '30×60', '40×80', '50×100'];
  let currentType = 'theme';

  function calculatePrice() {
    const sizeIdx = +sizeRange.value - 1;
    const duration = +durationSelect.value;
    const light = lightSelect.value;
    let base = { basic: [35000, 55000, 85000, 120000, 180000], theme: [95000, 145000, 220000, 320000, 480000], eco: [55000, 85000, 130000, 190000, 280000] };
    let min = base[currentType][sizeIdx];
    let max = Math.round(min * 1.45);
    if (duration >= 10) { min = Math.round(min * 1.25); max = Math.round(max * 1.25); }
    else if (duration >= 7) { min = Math.round(min * 1.15); max = Math.round(max * 1.15); }
    if (light === 'royal') { min = Math.round(min * 1.3); max = Math.round(max * 1.35); }
    else if (light === 'premium') { min = Math.round(min * 1.15); max = Math.round(max * 1.2); }
    document.getElementById('priceMin').textContent = '₹' + min.toLocaleString('en-IN');
    document.getElementById('priceMax').textContent = '₹' + max.toLocaleString('en-IN');
    document.getElementById('sizeValue').textContent = sizeLabels[sizeIdx] + ' ft';
    document.getElementById('outputDuration').textContent = `For ${duration} Days ${currentType === 'theme' ? 'Theme' : currentType === 'eco' ? 'Eco' : 'Basic'} Mandap • ${sizeLabels[sizeIdx]} ft`;
  }
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
      document.getElementById('typeBadge').textContent = btn.textContent;
      calculatePrice();
    });
  });
  if (sizeRange) sizeRange.addEventListener('input', calculatePrice);
  if (durationSelect) durationSelect.addEventListener('change', calculatePrice);
  if (lightSelect) lightSelect.addEventListener('change', calculatePrice);
  calculatePrice();

  // ===== Before-After Slider =====
  const slider = document.getElementById('comparisonSlider');
  const handle = document.getElementById('sliderHandle');
  const afterImg = document.querySelector('.slider-image-after');
  if (slider && handle && afterImg) {
    let isDragging = false;
    function moveSlider(x) {
      const rect = slider.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      afterImg.style.width = pos + '%';
      handle.style.left = pos + '%';
    }
    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', e => { if (isDragging) moveSlider(e.clientX); });
    slider.addEventListener('touchstart', e => { isDragging = true; moveSlider(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', e => { if (isDragging) moveSlider(e.touches[0].clientX); }, { passive: true });
  }

  // ===== Back to Top =====
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ===== Temple Bell =====
  const bellBtn = document.getElementById('bellAudioBtn');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => {
      bellBtn.classList.add('ringing');
      // Simple beep using Web Audio (or replace with real audio file)
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } catch (e) {}
      setTimeout(() => bellBtn.classList.remove('ringing'), 1200);
    });
  }

  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
});
