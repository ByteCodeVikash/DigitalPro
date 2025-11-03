/**
 * Digital Marketing Agency - Main JavaScript File
 * Core functionality and app initialization
 */

'use strict';

// ===== GLOBAL VARIABLES =====
const App = {
  isLoaded: false,
  isMobile: window.innerWidth <= 768,
  scrollPosition: 0,
  navbar: null,
  backToTopBtn: null,
  counters: [],
  observers: []
};

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
  App.init();
});

// ===== WINDOW LOAD =====
window.addEventListener('load', function() {
  App.isLoaded = true;
  hidePreloader();
});

// ===== APP INITIALIZATION =====
App.init = function() {
  console.log('🚀 DigitalPro Agency - Initializing...');
  
  // Initialize core components
  this.initNavigation();
  this.initScrollEffects();
  this.initCounters();
  this.initProgressBars();
  this.initLazyLoading();
  this.initSmoothScroll();
  this.initTypingEffect();
  this.initTooltips();
  this.initModalHandlers();
  this.initAccordions();
  this.initTabs();
  this.bindEvents();
  
  console.log('✅ App initialized successfully');
};

// ===== NAVIGATION =====
App.initNavigation = function() {
  this.navbar = document.getElementById('mainNav');
  
  if (!this.navbar) return;
  
  // Navbar scroll behavior
  window.addEventListener('scroll', throttle(() => {
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
    
    // Update scroll position
    this.scrollPosition = scrollTop;
  }, 16));
  
  // Mobile menu toggle
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
    });
    
    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link, .btn-nav-secondary, .btn-nav-primary');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMobile) {
          navbarCollapse.classList.remove('show');
        }
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });
  }
  
  // Active nav link highlighting
  this.updateActiveNavLink();
  window.addEventListener('scroll', throttle(() => {
    this.updateActiveNavLink();
  }, 100));
};

App.updateActiveNavLink = function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  
  const scrollPos = window.pageYOffset + 100;
  
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    
    if (scrollPos >= top && scrollPos <= bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

// ===== SCROLL EFFECTS =====
App.initScrollEffects = function() {
  // Back to top button
  this.backToTopBtn = document.getElementById('backToTop');
  
  if (this.backToTopBtn) {
    window.addEventListener('scroll', throttle(() => {
      if (window.pageYOffset > 300) {
        this.backToTopBtn.classList.add('show');
      } else {
        this.backToTopBtn.classList.remove('show');
      }
    }, 16));
    
    this.backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });
  }
  
  // Parallax effect for hero section
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', throttle(() => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      heroSection.style.transform = `translateY(${parallax}px)`;
    }, 16));
  }
  
  // Scroll reveal animation
  this.initScrollReveal();
};

App.initScrollReveal = function() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  
  if (revealElements.length === 0) return;
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  this.observers.push(revealObserver);
};

App.scrollToTop = function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// ===== COUNTERS =====
App.initCounters = function() {
  const counterElements = document.querySelectorAll('.counter');
  
  if (counterElements.length === 0) return;
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  counterElements.forEach(counter => {
    counterObserver.observe(counter);
  });
  
  this.observers.push(counterObserver);
};

App.animateCounter = function(element) {
  const target = parseInt(element.getAttribute('data-count')) || 0;
  const duration = 2000;
  const start = performance.now();
  
  element.classList.add('counting');
  
  const updateCounter = (currentTime) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(easeOutExpo * target);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.classList.remove('counting');
      element.textContent = target.toLocaleString();
    }
  };
  
  requestAnimationFrame(updateCounter);
};

// ===== PROGRESS BARS =====
App.initProgressBars = function() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  if (progressBars.length === 0) return;
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.getAttribute('data-width') || '100%';
        
        progressBar.style.setProperty('--progress-width', width);
        progressBar.classList.add('animate');
        
        progressObserver.unobserve(progressBar);
      }
    });
  }, {
    threshold: 0.5
  });
  
  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });
  
  this.observers.push(progressObserver);
};

// ===== LAZY LOADING =====
App.initLazyLoading = function() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (lazyImages.length === 0) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  
  lazyImages.forEach(img => {
    img.classList.add('lazy');
    imageObserver.observe(img);
  });
  
  this.observers.push(imageObserver);
};

// ===== SMOOTH SCROLL =====
App.initSmoothScroll = function() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        this.scrollToTop();
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const navbarHeight = this.navbar ? this.navbar.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ===== TYPING EFFECT =====
App.initTypingEffect = function() {
  const typingElements = document.querySelectorAll('.typing-text');
  
  typingElements.forEach(element => {
    const text = element.textContent;
    const speed = parseInt(element.getAttribute('data-speed')) || 100;
    
    element.textContent = '';
    element.style.borderRight = '2px solid currentColor';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        // Blinking cursor effect
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    // Start typing when element is visible
    const typingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeWriter, 500);
          typingObserver.unobserve(entry.target);
        }
      });
    });
    
    typingObserver.observe(element);
    this.observers.push(typingObserver);
  });
};

// ===== TOOLTIPS =====
App.initTooltips = function() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', this.showTooltip.bind(this));
    element.addEventListener('mouseleave', this.hideTooltip.bind(this));
  });
};

App.showTooltip = function(e) {
  const element = e.target;
  const text = element.getAttribute('data-tooltip');
  
  if (!text) return;
  
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  
  document.body.appendChild(tooltip);
  
  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  tooltip.style.left = rect.left + (rect.width - tooltipRect.width) / 2 + 'px';
  tooltip.style.top = rect.top - tooltipRect.height - 10 + 'px';
  
  tooltip.classList.add('show');
  element._tooltip = tooltip;
};

App.hideTooltip = function(e) {
  const element = e.target;
  if (element._tooltip) {
    element._tooltip.remove();
    element._tooltip = null;
  }
};

// ===== MODAL HANDLERS =====
App.initModalHandlers = function() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        this.openModal(modal);
      }
    });
  });
  
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal(modal));
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => this.closeModal(modal));
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        this.closeModal(openModal);
      }
    }
  });
};

App.openModal = function(modal) {
  modal.classList.add('show');
  document.body.classList.add('modal-open');
};

App.closeModal = function(modal) {
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
};

// ===== ACCORDIONS =====
App.initAccordions = function() {
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-bs-target');
      const target = document.querySelector(targetId);
      const isExpanded = !button.classList.contains('collapsed');
      
      // Close all other accordions in the same group
      const accordionGroup = button.closest('.accordion');
      if (accordionGroup) {
        const allButtons = accordionGroup.querySelectorAll('.accordion-button');
        const allTargets = accordionGroup.querySelectorAll('.accordion-collapse');
        
        allButtons.forEach(btn => {
          if (btn !== button) {
            btn.classList.add('collapsed');
            btn.setAttribute('aria-expanded', 'false');
          }
        });
        
        allTargets.forEach(tgt => {
          if (tgt !== target) {
            tgt.classList.remove('show');
          }
        });
      }
      
      // Toggle current accordion
      if (isExpanded) {
        button.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
        target.classList.remove('show');
      } else {
        button.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
        target.classList.add('show');
      }
    });
  });
};

// ===== TABS =====
App.initTabs = function() {
  const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = button.getAttribute('data-bs-target');
      const target = document.querySelector(targetId);
      
      if (!target) return;
      
      // Remove active class from all tabs and panels in the same group
      const tabGroup = button.closest('.nav-tabs');
      const panelGroup = target.closest('.tab-content');
      
      if (tabGroup) {
        tabGroup.querySelectorAll('.nav-link').forEach(tab => {
          tab.classList.remove('active');
        });
      }
      
      if (panelGroup) {
        panelGroup.querySelectorAll('.tab-pane').forEach(panel => {
          panel.classList.remove('active', 'show');
        });
      }
      
      // Add active class to current tab and panel
      button.classList.add('active');
      target.classList.add('active', 'show');
    });
  });
};

// ===== EVENT BINDING =====
App.bindEvents = function() {
  // Resize handler
  window.addEventListener('resize', debounce(() => {
    this.isMobile = window.innerWidth <= 768;
    this.handleResize();
  }, 250));
  
  // Focus management for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Button ripple effect
  this.initButtonRipples();
  
  // External links
  this.handleExternalLinks();
};

App.handleResize = function() {
  // Close mobile menu on resize to desktop
  if (!this.isMobile) {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
      navbarCollapse.classList.remove('show');
    }
  }
  
  // Recalculate positions for fixed elements
  this.updateActiveNavLink();
};

App.initButtonRipples = function() {
  const rippleButtons = document.querySelectorAll('.btn-ripple');
  
  rippleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
};

App.handleExternalLinks = function() {
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
  
  externalLinks.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
};

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function hidePreloader() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 300);
  }
}

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
  // Cleanup observers
  App.observers.forEach(observer => {
    observer.disconnect();
  });
  App.observers = [];
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('📊 Performance Metrics:', {
        'Page Load Time': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms',
        'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms',
        'Time to Interactive': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms'
      });
    }, 0);
  });
}

// ===== FAQ ACCORDION FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item-modern');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question-modern');
    const answer = item.querySelector('.faq-answer-modern');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all FAQ items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer-modern');
        otherAnswer.style.display = 'none';
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        answer.style.display = 'block';
      }
    });
  });
});

// Export for use in other modules
window.App = App;