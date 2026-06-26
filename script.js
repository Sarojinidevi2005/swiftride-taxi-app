/* ============================================================
   SwiftRide — Call Taxi Booking
   script.js | Author: SwiftRide Team
   ============================================================ */

/* ===== NAVBAR: Scroll shrink + active link ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link based on scroll position
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
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

window.addEventListener('scroll', updateNavbar);
updateNavbar(); // run once on load


/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});


/* ===== SCROLL-TO-TOP BUTTON ===== */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ===== ANIMATED STATISTICS COUNTER ===== */
let countersStarted = false;

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const duration = 1800; // ms
    const step = Math.ceil(target / (duration / 16)); // ~60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current.toLocaleString();
    }, 16);
  });
}

// Trigger counters when stats section enters viewport
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounters();
    }
  });
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);


/* ===== SCROLL REVEAL ANIMATIONS ===== */
function addRevealClasses() {
  const revealTargets = [
    '.service-card',
    '.why-card',
    '.review-card',
    '.contact-card',
    '.booking-info',
    '.booking-form-card',
  ];
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.12 });

function initReveal() {
  addRevealClasses();
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveal);


/* ===== TOAST NOTIFICATION ===== */
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}


/* ===== BOOKING FORM VALIDATION ===== */
const bookingForm = document.getElementById('bookingForm');

/**
 * Validate a single field.
 * @param {string} fieldId - Input element id
 * @param {string} errId   - Error span id
 * @param {Function} [customCheck] - Optional extra validator, returns true if valid
 * @returns {boolean}
 */
function validateField(fieldId, errId, customCheck) {
  const field = document.getElementById(fieldId);
  const errSpan = document.getElementById(errId);
  const value = field.value.trim();
  let valid = value !== '';

  if (valid && customCheck) {
    valid = customCheck(value);
  }

  if (!valid) {
    field.classList.add('error');
    errSpan.classList.add('show');
  } else {
    field.classList.remove('error');
    errSpan.classList.remove('show');
  }
  return valid;
}

// Live validation — clears error as user types
['fullName', 'phone', 'pickup', 'drop', 'rideDate', 'rideTime', 'taxiType'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  const errMap = {
    fullName: 'nameErr',
    phone: 'phoneErr',
    pickup: 'pickupErr',
    drop: 'dropErr',
    rideDate: 'dateErr',
    rideTime: 'timeErr',
    taxiType: 'typeErr',
  };
  el.addEventListener('input', () => {
    if (el.value.trim() !== '') {
      el.classList.remove('error');
      document.getElementById(errMap[id]).classList.remove('show');
    }
  });
  el.addEventListener('change', () => {
    if (el.value.trim() !== '') {
      el.classList.remove('error');
      document.getElementById(errMap[id]).classList.remove('show');
    }
  });
});

// Phone validator — must be 10 digits
function isValidPhone(val) {
  return /^[6-9]\d{9}$/.test(val.replace(/\s+/g, ''));
}

bookingForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const v1 = validateField('fullName', 'nameErr');
  const v2 = validateField('phone', 'phoneErr', isValidPhone);
  const v3 = validateField('pickup', 'pickupErr');
  const v4 = validateField('drop', 'dropErr');
  const v5 = validateField('rideDate', 'dateErr');
  const v6 = validateField('rideTime', 'timeErr');
  const v7 = validateField('taxiType', 'typeErr');

  if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6 || !v7) {
    // Scroll to first error
    const firstError = bookingForm.querySelector('.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // All valid — animate button, show toast, reset
  const bookBtn = document.getElementById('bookBtn');
  bookBtn.textContent = 'Confirming…';
  bookBtn.disabled = true;

  setTimeout(() => {
    bookBtn.innerHTML = '<i class="ph ph-car-simple"></i> Confirm Booking';
    bookBtn.disabled = false;
    bookingForm.reset();
    showToast();
  }, 900);
});


/* ===== SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ===== SET MIN DATE for date input (today onwards) ===== */
const rideDateInput = document.getElementById('rideDate');
if (rideDateInput) {
  const today = new Date().toISOString().split('T')[0];
  rideDateInput.setAttribute('min', today);
}
