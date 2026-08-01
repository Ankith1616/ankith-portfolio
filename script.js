// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.skill-category, .project-card, .cert-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle (optional enhancement)
const createMobileMenu = () => {
    const nav = document.querySelector('nav .container');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: var(--text);
        font-size: 1.5rem;
        cursor: pointer;
    `;

    if (window.innerWidth <= 640) {
        menuToggle.style.display = 'block';
        nav.appendChild(menuToggle);

        menuToggle.addEventListener('click', () => {
            const navUl = document.querySelector('nav ul');
            if (navUl.style.display === 'flex') {
                navUl.style.display = 'none';
            } else {
                navUl.style.display = 'flex';
                navUl.style.flexDirection = 'column';
                navUl.style.position = 'absolute';
                navUl.style.top = '100%';
                navUl.style.left = '0';
                navUl.style.right = '0';
                navUl.style.background = 'var(--surface)';
                navUl.style.padding = '1rem';
            }
        });
    }
};

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', () => {
    const existingToggle = document.querySelector('.mobile-menu-toggle');
    if (existingToggle) {
        existingToggle.remove();
    }
    createMobileMenu();
});