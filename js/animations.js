// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Add specific animations based on data attribute
      const animation = entry.target.dataset.animation;
      if (animation) {
        entry.target.classList.add(animation);
      }
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px'
});

// Observe all sections and elements with animations
document.querySelectorAll('.section-animate, [data-animation]').forEach((element) => {
  observer.observe(element);
});

// Smooth scroll with highlight effect
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    // Smooth scroll
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Add highlight effect
    target.classList.add('highlight');
    setTimeout(() => target.classList.remove('highlight'), 2000);
  });
});

// Skill cards hover effect
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.querySelector('img').style.transform = 'rotate(12deg) scale(1.1)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.querySelector('img').style.transform = 'rotate(0deg) scale(1)';
  });
});

// Add typing effect to hero section
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    typeWriter(heroText, 'Back-End Developer & Software Engineer');
  }
});