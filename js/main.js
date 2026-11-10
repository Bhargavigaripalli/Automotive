/**
 * Main Application Script for STACKLY Automotive Platform
 * Component Loader (with file:// fallback), Navigation, AOS, Swipers, Counter Animation
 */

const FALLBACK_HEADER = `
<nav class="navbar navbar-expand-lg navbar-light glass-nav fixed-top shadow-sm" style="z-index: 1030; padding: 12px 0;">
    <div class="container">
        <!-- Left: Logo -->
        <a class="navbar-brand logo d-flex align-items-center text-decoration-none" href="index.html" id="nav-brand-logo" aria-label="Stackly Home">
            <img class="logo-img" src="images/stackly-logo.webp" alt="Stackly Logo">
        </a>

        <!-- Mobile Toggler -->
        <button class="navbar-toggler border-0 shadow-none d-lg-none ms-auto me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style="outline: none;">
            <i class="fas fa-bars fs-4" style="color: var(--primary-color);"></i>
        </button>

        <!-- Center: Navigation Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto align-items-center gap-1 gap-lg-3 my-3 my-lg-0">
                <li class="nav-item"><a class="nav-link fw-bold px-2" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link fw-bold px-2" href="about.html">About</a></li>
                <li class="nav-item"><a class="nav-link fw-bold px-2" href="services.html">Services</a></li>
                <li class="nav-item"><a class="nav-link fw-bold px-2" href="pricing.html">Pricing</a></li>
                <li class="nav-item"><a class="nav-link fw-bold px-2" href="blog.html">Blog</a></li>
                <li class="nav-item"><a class="nav-link fw-bold px-2" href="contact.html">Contact</a></li>
                <li class="nav-item d-md-none w-100 mt-2"><a class="btn btn-custom-outline w-100 rounded-pill py-2" href="login.html">Login</a></li>
            </ul>
        </div>
        
        <!-- Right: Action Controls -->
        <div class="d-none d-md-flex align-items-center gap-2">

            <!-- Login -->
            <a href="login.html" class="btn btn-custom-secondary rounded-pill px-3 py-2 fw-bold" style="font-size: 0.85rem;">
                <i class="fas fa-user-circle me-1"></i> Login
            </a>
        </div>
    </div>
</nav>
`;

const FALLBACK_FOOTER = `
<footer class="pt-5 pb-4 border-top" style="background: rgba(255, 255, 255, 0.9);">
    <div class="container pt-3">
        <div class="row g-4 mb-5">
            <div class="col-lg-4 pe-lg-5">
                <a class="mb-4 d-flex align-items-center position-relative text-decoration-none logo" style="z-index: 1060;" href="index.html" aria-label="Stackly Home">
                    <img class="logo-img footer-logo-img" src="images/stackly-logo.webp" alt="Stackly Logo" style="height: 44px;">
                </a>
                <p class="text-muted mt-3 mb-3" style="line-height: 1.8;">The next-generation automotive platform engineered for supercar precision, AI diagnostics, performance tuning, and seamless digital booking.</p>
                <div class="d-flex align-items-center gap-2 mb-4 p-2 px-3 rounded-pill" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); width: fit-content;">
                    <span class="speed-dial-indicator"></span>
                    <span class="small fw-bold text-success" style="font-size: 0.75rem; letter-spacing: 0.5px;">GARAGE OPEN NOW &bull; 14 TECHS ON DUTY</span>
                </div>
                <div class="d-flex gap-3">
                    <a href="404.html" class="footer-social-icon"><i class="fab fa-facebook-f"></i></a>
                    <a href="404.html" class="footer-social-icon"><i class="fab fa-x-twitter"></i></a>
                    <a href="404.html" class="footer-social-icon"><i class="fab fa-instagram"></i></a>
                    <a href="404.html" class="footer-social-icon"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
            <div class="col-lg-2 col-md-6">
                <h5 class="fw-bold mb-4" style="color: var(--text-main); font-family: 'Orbitron', sans-serif; font-size: 1rem;">Platform</h5>
                <ul class="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li><a href="index.html" class="text-muted text-decoration-none footer-link-hover">Home</a></li>
                    <li><a href="about.html" class="text-muted text-decoration-none footer-link-hover">About</a></li>
                    <li><a href="services.html" class="text-muted text-decoration-none footer-link-hover">Services</a></li>
                    <li><a href="pricing.html" class="text-muted text-decoration-none footer-link-hover">Pricing</a></li>
                    <li><a href="blog.html" class="text-muted text-decoration-none footer-link-hover">Blog</a></li>
                    <li><a href="contact.html" class="text-muted text-decoration-none footer-link-hover">Contact</a></li>
                </ul>
            </div>
            <div class="col-lg-3 col-md-6">
                <h5 class="fw-bold mb-4" style="color: var(--text-main); font-family: 'Orbitron', sans-serif; font-size: 1rem;">Tech Center</h5>
                <ul class="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li>
                        <a href="https://maps.google.com" target="_blank" class="text-muted text-decoration-none d-flex align-items-start footer-contact-link">
                            <i class="fas fa-location-dot text-primary mt-1 me-3 fs-5"></i>
                            <span>Silicon Apex Speedway Way,<br>Suite 400, Automotive Park</span>
                        </a>
                    </li>
                    <li>
                        <a href="tel:+18005550199" class="text-muted text-decoration-none d-flex align-items-center footer-contact-link">
                            <i class="fas fa-phone-volume text-primary me-3 fs-5"></i>
                            <span>+1 (800) 555-APEX (2739)</span>
                        </a>
                    </li>
                    <li>
                        <a href="mailto:service@apexautomotive.io" class="text-muted text-decoration-none d-flex align-items-center footer-contact-link">
                            <i class="fas fa-envelope-circle-check text-primary me-3 fs-5"></i>
                            <span>service@apexautomotive.io</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-lg-3 col-md-6">
                <h5 class="fw-bold mb-4" style="color: var(--text-main); font-family: 'Orbitron', sans-serif; font-size: 1rem;">VIP Speed Pass</h5>
                <p class="text-muted small mb-3">Join 15,000+ drivers receiving track reports, dyno graphs, and seasonal discounts.</p>
                <form action="404.html" class="d-flex flex-column gap-2 mb-3 newsletter-form" novalidate>
                    <input type="email" class="form-control px-3 py-2 bg-light border-0 shadow-sm newsletter-input" placeholder="username@gmail.com" required style="border-radius: 8px; font-size: 0.9rem;">
                    <button type="submit" class="btn btn-custom-primary py-2 shadow-sm fw-bold w-100" style="border-radius: 8px; font-size: 0.85rem;">Subscribe to Feed</button>
                    <div class="newsletter-error text-danger small mt-1 fw-semibold" style="display: none; font-size: 0.8rem;">Please enter a valid Gmail address (@gmail.com).</div>
                </form>
            </div>
        </div>
        <div class="row pt-4 mt-2" style="border-top: 1px solid rgba(0,0,0,0.06);">
            <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <p class="text-muted small mb-0">&copy; 2026 STACKLY Automotive Performance & Diagnostics. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-center text-md-end">
                <a href="404.html" class="text-muted small text-decoration-none footer-link-hover me-3">Privacy Telemetry</a>
                <a href="404.html" class="text-muted small text-decoration-none footer-link-hover">Terms of Service</a>
            </div>
        </div>
    </div>
</footer>
`;

async function loadComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        try {
            const headerRes = await fetch('header.html');
            if (headerRes.ok) {
                headerPlaceholder.innerHTML = await headerRes.text();
            } else {
                headerPlaceholder.innerHTML = FALLBACK_HEADER;
            }
        } catch (e) {
            headerPlaceholder.innerHTML = FALLBACK_HEADER;
        }
    }

    if (footerPlaceholder) {
        try {
            const footerRes = await fetch('footer.html');
            if (footerRes.ok) {
                footerPlaceholder.innerHTML = await footerRes.text();
            } else {
                footerPlaceholder.innerHTML = FALLBACK_FOOTER;
            }
        } catch (e) {
            footerPlaceholder.innerHTML = FALLBACK_FOOTER;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    
    // Highlight Active Nav Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: true,
            offset: 40
        });
    }

    // Navbar Scroll Glass Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        if (window.scrollY > 40) navbar.classList.add('scrolled');
    }

    // Hero Swiper
    if (document.querySelector('.hero-swiper') && typeof Swiper !== 'undefined') {
        new Swiper('.hero-swiper', {
            loop: true,
            effect: 'fade',
            speed: 1400,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // Testimonials Swiper
    if (document.querySelector('.testimonials-swiper') && typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 25,
            speed: 3500,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter-number');
    const formatNumber = (num, target) => {
        if (target >= 1000) {
            return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
        }
        return Math.floor(num);
    };

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const stepTime = 20; 
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const updateCounter = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target >= 1000 ? (target / 1000) + 'k+' : target + (counter.getAttribute('data-suffix') || '+');
                clearInterval(updateCounter);
            } else {
                counter.innerText = formatNumber(current, target);
            }
        }, stepTime);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(counter => observer.observe(counter));
    }

    // Initialize Form Validations
    initContactForm();
    initNewsletterForms();
});

/* ==========================================================================
   CONTACT FORM & UNIVERSAL NEWSLETTER VALIDATION
   ========================================================================== */

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const contactName = document.getElementById('contactName');
    const contactPhone = document.getElementById('contactPhone');
    const contactEmail = document.getElementById('contactEmail');
    const contactSubject = document.getElementById('contactSubject');
    const contactMessage = document.getElementById('contactMessage');

    const nameError = document.getElementById('contactNameError');
    const phoneError = document.getElementById('contactPhoneError');
    const emailError = document.getElementById('contactEmailError');
    const subjectError = document.getElementById('contactSubjectError');
    const messageError = document.getElementById('contactMessageError');

    // Real-time restriction: Name takes ONLY alphabets and spaces, max 16 characters
    if (contactName) {
        contactName.addEventListener('input', function () {
            this.value = this.value.replace(/[^A-Za-z ]/g, '').slice(0, 16);
            clearError(this, nameError);
        });
    }

    // Real-time restriction: Phone takes ONLY numbers, max 10 digits
    if (contactPhone) {
        contactPhone.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
            clearError(this, phoneError);
        });
    }

    // Clear error on user interaction
    if (contactEmail) {
        contactEmail.addEventListener('input', () => clearError(contactEmail, emailError));
    }
    if (contactSubject) {
        contactSubject.addEventListener('change', () => clearError(contactSubject, subjectError));
    }
    if (contactMessage) {
        contactMessage.addEventListener('input', () => clearError(contactMessage, messageError));
    }

    function clearError(input, errorEl) {
        const box = input ? input.closest('.contact-field-box') : null;
        if (box) box.style.borderColor = 'rgba(0,0,0,0.08)';
        if (errorEl) errorEl.style.display = 'none';
    }

    function setFieldError(input, errorEl, msg) {
        const box = input ? input.closest('.contact-field-box') : null;
        if (box) box.style.borderColor = '#dc3545';
        if (errorEl) {
            if (msg) errorEl.textContent = msg;
            errorEl.style.display = 'block';
        }
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;
        let firstInvalid = null;

        // 1. Validate Name: Mandatory, alphabets + spaces only, 1-16 chars
        const nameVal = contactName ? contactName.value.trim() : '';
        const namePattern = /^[A-Za-z ]{1,16}$/;
        if (!nameVal || !namePattern.test(nameVal)) {
            isValid = false;
            if (!firstInvalid) firstInvalid = contactName;
            setFieldError(contactName, nameError, 'Name is mandatory and must contain only alphabets and spaces (maximum 16 characters).');
        } else {
            clearError(contactName, nameError);
        }

        // 2. Validate Phone: Mandatory, numbers only, exactly 10 digits
        const phoneVal = contactPhone ? contactPhone.value.trim() : '';
        const phonePattern = /^[0-9]{10}$/;
        if (!phoneVal || !phonePattern.test(phoneVal)) {
            isValid = false;
            if (!firstInvalid) firstInvalid = contactPhone;
            setFieldError(contactPhone, phoneError, 'Phone number is mandatory and must be exactly 10 digits.');
        } else {
            clearError(contactPhone, phoneError);
        }

        // 3. Validate Gmail: Mandatory, strict @gmail.com format
        const emailVal = contactEmail ? contactEmail.value.trim() : '';
        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!emailVal || !gmailPattern.test(emailVal)) {
            isValid = false;
            if (!firstInvalid) firstInvalid = contactEmail;
            setFieldError(contactEmail, emailError, 'Gmail is mandatory and must follow format: username@gmail.com.');
        } else {
            clearError(contactEmail, emailError);
        }

        // 4. Validate Subject: Mandatory
        const subjectVal = contactSubject ? contactSubject.value : '';
        if (!subjectVal) {
            isValid = false;
            if (!firstInvalid) firstInvalid = contactSubject;
            setFieldError(contactSubject, subjectError, 'Please select a subject.');
        } else {
            clearError(contactSubject, subjectError);
        }

        // 5. Validate Message: Mandatory
        const messageVal = contactMessage ? contactMessage.value.trim() : '';
        if (!messageVal) {
            isValid = false;
            if (!firstInvalid) firstInvalid = contactMessage;
            setFieldError(contactMessage, messageError, 'Please enter your message.');
        } else {
            clearError(contactMessage, messageError);
        }

        // Action: Only if all mandatory fields are valid, render to 404 page
        if (isValid) {
            window.location.href = '404.html';
        } else if (firstInvalid) {
            firstInvalid.focus();
        }
    });
}

function initNewsletterForms() {
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    const forms = document.querySelectorAll('.newsletter-form, form');
    forms.forEach(form => {
        if (form.id === 'contactForm' || form.id === 'loginForm' || form.id === 'signupForm') return;

        const emailInput = form.querySelector('.newsletter-input, input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"], button');
        const isNewsletter = form.classList.contains('newsletter-form') ||
            (submitBtn && /subscribe|feed/i.test(submitBtn.textContent)) ||
            (emailInput && /email|driver|feed|gmail/i.test(emailInput.placeholder));

        if (!isNewsletter || !emailInput) return;

        if (submitBtn) {
            submitBtn.type = 'submit';
            submitBtn.removeAttribute('onclick');
        }

        let errorDiv = form.parentElement.querySelector('.newsletter-error') || form.querySelector('.newsletter-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'newsletter-error text-danger small mt-1 fw-semibold';
            errorDiv.style.display = 'none';
            errorDiv.style.fontSize = '0.8rem';
            form.appendChild(errorDiv);
        }

        emailInput.addEventListener('input', () => {
            emailInput.style.borderColor = '';
            if (errorDiv) errorDiv.style.display = 'none';
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const val = (emailInput.value || '').trim();

            if (!val || !gmailPattern.test(val)) {
                emailInput.style.borderColor = '#dc3545';
                if (errorDiv) {
                    errorDiv.textContent = !val
                        ? 'Gmail address is mandatory to subscribe.'
                        : 'Please enter a valid Gmail address (@gmail.com).';
                    errorDiv.style.display = 'block';
                }
                emailInput.focus();
                return false;
            }

            emailInput.style.borderColor = '';
            if (errorDiv) errorDiv.style.display = 'none';
            // Valid Gmail entered -> render to 404 page
            window.location.href = '404.html';
        });
    });
}

