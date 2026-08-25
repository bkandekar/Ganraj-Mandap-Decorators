/**
 * Ganraj Mandap Decorators - Official JavaScript
 * Author: ebookcharm Web Services
 * Client: Ganraj Mandap Decorators (Kalwa, Thane)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. CONFIGURATION & CONSTANTS
     Easily update contact information or festival date below.
     ========================================================================== */
  
  // Target Date for Ganesh Chaturthi Countdown (YYYY-MM-DDTHH:MM:SS)
  // Format: "YYYY-MM-DDTHH:MM:SS" (e.g. September 14, 2026)
  const GANESH_CHATURTHI_TARGET_DATE = '2026-09-14T00:00:00';

  // Primary Client Contact Details
  const CONFIG = {
    whatsappNumber: '918329931123',
    callNumber: '9067257872',
    businessName: 'Ganraj Mandap Decorators',
    address: 'Shop No. 4, Near Vitthal Mandir, Kalwa (East), Thane, Maharashtra 400605'
  };

  /* ==========================================================================
     2. LIVE GANESH CHATURTHI COUNTDOWN TIMER
     ========================================================================== */
  function initCountdownTimer() {
    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minutesEl = document.getElementById('timerMinutes');
    const secondsEl = document.getElementById('timerSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const targetDate = new Date(GANESH_CHATURTHI_TARGET_DATE).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        // If festival has arrived or passed
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ==========================================================================
     3. STICKY NAVBAR & MOBILE NAVIGATION MENU
     ========================================================================== */
  function initNavigation() {
    const header = document.getElementById('mainHeader');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    // Mobile Hamburger Menu Toggle
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
      });

      // Close menu when a link is clicked
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          mobileToggle.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // ScrollSpy: Active nav link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    function scrollSpy() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', scrollSpy, { passive: true });
  }

  /* ==========================================================================
     4. ANIMATED STAT COUNTERS (Count-up on Scroll)
     ========================================================================== */
  function initStatCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current);
              }
            }, stepTime);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const banner = document.querySelector('.stats-card-banner');
    if (banner) observer.observe(banner);
  }

  /* ==========================================================================
     5. GALLERY FILTER TABS & LIGHTBOX MODAL
     ========================================================================== */
  function initGallery() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const items = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('lightboxModal');
    const backdrop = document.getElementById('lightboxBackdrop');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');

    let visibleItems = Array.from(items);
    let currentIndex = 0;

    // Filter Tabs Logic
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        items.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });

        // Update list of currently visible items for lightbox navigation
        visibleItems = Array.from(items).filter(item => {
          return filter === 'all' || item.getAttribute('data-category') === filter;
        });
      });
    });

    // Lightbox Open Function
    function openLightbox(index) {
      if (index < 0 || index >= visibleItems.length) return;
      currentIndex = index;

      const currentItem = visibleItems[currentIndex];
      const img = currentItem.querySelector('img');
      const title = currentItem.getAttribute('data-title') || img.alt;
      const desc = currentItem.getAttribute('data-desc') || '';

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    // Lightbox Close Function
    function closeLightbox() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Attach click events to gallery items
    items.forEach(item => {
      item.addEventListener('click', () => {
        const itemIndex = visibleItems.indexOf(item);
        if (itemIndex !== -1) {
          openLightbox(itemIndex);
        }
      });
    });

    // Next / Prev Controls
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(nextIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(prevIndex);
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    // Keyboard Navigation for Lightbox
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    });
  }

  /* ==========================================================================
     6. TESTIMONIALS CAROUSEL / SLIDER
     ========================================================================== */
  function initTestimonialSlider() {
    const track = document.getElementById('testimonialsTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;

    // Create pagination dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
      resetAutoplay();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // Autoplay Timer (5 seconds)
    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    track.addEventListener('mouseleave', () => startAutoplay());

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoplayTimer);
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
      startAutoplay();
    }, { passive: true });
  }

  /* ==========================================================================
     7. FAQ ACCORDION
     ========================================================================== */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');

      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Optional: Close other open FAQs
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        item.classList.toggle('active', !isOpen);
        questionBtn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  /* ==========================================================================
     8. WHATSAPP ENQUIRY & BOOKING FORM HANDLER
     ========================================================================== */
  function initBookingForm() {
    const form = document.getElementById('mandapEnquiryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('formFullName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const mandalName = document.getElementById('formMandalName').value.trim();
      const location = document.getElementById('formLocation').value;
      const category = document.getElementById('formCategory').value;
      const budget = document.getElementById('formBudget').value;
      const duration = document.getElementById('formDuration').value;
      const message = document.getElementById('formMessage').value.trim() || 'None / To be discussed';

      if (!fullName || !phone || !mandalName || !location || !category) {
        alert('Please complete all required fields (*)');
        return;
      }

      // Format clean, polite WhatsApp message
      const whatsappMessage = 
`🚩 *GANESHOTSAV MANDAP ENQUIRY* 🚩
----------------------------------------
*Mandal / Society:* ${mandalName}
*Contact Person:* ${fullName}
*Mobile / WhatsApp:* ${phone}
*Location:* ${location}
*Mandap Category:* ${category}
*Estimated Budget:* ${budget}
*Festival Duration:* ${duration}
*Specific Theme / Notes:* ${message}
----------------------------------------
_Inquiry sent via Ganraj Mandap Decorators Website_`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* ==========================================================================
     9. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================================================================
     10. BACK TO TOP BUTTON
     ========================================================================== */
  function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     11. TEMPLE BELL CHIME AUDIO (Web Audio API Synthesizer)
     ========================================================================== */
  function initTempleBellAudio() {
    const bellBtn = document.getElementById('bellAudioBtn');
    if (!bellBtn) return;

    let audioCtx = null;

    function playTempleBellChime() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtx) {
          audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        const frequencies = [880, 1760, 2640, 3520]; // Resonant brass temple bell harmonics

        frequencies.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq + (Math.random() * 4 - 2), now);

          const initialGain = 0.25 / (idx + 1);
          gain.gain.setValueAtTime(initialGain, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5 + idx * 0.5);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now);
          osc.stop(now + 3.0);
        });

        // Trigger bell vibration animation
        bellBtn.classList.add('ringing');
        setTimeout(() => {
          bellBtn.classList.remove('ringing');
        }, 1200);

      } catch (err) {
        console.warn('Audio chime playback notice:', err);
      }
    }

    bellBtn.addEventListener('click', playTempleBellChime);
  }

  /* ==========================================================================
     12. THEME FILTER TABS
     ========================================================================== */
  function initThemeFilters() {
    const filterBtns = document.querySelectorAll('.theme-filter-btn');
    const themeCards = document.querySelectorAll('.theme-card');

    if (!filterBtns.length || !themeCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-theme-filter');

        themeCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (filterVal === 'all' || cardCat === filterVal) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     13. INTERACTIVE MANDAP COST ESTIMATOR
     ========================================================================== */
  function initEstimatorCalculator() {
    const scaleBtns = document.querySelectorAll('#calcScaleSelector .pill-btn');
    const typeBadge = document.getElementById('mandalTypeBadge');
    const sizeRange = document.getElementById('calcSizeRange');
    const sizeText = document.getElementById('calcSizeText');
    const themeSelect = document.getElementById('calcThemeSelect');
    const idolSelect = document.getElementById('calcIdolSelect');
    const lightingSelect = document.getElementById('calcLightingSelect');
    const soundSelect = document.getElementById('calcSoundSelect');
    const rathSelect = document.getElementById('calcRathSelect');
    const priceMinEl = document.getElementById('calcPriceMin');
    const priceMaxEl = document.getElementById('calcPriceMax');
    const sendWhatsAppBtn = document.getElementById('calcSendWhatsAppBtn');

    if (!sizeRange || !priceMinEl || !priceMaxEl) return;

    let currentScaleMultiplier = 1.5;
    let currentScaleName = 'Sarvajanik Mandal';

    const sizeData = [
      { label: '15 x 20 Feet (300 sq.ft)', sqft: 300, baseRate: 15000 },
      { label: '25 x 40 Feet (1,000 sq.ft)', sqft: 1000, baseRate: 32000 },
      { label: '35 x 70 Feet (2,450 sq.ft)', sqft: 2450, baseRate: 65000 },
      { label: '50 x 100+ Feet (5,000+ sq.ft)', sqft: 5000, baseRate: 120000 }
    ];

    function calculateTotal() {
      const sizeIndex = parseInt(sizeRange.value, 10) - 1;
      const selectedSize = sizeData[sizeIndex] || sizeData[1];
      sizeText.textContent = selectedSize.label;

      const themeOpt = themeSelect.options[themeSelect.selectedIndex];
      const themeBase = parseFloat(themeOpt.getAttribute('data-base')) || 35000;

      const idolOpt = idolSelect.options[idolSelect.selectedIndex];
      const idolPrice = parseFloat(idolOpt.getAttribute('data-price')) || 0;

      const lightingOpt = lightingSelect.options[lightingSelect.selectedIndex];
      const lightingPrice = parseFloat(lightingOpt.getAttribute('data-price')) || 0;

      const soundOpt = soundSelect.options[soundSelect.selectedIndex];
      const soundPrice = parseFloat(soundOpt.getAttribute('data-price')) || 0;

      const rathOpt = rathSelect.options[rathSelect.selectedIndex];
      const rathPrice = parseFloat(rathOpt.getAttribute('data-price')) || 0;

      const baseRaw = (selectedSize.baseRate + themeBase + idolPrice + lightingPrice + soundPrice + rathPrice) * (currentScaleMultiplier * 0.8);

      const minEstimate = Math.round(baseRaw / 1000) * 1000;
      const maxEstimate = Math.round((baseRaw * 1.3) / 1000) * 1000;

      priceMinEl.textContent = '₹' + minEstimate.toLocaleString('en-IN');
      priceMaxEl.textContent = '₹' + maxEstimate.toLocaleString('en-IN') + '*';
    }

    scaleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        scaleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentScaleMultiplier = parseFloat(btn.getAttribute('data-val')) || 1.5;
        currentScaleName = btn.textContent.trim();
        if (typeBadge) typeBadge.textContent = currentScaleName;
        calculateTotal();
      });
    });

    [sizeRange, themeSelect, idolSelect, lightingSelect, soundSelect, rathSelect].forEach(control => {
      if (control) {
        control.addEventListener('input', calculateTotal);
        control.addEventListener('change', calculateTotal);
      }
    });

    if (sendWhatsAppBtn) {
      sendWhatsAppBtn.addEventListener('click', () => {
        const sizeIndex = parseInt(sizeRange.value, 10) - 1;
        const sizeLabel = sizeData[sizeIndex] ? sizeData[sizeIndex].label : '25 x 40 Feet';
        const themeName = themeSelect.options[themeSelect.selectedIndex].text;
        const idolName = idolSelect.options[idolSelect.selectedIndex].text;
        const lightingName = lightingSelect.options[lightingSelect.selectedIndex].text;
        const soundName = soundSelect.options[soundSelect.selectedIndex].text;
        const rathName = rathSelect.options[rathSelect.selectedIndex].text;
        const estMin = priceMinEl.textContent;
        const estMax = priceMaxEl.textContent;

        const message = `Namaskar Ganraj Mandap Decorators! 🚩\n\nI calculated a budget estimate on your website for our Ganesh Mandal:\n\n` +
          `• Setup Type: ${currentScaleName}\n` +
          `• Mandap Size: ${sizeLabel}\n` +
          `• Theme Design: ${themeName}\n` +
          `• Murti Height: ${idolName}\n` +
          `• Lighting Level: ${lightingName}\n` +
          `• Sound Setup: ${soundName}\n` +
          `• Visarjan Rath: ${rathName}\n` +
          `• Estimated Range: ${estMin} - ${estMax}\n\n` +
          `Please arrange a free site inspection and send the final proposal quotation.`;

        const waUrl = `https://wa.me/918329931123?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }

    calculateTotal();
  }

  /* ==========================================================================
     14. BEFORE & AFTER TRANSFORMATION COMPARISON SLIDER
     ========================================================================== */
  function initComparisonSlider() {
    const sliderContainer = document.getElementById('comparisonSlider');
    const afterLayer = document.getElementById('sliderAfterLayer');
    const handle = document.getElementById('sliderHandle');

    if (!sliderContainer || !afterLayer || !handle) return;

    let isSliding = false;

    function slideMove(clientX) {
      const rect = sliderContainer.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;

      if (pos < 5) pos = 5;
      if (pos > 95) pos = 95;

      afterLayer.style.width = pos + '%';
      handle.style.left = pos + '%';
    }

    sliderContainer.addEventListener('mousedown', () => { isSliding = true; });
    window.addEventListener('mouseup', () => { isSliding = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isSliding) return;
      slideMove(e.clientX);
    });

    sliderContainer.addEventListener('touchstart', () => { isSliding = true; }, { passive: true });
    window.addEventListener('touchend', () => { isSliding = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isSliding || !e.touches[0]) return;
      slideMove(e.touches[0].clientX);
    }, { passive: true });
  }

  /* ==========================================================================
     15. INITIALIZE ALL MODULES
     ========================================================================== */
  initCountdownTimer();
  initNavigation();
  initStatCounters();
  initGallery();
  initTestimonialSlider();
  initFAQ();
  initBookingForm();
  initScrollReveal();
  initBackToTop();
  initTempleBellAudio();
  initThemeFilters();
  initEstimatorCalculator();
  initComparisonSlider();

});
