// ===================================
// SIGNAL LIVING - Interactive Features
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initNavigation();
    initCategoryFilters();
    initFilterBar(); // New Figma filter bar
    initSmoothScroll();
    initNewsletterForm();
});

// ===================================
// HEADER FUNCTIONALITY
// ===================================

function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// MOBILE NAVIGATION
// ===================================

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navList.classList.toggle('active');

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navList.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Close mobile menu if open
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}

// ===================================
// CATEGORY FILTERING
// ===================================

function initCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    const navLinks = document.querySelectorAll('.nav-link');
    const productCards = document.querySelectorAll('.product-card');

    // Category card click handler
    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            filterProducts(category);

            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-category') === category) {
                    link.classList.add('active');
                }
            });

            // Smooth scroll to products
            document.getElementById('products').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Navigation link filter handler
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const category = this.getAttribute('data-category');
            if (category) {
                e.preventDefault();
                filterProducts(category);
            }
        });
    });

    // Filter function
    function filterProducts(category) {
        productCards.forEach((card, index) => {
            const cardCategories = card.getAttribute('data-category');

            if (category === 'all' || cardCategories.includes(category)) {
                card.style.display = 'block';
                // Re-apply stagger animation
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = `fadeIn 0.6s ease forwards ${index * 0.1}s`;
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle internal links
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===================================
// NEWSLETTER FORM
// ===================================

function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const input = this.querySelector('input[type="email"]');
            const email = input.value.trim();

            if (email && validateEmail(email)) {
                // Show success message
                showNotification('구독해 주셔서 감사합니다!', 'success');
                input.value = '';
            } else {
                showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
            }
        });
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#A8B5A0' : '#C85A54',
        color: '#FEFEFE',
        fontWeight: '600',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease',
        maxWidth: '300px'
    });

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// LAZY LOADING IMAGES
// ===================================

// Intersection Observer for lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    // Observe all product images
    document.querySelectorAll('.product-image img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm.length > 0) {
            searchProducts(searchTerm);
        } else {
            // Show all products if search is cleared
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.display = 'block';
            });
        }
    });
}

function searchProducts(term) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    productCards.forEach(card => {
        const name = card.querySelector('.product-name').textContent.toLowerCase();
        const desc = card.querySelector('.product-desc').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag'))
            .map(tag => tag.textContent.toLowerCase())
            .join(' ');

        const searchableText = `${name} ${desc} ${tags}`;

        if (searchableText.includes(term)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show message if no results
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    if (visibleCount === 0) {
        const productGrid = document.getElementById('productGrid');
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.textContent = '검색 결과가 없습니다.';
        message.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: var(--color-text-medium);
            font-size: 1.1rem;
        `;
        productGrid.appendChild(message);
    }
}

// ===================================
// CONSOLE BRANDING
// ===================================

console.log('%c SIGNAL26 ', 'background: #000000; color: #FFFFFF; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c Modern Lifestyle ', 'color: #666666; font-size: 12px;');
