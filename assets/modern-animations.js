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
    this.setupCursorFollower();
    this.setupAdvancedHovers();
    this.setupModernCards();
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

  /**
   * Setup modern cursor follower effect
   */
  setupCursorFollower() {
    if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(pointer: coarse)').matches) {
      const follower = document.createElement('div');
      follower.className = 'cursor-follower';
      document.body.appendChild(follower);

      let mouseX = 0;
      let mouseY = 0;
      let followerX = 0;
      let followerY = 0;

      const updateFollower = () => {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(updateFollower);
      };

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Activate cursor on interactive elements
      document.addEventListener('mouseenter', (e) => {
        if (e.target.matches('a, button, .interactive-element')) {
          follower.classList.add('active');
        }
      }, true);

      document.addEventListener('mouseleave', (e) => {
        if (e.target.matches('a, button, .interactive-element')) {
          follower.classList.remove('active');
        }
      }, true);

      updateFollower();
    }
  }

  /**
   * Setup advanced hover effects
   */
  setupAdvancedHovers() {
    // Enhanced image hover effects
    document.querySelectorAll('.hero__image, .product-card__media img').forEach(image => {
      const container = image.closest('.hero, .product-card');
      if (container) {
        container.addEventListener('mouseenter', () => {
          if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
            image.style.transform = 'scale(1.1)';
            image.style.filter = 'brightness(1.1)';
          }
        });

        container.addEventListener('mouseleave', () => {
          image.style.transform = '';
          image.style.filter = '';
        });
      }
    });

    // Text gradient effects for headings
    document.querySelectorAll('h1, h2, .hero__title').forEach(heading => {
      heading.classList.add('text-gradient');
    });
  }

  /**
   * Setup modern card effects
   */
  setupModernCards() {
    document.querySelectorAll('.product-card, .collection-card').forEach(card => {
      card.classList.add('modern-card');
      
      // Add floating animation to alternating cards
      const index = Array.from(card.parentNode.children).indexOf(card);
      if (index % 2 === 0) {
        card.classList.add('float-animation');
      } else {
        card.classList.add('float-animation-delayed');
      }
    });

    // Setup section dividers
    document.querySelectorAll('.section').forEach((section, index) => {
      if (index > 0) {
        const divider = document.createElement('div');
        divider.className = 'section-divider scroll-reveal';
        section.parentNode.insertBefore(divider, section);
      }
    });

    // Glass effect for certain elements
    document.querySelectorAll('.button-secondary, .cart-drawer').forEach(element => {
      element.classList.add('glass-effect');
    });
  }
}

// Initialize modern animations
new ModernAnimations();

// Export for potential external use
window.ModernAnimations = ModernAnimations;