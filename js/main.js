(function () {
  'use strict';

  /* ─── SCROLL PROGRESS ─── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (window.scrollY / max * 100) + '%';
    }, { passive: true });
  }

  /* ─── CUSTOM CURSOR ─── */
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let cx=0, cy=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    if (cur) { cur.style.left = cx+'px'; cur.style.top = cy+'px'; }
  });
  (function loop() {
    rx += (cx-rx)*.15; ry += (cy-ry)*.15;
    if (ring) { ring.style.left = rx+'px'; ring.style.top = ry+'px'; }
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.pill,.proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cur) cur.classList.add('hov');
      if (ring) ring.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => {
      if (cur) cur.classList.remove('hov');
      if (ring) ring.classList.remove('hov');
    });
  });

  /* ─── CONTACT FORM TOGGLE + SUBMISSION ─── */
  const toggleBtn  = document.getElementById('contact-toggle-btn');
  const formPanel  = document.getElementById('contact-form-panel');
  const closeBtn   = document.getElementById('form-close-btn');
  const recForm    = document.getElementById('recruiter-form');
  const successEl  = document.getElementById('form-success');
  const submitBtn  = document.getElementById('form-submit-btn');

  function openPanel() {
    if (formPanel && toggleBtn) {
      formPanel.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      formPanel.setAttribute('aria-hidden', 'false');
      toggleBtn.textContent = 'Close Form ×';
      setTimeout(() => formPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    }
  }
  function closePanel() {
    if (formPanel && toggleBtn) {
      formPanel.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      formPanel.setAttribute('aria-hidden', 'true');
      toggleBtn.textContent = 'Say Hello →';
      if (successEl) successEl.style.display = 'none';
      if (recForm) recForm.reset();
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', () => {
    if (formPanel) {
      formPanel.classList.contains('open') ? closePanel() : openPanel();
    }
  });
  if (closeBtn) closeBtn.addEventListener('click', closePanel);

  if (recForm && successEl && submitBtn) {
    recForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name  = document.getElementById('c-name').value.trim();
      const email = document.getElementById('c-email').value.trim();
      const phone = document.getElementById('c-phone').value.trim();
      const msg   = document.getElementById('c-msg').value.trim();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      try {
        // Send silently in the background using the FormSubmit AJAX service
        const response = await fetch("https://formsubmit.co/ajax/sharmabhavesh191@gmail.com", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone || "Not provided",
            message: msg
          })
        });

        if (response.ok) {
          successEl.className = "form-feedback form-success";
          successEl.innerHTML = "✅ Message sent successfully! I will get back to you soon.";
          successEl.style.display = "block";
          recForm.reset();
          submitBtn.textContent = 'Sent ✓';
          setTimeout(() => { 
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message →'; 
          }, 3000);
        } else {
          throw new Error("FormSubmit server error");
        }
      } catch (err) {
        // Fallback to mailto link if background post fails (e.g. offline, blocked, etc.)
        const subject = encodeURIComponent(`Opportunity for Bhavesh Sharma — from ${name}`);
        const body = encodeURIComponent(
          `Hi Bhavesh,\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          (phone ? `Phone: ${phone}\n` : '') +
          `\nMessage:\n${msg}\n\n` +
          `— Sent via your portfolio contact form`
        );
        window.location.href = `mailto:sharmabhavesh191@gmail.com?subject=${subject}&body=${body}`;

        successEl.className = "form-feedback form-success";
        successEl.innerHTML = "✉️ Email client opened! Your message is ready to send.";
        successEl.style.display = "block";
        recForm.reset();
        submitBtn.textContent = 'Email Opened ✓';
        setTimeout(() => { 
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message →'; 
          }, 3000);
      }
    });
  }

  /* ─── SCROLL REVEAL ─── */
  const revealAll = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      } else {
        entry.target.classList.remove('in');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealAll.forEach(el => io.observe(el));

  /* ─── COUNT-UP ON STAT NUMBERS ─── */
  function countUp(el, target, decimals, duration, suffix = '') {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (eased * target).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target.querySelector('.stat-num');
      if (!el) return;
      const raw  = entry.target.dataset.val || el.dataset.val;
      if (!raw) return;
      const num  = parseFloat(raw);
      const decs = (raw.includes('.') ? raw.split('.')[1].length : 0);
      const suffix = raw.replace(/[0-9.]/g, '');
      countUp(el, num, decs, 1200, suffix);
      statObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-card').forEach(c => statObs.observe(c));

  /* ─── SEE MORE ─── */
  const btn   = document.getElementById('see-more-btn');
  const extra = document.getElementById('proj-extra');
  let open = false;
  if (btn && extra) {
    btn.addEventListener('click', () => {
      open = !open;
      if (open) {
        extra.classList.add('open');
        btn.textContent = '− Show Less';
        extra.querySelectorAll('.proj-card').forEach((c, i) => {
          c.style.opacity = '0';
          c.style.transform = 'translateY(32px)';
          c.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
          setTimeout(() => { c.style.opacity='1'; c.style.transform='none'; }, i*130+60);
        });
      } else {
        extra.classList.remove('open');
        btn.textContent = '+ See More Projects';
      }
    });
  }

  /* ─── N8N VIDEO MODAL CONTROL ─── */
  const n8nPlayBtn      = document.getElementById('n8n-play-btn');
  const n8nCardPlayBtn  = document.getElementById('n8n-card-play-btn');
  const videoModal      = document.getElementById('video-modal');
  const modalBackBtn    = document.getElementById('modal-back-btn');
  const modalVideo      = document.getElementById('modal-video');

  if (videoModal && modalVideo) {
    const openModal = () => {
      videoModal.classList.add('open');
      videoModal.setAttribute('aria-hidden', 'false');
      modalVideo.play();
    };

    const closeModal = () => {
      videoModal.classList.remove('open');
      videoModal.setAttribute('aria-hidden', 'true');
      modalVideo.pause();
    };

    if (n8nPlayBtn) {
      n8nPlayBtn.addEventListener('click', openModal);
    }

    if (n8nCardPlayBtn) {
      n8nCardPlayBtn.addEventListener('click', openModal);
    }

    if (modalBackBtn) {
      modalBackBtn.addEventListener('click', closeModal);
    }

    // Close on clicking outside the video content box
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ─── ACTIVE NAV HIGHLIGHTING ─── */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  
  function setActive() {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 180;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + sectionId) {
            a.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive(); // Run once on load

})();
