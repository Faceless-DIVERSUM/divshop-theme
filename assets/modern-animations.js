/**
 * Modern Animations and Interactions
 * Enhances the theme with smooth scroll-triggered animations and modern effects
 */

class ModernAnimations {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.setupScrollReveal();
    this.setupParallax();
    this.setupSectionAnimations();
    this.setupTextAnimations();
    this.setupInteractiveElements();
  }

  /**
   * Setup scroll-triggered reveal animations
   */
  setupScrollReveal() {
    // Create intersection observer for scroll reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all scroll reveal elements
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Setup subtle parallax effects for background elements
   */
  setupParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      document.querySelectorAll('.parallax-bg').forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /**
   * Setup section entrance animations
   */
  setupSectionAnimations() {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  /**
   * Setup text reveal animations
   */
  setupTextAnimations() {
    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-text');
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    // Observe text elements that should animate
    document.querySelectorAll('.hero__title, .section__title, h1, h2').forEach(element => {
      // Add a slight delay for staggered effect
      const delay = Array.from(element.parentNode.children).indexOf(element) * 100;
      element.style.animationDelay = `${delay}ms`;
      textObserver.observe(element);
    });
  }

  /**
   * Setup interactive elements with modern micro-interactions
   */
  setupInteractiveElements() {
    // Add interactive class to buttons and links
    document.querySelectorAll('button, .button, a[href]').forEach(element => {
      if (!element.classList.contains('button-unstyled')) {
        element.classList.add('interactive-element');
      }
    });

    // Enhanced product card interactions
    document.querySelectorAll('.product-card, .collection-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Add a subtle scale effect to the card content
        const content = card.querySelector('.product-card__content, .collection-card__content');
        if (content) {
          content.style.transform = 'translateY(-5px)';
        }
      });

      card.addEventListener('mouseleave', () => {
        const content = card.querySelector('.product-card__content, .collection-card__content');
        if (content) {
          content.style.transform = '';
        }
      });
    });

    // Add ripple effect to buttons
    this.setupRippleEffect();
  }

  /**
   * Setup ripple effect for buttons
   */
  setupRippleEffect() {
    document.querySelectorAll('.button:not(.button-unstyled)').forEach(button => {
      button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          top: ${y}px;
          left: ${x}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
          z-index: 0;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add ripple animation keyframes
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize modern animations
new ModernAnimations();

// Export for potential external use
window.ModernAnimations = ModernAnimations;