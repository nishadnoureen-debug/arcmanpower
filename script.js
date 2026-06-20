/**
 * Arc Manpower (arcmanpower.ae)
 * Primary Interactive Engine
 * Fully customized Vanilla Javascript for premium micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Set copyright year dynamically
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- TOAST NOTIFICATION MODULE ---
  const toastContainer = document.getElementById('toastContainer');
  
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Customize icon based on toast type
    const icon = type === 'success' 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#386C98" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Smooth trigger entrance
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Auto dispose toast after 4s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }


  // --- HEADER SCROLL ACTION ---
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      scrollTopBtn.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      scrollTopBtn.classList.remove('visible');
    }
  });


  // --- MOBILE NAV MENU TOGGLE ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Stop body scrolling while mobile nav is open
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'initial';
    });

    // Close mobile nav on menu link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'initial';
      });
    });
  }


  // --- DYNAMIC HERO SLIDER ---
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevSlideBtn = document.getElementById('prevSlide');
  const nextSlideBtn = document.getElementById('nextSlide');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 6000; // Match CSS loading animation timer (6s)

  function showSlide(index) {
    // Reset previous active elements
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (index + slides.length) % slides.length;
    
    // Set new active slide
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  // Bind controls
  if (nextSlideBtn && prevSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay(); // Restart timer
    });

    prevSlideBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay(); // Restart timer
    });
  }

  // Click on indicators
  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  // Start slider auto play on load
  if (slides.length > 0) {
    startAutoPlay();
  }


  // --- INTERACTIVE STATISTICS COUNTERS ---
  const statsNumbers = document.querySelectorAll('.stat-number');
  
  const animateStats = () => {
    statsNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds count up
      const increment = target / (duration / 16); // ~60fps
      let current = 0;

      const updateCount = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCount);
        } else {
          // Finished, append '+' for numbers above 100
          stat.textContent = target >= 100 ? `${target.toLocaleString()}+` : target;
        }
      };

      updateCount();
    });
  };

  // Intersection Observer to trigger counter when stats component enters view
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          obs.unobserve(entry.target); // Trigger only once
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }


  // --- CAREERS TABS FILTERS ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const jobCards = document.querySelectorAll('.job-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active tab styling
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-category');

      jobCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Dynamic animation scaling
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // --- CAREERS APPLY PORTAL MODAL WINDOW ---
  const applyModalOverlay = document.getElementById('applyModalOverlay');
  const modalJobTitle = document.getElementById('modalJobTitle');
  const modalJobHiddenField = document.getElementById('modalJobHiddenField');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const applyForm = document.getElementById('applyJobForm');
  const applyResumeInput = document.getElementById('applyResume');
  const selectedFileName = document.getElementById('selectedFileName');
  const applySubmitBtn = document.getElementById('applySubmitBtn');

  // Trigger modal open
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('open-apply-modal')) {
      const jobRole = e.target.getAttribute('data-job');
      
      modalJobTitle.textContent = `Apply for: ${jobRole}`;
      modalJobHiddenField.value = jobRole;
      
      applyModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock main scroll
    }
  });

  // Modal close triggers
  function closeModal() {
    applyModalOverlay.classList.remove('active');
    document.body.style.overflow = 'initial';
    applyForm.reset();
    if (selectedFileName) selectedFileName.textContent = '';
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (applyModalOverlay) {
    applyModalOverlay.addEventListener('click', (e) => {
      if (e.target === applyModalOverlay) {
        closeModal();
      }
    });
  }

  // Handle file name displays
  if (applyResumeInput) {
    applyResumeInput.addEventListener('change', () => {
      if (applyResumeInput.files.length > 0) {
        selectedFileName.textContent = `Attached: ${applyResumeInput.files[0].name}`;
      } else {
        selectedFileName.textContent = '';
      }
    });
  }

  // Mock application submit pipelines
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      applySubmitBtn.classList.add('loading');
      applySubmitBtn.disabled = true;

      // Simulate network request latency (Ladda effect)
      setTimeout(() => {
        applySubmitBtn.classList.remove('loading');
        applySubmitBtn.disabled = false;
        
        const applicantName = document.getElementById('applyName').value;
        const assignedJob = modalJobHiddenField.value;

        closeModal();
        showToast(`Congratulations ${applicantName}, your profile for "${assignedJob}" has been successfully logged!`, 'success');
      }, 1500);
    });
  }


  // --- LET'S TALK / ENQUIRY VALIDATION FORM ---
  const enquiryForm = document.getElementById('enquiryForm');
  const formSuccessOverlay = document.getElementById('formSuccessOverlay');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform basic regex validations
      const phoneInput = document.getElementById('formPhone').value;
      const emailInput = document.getElementById('formEmail').value;
      
      // Check phone contains digits, optionally starting with +
      const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
      if (!phoneRegex.test(phoneInput)) {
        showToast('Please enter a valid UAE or international contact number.', 'error');
        return;
      }

      // Check standard email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput)) {
        showToast('Please verify your business email address structure.', 'error');
        return;
      }

      // Validated, trigger loaders
      formSubmitBtn.classList.add('loading');
      formSubmitBtn.disabled = true;

      // Simulate API submit latency
      setTimeout(() => {
        formSubmitBtn.classList.remove('loading');
        formSubmitBtn.disabled = false;
        
        // Trigger success overlay transition
        formSuccessOverlay.classList.add('active');
        showToast('Enquiry successfully submitted!', 'success');

        // Reset form details after a delay and clear overlay
        setTimeout(() => {
          enquiryForm.reset();
          formSuccessOverlay.classList.remove('active');
        }, 5000);

      }, 1800);
    });
  }


  // --- SCROLL REVEAL MICRO-ANIMATIONS OBSERVER ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  // --- ACTIVE SCROLL TRACKER NAVIGATION INDICATOR ---
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 200; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (correspondingLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  });

});
