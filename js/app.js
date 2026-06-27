// Navbar scroll effect
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


// count up animation 
const statNumbers = document.querySelectorAll('.stat-number');

const countUp = (element, target, suffix) => {
  let count = 0;
  const duration = 2000;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      count = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(count) + suffix;
  }, 16);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const number = parseInt(text);
      const suffix = text.replace(number, '');
      countUp(el, number, suffix);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(stat => observer.observe(stat));