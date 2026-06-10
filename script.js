/* ==========================================================================
   PORTFOLIO INTERACTIVE SCRIPT - AAFRIN FATHIMA S
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all custom features
    initCustomCursor();
    initParticleBackground();
    initNavbarScroll();
    initMobileMenu();
    initActiveNavLinkTracker();
    initProjectFiltering();
    initSkillsCardGlow();
    initAITerminalInteractive();
    initGSAPAnimations();
    initAchievementsCelebrations();
    initContactForm();
});

/* ==========================================================================
   CUSTOM DUAL-RING CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor dot tracking
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Elastic animation for outline cursor using requestAnimationFrame
    function animateOutline() {
        // Lerp (Linear Interpolation) formula: Current = Current + (Target - Current) * Ease
        const ease = 0.15;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    requestAnimationFrame(animateOutline);

    // Add hover effects for interactive elements
    const hoverables = 'a, button, input, textarea, .tab-btn, .project-card, .celebration-trigger';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverables)) {
            cursorDot.style.width = '12px';
            cursorDot.style.height = '12px';
            cursorDot.style.backgroundColor = 'var(--secondary-gold)';
            
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'var(--primary-pink)';
            cursorOutline.style.backgroundColor = 'rgba(255, 75, 145, 0.05)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverables)) {
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
            cursorDot.style.backgroundColor = 'var(--primary-pink)';
            
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'var(--primary-pink)';
            cursorOutline.style.backgroundColor = 'transparent';
        }
    });
}

/* ==========================================================================
   CANVAS PARTICLE BACKGROUND
   ========================================================================== */
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Mouse coords for interaction
    const mouse = {
        x: null,
        y: null,
        radius: 120 // Interaction radius
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    window.addEventListener('resize', resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle Object
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update position and check boundaries
        update() {
            // Check boundary collisions
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Mouse interaction (repelling effect)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 2;
                    }
                }
            }

            this.draw();
        }
    }

    // Initialize particles array
    function initParticles() {
        particlesArray = [];
        // Scale number of particles based on screen width
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
        const colorPalette = [
            'rgba(255, 75, 145, 0.25)', // Primary Pink
            'rgba(255, 191, 163, 0.18)', // Rose Gold
            'rgba(157, 78, 221, 0.15)',  // Deep Violet
        ];

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.8;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.5) - 0.25;
            let directionY = (Math.random() * 0.5) - 0.25;
            let color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles when close
    function connect() {
        let opacityValue = 1;
        const maxDistance = 100;
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < maxDistance) {
                    opacityValue = 1 - (distance / maxDistance);
                    // Fade color based on distance
                    ctx.strokeStyle = `rgba(255, 75, 145, ${opacityValue * 0.08})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/* ==========================================================================
   NAVBAR SHOLD ON SCROLL
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   MOBILE BURGER MENU
   ========================================================================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on clicking outside (if menu is active)
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });
}

/* ==========================================================================
   ACTIVE NAV LINK TRACKER
   ========================================================================== */
function initActiveNavLinkTracker() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const options = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the mid-viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ==========================================================================
   PROJECT FILTERING LOGIC
   ========================================================================== */
function initProjectFiltering() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (tabButtons.length === 0 || projectCards.length === 0) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Switch active tab class
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-tab');

            // Toggle visibility of project cards with cinematic delay
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Reveal Card
                    card.style.display = 'flex';
                    // Retrigger animation state using GSAP
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, 
                            { opacity: 0, y: 30, scale: 0.95 },
                            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', clearProps: 'transform' }
                        );
                    } else {
                        card.style.opacity = '1';
                    }
                } else {
                    // Hide Card
                    card.style.display = 'none';
                }
            });

            // Refresh ScrollTrigger positions because layout height changed
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    });
}

/* ==========================================================================
   GSAP TIMELINES & SCROLLREVEALS
   ========================================================================== */
function initGSAPAnimations() {
    // If GSAP is not loaded, exit gracefully
    if (typeof gsap === 'undefined') return;

    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- Hero Animations ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTl.from('.navbar', { y: -80, opacity: 0, duration: 1.2 })
          .from('.hero-badge', { scale: 0.8, opacity: 0, duration: 0.6 }, '-=0.6')
          .from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
          .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
          .from('.hero-ctas', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
          .from('.cyber-glass-card', { opacity: 0, x: 50, rotateY: -15, duration: 1 }, '-=0.8')
          .from('.floating-tech-badge', { opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.8 }, '-=0.6')
          .from('.scroll-down-indicator', { opacity: 0, y: -20, duration: 0.6 }, '-=0.4');

    // Generic ScrollTrigger Reveal helper
    const revealItems = document.querySelectorAll('.reveal-item');
    
    revealItems.forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%', // Trigger when top of element is 85% down viewport
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Special animation for skill categories (stagger)
    if (document.querySelector('.skills-grid')) {
        gsap.from('.skills-category-card', {
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    // Special animation for projects (stagger)
    if (document.querySelector('.projects-grid')) {
        gsap.from('.project-card', {
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    // Timeline marker expansion effect
    const timelineItems = document.querySelectorAll('.journey-card-wrapper');
    timelineItems.forEach(item => {
        const marker = item.querySelector('.journey-marker');
        const card = item.querySelector('.journey-card');
        
        gsap.from(marker, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
            },
            scale: 0.2,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(2)'
        });

        gsap.from(card, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
            },
            x: item.classList.contains('left') ? -60 : 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

/* ==========================================================================
   ACHIEVEMENTS CONFETTI CELEBRATIONS
   ========================================================================== */
function initAchievementsCelebrations() {
    const triggers = document.querySelectorAll('.celebration-trigger');
    
    if (triggers.length === 0 || typeof confetti === 'undefined') return;

    triggers.forEach(card => {
        // Fire confetti on Click
        card.addEventListener('click', () => {
            celebrateWithConfetti();
        });
        
        // Add mouseenter listener for a lighter burst
        let canBurst = true;
        card.addEventListener('mouseenter', () => {
            if (canBurst) {
                // A quick light confetti shower
                confetti({
                    particleCount: 25,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#ff4b91', '#ffbfa3', '#9d4ede']
                });
                confetti({
                    particleCount: 25,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#ff4b91', '#ffbfa3', '#9d4ede']
                });
                
                // Throttle hover confetti to prevent lag
                canBurst = false;
                setTimeout(() => { canBurst = true; }, 3000);
            }
        });
    });

    function celebrateWithConfetti() {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confetti bursts from random angles
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#ff4b91', '#ff80a4', '#ffbfa3', '#ffffff']
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#ff4b91', '#ff80a4', '#ffbfa3', '#ffffff']
            }));
        }, 250);
    }
}

/* ==========================================================================
   CONTACT FORM INTEGRATION
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('portfolio-contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get Form Values
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const submitBtn = document.getElementById('form-submit-btn');

        // Check values
        if (!nameInput.value || !emailInput.value || !subjectInput.value) {
            return;
        }

        // Visual feedback for sending
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span><i data-lucide="loader" class="animate-spin"></i>`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        submitBtn.disabled = true;

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            // Restore button
            submitBtn.innerHTML = `<span>Message Sent!</span><i data-lucide="check-circle"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            submitBtn.style.background = 'linear-gradient(135deg, #27c93f 0%, #a2f2a5 100%)';
            submitBtn.style.color = '#040106';

            // Confetti check
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#27c93f', '#a2f2a5', '#ff4b91', '#ffffff']
                });
            }

            // Reset fields
            contactForm.reset();

            // Restore button styling after 4 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 4000);

        }, 1500);
    });
}

/* ==========================================================================
   INTERACTIVE SKILLS MOUSE TRAIL GLOW
   ========================================================================== */
function initSkillsCardGlow() {
    const cards = document.querySelectorAll('.skills-category-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   AI TERMINAL CONSOLE INTERACTIVE SYSTEM
   ========================================================================== */
function initAITerminalInteractive() {
    const badges = document.querySelectorAll('.clickable-ai-badge');
    const termCommand = document.getElementById('terminal-command');
    const termOutput = document.getElementById('terminal-output');

    if (badges.length === 0 || !termCommand || !termOutput) return;

    // Console output database
    const consoleDatabase = {
        Copilot: {
            command: `copilot --generate "REST API for product search"`,
            output: `[GitHub Copilot] Generating Express router...

router.get('/search', async (req, res) => {
  const { query } = req.query;
  const results = await db.query('SELECT * FROM products WHERE name ILIKE $1', [\`%\${query}%\`]);
  res.json(results.rows);
});

[SUCCESS] Code block generated in 450ms.`
        },
        Antigravity: {
            command: `antigravity --optimise "LMS dashboard components"`,
            output: `[Antigravity] Analysing client codebases...
[INFO] Found 3 unoptimised layout blocks.
[PROCESS] Injecting glassmorphic css tokens & backdrop-filter buffers.
[SUCCESS] Responsive scaling active. Build completed in 18ms.`
        },
        Claude: {
            command: `claude --refactor "PostgreSQL database indexing"`,
            output: `[Claude] Suggested optimization:

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_category ON courses(category);

[INFO] Performance forecast: +240% read throughput.
[SUCCESS] SQL statements executed successfully.`
        },
        Lovable: {
            command: `lovable --prompt "add glowing neon theme buttons"`,
            output: `[Lovable] Applying pink accents:

button {
  background: linear-gradient(135deg, #ff4b91, #ffbfa3);
  box-shadow: 0 0 15px rgba(255, 75, 145, 0.4);
}

[SUCCESS] Styles updated in compiler cache.`
        },
        Kombai: {
            command: `kombai --vector "figma-design-spec"`,
            output: `[Kombai] Parsing vector structures...
[EXPORT] SVG layout compiled to semantic HTML5 and clean flexbox CSS styles.
[SUCCESS] Zero-pixel deviation layout created.`
        },
        Codex: {
            command: `codex --explain "RESTful API query execution plan"`,
            output: `[Codex] Execution Plan Analysis:
- Seq Scan detected on 'course_enrollments' (Size: 25k records).
- Recommendation: Replace with Index Scan using 'idx_enrollments_student_id'.
[SUCCESS] Execution profile mapped.`
        },
        Zencoder: {
            command: `zencoder --transcode "intro_video.mov" --target "h264_1080p"`,
            output: `[Zencoder] Starting transcode job #847291...
[STATUS] Audio channel mapping verified. Video stream configured.
[SUCCESS] Output uploaded to CDN storage block. Status: 200 OK.`
        },
        Replit: {
            command: `replit --deploy "vc3d-printing-server"`,
            output: `[Replit] Container creation sequence initialized...
[PORT] Routing server output to :http://localhost:8080.
[SUCCESS] App live on production sub-domains.`
        },
        Traycer: {
            command: `traycer --debug "qr-generator-exception"`,
            output: `[Traycer] Traceback inspection complete:
- Line 42: ReferenceError: 'QRCode' class not defined.
- Solution: Load 'qrcode-generator' client package.
[SUCCESS] Troubleshooting report generated.`
        }
    };

    let typingTimer = null;

    badges.forEach(badge => {
        badge.addEventListener('click', () => {
            const tool = badge.getAttribute('data-tool');
            const data = consoleDatabase[tool];

            if (!data) return;

            // Toggle active class on badges
            badges.forEach(b => b.classList.remove('active-badge'));
            badge.classList.add('active-badge');

            // Cancel running typing animation
            if (typingTimer) clearTimeout(typingTimer);

            // Print Command first
            termCommand.textContent = '';
            termOutput.textContent = '';

            let cmdCharIndex = 0;
            function typeCommand() {
                if (cmdCharIndex < data.command.length) {
                    termCommand.textContent += data.command.charAt(cmdCharIndex);
                    cmdCharIndex++;
                    typingTimer = setTimeout(typeCommand, 30);
                } else {
                    // Once command finishes typing, output results after a slight pause
                    typingTimer = setTimeout(() => {
                        termOutput.textContent = data.output;
                    }, 200);
                }
            }
            typeCommand();
        });
    });
}
