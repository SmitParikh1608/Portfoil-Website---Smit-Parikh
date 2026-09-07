/**
 * Smit Parikh - QA Analyst & Python Developer Portfolio
 * Interactive Script Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDynamicTyping();
  initTestSimulator();
  initSkillsFilter();
  initClipboardButtons();
  initContactForm();
  initNavigation();
  initPrintResume();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Retrieve saved preference or check system preference
  const savedTheme = localStorage.getItem('smit_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('smit_theme', newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
  });
}

/* ==========================================================================
   2. Dynamic Typing Effect (Hero Subtitle)
   ========================================================================== */
function initDynamicTyping() {
  const typingElement = document.getElementById('dynamic-typing');
  if (!typingElement) return;

  const roles = [
    'QA Automation & Python Engineering',
    'Manual & Automated Regression Testing',
    'SQL Data Integrity & Validation',
    'Pandas & ETL Script Development',
    'AI & Machine Learning Research'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const holdDelay = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Initial delay before starting
  setTimeout(type, 800);
}

/* ==========================================================================
   3. Interactive Live QA Test Runner Simulator
   ========================================================================== */
function initTestSimulator() {
  const rerunBtn = document.getElementById('rerun-tests-btn');
  const terminalOutput = document.getElementById('terminal-output');
  if (!rerunBtn || !terminalOutput) return;

  const testSteps = [
    { name: 'test_api_functional_endpoints', progress: '25%', duration: '0.04s' },
    { name: 'test_sql_schema_and_data_integrity', progress: '50%', duration: '0.08s' },
    { name: 'test_regression_cross_browser_ui', progress: '75%', duration: '0.11s' },
    { name: 'test_pandas_etl_csv_processing', progress: '100%', duration: '0.05s' }
  ];

  let isRunning = false;

  function runSuite() {
    if (isRunning) return;
    isRunning = true;

    rerunBtn.disabled = true;
    rerunBtn.innerHTML = `
      <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
      </svg>
      <span>Running...</span>
    `;

    // Clear terminal and show initializing
    terminalOutput.innerHTML = `
      <div class="log-line text-muted">$ pytest -v tests/test_qa_pipeline.py</div>
      <div class="log-line text-info">&gt; Initializing test runner: Python 3.11 + PyTest v7.4</div>
    `;

    let stepIndex = 0;

    function executeNextStep() {
      if (stepIndex < testSteps.length) {
        const step = testSteps[stepIndex];
        const stepElement = document.createElement('div');
        stepElement.className = 'log-line test-item';
        stepElement.innerHTML = `
          <span class="test-name">${step.name}</span>
          <span class="test-status status-running">RUNNING...</span>
        `;
        terminalOutput.appendChild(stepElement);

        setTimeout(() => {
          stepElement.innerHTML = `
            <span class="test-name">${step.name}</span>
            <span class="test-status status-pass">PASSED [${step.progress}]</span>
          `;
          stepIndex++;
          setTimeout(executeNextStep, 260);
        }, 320);
      } else {
        // All tests finished
        const summary = document.createElement('div');
        summary.className = 'log-summary text-success';
        summary.innerHTML = `&#10003; 4 passed in 0.28s (Coverage: 99.8%)`;
        terminalOutput.appendChild(summary);

        rerunBtn.disabled = false;
        rerunBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Run Suite</span>
        `;
        isRunning = false;

        showToast('All 4 test suites passed with 99.8% coverage!', 'success');
      }
    }

    setTimeout(executeNextStep, 350);
  }

  rerunBtn.addEventListener('click', runSuite);
}

/* ==========================================================================
   4. Skills Filter Matrix
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Clipboard Copy Utility with Toast
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
          pulseButton(btn);
        }).catch(() => {
          fallbackCopy(textToCopy, btn);
        });
      } else {
        fallbackCopy(textToCopy, btn);
      }
    });
  });

  function fallbackCopy(text, btn) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied "${text}" to clipboard!`, 'success');
      pulseButton(btn);
    } catch (err) {
      showToast(`Failed to copy: ${text}`, 'error');
    }
    document.body.removeChild(tempInput);
  }

  function pulseButton(btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    setTimeout(() => {
      btn.innerHTML = originalHTML;
    }, 1600);
  }
}

/* ==========================================================================
   6. Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim() || 'Portfolio Inquiry';
    const message = messageInput.value.trim();

    if (!name) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    if (!email) {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!message) {
      messageError.textContent = 'Please write your message.';
      isValid = false;
    } else if (message.length < 10) {
      messageError.textContent = 'Message should be at least 10 characters long.';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending with loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Sending Message...</span>
      <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
      </svg>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      showToast(`Thank you, ${name}! Your message has been prepared.`, 'success');

      // Also trigger a mailto link with prefilled subject and body
      const mailtoUrl = `mailto:smitparikh.a@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Smit,\n\nName: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.open(mailtoUrl, '_blank');

      form.reset();
    }, 1000);
  });
}

/* ==========================================================================
   7. Navigation & Mobile Menu & Back to Top
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Mobile Menu Toggle
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll events
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Back to Top button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // IntersectionObserver for active section link highlighting
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

/* ==========================================================================
   8. Resume Print / Download Trigger
   ========================================================================== */
function initPrintResume() {
  const printBtn = document.getElementById('print-resume-btn');
  if (!printBtn) return;

  printBtn.addEventListener('click', () => {
    showToast('Opening print preview for Smit Parikh Resume...', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  });
}

/* ==========================================================================
   9. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
  } else {
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, 3200);
}
