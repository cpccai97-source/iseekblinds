// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '70px';
    nav.style.right = '20px';
    nav.style.background = '#fff';
    nav.style.padding = '20px';
    nav.style.borderRadius = '8px';
    nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Simple form handler
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

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others in the same category
    const category = btn.closest('.faq-category');
    if (category) {
      category.querySelectorAll('.faq-question').forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBtn.nextElementSibling.classList.remove('open');
        }
      });
    }

    // Toggle current
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    answer.classList.toggle('open', !isOpen);
  });
});
