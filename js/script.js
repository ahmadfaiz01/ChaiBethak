document.addEventListener('DOMContentLoaded', function() {
    // Display welcome message
    showWelcomeMessage();
    
    // Initialize back to top button
    initBackToTopButton();
    
    // Initialize show more/less functionality for testimonials
    initShowMoreButton();
    
    // Display current date in footer
    displayCurrentDate();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Form validation
    initFormValidation();
});

function showWelcomeMessage() {
    // Check sessionStorage to see if welcome was shown in this session
    if (!sessionStorage.getItem('welcomeShown')) {
        // Create welcome overlay
        const welcomeOverlay = document.createElement('div');
        welcomeOverlay.className = 'welcome-overlay';
        welcomeOverlay.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-logo">Welcome to</div>
                <div class="welcome-logo">Chaii Bethak</div>
                <p class="welcome-message">Experience the authentic taste of Pakistan's traditional tea culture</p>
                <button class="welcome-btn">Enter Tea House</button>
            </div>
        `;
        
        document.body.insertBefore(welcomeOverlay, document.body.firstChild);
        
        const welcomeBtn = document.querySelector('.welcome-btn');
        welcomeBtn.addEventListener('click', function() {
            welcomeOverlay.classList.add('welcome-hidden');
            
            setTimeout(() => {
                welcomeOverlay.remove();
                // Mark as shown for this session
                sessionStorage.setItem('welcomeShown', 'true');
                
                // Show first visit banner if needed
                if (!localStorage.getItem('hasVisitedBefore')) {
                    showFirstVisitBanner();
                    localStorage.setItem('hasVisitedBefore', 'true');
                }
            }, 1000);
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.contains(welcomeOverlay)) {
                welcomeOverlay.classList.add('welcome-hidden');
                setTimeout(() => {
                    if (document.contains(welcomeOverlay)) {
                        welcomeOverlay.remove();
                        sessionStorage.setItem('welcomeShown', 'true');
                        
                        if (!localStorage.getItem('hasVisitedBefore')) {
                            showFirstVisitBanner();
                            localStorage.setItem('hasVisitedBefore', 'true');
                        }
                    }
                }, 1000);
            }
        }, 5000);
    }
    // Show first visit banner if needed (even if welcome was shown)
    else if (!localStorage.getItem('hasVisitedBefore')) {
        showFirstVisitBanner();
        localStorage.setItem('hasVisitedBefore', 'true');
    }
}


/**
 * Initializes the show more/less functionality for testimonials
 */
function initShowMoreButton() {
    const showMoreButton = document.getElementById('show-more');
    
    if (!showMoreButton) return;
    
    const testimonials = document.querySelectorAll('.testimonial.hidden');
    
    showMoreButton.addEventListener('click', () => {
        // If testimonials are hidden, show them
        if (showMoreButton.textContent === 'Show More') {
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('hidden');
            });
            showMoreButton.textContent = 'Show Less';
        } else {
            // Otherwise, hide them
            testimonials.forEach(testimonial => {
                testimonial.classList.add('hidden');
            });
            showMoreButton.textContent = 'Show More';
        }
    });
}

/*
 Displays the current date and time in the footer and Updates every minute to keep time current
 */
function displayCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    
    if (!currentDateElement) return;
    
    // Function to update the date/time
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Update immediately and then every minute
    updateDateTime();
    setInterval(updateDateTime, 60000);
}

/*
  Initializes the mobile menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // Animate the hamburger icon
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.classList.toggle('active');
        });
    });
}

/* Validates form inputs before submission */
function initFormValidation() {
    // Newsletter form validation
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', validateNewsletterForm);
    }
    
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', validateContactForm);
    }
}

/* Validates the newsletter form */
function validateNewsletterForm(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    
    // Reset error message
    emailError.textContent = '';
    
    // Validate email format
    if (!isValidEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        return;
    }
    
    // If validation passes, show success message
    alert('Thank you for subscribing to our newsletter!');
    event.target.reset();
}

/* Validates the contact form */
function validateContactForm(event) {
    event.preventDefault();
    
    let isValid = true;
    
    // Get form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Get error elements
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('contact-email-error');
    const phoneError = document.getElementById('phone-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');
    
    // Reset all error messages
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    subjectError.textContent = '';
    messageError.textContent = '';
    
    // Validate name (required, at least 2 characters)
    if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please enter your name (at least 2 characters)';
        isValid = false;
    }
    
    // Validate email (required, valid format)
    if (!isValidEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate phone (optional, but must match pattern if provided)
    if (phoneInput.value && !phoneInput.validity.valid) {
        phoneError.textContent = 'Please use format: 123-456-7890';
        isValid = false;
    }
    
    // Validate subject (required)
    if (!subjectInput.value) {
        subjectError.textContent = 'Please select a subject';
        isValid = false;
    }
    
    // Validate message (at least 10 characters)
    if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Please enter a message (at least 10 characters)';
        isValid = false;
    }
    
    // If validation passes, show success message
    if (isValid) {
        alert('Thank you for your message! We will get back to you soon.');
        event.target.reset();
    }
}

/*Validates an email address format*/
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
