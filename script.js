// ========== DOM Elements ==========
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const scrollProgress = document.getElementById('scrollProgress');
const contactForm = document.getElementById('contactForm');

// ========== 1. Navbar Scroll Detection ==========
function handleScroll() {
  // Navbar background change
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Back to top button visibility
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
  
  // Scroll progress bar
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  scrollProgress.style.width = scrolled + '%';
}

window.addEventListener('scroll', handleScroll);
handleScroll();

// ========== 2. Back to Top Button ==========
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== 3. Dark/Light Mode with localStorage ==========
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// ========== 4. Mobile Hamburger Menu ==========
function closeMenu() {
  navLinks.classList.remove('active');
  const icon = menuToggle.querySelector('i');
  icon.classList.remove('fa-times');
  icon.classList.add('fa-bars');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function openMenu() {
  navLinks.classList.add('active');
  const icon = menuToggle.querySelector('i');
  icon.classList.remove('fa-bars');
  icon.classList.add('fa-times');
  menuToggle.setAttribute('aria-expanded', 'true');
}

menuToggle.addEventListener('click', () => {
  if (navLinks.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') && 
      !navLinks.contains(e.target) && 
      !menuToggle.contains(e.target)) {
    closeMenu();
  }
});

// Close menu with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    closeMenu();
  }
});

// ========== 5. Active Navigation Link Highlighting ==========
function setActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink();

// ========== 6. Scroll Reveal Animation (Intersection Observer) ==========
const revealElements = document.querySelectorAll('.fade-up, .scroll-reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ========== 7. Animated Counters ==========
const statNumbers = document.querySelectorAll('.stat-number');
let countersTriggered = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersTriggered) {
      countersTriggered = true;
      
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            if (target === 9999) {
              stat.textContent = Math.floor(current) + '%';
            } else if (target >= 1000000) {
              stat.textContent = Math.floor(current / 1000000) + 'M+';
            } else if (target >= 1000) {
              stat.textContent = Math.floor(current / 1000) + 'K+';
            } else {
              stat.textContent = Math.floor(current);
            }
            requestAnimationFrame(updateCounter);
          } else {
            if (target === 9999) {
              stat.textContent = '99.99%';
            } else if (target >= 1000000) {
              stat.textContent = (target / 1000000) + 'M+';
            } else if (target >= 1000) {
              stat.textContent = (target / 1000) + 'K+';
            } else {
              stat.textContent = target;
            }
          }
        };
        updateCounter();
      });
      
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  counterObserver.observe(statsSection);
}

// ========== 8. FAQ Accordion ==========
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    // Close other open items
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
  });
});

// ========== 9. Contact Form Validation ==========
function validateForm() {
  let isValid = true;
  
  // Name validation
  const name = document.getElementById('name');
  const nameError = document.getElementById('nameError');
  if (!name.value.trim()) {
    nameError.textContent = 'Name is required';
    nameError.classList.add('visible');
    isValid = false;
  } else if (name.value.trim().length < 2) {
    nameError.textContent = 'Name must be at least 2 characters';
    nameError.classList.add('visible');
    isValid = false;
  } else {
    nameError.classList.remove('visible');
  }
  
  // Email validation
  const email = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    emailError.textContent = 'Email is required';
    emailError.classList.add('visible');
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    emailError.textContent = 'Please enter a valid email address';
    emailError.classList.add('visible');
    isValid = false;
  } else {
    emailError.classList.remove('visible');
  }
  
  // Message validation
  const message = document.getElementById('message');
  const messageError = document.getElementById('messageError');
  if (!message.value.trim()) {
    messageError.textContent = 'Message is required';
    messageError.classList.add('visible');
    isValid = false;
  } else if (message.value.trim().length < 10) {
    messageError.textContent = 'Message must be at least 10 characters';
    messageError.classList.add('visible');
    isValid = false;
  } else {
    messageError.classList.remove('visible');
  }
  
  return isValid;
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Thank you! Your message has been sent. We\'ll get back to you soon.');
      contactForm.reset();
    }
  });
}

// Real-time validation
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

if (nameInput) {
  nameInput.addEventListener('input', () => {
    const error = document.getElementById('nameError');
    if (nameInput.value.trim().length >= 2) {
      error.classList.remove('visible');
    }
  });
}

if (emailInput) {
  emailInput.addEventListener('input', () => {
    const error = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value)) {
      error.classList.remove('visible');
    }
  });
}

if (messageInput) {
  messageInput.addEventListener('input', () => {
    const error = document.getElementById('messageError');
    if (messageInput.value.trim().length >= 10) {
      error.classList.remove('visible');
    }
  });
}

// ========== 10. Newsletter Subscription ==========
const newsletterBtn = document.getElementById('newsletterBtn');
const newsletterEmail = document.getElementById('newsletterEmail');

if (newsletterBtn) {
  newsletterBtn.addEventListener('click', () => {
    const email = newsletterEmail.value;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Successfully subscribed to newsletter!');
      newsletterEmail.value = '';
    } else if (email) {
      alert('Please enter a valid email address');
    } else {
      alert('Please enter your email address');
    }
  });
}

// ========== 11. Button Interactions ==========
const heroCta = document.getElementById('heroCta');
const heroDemo = document.getElementById('heroDemo');
const getStartedNav = document.getElementById('getStartedNav');

if (heroCta) {
  heroCta.addEventListener('click', () => {
    alert('✨ Start your 14-day free trial! No credit card required.');
  });
}

if (heroDemo) {
  heroDemo.addEventListener('click', () => {
    alert('🎥 Watch our interactive demo. See Nexus in action.');
  });
}

if (getStartedNav) {
  getStartedNav.addEventListener('click', (e) => {
    e.preventDefault();
    alert('✨ Start your 14-day free trial!');
  });
}

// Pricing buttons
document.querySelectorAll('.pricing-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('🚀 Thank you for your interest! Our team will contact you shortly.');
  });
});

// ========== 12. Smooth Scroll for Anchor Links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

console.log('✅ Nexus SaaS landing page loaded successfully!');