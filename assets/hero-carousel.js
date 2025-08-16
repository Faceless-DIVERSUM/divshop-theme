/**
 * Hero Carousel System
 * Manages layered carousels with customizable effects and transitions
 */

import { Component } from '@theme/component';
import { debounce, throttle } from '@theme/utilities';

/**
 * Hero Carousel Layer Component
 * Handles individual carousel animations and effects
 */
class HeroCarouselLayer extends Component {
  constructor(element) {
    super();
    this.element = element;
    this.frames = element.querySelectorAll('.hero-carousel-frame');
    this.currentFrame = 0;
    this.isPlaying = true;
    this.animationId = null;
    
    // Get settings from data attributes
    this.settings = {
      frameDuration: parseFloat(element.dataset.frameDuration) * 1000 || 3000,
      transitionType: element.dataset.transitionType || 'fade',
      zoomIntensity: parseFloat(element.dataset.zoomIntensity) || 0,
      parallaxVIntensity: parseFloat(element.dataset.parallaxVIntensity) || 0,
      parallaxHIntensity: parseFloat(element.dataset.parallaxHIntensity) || 0,
      kenBurnsIntensity: parseFloat(element.dataset.kenBurnsIntensity) || 0,
      tiltIntensity: parseFloat(element.dataset.tiltIntensity) || 0,
      blurFocusIntensity: parseFloat(element.dataset.blurFocusIntensity) || 0,
    };

    this.init();
  }

  init() {
    if (this.frames.length <= 1) return;

    this.setupTransitions();
    this.setupEffects();
    this.startCarousel();
    
    // Pause on hover if zoom effect is enabled
    if (this.settings.zoomIntensity > 0) {
      this.element.addEventListener('mouseenter', () => this.pause());
      this.element.addEventListener('mouseleave', () => this.resume());
    }
  }

  setupTransitions() {
    this.frames.forEach((frame, index) => {
      frame.style.position = 'absolute';
      frame.style.top = '0';
      frame.style.left = '0';
      frame.style.width = '100%';
      frame.style.height = '100%';
      frame.style.opacity = index === 0 ? '1' : '0';
      frame.style.transform = 'scale(1)';
      frame.style.filter = 'blur(0px)';
      frame.style.zIndex = index === 0 ? '2' : '1';
      
      // Set transition duration based on transition type
      const transitionDuration = this.getTransitionDuration();
      frame.style.transition = `opacity ${transitionDuration}ms ease-in-out, transform ${transitionDuration}ms ease-in-out, filter ${transitionDuration}ms ease-in-out`;
    });
  }

  getTransitionDuration() {
    switch (this.settings.transitionType) {
      case 'fade': return 800;
      case 'slide': return 1000;
      case 'zoom': return 1200;
      case 'blur': return 900;
      default: return 800;
    }
  }

  setupEffects() {
    // Setup zoom effect
    if (this.settings.zoomIntensity > 0) {
      this.setupZoomEffect();
    }

    // Setup parallax effects
    if (this.settings.parallaxVIntensity > 0 || this.settings.parallaxHIntensity > 0) {
      this.setupParallaxEffect();
    }

    // Setup Ken Burns effect
    if (this.settings.kenBurnsIntensity > 0) {
      this.setupKenBurnsEffect();
    }

    // Setup tilt effect
    if (this.settings.tiltIntensity > 0) {
      this.setupTiltEffect();
    }

    // Setup blur focus effect
    if (this.settings.blurFocusIntensity > 0) {
      this.setupBlurFocusEffect();
    }
  }

  setupZoomEffect() {
    const zoomScale = 1 + (this.settings.zoomIntensity * 0.02);
    
    this.element.addEventListener('mouseenter', () => {
      this.frames.forEach(frame => {
        const img = frame.querySelector('.hero-carousel-image');
        if (img) {
          img.style.transform = `scale(${zoomScale})`;
          img.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
      });
    });

    this.element.addEventListener('mouseleave', () => {
      this.frames.forEach(frame => {
        const img = frame.querySelector('.hero-carousel-image');
        if (img) {
          img.style.transform = 'scale(1)';
        }
      });
    });
  }

  setupParallaxEffect() {
    const handleScroll = throttle(() => {
      const rect = this.element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - elementTop) / (windowHeight + elementHeight)
      ));
      
      // Apply parallax transform
      const vOffset = (scrollProgress - 0.5) * this.settings.parallaxVIntensity * 10;
      const hOffset = (scrollProgress - 0.5) * this.settings.parallaxHIntensity * 10;
      
      this.frames.forEach(frame => {
        const img = frame.querySelector('.hero-carousel-image');
        if (img) {
          const currentTransform = img.style.transform;
          const scaleMatch = currentTransform.match(/scale\([^)]*\)/);
          const scaleTransform = scaleMatch ? scaleMatch[0] : 'scale(1)';
          
          img.style.transform = `translate3d(${hOffset}px, ${vOffset}px, 0) ${scaleTransform}`;
        }
      });
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll);
    
    // Store reference for cleanup
    this.scrollHandler = handleScroll;
  }

  setupKenBurnsEffect() {
    // Ken Burns effect applies slow zoom and pan during transitions
    const kenBurnsScale = 1 + (this.settings.kenBurnsIntensity * 0.02);
    
    this.frames.forEach(frame => {
      const img = frame.querySelector('.hero-carousel-image');
      if (img) {
        // Apply random pan direction
        const panX = (Math.random() - 0.5) * this.settings.kenBurnsIntensity * 10;
        const panY = (Math.random() - 0.5) * this.settings.kenBurnsIntensity * 10;
        
        img.style.transformOrigin = 'center center';
        img.style.animation = `kenBurns-${frame.dataset.frameIndex} ${this.settings.frameDuration}ms linear infinite`;
        
        // Create unique keyframes for each frame
        const styleId = `ken-burns-${this.element.dataset.carouselId}-${frame.dataset.frameIndex}`;
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            @keyframes kenBurns-${frame.dataset.frameIndex} {
              0% { transform: scale(1) translate(0, 0); }
              100% { transform: scale(${kenBurnsScale}) translate(${panX}px, ${panY}px); }
            }
          `;
          document.head.appendChild(style);
        }
      }
    });
  }

  setupTiltEffect() {
    const maxTilt = this.settings.tiltIntensity * 2; // Max 20 degrees
    
    this.element.addEventListener('mousemove', (e) => {
      const rect = this.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      const rotateX = deltaY * maxTilt;
      const rotateY = -deltaX * maxTilt;
      
      this.frames.forEach(frame => {
        const img = frame.querySelector('.hero-carousel-image');
        if (img) {
          img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
          img.style.transition = 'transform 0.1s ease-out';
        }
      });
    });

    this.element.addEventListener('mouseleave', () => {
      this.frames.forEach(frame => {
        const img = frame.querySelector('.hero-carousel-image');
        if (img) {
          img.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
          img.style.transition = 'transform 0.3s ease-out';
        }
      });
    });
  }

  setupBlurFocusEffect() {
    const maxBlur = this.settings.blurFocusIntensity * 2; // Max 20px blur
    
    // Initial blur state
    this.frames.forEach(frame => {
      const img = frame.querySelector('.hero-carousel-image');
      if (img) {
        img.style.filter = `blur(${maxBlur}px)`;
        img.style.transition = 'filter 0.6s ease';
      }
    });

    this.element.addEventListener('mouseenter', () => {
      this.frames.forEach(frame => {
        const img = frame.querySelector('.hero-carousel-image');
        if (img) {
          img.style.filter = 'blur(0px)';
        }
      });
    });

    this.element.addEventListener('mouseleave', () => {
      this.frames.forEach(frame => {
        const img = frame.querySelector('.hero-carousel-image');
        if (img) {
          img.style.filter = `blur(${maxBlur}px)`;
        }
      });
    });
  }

  startCarousel() {
    if (this.frames.length <= 1) return;
    
    this.scheduleNextFrame();
  }

  scheduleNextFrame() {
    if (!this.isPlaying) return;
    
    this.animationId = setTimeout(() => {
      this.nextFrame();
      this.scheduleNextFrame();
    }, this.settings.frameDuration);
  }

  nextFrame() {
    if (this.frames.length <= 1) return;

    const currentFrame = this.frames[this.currentFrame];
    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    const nextFrame = this.frames[this.currentFrame];

    this.transitionToFrame(currentFrame, nextFrame);
  }

  transitionToFrame(currentFrame, nextFrame) {
    // Reset next frame styles
    nextFrame.style.zIndex = '2';
    currentFrame.style.zIndex = '1';

    switch (this.settings.transitionType) {
      case 'fade':
        this.fadeTransition(currentFrame, nextFrame);
        break;
      case 'slide':
        this.slideTransition(currentFrame, nextFrame);
        break;
      case 'zoom':
        this.zoomTransition(currentFrame, nextFrame);
        break;
      case 'blur':
        this.blurTransition(currentFrame, nextFrame);
        break;
      default:
        this.fadeTransition(currentFrame, nextFrame);
    }
  }

  fadeTransition(currentFrame, nextFrame) {
    nextFrame.style.opacity = '1';
    currentFrame.style.opacity = '0';
  }

  slideTransition(currentFrame, nextFrame) {
    nextFrame.style.transform = 'translateX(100%)';
    nextFrame.style.opacity = '1';
    
    requestAnimationFrame(() => {
      nextFrame.style.transform = 'translateX(0)';
      currentFrame.style.transform = 'translateX(-100%)';
      
      setTimeout(() => {
        currentFrame.style.opacity = '0';
        currentFrame.style.transform = 'translateX(0)';
      }, this.getTransitionDuration());
    });
  }

  zoomTransition(currentFrame, nextFrame) {
    nextFrame.style.transform = 'scale(1.1)';
    nextFrame.style.opacity = '1';
    
    requestAnimationFrame(() => {
      nextFrame.style.transform = 'scale(1)';
      currentFrame.style.transform = 'scale(0.9)';
      currentFrame.style.opacity = '0';
      
      setTimeout(() => {
        currentFrame.style.transform = 'scale(1)';
      }, this.getTransitionDuration());
    });
  }

  blurTransition(currentFrame, nextFrame) {
    nextFrame.style.filter = 'blur(10px)';
    nextFrame.style.opacity = '1';
    
    requestAnimationFrame(() => {
      nextFrame.style.filter = 'blur(0px)';
      currentFrame.style.filter = 'blur(10px)';
      currentFrame.style.opacity = '0';
      
      setTimeout(() => {
        currentFrame.style.filter = 'blur(0px)';
      }, this.getTransitionDuration());
    });
  }

  pause() {
    this.isPlaying = false;
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.scheduleNextFrame();
    }
  }

  destroy() {
    this.pause();
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    
    // Clean up Ken Burns keyframes
    const carouselId = this.element.dataset.carouselId;
    this.frames.forEach(frame => {
      const styleId = `ken-burns-${carouselId}-${frame.dataset.frameIndex}`;
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    });
  }
}

/**
 * Hero Carousel Manager
 * Manages multiple carousel layers
 */
class HeroCarouselManager {
  constructor() {
    this.carousels = new Map();
    this.init();
  }

  init() {
    this.setupCarousels();
    
    // Listen for theme editor changes
    document.addEventListener('shopify:section:load', () => {
      this.refresh();
    });
    
    document.addEventListener('shopify:section:reorder', () => {
      this.refresh();
    });
  }

  setupCarousels() {
    const carouselElements = document.querySelectorAll('.hero-carousel-layer');
    
    carouselElements.forEach(element => {
      const carouselId = element.dataset.carouselId;
      if (!this.carousels.has(carouselId)) {
        const carousel = new HeroCarouselLayer(element);
        this.carousels.set(carouselId, carousel);
      }
    });
  }

  refresh() {
    // Destroy existing carousels
    this.carousels.forEach(carousel => carousel.destroy());
    this.carousels.clear();
    
    // Setup new carousels
    setTimeout(() => {
      this.setupCarousels();
    }, 100);
  }

  pauseAll() {
    this.carousels.forEach(carousel => carousel.pause());
  }

  resumeAll() {
    this.carousels.forEach(carousel => carousel.resume());
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.heroCarouselManager = new HeroCarouselManager();
  });
} else {
  window.heroCarouselManager = new HeroCarouselManager();
}

export { HeroCarouselLayer, HeroCarouselManager };