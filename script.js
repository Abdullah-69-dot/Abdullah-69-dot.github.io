/* ============================================================
   Portfolio JavaScript — Interactions & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ────────────────────────────────────────────
    // 1. PARTICLE BACKGROUND
    // ────────────────────────────────────────────
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 60;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(167, 139, 250, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(167, 139, 250, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ────────────────────────────────────────────
    // 2. TYPING EFFECT
    // ────────────────────────────────────────────
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = [
            'Python Backend Developer',
            'Django & DRF Specialist',
            'API Architect',
            'Problem Solver'
        ];
        let phraseIdx = 0, charIdx = 0, isDeleting = false;

        function type() {
            const current = phrases[phraseIdx];
            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIdx--);
                if (charIdx < 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, 40);
            } else {
                typedEl.textContent = current.substring(0, charIdx++);
                if (charIdx > current.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
                setTimeout(type, 80);
            }
        }
        setTimeout(type, 800);
    }

    // ────────────────────────────────────────────
    // 3. NAVBAR SCROLL EFFECTS
    // ────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Solid bg on scroll
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }

        // Active link highlight
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });

    // ────────────────────────────────────────────
    // 4. SMOOTH SCROLL
    // ────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ────────────────────────────────────────────
    // 5. MOBILE MENU
    // ────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ────────────────────────────────────────────
    // 6. SCROLL-REVEAL (Intersection Observer)
    // ────────────────────────────────────────────
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
        fadeEls.forEach(el => observer.observe(el));
    }

    // ────────────────────────────────────────────
    // 7. COUNTER ANIMATION
    // ────────────────────────────────────────────
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = +el.getAttribute('data-count');
                    let current = 0;
                    const step = Math.ceil(target / 40);
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) { current = target; clearInterval(timer); }
                        el.textContent = current;
                    }, 40);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObserver.observe(c));
    }

    // ────────────────────────────────────────────
    // 8. COPY CODE BUTTON
    // ────────────────────────────────────────────
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const codeBlock = document.querySelector('.code-block code');
            const text = codeBlock.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#39ff14" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
                }, 2000);
            });
        });
    }

});
