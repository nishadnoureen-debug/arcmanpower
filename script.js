/**
 * Arc Global (arcmanpower.ae)
 * Primary Interactive Engine
 * Fully customized Vanilla Javascript for premium micro-interactions.
 */

// === iOS Viewport Height Fix ===
// iOS Safari treats 100vh as the full screen height including the browser toolbar,
// causing hero sections to appear cut off. This sets a --vh CSS variable that equals
// 1% of the actual visible window height, so we can use calc(var(--vh) * 100) instead.
(function setVH() {
  const updateVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--header-h', '5rem');
  };
  updateVH();
  window.addEventListener('resize', updateVH);
  window.addEventListener('orientationchange', () => {
    setTimeout(updateVH, 150); // Delay to allow orientation to finalize
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  
  // --- PAGE ENTRANCE OVERLAY (shown only on load / reload, not on internal navigation) ---
  const transitionOverlay = document.getElementById('pageTransitionOverlay');
  
  if (transitionOverlay) {
    // Fade out overlay after the brand splash animation completes on page load/reload
    setTimeout(() => {
      transitionOverlay.classList.add('fade-out');
    }, 1000); // Hold long enough to show logo + loader bar, then dismiss
  }

  // Handle bfcache (browser back/forward buttons) — hide overlay immediately
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && transitionOverlay) {
      transitionOverlay.classList.add('fade-out');
    }
  });

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
    // Create mobile nav backdrop overlay dynamically
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    mobileToggle.addEventListener('click', () => {
      const isActive = mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      backdrop.classList.toggle('active');
      
      // Stop body scrolling while mobile nav is open
      document.body.style.overflow = isActive ? 'hidden' : 'initial';
    });

    // Close mobile nav on menu link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = 'initial';
      });
    });

    // Close mobile nav on backdrop click
    backdrop.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = 'initial';
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

  // Start slider auto play on load and bind swipe touch controls
  if (slides.length > 0) {
    startAutoPlay();

    // Touch swipe support for Hero Slider
    let touchStartX = 0;
    let touchEndX = 0;
    const heroSlider = document.querySelector('.hero');
    
    if (heroSlider) {
      heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
      
      function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        const swipeThreshold = 50; // min distance in px to register swipe
        
        if (swipeDistance < -swipeThreshold) {
          // Swipe left -> Next slide
          nextSlide();
          startAutoPlay();
        } else if (swipeDistance > swipeThreshold) {
          // Swipe right -> Previous slide
          prevSlide();
          startAutoPlay();
        }
      }
    }
  }


  // --- INTERACTIVE STATISTICS COUNTERS ---
  const statsNumbers = document.querySelectorAll('.stats .stat-number');
  
  const animateStats = () => {
    statsNumbers.forEach(stat => {
      const targetAttr = stat.getAttribute('data-target');
      if (!targetAttr) return;
      const target = parseInt(targetAttr, 10);
      if (isNaN(target)) return;
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

  // --- NEWS & MEDIA ARTICLE READ MORE MODAL SYSTEM ---
  const articlesData = {
    "featured": {
      title: "UAE Construction Boom 2025: How Manpower Demand Is Reshaping the Workforce Landscape",
      tag: "Featured",
      date: "June 15, 2026",
      img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
      content: `<p>With the UAE's Vision 2031 mega-projects accelerating at an unprecedented pace, the demand for skilled and certified construction labor has experienced an extraordinary surge of over 35% in the last 18 months. Developments like the expansion of Al Maktoum International Airport, Palm Jebel Ali, and massive new residential master communities in Dubai and Abu Dhabi are creating high competition for reliable contracting partners.</p>
                <p>For project managers and HR leaders, this landscape requires a strategic shift from traditional direct hiring to partnering with certified, ISO-level manpower outsourcing firms. Managing housing logistics, daily air-conditioned transport, medical screenings, and Ministry of Human Resources & Emiratisation (MoHRE) compliance is increasingly complex. Partnering with a specialized provider like Arc Global guarantees that your labor supply is fully compliant, immediately deployable, and trained in high-level industrial safety standards.</p>
                <p>Furthermore, the modern construction landscape demands advanced skillsets. Operatives must be familiar with safety standards (HSE), scaffolding regulations, and MEP systems. At Arc Global, we address this demand through our intensive safety and trades-training inductions, ensuring every worker deployed onto your site adds value and safeguards the project timeline from day one.</p>`
    },
    "1": {
      title: "Understanding the New UAE Labour Law Amendments: What Employers Must Know in 2026",
      tag: "Labour Law",
      date: "May 28, 2026",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      content: `<p>The Ministry of Human Resources and Emiratisation (MoHRE) has introduced several critical amendments to the UAE Federal Decree-Law on Labour Relations. These revisions are designed to align the UAE work environment with global standards, introducing stronger compliance measures, flexible working contracts, and expanded protections for both employers and employees.</p>
                <p>Key changes include mandatory adherence to the Wage Protection System (WPS) with stricter penalties for delayed salaries, new guidelines on non-compete clauses, and simplified contract templates for partial and temporary employment models. Employers must ensure their HR policies, contract structures, and payroll pipelines are fully audited and updated to avoid substantial compliance fines.</p>
                <p>Arc Global maintains a dedicated legal compliance desk that monitors all MoHRE directives. We absorb all administrative burden and compliance liabilities for our outsourced personnel, ensuring 100% adherence to all regulatory adjustments. By partnering with us, you safeguard your business from compliance risks and legal overheads.</p>`
    },
    "2": {
      title: "The Surge in MEP Workforce Demand Across Gulf's Major Giga-Projects",
      tag: "MEP & Engineering",
      date: "May 10, 2026",
      img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      content: `<p>As mega giga-projects like Saudi Arabia's NEOM, Dubai Urban Plan 2040, and Abu Dhabi's massive solar infrastructures push boundaries, mechanical, electrical, and plumbing (MEP) trades have transitioned into the highest-demand workforce sectors in the GCC. High-density buildings, green data centers, and advanced manufacturing plants require certified HVAC technicians, duct-men, and industrial electricians with deep technical expertise.</p>
                <p>Finding local talent for these specialized roles is increasingly challenging. Standard recruiting channels often fail to verify technical competence and background checks. This is why Arc Global utilizes established international trade centers to source and rigorously test MEP workers on live systems before deployment.</p>
                <p>Every outsourced electrician, plumber, and technician in our roster possesses recognized industry credentials and has successfully cleared safety screenings. This guarantees a seamless integration into your project's engineering workflow, keeping your complex mechanical systems on track and built to exact specifications.</p>`
    },
    "3": {
      title: "How Premium Worker Welfare Programs Directly Improve Project Productivity by 40%",
      tag: "Welfare & HSE",
      date: "April 22, 2026",
      img: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80",
      content: `<p>Historically, worker accommodations and wellness programs were viewed purely as compliance costs. Today, empirical studies and project logs prove that premium living conditions, clean dining options, and structured mental health support directly boost worker output and project productivity by up to 40% while reducing site absenteeism and safety incidents.</p>
                <p>Arc Global has been at the forefront of this shift, managing modern accommodations in Jebel Ali and Sonapur equipped with Wi-Fi, fitness centers, multi-cultural catering services, and around-the-clock medical clinics. We recognize that a comfortable, well-fed, and healthy employee performs significantly better on high-stress industrial work sites.</p>
                <p>When you hire from Arc Global, you are deploying a workforce that is supported by dedicated welfare officers. The resulting morale and health translate into superior work quality, fewer project delays, and a safer, more efficient site environment for your company.</p>`
    },
    "4": {
      title: "E-Commerce Boom Drives Surge in Warehouse & Logistics Workforce Demand Across Dubai",
      tag: "Logistics",
      date: "April 5, 2026",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
      content: `<p>The explosive expansion of e-commerce, third-party logistics (3PL), and global supply chains in Dubai has created an intense demand for reliable warehouse operatives, forklift operators, packagers, and logistics drivers. Fulfilment hubs in Dubai South, JAFZA, and DAFZA require flexible staffing models that scale rapidly during seasonal peaks and retail events.</p>
                <p>Managing fluctuating demand requires an outsourcing partner that can supply certified warehouse operators at short notice. Forklift operators and heavy-machinery drivers must also hold valid UAE licenses and have cleared strict equipment handling tests.</p>
                <p>Arc Global maintains a pool of pre-vetted warehouse personnel who are fully trained in modern inventory management, safety protocols, and packaging standards. We offer scalable contract durations, enabling logistics and retail managers to align workforce capacity with real-time package volumes without incurring fixed overheads.</p>`
    },
    "5": {
      title: "Outsourcing vs. Direct Hiring in UAE: Which Model Saves More for Your Business?",
      tag: "HR Strategy",
      date: "March 18, 2026",
      img: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80",
      content: `<p>For businesses operating in labor-intensive sectors like facilities management, construction, and hospitality in the UAE, the cost of staffing is the largest line item on the balance sheet. In this article, we analyze the hidden costs of direct hiring—including visa quotas, bank guarantees, health insurance, annual flights, end-of-service gratuities, and housing logistics—against the structured, single-invoice model of managed outsourcing.</p>
                <p>When accounting for recruitment cycle delays, visa processing overhead, accommodation capital expenditure, and HR administrative salaries, outsourcing typically yields a 15% to 25% direct cost reduction. More importantly, outsourcing converts fixed payroll costs into variable, project-based expenses, giving businesses the agility to scale down during market contractions.</p>
                <p>Arc Global handles all facets of visa outsourcing, WPS management, and daily logistics. Our clients receive one simple monthly invoice per worker, leaving their internal HR teams free to focus on core operations and business development.</p>`
    },
    "6": {
      title: "Staffing for Dubai's World-Class Hospitality Sector: Quality Standards That Cannot Be Compromised",
      tag: "Hospitality",
      date: "March 3, 2026",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      content: `<p>As Dubai continues to lead global tourism rankings, hospitality operators from five-star resorts to boutique cafes face extreme standards of customer service and cleanliness. Front-of-house staff, housekeeping, kitchen stewards, and banquet servers are the face of your brand, and any compromise in training or presentation transiently reflects in customer reviews.</p>
                <p>Arc Global offers specialized hospitality staffing solutions, placing highly-trained stewards, cleaning teams, and service staff in premier venues across the UAE. We place a massive emphasis on grooming, English language proficiency, and hospitality etiquette during our recruitment process.</p>
                <p>Our hospitality personnel undergo rigorous training sessions focusing on sanitization standards, guest interactions, and service pacing. We provide continuous support and quality audits, ensuring our team members always match and exceed the world-class reputation of your brand.</p>`
    }
  };

  const articleModalOverlay = document.getElementById('articleModalOverlay');
  const closeArticleModalBtn = document.getElementById('closeArticleModalBtn');
  
  if (articleModalOverlay && closeArticleModalBtn) {
    const articleTitleEl = document.getElementById('articleModalTitle');
    const articleTagEl = document.getElementById('articleModalTag');
    const articleDateEl = document.getElementById('articleModalDate');
    const articleImgEl = document.getElementById('articleModalImg');
    const articleContentEl = document.getElementById('articleModalContent');

    const openArticleModal = (articleId) => {
      const article = articlesData[articleId];
      if (!article) return;

      articleTitleEl.textContent = article.title;
      articleTagEl.textContent = article.tag;
      articleDateEl.textContent = article.date;
      articleImgEl.src = article.img;
      articleImgEl.alt = article.title;
      articleContentEl.innerHTML = article.content;

      articleModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock body scroll
    };

    const closeArticleModal = () => {
      articleModalOverlay.classList.remove('active');
      document.body.style.overflow = 'initial'; // Restore body scroll
    };

    // Attach click events to all read more links
    const readMoreLinks = document.querySelectorAll('.blog-read-link');
    readMoreLinks.forEach((link, index) => {
      let articleId = link.getAttribute('data-article-id');
      if (!articleId) {
        articleId = index === 0 ? 'featured' : index.toString();
        link.setAttribute('data-article-id', articleId);
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        openArticleModal(articleId);
      });
    });

    closeArticleModalBtn.addEventListener('click', closeArticleModal);
    
    // Close on overlay background click
    articleModalOverlay.addEventListener('click', (e) => {
      if (e.target === articleModalOverlay) {
        closeArticleModal();
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && articleModalOverlay.classList.contains('active')) {
        closeArticleModal();
      }
    });
  }

  // --- REQUEST MANPOWER MODAL SYSTEM ---
  const requestModalOverlay = document.getElementById('requestManpowerModalOverlay');
  const closeRequestModalBtn = document.getElementById('closeRequestModalBtn');
  const openRequestModalBtns = document.querySelectorAll('.open-request-modal');
  const requestManpowerForm = document.getElementById('requestManpowerForm');
  const requestSuccessOverlay = document.getElementById('requestSuccessOverlay');
  const requestSubmitBtn = document.getElementById('requestSubmitBtn');

  function openRequestModal(e) {
    if (e) e.preventDefault();
    if (requestModalOverlay) {
      requestModalOverlay.classList.add('active');
    }
  }

  function closeRequestModal() {
    if (requestModalOverlay) {
      requestModalOverlay.classList.remove('active');
    }
  }

  if (openRequestModalBtns) {
    openRequestModalBtns.forEach(btn => {
      btn.addEventListener('click', openRequestModal);
    });
  }

  if (closeRequestModalBtn) {
    closeRequestModalBtn.addEventListener('click', closeRequestModal);
  }

  if (requestModalOverlay) {
    requestModalOverlay.addEventListener('click', (e) => {
      if (e.target === requestModalOverlay) {
        closeRequestModal();
      }
    });
  }

  // Close request modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && requestModalOverlay && requestModalOverlay.classList.contains('active')) {
      closeRequestModal();
    }
  });

  if (requestManpowerForm) {
    requestManpowerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Perform basic validation
      const phoneInput = document.getElementById('requestPhone').value;
      const emailInput = document.getElementById('requestEmail').value;

      const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
      if (!phoneRegex.test(phoneInput)) {
        showToast('Please enter a valid UAE or international contact number.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput)) {
        showToast('Please verify your business email address structure.', 'error');
        return;
      }

      // Loader
      if (requestSubmitBtn) {
        requestSubmitBtn.classList.add('loading');
        requestSubmitBtn.disabled = true;
      }

      // Simulate API submit latency
      setTimeout(() => {
        if (requestSubmitBtn) {
          requestSubmitBtn.classList.remove('loading');
          requestSubmitBtn.disabled = false;
        }

        if (requestSuccessOverlay) {
          requestSuccessOverlay.classList.add('active');
        }
        showToast('Staffing request successfully submitted!', 'success');

        // Reset and close modal after a delay
        setTimeout(() => {
          if (requestManpowerForm) requestManpowerForm.reset();
          if (requestSuccessOverlay) {
            requestSuccessOverlay.classList.remove('active');
          }
          closeRequestModal();
        }, 5000);

      }, 1800);
    });
  }

});
