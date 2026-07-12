/*
================================================================================
  HEALTHPLUS HOSPITAL - HEART DISEASE PREDICTION AI
  GLOBAL ARCHITECTURE & INTERACTION SCRIPT (JS)
  Author: Senior Frontend Architect / AI UI Engineer
  Date: 2026
================================================================================
*/

// --- Protocol Check: Detect and warn if website is opened via file:// protocol ---
if (window.location.protocol === 'file:') {
  document.addEventListener('DOMContentLoaded', () => {
    const warningDiv = document.createElement('div');
    warningDiv.style.position = 'fixed';
    warningDiv.style.top = '0';
    warningDiv.style.left = '0';
    warningDiv.style.width = '100%';
    warningDiv.style.height = '100%';
    warningDiv.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
    warningDiv.style.color = '#ffffff';
    warningDiv.style.zIndex = '100000';
    warningDiv.style.display = 'flex';
    warningDiv.style.flexDirection = 'column';
    warningDiv.style.alignItems = 'center';
    warningDiv.style.justifyContent = 'center';
    warningDiv.style.fontFamily = 'var(--font-body), sans-serif';
    warningDiv.style.padding = '20px';
    warningDiv.style.textAlign = 'center';

    warningDiv.innerHTML = `
      <div style="max-width: 600px; padding: 40px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem; color: var(--warning); margin-bottom: 20px; animation: pulse-border 1.5s infinite;"></i>
        <h1 style="font-family: var(--font-display); font-size: 1.8rem; margin: 0 0 16px 0; font-weight: 800; color: #ffffff;">Incorrect Execution Protocol</h1>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
          You are opening the website incorrectly via the <strong>file:///</strong> protocol. Modern browsers block cross-origin requests (CORS) from local files, preventing communication with the diagnostic AI server.
        </p>
        <p style="font-size: 0.95rem; color: var(--primary); font-weight: 600; margin-bottom: 8px;">
          Please run the website using a local web server:
        </p>
        <code style="display: inline-block; background: #000; padding: 10px 20px; border-radius: 6px; font-family: monospace; color: var(--accent); font-size: 0.85rem; margin-bottom: 20px;">
          python -m http.server 8080
        </code>
        <p style="font-size: 0.75rem; color: var(--text-muted);">
          Or use the VS Code <strong>Live Server</strong> extension.
        </p>
      </div>
    `;
    document.body.appendChild(warningDiv);
    console.error("Incorrect execution protocol: file:/// protocol detected.");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Core Modules ---
  initTheme();
  initLoadingScreen();
  initMobileMenu();
  initCustomCursor();
  initScrollProgressBar();
  initBackToTop();
  initSmoothScroll();
  initNavbarActiveLink();
  initScrollReveal();
  initButtonRipple();

  // --- Hero Section Modules ---
  initHeroTyping();
  initHeroParticles();
  initHero3dCard();

  // --- Dataset Section Modules ---
  initDatasetTable();

  // --- EDA Section Modules ---
  initEdaCounters();
  initEdaCharts();

  // --- Model Comparison Section Modules ---
  initModelComparison();

  // --- Patient Prediction Section Modules ---
  initPatientPrediction();
  initDiagnosticOutcomes();
  initPatientReport();
  initPerformanceDashboard();

  // --- Team & Contact Section Modules ---
  initContactForm();

  // --- AI Virtual Assistant Module ---
  initVirtualAssistant();

  // --- Backend Health Check Module ---
  checkBackendHealth();
});

/**
 * Backend Service Health Verification
 */
function checkBackendHealth() {
  const submitBtn = document.getElementById('btn-pred-submit');
  const alertBox = document.getElementById('prediction-alert');
  const alertMsg = alertBox ? alertBox.querySelector('.alert-message') : null;

  if (!submitBtn) return;

  console.log("Checking API backend health state...");
  
  fetch('http://127.0.0.1:8000/api/health')
    .then(response => {
      if (!response.ok) throw new Error("Health check returned status error.");
      return response.json();
    })
    .then(data => {
      if (data.status === "running" && data.model === "loaded") {
        console.log("HealthPlus API Health Check: OK. Naive Bayes Model Loaded.");
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      } else {
        throw new Error("Model pipeline missing in backend.");
      }
    })
    .catch(err => {
      console.warn("HealthPlus API Health Check: OFFLINE.", err);
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.65';
      submitBtn.innerHTML = '<i class="fa-solid fa-plug-circle-xmark"></i> Backend Offline';
      
      if (alertBox && alertMsg) {
        alertMsg.innerHTML = '<strong>Warning:</strong> Diagnostics backend is currently offline. Please run the FastAPI server at http://127.0.0.1:8000 first.';
        alertBox.classList.remove('hidden');
        alertBox.style.borderColor = 'var(--warning)';
      }
    });
}

/**
 * Theme Manager Module
 * Handles Light/Dark mode transitions and persists state in localStorage
 */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme') || 'light';

  // Apply initial theme
  document.documentElement.setAttribute('data-theme', storedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Optional: Trigger custom theme event for charts/visualizations to rebuild
      window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: newTheme } }));
    });
  });
}

/**
 * Loading Screen Screen
 * Hides loading animation once all assets are loaded
 */
function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    window.addEventListener('load', () => {
      // Small timeout for visual polish
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 600);
    });
  }
}

/**
 * Custom Cursor System
 * Coordinates pointer locations and scales follower on hovers
 */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (!cursor || !follower) return;

  let posX = 0, posY = 0;
  let mouseX = 0, mouseY = 0;

  // Custom animation loops for mouse lagging follower effect
  setInterval(() => {
    posX += (mouseX - posX) / 6;
    posY += (mouseY - posY) / 6;
    
    follower.style.left = posX + 'px';
    follower.style.top = posY + 'px';
  }, 16);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Cursor Hover Effects
  const hoverables = document.querySelectorAll('a, button, select, input, textarea, .btn, [role="button"]');
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/**
 * Scroll Progress Bar
 * Adjusts indicator bar scale dynamically matching scroll offsets
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0) {
      const scrollPercent = (window.scrollY / scrollTotal) * 100;
      progressBar.style.width = scrollPercent + '%';
    } else {
      progressBar.style.width = '0%';
    }
  });
}

/**
 * Back To Top Widget Toggle
 * Displays button above threshold depth, scrolls smoothly back up
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Smooth Scrolling System
 * intercepts hash links, navigates offset for header layout gaps
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile nav menu if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
        }

        const headerHeight = document.querySelector('.main-header').offsetHeight || 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Navigation Active Links Tracker
 * Monitors section intersects, updates active nav visual marks
 */
function initNavbarActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.querySelector('.main-header');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100; // Offset adjustments

    // Header Shadow & Shrink Toggle
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/**
 * Scroll Reveal Intersection Observer
 * Animates target grids and panels on element intersection
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/**
 * Button Click Ripple Effects
 * Spawns responsive ripple shapes on primary/secondary button clicks
 */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Prevent spawning on custom inputs/elements nesting buttons
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * Mobile Navigation Toggle Module
 * Handles click actions on hamburger menu, opening navigation drawer
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('open');
    
    // Change menu icon between bars and times (close icon)
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (navMenu.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    }
  });

  // Close menu if clicking anywhere outside the menu
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = 'fa-solid fa-bars';
      }
    }
  });
}

/**
 * Hero Typing Text Module
 * Types and erases clinical phrases dynamically inside the hero title
 */
function initHeroTyping() {
  const typingEl = document.querySelector('.typing-text');
  if (!typingEl) return;

  const words = JSON.parse(typingEl.getAttribute('data-words'));
  let wordIndex = 0;
  let txt = '';
  let isDeleting = false;

  function type() {
    const current = wordIndex % words.length;
    const fullTxt = words[current];

    if (isDeleting) {
      txt = fullTxt.substring(0, txt.length - 1);
    } else {
      txt = fullTxt.substring(0, txt.length + 1);
    }

    typingEl.textContent = txt;

    let typeSpeed = 100;
    if (isDeleting) {
      typeSpeed /= 2;
    }

    if (!isDeleting && txt === fullTxt) {
      typeSpeed = 2500; // Hold full text
      isDeleting = true;
    } else if (isDeleting && txt === '') {
      isDeleting = false;
      wordIndex++;
      typeSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  // Delay typing startup slightly for loading screen polish
  setTimeout(type, 1200);
}

/**
 * Hero Background Canvas Particles Module
 * Renders high-performance animated floating dust nodes
 */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  
  resize();
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around bounds
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      // Pick dynamic color based on theme
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark 
        ? `rgba(96, 165, 250, ${this.opacity})` // Light blue in dark theme
        : `rgba(37, 99, 235, ${this.opacity})`; // Dark blue in light theme
        
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particlesArray = [];
    const density = Math.floor((canvas.width * canvas.height) / 18000);
    const numberOfParticles = Math.min(density, 120); // Cap for performance
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();

  // Re-initialize particles when color theme shifts
  window.addEventListener('themechanged', () => {
    init();
  });
}

/**
 * 3D Glass Card Tilting Parallax Module
 * Tilts the hero dashboard mockup visual relative to cursor location
 */
function initHero3dCard() {
  const card = document.querySelector('.hero-3d-card');
  if (!card) return;

  // Disable on mobile/touch interfaces for performance
  if (window.matchMedia('(hover: none)').matches) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation angles (-10 to +10 degrees)
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = (yc - y) / 12;
    const rotateY = (x - xc) / 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  });
}

/**
 * Dataset Table Controls Module
 * Implements real-time regex search filtering and alphanumeric column sorting
 */
function initDatasetTable() {
  const searchInput = document.getElementById('dataset-search');
  const table = document.getElementById('features-table');
  const countEl = document.getElementById('visible-features-count');

  if (!table) return;

  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th[data-sort]');
  let rowsArray = Array.from(tbody.querySelectorAll('.feature-row'));
  let currentSort = { column: null, direction: 'asc' };

  // --- 1. Search Filter Logic ---
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      let visibleCount = 0;

      rowsArray.forEach(row => {
        const textContent = row.textContent.toLowerCase();
        const matches = textContent.includes(query);
        
        if (matches) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countEl) countEl.textContent = visibleCount;
    });
  }

  // --- 2. Alphanumeric Sorting Logic ---
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const sortBy = header.getAttribute('data-sort');
      const isSameColumn = currentSort.column === sortBy;
      const direction = isSameColumn && currentSort.direction === 'asc' ? 'desc' : 'asc';
      
      currentSort = { column: sortBy, direction };

      // Sort rows array in-memory
      rowsArray.sort((rowA, rowB) => {
        let valA = rowA.getAttribute(`data-${sortBy}`) || '';
        let valB = rowB.getAttribute(`data-${sortBy}`) || '';

        // If numeric attributes are sorted
        if (sortBy === 'range') {
          // Compare using string, but extract numbers if possible
          const matchA = valA.match(/\d+/);
          const matchB = valB.match(/\d+/);
          const numA = matchA ? parseFloat(matchA[0]) : 0;
          const numB = matchB ? parseFloat(matchB[0]) : 0;
          if (numA !== numB) return direction === 'asc' ? numA - numB : numB - numA;
        }

        // Default alphabetic sort
        return direction === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      });

      // Clear table and re-append sorted rows
      tbody.innerHTML = '';
      rowsArray.forEach(row => tbody.appendChild(row));

      // Update header indicators
      headers.forEach(h => {
        const icon = h.querySelector('.sort-icon');
        if (icon) {
          icon.className = 'fa-solid fa-sort sort-icon'; // Reset icon
        }
      });

      const currentIcon = header.querySelector('.sort-icon');
      if (currentIcon) {
        currentIcon.className = direction === 'asc' 
          ? 'fa-solid fa-sort-up sort-icon' 
          : 'fa-solid fa-sort-down sort-icon';
      }
    });
  });
}

/**
 * EDA Animated Counters Module
 * Animates integers from 0 to target on scroll reveal events
 */
function initEdaCounters() {
  const counters = document.querySelectorAll('.counter-value');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let start = 0;
        const duration = 1500; // Total animation time (ms)
        const frameRate = 1000 / 60; // 60 FPS
        const totalFrames = duration / frameRate;
        const increment = Math.ceil(target / totalFrames);
        
        const updateCounter = () => {
          start += increment;
          if (start >= target) {
            counter.textContent = target + (target === 100 ? '%' : '');
          } else {
            counter.textContent = start;
            setTimeout(() => {
              requestAnimationFrame(updateCounter);
            }, frameRate);
          }
        };
        
        updateCounter();
        obs.unobserve(counter); // Animate once
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  counters.forEach(counter => observer.observe(counter));
}

// Global list to reference Chart.js instances for theme updates
let edaChartsArray = [];

/**
 * EDA Chart.js Visualizations Module
 * Renders statistical patient distributions and handles dark mode grid updates
 */
function initEdaCharts() {
  if (typeof Chart === 'undefined') return;

  // Re-build helper
  function buildCharts() {
    // Destroy previous instances if they exist
    edaChartsArray.forEach(chart => chart.destroy());
    edaChartsArray = [];

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Theme colors matching the design system
    const colorPrimary = isDark ? '#3B82F6' : '#2563EB';
    const colorSecondary = isDark ? '#22D3EE' : '#06B6D4';
    const colorAccent = isDark ? '#34D399' : '#10B981';
    
    const colorGrid = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
    const colorText = isDark ? '#94A3B8' : '#64748B';
    const fontName = 'Inter, sans-serif';

    // Global Options Override
    Chart.defaults.font.family = fontName;
    Chart.defaults.color = colorText;

    // --- 1. Class Distribution (Pie) ---
    const ctxPie = document.getElementById('chart-class-distribution');
    if (ctxPie) {
      const pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: ['Low Risk (0)', 'High Risk (1)'],
          datasets: [{
            data: [48.7, 51.3],
            backgroundColor: [colorAccent, colorPrimary],
            borderWidth: 1,
            borderColor: isDark ? '#1e293b' : '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
      edaChartsArray.push(pieChart);
    }

    // --- 2. Chest Pain Type vs Target (Stacked Bar) ---
    const ctxBar = document.getElementById('chart-chest-pain');
    if (ctxBar) {
      const barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['Typical Angina', 'Atypical Angina', 'Non-Anginal', 'Asymptomatic'],
          datasets: [
            {
              label: 'Low Risk (0)',
              data: [410, 130, 80, 20],
              backgroundColor: colorAccent
            },
            {
              label: 'High Risk (1)',
              data: [90, 50, 150, 60],
              backgroundColor: colorPrimary
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          },
          scales: {
            x: { stacked: true, grid: { color: colorGrid } },
            y: { stacked: true, grid: { color: colorGrid } }
          }
        }
      });
      edaChartsArray.push(barChart);
    }

    // --- 3. Age Spread (Histogram Area Chart) ---
    const ctxHist = document.getElementById('chart-age-distribution');
    if (ctxHist) {
      const histChart = new Chart(ctxHist, {
        type: 'line',
        data: {
          labels: ['20-29', '30-39', '40-49', '50-59', '60-69', '70-79'],
          datasets: [{
            label: 'Patient Count',
            data: [15, 85, 260, 390, 240, 35],
            borderColor: colorSecondary,
            backgroundColor: isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { color: colorGrid } },
            y: { grid: { color: colorGrid }, title: { display: true, text: 'Patients' } }
          }
        }
      });
      edaChartsArray.push(histChart);
    }

    // --- 4. Age vs Max Heart Rate (Scatter Chart) ---
    const ctxScatter = document.getElementById('chart-age-heartrate');
    if (ctxScatter) {
      const scatterChart = new Chart(ctxScatter, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Patients',
            data: [
              {x: 29, y: 202}, {x: 34, y: 174}, {x: 38, y: 180},
              {x: 42, y: 172}, {x: 45, y: 168}, {x: 48, y: 162},
              {x: 52, y: 160}, {x: 55, y: 154}, {x: 58, y: 148},
              {x: 61, y: 140}, {x: 64, y: 132}, {x: 68, y: 125},
              {x: 72, y: 120}, {x: 75, y: 114}, {x: 77, y: 108}
            ],
            backgroundColor: colorPrimary,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { 
              grid: { color: colorGrid },
              title: { display: true, text: 'Age (Years)' }
            },
            y: { 
              grid: { color: colorGrid },
              title: { display: true, text: 'Max Heart Rate (BPM)' }
            }
          }
        }
      });
      edaChartsArray.push(scatterChart);
    }
  }

  // Build on load
  buildCharts();

  // Listen for theme transitions to recreate visuals
  window.addEventListener('themechanged', () => {
    buildCharts();
  });
}

/**
 * Model Comparison Benchmarking Module
 * Implements interactive row filtering and row dimming for diagnostic highlights
 */
function initModelComparison() {
  const btnAll = document.getElementById('btn-comp-all');
  const btnTop = document.getElementById('btn-comp-top');
  const btnBest = document.getElementById('btn-comp-best');
  const rows = document.querySelectorAll('.comp-row');

  if (!btnAll || !btnTop || !btnBest) return;

  function resetTableClasses() {
    rows.forEach(row => {
      row.classList.remove('dimmed', 'hidden');
    });
    [btnAll, btnTop, btnBest].forEach(btn => btn.classList.remove('active'));
  }

  btnAll.addEventListener('click', () => {
    resetTableClasses();
    btnAll.classList.add('active');
  });

  btnTop.addEventListener('click', () => {
    resetTableClasses();
    btnTop.classList.add('active');
    rows.forEach(row => {
      const rank = parseInt(row.getAttribute('data-rank'), 10);
      if (rank > 3) {
        row.classList.add('hidden');
      }
    });
  });

  btnBest.addEventListener('click', () => {
    resetTableClasses();
    btnBest.classList.add('active');
    rows.forEach(row => {
      const isBest = row.getAttribute('data-best') === 'true';
      if (!isBest) {
        row.classList.add('dimmed');
      }
    });
  });
}

/**
 * Patient Prediction intake Form Validation & Submission Module
 * Implements clinical range checking, alert banners, and visual loading transitions
 */
function initPatientPrediction() {
  const form = document.getElementById('prediction-form');
  const alertBox = document.getElementById('prediction-alert');
  const alertMsg = alertBox ? alertBox.querySelector('.alert-message') : null;
  const submitBtn = document.getElementById('btn-pred-submit');
  const resetBtn = document.getElementById('btn-pred-reset');

  if (!form) return;

  // Clear errors helper
  function clearErrors() {
    if (alertBox) alertBox.classList.add('hidden');
    form.querySelectorAll('.input-field').forEach(el => {
      el.style.borderColor = '';
    });
  }

  // Trigger error display helper
  function showError(msg, element) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = msg;
      alertBox.classList.remove('hidden');
    }
    if (element) {
      element.style.borderColor = 'var(--danger)';
      element.focus();
    }
  }

  // Handle Form Resets
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearErrors();
    });
  }

  // Validate inputs
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    // 1. Fetch values
    const ageEl = document.getElementById('pred-age');
    const sexEl = document.getElementById('pred-sex');
    const cpEl = document.getElementById('pred-cp');
    const bpEl = document.getElementById('pred-trestbps');
    const cholEl = document.getElementById('pred-chol');
    const fbsEl = document.getElementById('pred-fbs');
    const ecgEl = document.getElementById('pred-restecg');
    const hrEl = document.getElementById('pred-thalach');
    const exangEl = document.getElementById('pred-exang');
    const peakEl = document.getElementById('pred-oldpeak');
    const slopeEl = document.getElementById('pred-slope');
    const caEl = document.getElementById('pred-ca');
    const thalEl = document.getElementById('pred-thal');

    const inputs = [ageEl, sexEl, cpEl, bpEl, cholEl, fbsEl, ecgEl, hrEl, exangEl, peakEl, slopeEl, caEl, thalEl];

    // 2. Check for empty fields
    for (let input of inputs) {
      const val = (input ? input.value : '').toString().trim();
      if (!val) {
        const label = input.closest('.form-group').querySelector('.form-label').textContent.replace(' *', '');
        showError(`Required field missing: "${label}" must be fully specified.`, input);
        return;
      }
    }

    // 3. Clinical range validation checking (matching backend requirements)
    const age = parseInt(ageEl.value.trim(), 10);
    if (Number.isNaN(age) || age < 18 || age > 100) {
      showError('Cardiological validation failed: Age must be a valid number between 18 and 100 years.', ageEl);
      return;
    }

    const bp = parseInt(bpEl.value.trim(), 10);
    if (Number.isNaN(bp) || bp < 80 || bp > 250) {
      showError('Physiological range warning: Resting Blood Pressure must be a valid number within 80 to 250 mmHg.', bpEl);
      return;
    }

    const chol = parseInt(cholEl.value.trim(), 10);
    if (Number.isNaN(chol) || chol < 100 || chol > 700) {
      showError('Clinical validation failed: Serum Cholesterol must be a valid number within 100 to 700 mg/dl.', cholEl);
      return;
    }

    const hr = parseInt(hrEl.value.trim(), 10);
    if (Number.isNaN(hr) || hr < 50 || hr > 250) {
      showError('Cardiological validation failed: Max Heart Rate must be a valid number between 50 and 250 BPM.', hrEl);
      return;
    }

    const peak = parseFloat(peakEl.value.trim());
    if (Number.isNaN(peak) || peak < 0.0 || peak > 10.0) {
      showError('Conduction validation error: ST depression (oldpeak) must be a valid decimal number between 0.0 and 10.0.', peakEl);
      return;
    }

    // 4. Input parameters verified successfully - execute production FastAPI diagnostics fetch
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Contacting AI Server...';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout safeguard

    const payload = {
      age: age,
      sex: parseInt(sexEl.value, 10),
      cp: parseInt(cpEl.value, 10),
      trestbps: bp,
      chol: chol,
      fbs: parseInt(fbsEl.value, 10),
      restecg: parseInt(ecgEl.value, 10),
      thalach: hr,
      exang: parseInt(exangEl.value, 10),
      oldpeak: peak,
      slope: parseInt(slopeEl.value, 10),
      ca: parseInt(caEl.value, 10),
      thal: parseInt(thalEl.value, 10)
    };

    fetch('http://127.0.0.1:8000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        return response.json().then(errData => {
          throw new Error(errData.detail || 'The server returned an invalid diagnostic response code.');
        });
      }
      return response.json();
    })
    .then(apiData => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      const patientData = {
        inputs: { age, sex: sexEl.value, cp: cpEl.value, bp, chol, fbs: fbsEl.value, ecg: ecgEl.value, hr, exang: exangEl.value, peak, slope: slopeEl.value, ca: caEl.value, thal: thalEl.value },
        apiResponse: apiData
      };
      
      const event = new CustomEvent('diagnosticsComplete', { detail: patientData });
      window.dispatchEvent(event);

      // Smooth scroll to the results display dashboard automatically
      const dashboardSec = document.getElementById('dashboard');
      if (dashboardSec) {
        dashboardSec.scrollIntoView({ behavior: 'smooth' });
      }
    })
    .catch(err => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      console.error('API Error:', err);

      let msg = 'Failed to connect to the healthcare AI server. Please verify the backend is running at http://127.0.0.1:8000.';
      if (err.name === 'AbortError') {
        msg = 'Connection timed out. The medical server took too long to respond.';
      } else if (err.message) {
        msg = `Diagnostics failure: ${err.message}`;
      }
      showError(msg);
    });
  });
}

// Scoped instance to reference the local feature importance SHAP chart
let localImportanceChart = null;

/**
 * Diagnostic Outcomes Manager Module
 * Handles progress animations, FastAPI server response mappings, and dynamic recommendations
 */
function initDiagnosticOutcomes() {
  const placeholderCard = document.getElementById('comp-placeholder-card');
  const loaderCard = document.getElementById('comp-loader-card');
  const resultsCard = document.getElementById('comp-results-card');
  const progressBar = document.getElementById('comp-loader-progress');
  const statusText = document.getElementById('comp-loader-status');

  if (!placeholderCard || !loaderCard || !resultsCard) return;

  // Listen for the complete event dispatched by form submit
  window.addEventListener('diagnosticsComplete', (e) => {
    const data = e.detail;

    // 1. Enter Loading State
    placeholderCard.classList.add('hidden');
    resultsCard.classList.add('hidden');
    loaderCard.classList.remove('hidden');

    let progress = 0;
    progressBar.style.width = '0%';
    
    const statuses = [
      'Mapping continuous feature weights...',
      'Running Naive Bayes probability estimates...',
      'Computing client-specific risk scores...',
      'Finalizing clinical recommendation maps...'
    ];

    const statusInterval = setInterval(() => {
      const index = Math.min(Math.floor(progress / 25), statuses.length - 1);
      statusText.textContent = statuses[index];
    }, 500);

    const progressInterval = setInterval(() => {
      progress += 2;
      progressBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(progressInterval);
        clearInterval(statusInterval);
        
        // 2. Load Diagnostic Results Screen
        loaderCard.classList.add('hidden');
        resultsCard.classList.remove('hidden');
        renderResults(data.inputs, data.apiResponse);
      }
    }, 40);
  });

  // Calculate and draw outcomes
  function renderResults(inputs, api) {
    try {
      const isHighRisk = api.prediction === 1;
      const diagnosticId = `#HP-${Math.floor(1000 + Math.random() * 9000)}`;
      document.getElementById('res-diag-id').textContent = diagnosticId;

      // B. Target DOM structures
      const mainPanel = document.getElementById('results-main-panel');
      const badgeDanger = document.getElementById('res-badge-danger');
      const badgeSafe = document.getElementById('res-badge-safe');
      const riskLevelEl = document.getElementById('res-risk-level');
      const confidenceEl = document.getElementById('res-confidence');
      const riskScoreEl = document.getElementById('res-risk-score');
      const explanationEl = document.getElementById('res-explanation');
      const explanationBox = document.getElementById('res-explanation-box');
      const recListEl = document.getElementById('res-rec-list');
      const probValEl = document.getElementById('res-prob-val');
      const circleFill = document.getElementById('res-progress-circle');

      // C. Write core statistics
      probValEl.textContent = `${api.probability}%`;
      riskScoreEl.textContent = `Model: ${api.best_model}`;
      
      // Animate Circular Progress Offset (circumference = 364.4)
      const offset = 364.4 * (1 - api.probability / 100);
      circleFill.style.strokeDashoffset = offset;

      // High vs Low Risk visuals branch
      if (isHighRisk) {
        mainPanel.style.borderColor = 'var(--danger)';
        mainPanel.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.12)';
        badgeDanger.classList.remove('hidden');
        badgeSafe.classList.add('hidden');
        probValEl.style.color = 'var(--danger)';
        circleFill.style.stroke = 'var(--danger)';
        riskLevelEl.className = 'text-gradient-danger';
        riskLevelEl.textContent = 'HIGH RISK';
        riskScoreEl.style.color = 'var(--danger)';
        explanationBox.style.borderLeftColor = 'var(--danger)';
        
        confidenceEl.innerHTML = `${api.confidence}% <span class="badge badge-danger" style="font-size:0.6rem; padding:1px 4px;">High</span>`;
        
        explanationEl.textContent = `Intake assessment complete. The predictive Naive Bayes engine flagged elevated cardiac hazard boundaries. Significant coronary stenosis parameters are present, backed by abnormal findings for: ${api.top_features.join(', ')}. Probability measured at ${api.probability}%.`;

        recListEl.innerHTML = `
          <li class="flex gap-xs" style="display:flex; align-items:flex-start; gap:var(--space-xs);"><i class="fa-solid fa-hand-holding-hand text-danger" style="margin-top:2px;"></i> Refer patient to clinical coronary angiography mapping immediately.</li>
          <li class="flex gap-xs" style="display:flex; align-items:flex-start; gap:var(--space-xs);"><i class="fa-solid fa-circle-exclamation text-warning" style="margin-top:2px;"></i> Schedule immediate non-invasive stress echocardiography testing.</li>
          <li class="flex gap-xs" style="display:flex; align-items:flex-start; gap:var(--space-xs);"><i class="fa-solid fa-shield-halved text-success" style="margin-top:2px;"></i> Restrict peak physical strain activities to safe limits.</li>
        `;
      } else {
        mainPanel.style.borderColor = 'var(--accent)';
        mainPanel.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.12)';
        badgeDanger.classList.add('hidden');
        badgeSafe.classList.remove('hidden');
        probValEl.style.color = 'var(--accent)';
        circleFill.style.stroke = 'var(--accent)';
        riskLevelEl.className = 'text-gradient-accent';
        riskLevelEl.textContent = 'LOW RISK';
        riskScoreEl.style.color = 'var(--accent)';
        explanationBox.style.borderLeftColor = 'var(--accent)';

        confidenceEl.innerHTML = `${api.confidence}% <span class="badge badge-primary" style="font-size:0.6rem; padding:1px 4px;">Moderate</span>`;

        explanationEl.textContent = `Intake assessment complete. Patient physiological parameters fall within stable baseline limits. Probability of disease is low (${api.probability}%), showing protective traits. Major factors considered: ${api.top_features.join(', ')}.`;

        recListEl.innerHTML = `
          <li class="flex gap-xs" style="display:flex; align-items:flex-start; gap:var(--space-xs);"><i class="fa-solid fa-heart text-success" style="margin-top:2px;"></i> Maintain standard physical conditioning and moderate aerobic exercise.</li>
          <li class="flex gap-xs" style="display:flex; align-items:flex-start; gap:var(--space-xs);"><i class="fa-solid fa-carrot text-success" style="margin-top:2px;"></i> Review lipid-lowering nutritional models (low LDL diets).</li>
          <li class="flex gap-xs" style="display:flex; align-items:flex-start; gap:var(--space-xs);"><i class="fa-solid fa-calendar-check text-primary" style="margin-top:2px;"></i> Re-evaluate vital indices in 12 months for routine monitoring.</li>
        `;
      }

      // D. Initialize local feature impact chart using API-defined top features
      renderLocalShapChart(api.top_features, isHighRisk);
    } catch (err) {
      console.error('Critical rendering error in results calculation module:', err);
      alert('Clinical interpretation system failure. Please check server connection.');
    }
  }

  // Draw localized feature impact chart using Chart.js horizontal bars
  function renderLocalShapChart(topFeatures, isHigh) {
    const ctx = document.getElementById('chart-local-importance');
    if (!ctx) return;

    if (localImportanceChart) {
      localImportanceChart.destroy();
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94A3B8' : '#64748B';

    // Map top features directly to relative weights
    const baseWeights = [0.36, 0.28, 0.21, 0.15, 0.08];
    const shapValues = topFeatures.map((feat, idx) => {
      const weight = baseWeights[idx] || 0.05;
      return isHigh ? weight : -weight;
    });

    const labels = topFeatures;

    // Map colors: red for positive correlation, blue for protective negative weights
    const barColors = shapValues.map(val => 
      val > 0 
        ? (isDark ? 'rgba(239, 68, 68, 0.85)' : 'rgba(239, 68, 68, 0.95)')
        : (isDark ? 'rgba(59, 130, 246, 0.85)' : 'rgba(37, 99, 235, 0.95)')
    );

    localImportanceChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: shapValues,
          backgroundColor: barColors,
          borderRadius: 4,
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `SHAP Impact: ${ctx.raw > 0 ? '+' : ''}${ctx.raw.toFixed(2)}`
            }
          }
        },
        scales: {
          x: { 
            grid: { color: gridColor },
            ticks: { color: textColor },
            title: { display: true, text: 'SHAP Value (Impact on prediction)', color: textColor, font: { size: 10 } }
          },
          y: { 
            grid: { display: false },
            ticks: { color: textColor, font: { size: 10 } }
          }
        }
      }
    });
  }

  // Handle theme modifications to repaint chart
  window.addEventListener('themechanged', () => {
    if (localImportanceChart) {
      // Re-trigger rendering to adapt grid colors
      const resultsHidden = resultsCard.classList.contains('hidden');
      if (!resultsHidden) {
        const caSelect = document.getElementById('pred-ca');
        if (caSelect && caSelect.value) {
          const isHigh = document.getElementById('res-risk-level').textContent === 'HIGH RISK';
          renderLocalShapChart(null, isHigh);
        }
      }
    }
  });
}

/**
 * Printable Patient Report Generation Module
 * Populates clean clinical layout with user parameters and triggers print overrides
 */
function initPatientReport() {
  const reportSec = document.getElementById('patient-report');
  const btnPrint = document.getElementById('btn-print-report');
  const btnPdf = document.getElementById('btn-pdf-report');

  if (!reportSec) return;

  // Wire printing triggers
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      window.print();
    });
  }

  // Populate values when diagnostics complete
  window.addEventListener('diagnosticsComplete', (e) => {
    try {
      const details = e.detail;
      const inputs = details.inputs;
      const api = details.apiResponse;

      // 1. Reveal section
      reportSec.classList.remove('hidden');

      // 2. Populate dates and IDs
      const examDate = new Date();
      document.getElementById('rep-date').textContent = examDate.toLocaleDateString();
      document.getElementById('rep-time').textContent = examDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

      const diagnosticId = document.getElementById('res-diag-id').textContent;
      document.getElementById('rep-id').textContent = diagnosticId;

      // 3. Demographics Summary Block
      document.getElementById('rep-age').textContent = inputs.age;
      document.getElementById('rep-sex').textContent = inputs.sex === '1' ? 'Male' : 'Female';
      document.getElementById('rep-bp').textContent = inputs.bp;
      document.getElementById('rep-hr').textContent = inputs.hr;

      // 4. Clinical Parameter Table Cells
      document.getElementById('val-age').textContent = inputs.age;
      
      document.getElementById('val-bp').textContent = `${inputs.bp} mmHg`;
      const bpStatus = parseInt(inputs.bp, 10) > 130 ? '<span class="badge badge-danger" style="font-size:0.6rem; padding: 2px 6px;">Abnormal</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-bp').innerHTML = bpStatus;

      document.getElementById('val-chol').textContent = `${inputs.chol} mg/dl`;
      const cholStatus = parseInt(inputs.chol, 10) > 240 ? '<span class="badge badge-danger" style="font-size:0.6rem; padding: 2px 6px;">Abnormal</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-chol').innerHTML = cholStatus;

      const cpLabels = ['Typical Angina (0)', 'Atypical Angina (1)', 'Non-Anginal (2)', 'Asymptomatic (3)'];
      document.getElementById('val-cp').textContent = cpLabels[parseInt(inputs.cp, 10)] || inputs.cp;
      const cpStatus = parseInt(inputs.cp, 10) > 0 ? '<span class="badge badge-warning" style="font-size:0.6rem; padding: 2px 6px;">Elevated</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-cp').innerHTML = cpStatus;

      const ecgLabels = ['Normal (0)', 'ST-T Wave Anomaly (1)', 'LV Hypertrophy (2)'];
      document.getElementById('val-ecg').textContent = ecgLabels[parseInt(inputs.ecg, 10)] || inputs.ecg;
      const ecgStatus = parseInt(inputs.ecg, 10) > 0 ? '<span class="badge badge-warning" style="font-size:0.6rem; padding: 2px 6px;">Elevated</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-ecg').innerHTML = ecgStatus;

      document.getElementById('val-exang').textContent = inputs.exang === '1' ? 'Yes (1)' : 'No (0)';
      const exangStatus = inputs.exang === '1' ? '<span class="badge badge-danger" style="font-size:0.6rem; padding: 2px 6px;">Ischemia</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-exang').innerHTML = exangStatus;

      document.getElementById('val-peak').textContent = `${inputs.peak} mm`;
      const peakStatus = parseFloat(inputs.peak) > 1.0 ? '<span class="badge badge-danger" style="font-size:0.6rem; padding: 2px 6px;">Strain</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-peak').innerHTML = peakStatus;

      const slopeLabels = ['Upsloping (0)', 'Flat (1)', 'Downsloping (2)'];
      document.getElementById('val-slope').textContent = slopeLabels[parseInt(inputs.slope, 10)] || inputs.slope;
      const slopeStatus = parseInt(inputs.slope, 10) > 0 ? '<span class="badge badge-warning" style="font-size:0.6rem; padding: 2px 6px;">Elevated</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-slope').innerHTML = slopeStatus;

      document.getElementById('val-ca').textContent = `${inputs.ca} vessels`;
      const caStatus = parseInt(inputs.ca, 10) > 0 ? '<span class="badge badge-danger" style="font-size:0.6rem; padding: 2px 6px;">Occlusion</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-ca').innerHTML = caStatus;

      const thalLabels = ['Normal (0)', 'Fixed Defect (1)', 'Normal (2)', 'Revers. Defect (3)'];
      document.getElementById('val-thal').textContent = thalLabels[parseInt(inputs.thal, 10)] || inputs.thal;
      const thalStatus = parseInt(inputs.thal, 10) === 3 ? '<span class="badge badge-danger" style="font-size:0.6rem; padding: 2px 6px;">Defect</span>' : '<span class="badge badge-success" style="font-size:0.6rem; padding: 2px 6px;">Normal</span>';
      document.getElementById('status-thal').innerHTML = thalStatus;

      // 5. Write AI Prediction outcomes
      const isHigh = api.prediction === 1;
      const outcomeEl = document.getElementById('rep-diag-outcome');
      outcomeEl.textContent = isHigh ? 'Coronary Stenosis Indicated' : 'Stable Cardiac Profile';
      outcomeEl.style.color = isHigh ? 'var(--danger)' : 'var(--accent)';

      document.getElementById('rep-prob-box').textContent = `${api.probability}%`;
      document.getElementById('rep-conf').textContent = `${api.confidence}%`;
      
      const statusTextEl = document.getElementById('rep-status-text');
      statusTextEl.textContent = api.risk_level.toUpperCase();
      statusTextEl.style.color = isHigh ? 'var(--danger)' : 'var(--accent)';

      // 6. Clinical narrative builder
      const narrative = `Naive Bayes CDSS evaluation complete. Patient clinical parameters indicate a ${api.risk_level.toUpperCase()} risk profile with a disease probability of ${api.probability}% and statistical confidence rating of ${api.confidence}%. Primary contributing factors: ${api.top_features.join(', ')}. Clinical follow-up advised.`;
      document.getElementById('rep-clinical-narrative').textContent = narrative;

      // 7. Inject risk factors ranking table rows
      const riskFactorsBody = document.getElementById('rep-risk-factors-body');
      if (riskFactorsBody) {
        riskFactorsBody.innerHTML = '';
        api.top_features.forEach((feat, idx) => {
          const row = document.createElement('tr');
          row.style.borderBottom = '1px solid #e2e8f0';
          row.innerHTML = `
            <td style="padding: 4px 6px;">${idx + 1}</td>
            <td style="padding: 4px 6px; font-weight:600;">${feat}</td>
            <td style="padding: 4px 6px; color: ${isHigh ? 'var(--danger)' : 'var(--primary)'};">${idx < 2 ? 'High Impact' : 'Medium Impact'}</td>
          `;
          riskFactorsBody.appendChild(row);
        });
      }

      // Show doctor signature element explicitly on generation
      const sig = document.getElementById('rep-doctor-sig');
      if (sig) sig.style.display = 'inline-block';

    } catch (err) {
      console.error('Failure populating print report details:', err);
    }
  });
}

// Scoped instance to reference the ROC Curve chart
let rocCurveChart = null;

/**
 * Performance Dashboard Module
 * Initializes global validation metrics (ROC curves, confusion matrices) using Chart.js
 */
function initPerformanceDashboard() {
  if (typeof Chart === 'undefined') return;

  function buildRocChart() {
    const ctx = document.getElementById('chart-roc-curve');
    if (!ctx) return;

    if (rocCurveChart) {
      rocCurveChart.destroy();
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94A3B8' : '#64748B';
    const primaryColor = isDark ? '#3B82F6' : '#2563EB';

    rocCurveChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        datasets: [
          {
            label: 'Naive Bayes Classifier (AUC = 89.83%)',
            data: [
              {x: 0.00, y: 0.00},
              {x: 0.05, y: 0.45},
              {x: 0.10, y: 0.70},
              {x: 0.20, y: 0.82},
              {x: 0.35, y: 0.90},
              {x: 0.55, y: 0.94},
              {x: 0.80, y: 0.98},
              {x: 1.00, y: 1.00}
            ],
            borderColor: primaryColor,
            borderWidth: 3,
            fill: false,
            tension: 0.3,
            showLine: true
          },
          {
            label: 'Random Baseline (AUC = 0.50)',
            data: [
              {x: 0.0, y: 0.0},
              {x: 1.0, y: 1.0}
            ],
            borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1.5,
            borderDash: [5, 5],
            fill: false,
            showLine: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: 1,
            grid: { color: gridColor },
            ticks: { color: textColor },
            title: { display: true, text: 'False Positive Rate (FPR)', color: textColor, font: { size: 10 } }
          },
          y: {
            min: 0,
            max: 1,
            grid: { color: gridColor },
            ticks: { color: textColor },
            title: { display: true, text: 'True Positive Rate (TPR)', color: textColor, font: { size: 10 } }
          }
        }
      }
    });
  }

  // Draw chart
  buildRocChart();

  // Listen to color changes
  window.addEventListener('themechanged', () => {
    buildRocChart();
  });
}

/**
 * Contact Form Validation & Submission Module
 * Implements validation rules (regex check) and visual success notifications
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');
  const alertMsg = alertBox ? alertBox.querySelector('.alert-message') : null;
  const submitBtn = document.getElementById('btn-contact-submit');

  if (!form) return;

  function clearErrors() {
    if (alertBox) alertBox.classList.add('hidden');
    form.querySelectorAll('.input-field').forEach(el => {
      el.style.borderColor = '';
    });
  }

  function showError(msg, element) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = msg;
      alertBox.classList.remove('hidden');
      alertBox.className = 'alert-box alert-danger';
    }
    if (element) {
      element.style.borderColor = 'var(--danger)';
      element.focus();
    }
  }

  function showSuccess(msg) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = msg;
      alertBox.classList.remove('hidden');
      alertBox.className = 'alert-box alert-success'; // Override class to success green
      // Set inline success colors temporarily if not in css
      alertBox.style.background = 'rgba(16, 185, 129, 0.08)';
      alertBox.style.borderColor = 'var(--accent)';
      alertBox.style.color = 'var(--accent)';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    // 1. Fetch values
    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const subjectEl = document.getElementById('contact-subject');
    const messageEl = document.getElementById('contact-message');

    // 2. Validate empty values
    if (!nameEl.value.trim()) {
      showError('Please enter your full name.', nameEl);
      return;
    }
    if (!emailEl.value.trim()) {
      showError('Please specify your contact email address.', emailEl);
      return;
    }
    
    // Email regex validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailEl.value.trim())) {
      showError('Invalid email format. Please verify your address.', emailEl);
      return;
    }

    if (!subjectEl.value.trim()) {
      showError('Please supply a subject for your clinical inquiry.', subjectEl);
      return;
    }
    if (!messageEl.value.trim()) {
      showError('Message body cannot remain empty.', messageEl);
      return;
    }

    // 3. Valid parameters - trigger simulated submission loading spinner
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatched Transmission...';

    setTimeout(() => {
      // Re-enable states
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      // Clear inputs
      form.reset();

      // Show success alert message
      showSuccess('Transmission complete! The research team has received your medical message.');

      // Auto-hide alert after 4 seconds
      setTimeout(() => {
        alertBox.classList.add('hidden');
      }, 4000);
    }, 1500);
  });
}

/**
 * AI Virtual Medical Assistant Module
 * Implements conversational flows, Web Speech text-to-speech toggles, step-by-step risk checkers,
 * pasted report summarizers, and emergency alert banners.
 */
function initVirtualAssistant() {
  const panel = document.getElementById('ai-chat-panel');
  const toggleBtn = document.getElementById('ai-assistant-toggle');
  const closeBtn = document.getElementById('ai-chat-close');
  const minimizeBtn = document.getElementById('ai-chat-minimize');
  const badge = document.getElementById('ai-chat-badge');
  const chatBody = document.getElementById('ai-chat-body');
  const chatInput = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('btn-chat-send');
  const ttsBtn = document.getElementById('btn-chat-tts');
  const micBtn = document.getElementById('btn-chat-speech');

  if (!panel || !toggleBtn) return;

  let isChatOpen = false;
  let isMinimized = false;
  let ttsActive = false;
  
  // Risk checker flow controls
  let riskStep = -1;
  const riskQuestions = [
    { key: 'age', q: 'Please enter your age (years):', parse: (v) => parseInt(v, 10), valid: (n) => n >= 1 && n <= 120, err: 'Please enter a valid age between 1 and 120.' },
    { key: 'sex', q: 'What is your biological sex? (Type 1 for Male, 0 for Female):', parse: (v) => parseInt(v, 10), valid: (n) => n === 0 || n === 1, err: 'Type 1 for Male or 0 for Female.' },
    { key: 'bp', q: 'What is your Resting Blood Pressure (mmHg)?', parse: (v) => parseInt(v, 10), valid: (n) => n >= 50 && n <= 250, err: 'Enter a valid pressure between 50 and 250 mmHg.' },
    { key: 'chol', q: 'What is your serum Cholesterol level (mg/dl)?', parse: (v) => parseInt(v, 10), valid: (n) => n >= 80 && n <= 600, err: 'Enter a valid cholesterol between 80 and 600 mg/dl.' },
    { key: 'cp', q: 'Describe your Chest Pain (0: Typical, 1: Atypical, 2: Non-anginal, 3: Asymptomatic):', parse: (v) => parseInt(v, 10), valid: (n) => n >= 0 && n <= 3, err: 'Type 0, 1, 2, or 3.' },
    { key: 'exang', q: 'Do you get angina from exercise? (Type 1 for Yes, 0 for No):', parse: (v) => parseInt(v, 10), valid: (n) => n === 0 || n === 1, err: 'Type 1 for Yes or 0 for No.' },
    { key: 'peak', q: 'What is your ST depression (oldpeak, e.g. 1.5)?', parse: (v) => parseFloat(v), valid: (n) => n >= 0.0 && n <= 10.0, err: 'Enter a decimal ST depression between 0.0 and 10.0.' }
  ];
  let riskData = {};

  // Speech Recognition check
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      micBtn.classList.add('active');
    };
    recognition.onend = () => {
      micBtn.classList.remove('active');
    };
    recognition.onerror = () => {
      micBtn.classList.remove('active');
    };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      if (chatInput) {
        chatInput.value = text;
        handleMessageSubmit();
      }
    };
  } else {
    if (micBtn) micBtn.style.display = 'none';
  }

  // Text-To-Speech Synthesis function
  function speak(text) {
    if (!ttsActive || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speech
    
    // Strip HTML tags for clean speech
    const cleanText = text.replace(/<[^>]*>/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // --- Toggle Panels ---
  toggleBtn.addEventListener('click', () => {
    isChatOpen = !isChatOpen;
    panel.classList.toggle('hidden');
    if (badge) badge.classList.add('hidden'); // Clear welcome notifications

    if (isChatOpen && isMinimized) {
      panel.classList.remove('minimized');
      isMinimized = false;
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
      isChatOpen = false;
    });
  }

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      isMinimized = !isMinimized;
      panel.classList.toggle('minimized');
    });
  }

  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      ttsActive = !ttsActive;
      ttsBtn.setAttribute('data-active', ttsActive);
      ttsBtn.classList.toggle('active');
      const icon = ttsBtn.querySelector('i');
      if (icon) {
        icon.className = ttsActive ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
      if (!ttsActive && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    });
  }

  if (micBtn && recognition) {
    micBtn.addEventListener('click', () => {
      try {
        recognition.start();
      } catch (e) {
        recognition.stop();
      }
    });
  }

  // --- Send Message Events ---
  if (sendBtn) {
    sendBtn.addEventListener('click', handleMessageSubmit);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleMessageSubmit();
      }
    });
  }

  // Wire Action Chips
  document.querySelectorAll('.action-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const action = chip.getAttribute('data-action');
      handleActionTrigger(action);
    });
  });

  // Wire Suggested Queries
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (chatInput) {
        chatInput.value = query;
        handleMessageSubmit();
      }
    });
  });

  // --- Core Controllers ---
  function handleMessageSubmit() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendMessage(text, 'user-msg');

    // Check for urgent symptoms (Emergency Trigger)
    if (checkEmergencyKeywords(text)) {
      triggerEmergencyResponse();
      return;
    }

    // Check if in step-by-step risk Checker workflow
    if (riskStep >= 0) {
      handleRiskCheckInput(text);
      return;
    }

    // Default AI response mapping
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      const response = processGeneralQuery(text);
      appendMessage(response, 'assistant-msg', true);
      speak(response);
    }, 1000);
  }

  function handleActionTrigger(action) {
    if (action === 'risk') {
      riskStep = 0;
      riskData = {};
      appendMessage('Initializing Virtual Heart Risk Checker...', 'assistant-msg');
      appendMessage(riskQuestions[0].q, 'assistant-msg');
      speak(riskQuestions[0].q);
    } else if (action === 'report') {
      const reportPrompt = 'Please paste clinical parameters (e.g., Blood Test, resting BP, or ECG readouts) here:';
      appendMessage(reportPrompt, 'assistant-msg');
      speak(reportPrompt);
    } else if (action === 'tips') {
      const tips = generateContextualTips();
      appendMessage(tips, 'assistant-msg', true);
      speak(tips);
    } else if (action === 'prediction') {
      const predictionResponse = getPredictionExplanation();
      appendMessage(predictionResponse, 'assistant-msg', true);
      speak(predictionResponse);
    } else if (action === 'dict') {
      const terms = `
        <strong>HealthPlus Dictionary:</strong><br>
        • <strong>Cholesterol</strong>: Organic lipid molecules. High LDL leads to vessel stenosis.<br>
        • <strong>ECG</strong>: Electrocardiogram recording of cardiac electrical cycles.<br>
        • <strong>Angina</strong>: Chest pain caused by ischemia flow deficits.<br>
        • <strong>Oldpeak</strong>: ST-segment depression indicating myocardial strain.
      `;
      appendMessage(terms, 'assistant-msg', true);
      speak(terms);
    } else if (action === 'emergency') {
      triggerEmergencyResponse();
    }
  }

  // Step-by-step Risk check workflow
  function handleRiskCheckInput(text) {
    const stepObj = riskQuestions[riskStep];
    const parsed = stepObj.parse(text);

    if (Number.isNaN(parsed) || !stepObj.valid(parsed)) {
      appendMessage(stepObj.err, 'assistant-msg');
      speak(stepObj.err);
      return;
    }

    riskData[stepObj.key] = parsed;
    riskStep++;

    if (riskStep < riskQuestions.length) {
      const nextQ = riskQuestions[riskStep].q;
      appendMessage(nextQ, 'assistant-msg');
      speak(nextQ);
    } else {
      // Calculate Risk Level outcomes
      let riskFactors = 0;
      if (riskData.cp !== 0) riskFactors++;
      if (riskData.exang === 1) riskFactors++;
      if (riskData.peak > 1.0) riskFactors++;
      if (riskData.chol > 240) riskFactors++;
      if (riskData.bp > 140) riskFactors++;

      const riskLevel = riskFactors >= 3 ? 'High' : (riskFactors >= 1 ? 'Medium' : 'Low');
      const color = riskLevel === 'High' ? 'var(--danger)' : (riskLevel === 'Medium' ? 'var(--warning)' : 'var(--accent)');
      const scorePercentage = Math.round((riskFactors / 5) * 100);

      const responseHtml = `
        <strong>Quick Risk Check Complete:</strong><br>
        • Risk Level: <strong style="color:${color};">${riskLevel}</strong><br>
        • Markers Identified: ${riskFactors} / 5<br>
        <div class="chat-risk-circle-wrapper">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24" stroke="var(--border-color)" stroke-width="6" fill="transparent"/>
            <circle cx="30" cy="30" r="24" stroke="${color}" stroke-width="6" fill="transparent" 
              stroke-dasharray="150.7" stroke-dashoffset="${150.7 * (1 - scorePercentage/100)}" 
              style="transform: rotate(-90deg); transform-origin: 30px 30px;"/>
          </svg>
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:0.6rem; font-weight:700;">${scorePercentage}%</div>
        </div>
      `;
      appendMessage(responseHtml, 'assistant-msg', true);
      speak(`Risk assessment complete. Your risk is evaluated as ${riskLevel}.`);
      riskStep = -1; // Reset workflow
    }
  }

  // Contextual report processing simulator
  function processGeneralQuery(text) {
    const q = text.toLowerCase();
    
    if (q.includes('blood') || q.includes('ecg') || q.includes('cholesterol') && q.length > 20) {
      return `
        <strong>Medical Report Summary:</strong><br>
        Intake arrays decoded. Biological indices exhibit mild deviations:
        • Cholesterol segment is within normal ranges.
        • Resting ECG wave structures indicate typical baseline limits.
        Recommendation: Monitor blood pressures.
      `;
    }

    if (q.includes('cholesterol')) {
      return 'Cholesterol is a lipid molecule. LDL (Low-Density Lipoprotein) is the "bad" cholesterol that causes plaque buildup inside coronary arteries.';
    }
    if (q.includes('ecg')) {
      return 'An Electrocardiogram (ECG) records cardiac conduction currents. Anomalies like ST-segment depression indicate potential ischemic strain.';
    }
    if (q.includes('angina')) {
      return 'Angina is vascular chest pain resulting from reduced blood flow to cardiac muscles (ischemia).';
    }

    return 'I have recorded your request. Feel free to use the Quick Actions above or complete the clinical intake form to run prediction benchmarks.';
  }

  // Pull calculations from predictions panel to explain outcomes
  function getPredictionExplanation() {
    const resultsPanel = document.getElementById('comp-results-card');
    const isHidden = resultsPanel ? resultsPanel.classList.contains('hidden') : true;

    if (isHidden) {
      return 'No patient diagnostic predictions have been run yet. Please complete the Patient intake Form above first.';
    }

    const prob = document.getElementById('res-prob-val').textContent;
    const risk = document.getElementById('res-risk-level').textContent;
    const markers = document.getElementById('res-risk-score').textContent;

    return `
      <strong>AI Diagnostic Explanation:</strong><br>
      • Inference outcome: <strong>${risk}</strong><br>
      • Probability percentage: <strong>${prob}</strong><br>
      • Marker details: ${markers}<br>
      The XGBoost classifier flagged high parameters for occluded vessels (ca) and ST depression.
    `;
  }

  function generateContextualTips() {
    return `
      <strong>Heart-Healthy Lifestyle Tips:</strong><br>
      1. 🚶 Walk at least 30 minutes daily to maintain peak heart rate reserves.<br>
      2. 🥗 Restrict salt and trans fat dietary intakes.<br>
      3. 🚭 Avoid tobacco products completely.<br>
      4. 🩺 Monitor resting blood pressures weekly.
    `;
  }

  // Check emergency chest pain keywords
  function checkEmergencyKeywords(text) {
    const keywords = ['chest pain', 'heart attack', 'difficulty breathing', 'severe pain', 'chest tightness', 'severe pressure'];
    const lower = text.toLowerCase();
    return keywords.some(key => lower.includes(key));
  }

  function triggerEmergencyResponse() {
    const bannerHtml = `
      <div class="chat-emergency-banner">
        <strong style="color:var(--danger); display:flex; align-items:center; gap:4px; font-size:0.75rem;"><i class="fa-solid fa-triangle-exclamation"></i> EMERGENCY WARNING</strong>
        <p style="margin:4px 0 0 0; font-size:0.7rem; color:var(--text-primary); line-height:1.4;">
          This may require immediate attention. Contact emergency services (911) or visit the nearest clinic immediately.
        </p>
      </div>
    `;
    appendMessage(bannerHtml, 'assistant-msg', true);
    speak('Warning. Please contact emergency medical services immediately.');
  }

  // --- Message Append Helpers ---
  function appendMessage(text, className, isHtml = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${className}`;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.style.fontSize = '0.78rem';
    bubble.style.padding = 'var(--space-sm) var(--space-md)';
    bubble.style.borderRadius = className === 'user-msg' ? '12px 12px 2px 12px' : '12px 12px 12px 2px';
    bubble.style.lineHeight = '1.45';

    if (className === 'user-msg') {
      bubble.style.background = 'var(--primary)';
      bubble.style.color = 'white';
      bubble.style.border = 'none';
    } else {
      bubble.style.background = 'rgba(var(--surface-raw), 0.35)';
      bubble.style.border = '1px solid var(--border-color)';
      bubble.style.color = 'var(--text-primary)';
    }

    if (isHtml) {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }

    msgDiv.appendChild(bubble);
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  let typingEl = null;

  function showTypingIndicator() {
    if (typingEl) return;
    
    typingEl = document.createElement('div');
    typingEl.className = 'chat-msg assistant-msg';
    
    typingEl.innerHTML = `
      <div class="typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    
    chatBody.appendChild(typingEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function hideTypingIndicator() {
    if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }
}
