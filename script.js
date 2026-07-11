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
    '.contact-form-info',
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


/* ===== TOAST NOTIFICATION (shared by all forms) ===== */
/**
 * Show the success toast with custom title/message text.
 * Falls back to the default booking-confirmation copy if no args given.
 */
function showToast(title = 'Booking Confirmed!', message = 'Your driver will contact you shortly.') {
  const toast = document.getElementById('toast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
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


/* ============================================================
   CONTACT FORM — validation, no alert(), success toast, reset
   ============================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const contactEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone: digits only, minimum 10 digits
  function isValidContactPhone(val) {
    const digitsOnly = val.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly === val.replace(/\s+/g, '');
  }

  function isValidEmail(val) {
    return contactEmailRegex.test(val);
  }

  // Strip non-numeric characters as the user types in the phone field
  const contactPhoneField = document.getElementById('contactPhone');
  contactPhoneField.addEventListener('input', () => {
    contactPhoneField.value = contactPhoneField.value.replace(/[^\d]/g, '');
  });

  // Live validation — clear error as soon as the field becomes valid
  const contactFieldMap = {
    contactName: { err: 'contactNameErr' },
    contactEmail: { err: 'contactEmailErr', check: isValidEmail },
    contactPhone: { err: 'contactPhoneErr', check: isValidContactPhone },
    contactSubject: { err: 'contactSubjectErr' },
    contactMessage: { err: 'contactMessageErr' },
  };

  Object.keys(contactFieldMap).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const { err, check } = contactFieldMap[id];
    const clearIfValid = () => {
      const val = el.value.trim();
      const ok = val !== '' && (!check || check(val));
      if (ok) {
        el.classList.remove('error');
        document.getElementById(err).classList.remove('show');
      }
    };
    el.addEventListener('input', clearIfValid);
    el.addEventListener('change', clearIfValid);
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const vName = validateField('contactName', 'contactNameErr');
    const vEmail = validateField('contactEmail', 'contactEmailErr', isValidEmail);
    const vPhone = validateField('contactPhone', 'contactPhoneErr', isValidContactPhone);
    const vSubject = validateField('contactSubject', 'contactSubjectErr');
    const vMessage = validateField('contactMessage', 'contactMessageErr');

    if (!vName || !vEmail || !vPhone || !vSubject || !vMessage) {
      const firstError = contactForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // All valid — animate button, show success toast, reset form
    const submitBtn = document.getElementById('contactSubmitBtn');
    submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';
      submitBtn.disabled = false;
      contactForm.reset();
      showToast('Message Sent!', 'Our support team will get back to you shortly.');
    }, 900);
  });
}


/* ============================================================
   RIDE PLANNER — add / delete / complete ride tasks + counters
   ============================================================ */
const plannerForm = document.getElementById('plannerForm');
const rideTaskInput = document.getElementById('rideTaskInput');
const rideTaskList = document.getElementById('rideTaskList');
const plannerEmpty = document.getElementById('plannerEmpty');
const plannerErr = document.getElementById('plannerErr');
const totalRideCount = document.getElementById('totalRideCount');
const pendingRideCount = document.getElementById('pendingRideCount');
const completedRideCount = document.getElementById('completedRideCount');

if (plannerForm) {
  const STORAGE_KEY = 'swiftride_ride_tasks';

  // In-memory list of ride tasks: { id, text, completed }
  let rideTasks = loadRideTasks();

  function loadRideTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function saveRideTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rideTasks));
    } catch {
      /* localStorage unavailable — fail silently, list still works in-memory */
    }
  }

  function updateCounters() {
    const total = rideTasks.length;
    const completed = rideTasks.filter(t => t.completed).length;
    const pending = total - completed;
    totalRideCount.textContent = total;
    pendingRideCount.textContent = pending;
    completedRideCount.textContent = completed;
    plannerEmpty.classList.toggle('show', total === 0);
    rideTaskList.style.display = total === 0 ? 'none' : 'flex';
  }

  function createRideTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'planner-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    li.innerHTML = `
      <button type="button" class="planner-check" aria-label="Mark ride as complete">
        <i class="ph-fill ph-check"></i>
      </button>
      <span class="planner-text"></span>
      <button type="button" class="planner-delete" aria-label="Delete ride task">
        <i class="ph ph-trash"></i>
      </button>
    `;
    // Set text via textContent to avoid any HTML injection from user input
    li.querySelector('.planner-text').textContent = task.text;
    return li;
  }

  function renderRideTasks() {
    rideTaskList.innerHTML = '';
    rideTasks.forEach(task => {
      rideTaskList.appendChild(createRideTaskElement(task));
    });
    updateCounters();
  }

  function addRideTask(text) {
    const trimmed = text.trim();
    if (trimmed === '') {
      plannerErr.classList.add('show');
      rideTaskInput.classList.add('error');
      return false;
    }
    plannerErr.classList.remove('show');
    rideTaskInput.classList.remove('error');

    rideTasks.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: trimmed,
      completed: false,
    });
    saveRideTasks();
    renderRideTasks();
    return true;
  }

  // Add via form submit (covers both button click and Enter key)
  plannerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const added = addRideTask(rideTaskInput.value);
    if (added) {
      rideTaskInput.value = '';
      rideTaskInput.focus();
    }
  });

  // Clear inline error as soon as the user starts typing again
  rideTaskInput.addEventListener('input', () => {
    if (rideTaskInput.value.trim() !== '') {
      plannerErr.classList.remove('show');
      rideTaskInput.classList.remove('error');
    }
  });

  // Event delegation for complete / delete buttons
  rideTaskList.addEventListener('click', function (e) {
    const item = e.target.closest('.planner-item');
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.closest('.planner-check')) {
      const task = rideTasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        saveRideTasks();
        renderRideTasks();
      }
    } else if (e.target.closest('.planner-delete')) {
      rideTasks = rideTasks.filter(t => t.id !== id);
      saveRideTasks();
      renderRideTasks();
    }
  });

  // Initial render on page load
  renderRideTasks();
}