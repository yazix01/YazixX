document.addEventListener('DOMContentLoaded', () => {

    /* --- Sticky Navbar --- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, { passive: true });

    /* --- Active Nav Link on Scroll --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* --- 3D Logo Parallax Effect --- */
    const target = document.getElementById('logo-3d-target');
    const isLargeScreen = window.innerWidth > 768;

    if (target && window.matchMedia('(hover: hover)').matches && isLargeScreen) {
        let animFrameId;

        document.addEventListener('mousemove', (e) => {
            cancelAnimationFrame(animFrameId);
            animFrameId = requestAnimationFrame(() => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 30;

                const rotateX = Math.max(Math.min(yAxis, 15), -15);
                const rotateY = Math.max(Math.min(-xAxis, 15), -15);

                target.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            });
        });

        document.addEventListener('mouseleave', () => {
            cancelAnimationFrame(animFrameId);
            target.style.transition = 'transform 0.6s ease';
            target.style.transform = 'rotateY(0deg) rotateX(0deg)';
            setTimeout(() => {
                target.style.transition = 'transform 0.12s ease-out';
            }, 600);
        });
    }

    /* --- Mobile Menu Toggle --- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-links');

    if (mobileBtn && navList) {

        function openMenu() {
            navList.classList.add('active');
            document.body.style.overflow = 'hidden';
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            }
            mobileBtn.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            navList.classList.remove('active');
            document.body.style.overflow = '';
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
            mobileBtn.setAttribute('aria-expanded', 'false');
        }

        mobileBtn.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when a link is clicked
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close when clicking outside the nav
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navList.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /* --- Stagger reveal for grid children --- */
    document.querySelectorAll('.skills-grid, .about-grid, .projects-grid').forEach(grid => {
        const children = grid.querySelectorAll('.glass-card, .project-card, .skill-card, .about-card');
        children.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.08}s`;
            card.classList.add('reveal');
            revealObserver.observe(card);
            
            // Clean up delay so hovers are instant
            setTimeout(() => {
                card.style.transitionDelay = '0s';
                card.classList.add('hover-ready');
            }, 1000 + (i * 50));
        });
    });

    /* --- Formspree Integration --- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const statusDiv = document.getElementById('form-status');
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const submitIcon = document.getElementById('submit-icon');
            
            // Set loading state
            submitText.textContent = 'Sending...';
            submitIcon.className = 'ph-bold ph-spinner ph-spin';
            submitBtn.disabled = true;
            statusDiv.classList.remove('show', 'success', 'error');
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    statusDiv.textContent = "Message sent successfully. I'll get back to you soon.";
                    statusDiv.className = 'form-status success show';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        statusDiv.textContent = data.errors.map(error => error.message).join(", ");
                    } else {
                        statusDiv.textContent = "Something went wrong. Please try again.";
                    }
                    statusDiv.className = 'form-status error show';
                }
            } catch (error) {
                statusDiv.textContent = "Something went wrong. Please try again.";
                statusDiv.className = 'form-status error show';
            } finally {
                // Reset button state
                submitText.textContent = 'Send Message';
                submitIcon.className = 'ph-bold ph-paper-plane-tilt';
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    statusDiv.classList.remove('show');
                }, 5000);
            }
        });
    }
});
