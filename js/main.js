// === Mobile menu toggle ===
const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';
    nav.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) {
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '72px';
      nav.style.right = '20px';
      nav.style.left = '20px';
      nav.style.background = '#F5F0EB';
      nav.style.padding = '24px';
      nav.style.borderRadius = '4px';
      nav.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
      nav.style.zIndex = '200';
    }
  });
}

// === Smooth scroll for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// === Scroll Reveal (IntersectionObserver) ===
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// === Simple form handler ===
document.querySelectorAll('#contactForm, #quoteForm').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const isQuote = form.id === 'quoteForm';
    alert(isQuote
      ? 'Thank you for your quote request! We\'ll contact you within 24 hours to arrange your free measure & quote.'
      : 'Thank you for your enquiry! We will get back to you within 24 hours.');
    form.reset();
  });
});

// === FAQ Accordion ===
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    const category = btn.closest('.faq-category');
    if (category) {
      category.querySelectorAll('.faq-question').forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBtn.nextElementSibling.classList.remove('open');
        }
      });
    }

    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    answer.classList.toggle('open', !isOpen);
  });
});

// === Header background on scroll ===
const header = document.querySelector('.header');
if (header) {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.style.background = 'rgba(245,240,235,0.95)';
    } else {
      header.style.background = '#F5F0EB';
    }
    lastScroll = scrollY;
  }, { passive: true });
}
