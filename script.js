/**
 * Premium Product Webpage - JavaScript Implementation
 * Features: Sticky Header, Image Carousel with Zoom, FAQ Accordion
 * Author: Gushwork Assignment
 */

'use strict';

// ===================================
// Sticky Header Controller
// ===================================

/**
 * Manages sticky header visibility based on scroll position
 * - Hidden initially
 * - Appears when scrolling down past first fold
 * - Hides when scrolling back up
 */
class StickyHeaderController {
    constructor() {
        this.header = document.getElementById('stickyHeader');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navMenu = document.getElementById('navMenu');
        
        this.lastScrollTop = 0;
        this.scrollThreshold = window.innerHeight * 0.8; // 80% of viewport height
        this.isHeaderVisible = false;
        this.scrollDirection = 'down';
        
        this.init();
    }
    
    init() {
        // Scroll event listener with throttling for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                this.handleScroll();
            });
        });
        
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking on links
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.navMenu.contains(e.target) && 
                !this.mobileToggle.contains(e.target) &&
                this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Determine scroll direction
        if (currentScroll > this.lastScrollTop) {
            this.scrollDirection = 'down';
        } else {
            this.scrollDirection = 'up';
        }
        
        // Show/hide header based on scroll position and direction
        if (currentScroll > this.scrollThreshold) {
            if (this.scrollDirection === 'down' && !this.isHeaderVisible) {
                this.showHeader();
            } else if (this.scrollDirection === 'up' && currentScroll > this.scrollThreshold * 1.2) {
                // Keep header visible when scrolling up
                this.showHeader();
            }
        } else {
            // Hide header when near top
            if (this.isHeaderVisible) {
                this.hideHeader();
            }
        }
        
        this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }
    
    showHeader() {
        this.header.classList.add('visible');
        this.isHeaderVisible = true;
    }
    
    hideHeader() {
        this.header.classList.remove('visible');
        this.isHeaderVisible = false;
        this.closeMobileMenu();
    }
    
    toggleMobileMenu() {
        this.mobileToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// ===================================
// Image Carousel Controller
// ===================================

/**
 * Interactive image carousel with zoom effect
 * Features:
 * - Previous/Next navigation
 * - Thumbnail navigation
 * - Zoom on hover
 * - Touch/swipe support
 * - Keyboard navigation
 */
class ImageCarouselController {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.thumbnailsContainer = document.getElementById('thumbnails');
        
        this.currentIndex = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        
        // Touch/swipe support
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        // Create thumbnails
        this.createThumbnails();
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Touch/swipe support
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Mouse drag support (optional)
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        
        this.track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos = e.pageX;
            this.track.style.cursor = 'grabbing';
        });
        
        this.track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const currentPosition = e.pageX;
            currentTranslate = prevTranslate + currentPosition - startPos;
        });
        
        this.track.addEventListener('mouseup', () => {
            isDragging = false;
            this.track.style.cursor = 'grab';
            
            const movedBy = currentTranslate - prevTranslate;
            if (movedBy < -50) this.next();
            if (movedBy > 50) this.prev();
            
            prevTranslate = currentTranslate;
        });
        
        this.track.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                this.track.style.cursor = 'grab';
            }
        });
    }
    
    createThumbnails() {
        this.slides.forEach((slide, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.classList.add('thumbnail');
            if (index === 0) thumbnail.classList.add('active');
            
            const img = slide.querySelector('img').cloneNode();
            thumbnail.appendChild(img);
            
            thumbnail.addEventListener('click', () => this.goToSlide(index));
            
            this.thumbnailsContainer.appendChild(thumbnail);
        });
        
        this.thumbnails = document.querySelectorAll('.thumbnail');
    }
    
    updateCarousel() {
        // Move carousel track
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update thumbnails
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update ARIA attributes for accessibility
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== this.currentIndex);
        });
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }
    
    handleTouchMove(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
    }
    
    handleTouchEnd(e) {
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = Math.abs(this.touchStartY - this.touchEndY);
        
        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
            if (diffX > 0) {
                // Swipe left - next
                this.next();
            } else {
                // Swipe right - prev
                this.prev();
            }
        }
    }
    
    handleKeyboard(e) {
        // Only handle keyboard if carousel is in viewport
        const carouselRect = this.track.getBoundingClientRect();
        const isInViewport = carouselRect.top < window.innerHeight && carouselRect.bottom > 0;
        
        if (!isInViewport) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.next();
        }
    }
}

// ===================================
// FAQ Accordion Controller
// ===================================

/**
 * Manages FAQ accordion functionality
 * - Expand/collapse answers
 * - Smooth animations
 * - Only one item open at a time (optional)
 */
class FAQController {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.allowMultipleOpen = false; // Set to true to allow multiple items open
        
        this.init();
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                this.toggleItem(item);
            });
        });
    }
    
    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        // Close all items if only one should be open
        if (!this.allowMultipleOpen && !isActive) {
            this.faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
        }
        
        // Toggle current item
        item.classList.toggle('active');
    }
}

// ===================================
// Smooth Scroll Controller
// ===================================

/**
 * Adds smooth scrolling to anchor links
 */
class SmoothScrollController {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if href is just "#"
                if (href === '#') return;
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerOffset = 80; // Account for sticky header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// Scroll Animations Controller
// ===================================

/**
 * Adds fade-in animations to elements as they enter viewport
 */
class ScrollAnimationsController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);
        
        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.feature-card, .faq-item, .specs-table, .brand-logo'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ===================================
// Performance Optimization
// ===================================

/**
 * Lazy load images for better performance
 */
class LazyLoadController {
    constructor() {
        this.init();
    }
    
    init() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        // Check if browser supports native lazy loading
        if ('loading' in HTMLImageElement.prototype) {
            return; // Browser handles it natively
        }
        
        // Fallback for browsers without native support
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// Button Interactions
// ===================================

/**
 * Handles CTA button clicks and form submissions
 */
class ButtonInteractionsController {
    constructor() {
        this.init();
    }
    
    init() {
        // Add to Cart button
        const addToCartBtn = document.querySelector('.btn-primary');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.handleAddToCart();
            });
        }
        
        // Wishlist button
        const wishlistBtn = document.querySelector('.btn-secondary');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.handleWishlist();
            });
        }
    }
    
    handleAddToCart() {
        // In a real application, this would add the item to cart
        console.log('Product added to cart');
        
        // Visual feedback
        const btn = document.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Added!';
        btn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    }
    
    handleWishlist() {
        // In a real application, this would add to wishlist
        console.log('Product added to wishlist');
        
        // Visual feedback
        const btn = document.querySelector('.btn-secondary');
        const svg = btn.querySelector('svg');
        svg.style.fill = 'var(--secondary-color)';
        svg.style.stroke = 'var(--secondary-color)';
        
        setTimeout(() => {
            svg.style.fill = '';
            svg.style.stroke = '';
        }, 2000);
    }
}

// ===================================
// Accessibility Enhancements
// ===================================

/**
 * Improves keyboard navigation and accessibility
 */
class AccessibilityController {
    constructor() {
        this.init();
    }
    
    init() {
        // Add keyboard navigation class
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
        
        // Skip to main content link (for screen readers)
        this.addSkipLink();
    }
    
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#hero';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 100;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// ===================================
// Initialize All Controllers
// ===================================

/**
 * Main initialization function
 * Runs when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all controllers
    new StickyHeaderController();
    new ImageCarouselController();
    new FAQController();
    new SmoothScrollController();
    new ScrollAnimationsController();
    new LazyLoadController();
    new ButtonInteractionsController();
    new AccessibilityController();
    
    console.log('✅ Premium Product Webpage - All features initialized successfully!');
});

// ===================================
// Window Resize Handler
// ===================================

/**
 * Handle window resize events with debouncing
 */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate carousel positions if needed
        const carousel = document.getElementById('carouselTrack');
        if (carousel) {
            const currentIndex = parseInt(carousel.dataset.currentIndex) || 0;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        console.log('Window resized - layout adjusted');
    }, 250);
});

// ===================================
// Performance Monitoring (Optional)
// ===================================

/**
 * Log performance metrics
 */
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`📊 Page Load Time: ${pageLoadTime}ms`);
    }
});
