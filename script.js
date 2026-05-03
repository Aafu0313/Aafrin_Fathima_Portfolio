// Console error filtering for external services
(function() {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    // Filter out known external service errors
    const filterMessages = [
        'Element with id: dust-var-locale not found',
        'Element with id: isMergeSignInSignUpV2Enabled not found',
        'Element with id: mergeSignInSignUpLixValue not found',
        'Element with id: joinUrl not found',
        'Element with id: enablePlatformJs not found',
        'TMS load event sent successfully',
        '[GSI_LOGGER]',
        'Could not load source map',
        'Using this console may allow attackers',
        'Error {name: \'\', stack: <accessor>}',
        'protechts.net',
        'licdn.com',
        '95dn6qmfiqsklhxazp0jn20zg',
        'ejtdgjypmqo0r3rqzilfwa1k3',
        '29rdkxlvag0d3cpj96fiilbju',
        '5btsu35dk4f0xrzzr30jr7gap',
        '4rq4zqumv8obfum0kflg396dp',
        'main.min.js',
        'No outlet was found with a data-modal attribute',
        'dust-var-locale',
        'isMergeSignInSignUpV2Enabled',
        'mergeSignInSignUpLixValue',
        'joinUrl',
        'enablePlatformJs',
        'Your client application may not display the Google One Tap',
        'Your client application uses one of the Google One Tap',
        'Currently, you disable FedCM on Google One Tap',
        'static.licdn.com',
        'collector-PXdOjV695v.protechts.net',
        'Unexpected 404 response',
        'm=_b,_tp:543',
        'Self-XSS'
    ];
    
    function shouldFilterMessage(message) {
        if (!message) return false;
        const lowerMessage = message.toLowerCase();
        return filterMessages.some(filter => 
            lowerMessage.includes(filter.toLowerCase()) ||
            message.includes(filter)
        );
    }
    
    console.error = function(...args) {
        const message = args.join(' ');
        if (!shouldFilterMessage(message)) {
            originalError.apply(console, args);
        }
    };
    
    console.warn = function(...args) {
        const message = args.join(' ');
        if (!shouldFilterMessage(message)) {
            originalWarn.apply(console, args);
        }
    };
    
    console.log = function(...args) {
        const message = args.join(' ');
        if (!shouldFilterMessage(message)) {
            originalLog.apply(console, args);
        }
    };
})();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100; // Trigger point

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

// Add event listener for scroll
window.addEventListener("scroll", reveal);

// Trigger reveal once on load to show elements already in view
reveal();

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 5, 29, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(26, 5, 29, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (mobileBtn.classList.contains('active')) {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

