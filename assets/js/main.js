// Title glitch effect
const glitchTitle = document.querySelector('.glitch-title');
if (glitchTitle) {
    const originalText = glitchTitle.getAttribute('data-text');

    function glitchText() {
        const chars = originalText.split('');
        const glitchedText = chars.map(char => {
            if (Math.random() < 0.15 && char !== ' ') {
                return Math.random() < 0.5 ? '0' : '1';
            }
            return char;
        }).join('');

        glitchTitle.textContent = glitchedText;

        setTimeout(() => {
            glitchTitle.textContent = originalText;
        }, 300);
    }

    setInterval(() => {
        if (Math.random() < 0.5) {
            glitchText();
        }
    }, 5000);
}

// Glitch Effect - Horizontal Strip Displacement (lighter version)
const glitchDefaults = {
    strips: 30,
    duration: 3200,
    width: 400,
    height: 400
};

let glitchKeyframesInjected = false;
const initializedGlitchTargets = new Set();

function injectGlitchKeyframes() {
    if (glitchKeyframesInjected) return;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes stripGlitch {
            0%, 100% { transform: translateX(0); }
            6% { transform: translateX(var(--glitch-offset)); }
            7.5% { transform: translateX(calc(var(--glitch-offset) * -0.35)); }
            9% { transform: translateX(var(--glitch-offset)); }
            11% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(styleSheet);
    glitchKeyframesInjected = true;
}

function buildGlitchStrips({ glitchStrips, imagePath, width, height, strips, duration }) {
    const stripHeight = height / strips;
    const stripsHTML = [];

    for (let i = 0; i < strips; i++) {
        const offset = (Math.random() * 60 - 30).toFixed(1); // -30px to 30px
        const delay = -((duration / strips) * i).toFixed(2);

        stripsHTML.push(`
            <div class="line" style="
                height: ${stripHeight}px;
                background: url('${imagePath}') no-repeat;
                background-position: 0 ${-stripHeight * i}px;
                background-size: ${width}px ${height}px;
                top: ${stripHeight * i}px;
                animation: stripGlitch ${duration}ms ${delay}ms infinite;
                --glitch-offset: ${offset}px;
            "></div>
        `);
    }

    glitchStrips.innerHTML = stripsHTML.join('');
}

function initGlitchEffect(config) {
    const {
        imageSelector,
        containerSelector,
        stripsSelector,
        imagePath,
        strips = glitchDefaults.strips,
        duration = glitchDefaults.duration
    } = config;

    const image = document.querySelector(imageSelector);
    const imageContainer = document.querySelector(containerSelector);
    const glitchStrips = document.querySelector(stripsSelector);

    if (!image || !imageContainer || !glitchStrips) {
        return;
    }

    const targetKey = `${containerSelector}|${imageSelector}`;
    if (initializedGlitchTargets.has(targetKey)) return;

    const resolvedWidth = image.clientWidth || imageContainer.clientWidth || image.naturalWidth || glitchDefaults.width;
    const resolvedHeight = image.clientHeight || imageContainer.clientHeight || image.naturalHeight || glitchDefaults.height;

    injectGlitchKeyframes();
    buildGlitchStrips({
        glitchStrips,
        imagePath,
        width: resolvedWidth,
        height: resolvedHeight,
        strips,
        duration
    });

    const triggerGlitch = () => {
        imageContainer.classList.add('glitching');
        setTimeout(() => {
            imageContainer.classList.remove('glitching');
        }, 500);
    };

    setTimeout(triggerGlitch, 1200);
    setInterval(() => {
        if (Math.random() < 0.7) {
            triggerGlitch();
        }
    }, 5500);

    initializedGlitchTargets.add(targetKey);
}

// Initialize glitch for homepage profile image
initGlitchEffect({
    imageSelector: '#profile-image',
    containerSelector: '.hero .image-container',
    stripsSelector: '.hero .glitch-strips',
    imagePath: 'assets/images/profile.jpg'
});

// Initialize glitch for about page profile image
initGlitchEffect({
    imageSelector: '#about-profile-image',
    containerSelector: '.about-image-section .image-container',
    stripsSelector: '.about-image-section .glitch-strips',
    imagePath: '../assets/images/about-profile.jpg'
});

// Mobile menu toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}
// Console log easter egg
console.log('%c[SYSTEM]: Welcome, hacker!', 'color: #00ff41; font-size: 16px; font-family: monospace;');
console.log('%c[INFO]: Looking for vulnerabilities? Try harder! 😎', 'color: #00d9ff; font-size: 14px; font-family: monospace;');

// Rotating Quotes
const quotes = [
    {
        text: "Talk is cheap. Show me the code.",
        author: "Linux Torvalds"
    },
    {
        text: "Try Harder",
        author: "Offensive Security"
    },
    {
        text: "What If Changing The World Was Just About Being Here, By Showing Up No Matter How Many Times We Get Told We Don’t Belong...",
        author: "Elliot Alderson, Mr. Robot"
    },
    {
        text: "No System Is Safe",
        author: "Benjamin Engel, Who Am I"
    },
    {
        text: "Security is an outcome of thoughtful design, not a product you install or a checklist you complete.",
        author: "Timsux Wales"
    }
];

const quoteText = document.querySelector('.quote-text');
const quoteAuthor = document.querySelector('.quote-author');
const dots = document.querySelectorAll('.dot');

let currentQuoteIndex = 0;

function updateQuote(index) {
    // Remove active class from all dots
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current dot
    dots[index].classList.add('active');
    
    // Fade out
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';
    
    setTimeout(() => {
        // Update text
        quoteText.textContent = quotes[index].text;
        quoteAuthor.textContent = quotes[index].author;
        
        // Fade in
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
    }, 400);
}

// Initialize first quote
if (quoteText && quoteAuthor) {
    updateQuote(0);
    
    // Auto-rotate quotes every 6 seconds
    setInterval(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        updateQuote(currentQuoteIndex);
    }, 6000);
    
    // Manual dot click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentQuoteIndex = index;
            updateQuote(index);
        });
    });
}
