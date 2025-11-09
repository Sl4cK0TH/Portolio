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

// Glitch Effect - Horizontal Strip Displacement
const imageContainer = document.querySelector('.image-container');
const glitchStrips = document.querySelector('.glitch-strips');

if (imageContainer && glitchStrips) {
    console.log('Glitch effect initialized');
    
    const numStrips = 100; // Number of horizontal strips
    const imageHeight = 400; // Match your image container height
    const imageWidth = 400;
    const stripHeight = imageHeight / numStrips;
    const animationDuration = 4000; // 4 seconds
    
    // Generate keyframes for each strip
    function generateKeyframes() {
        let styleSheet = document.createElement('style');
        let keyframesCSS = '';
        
        for (let i = 0; i < numStrips; i++) {
            const delay = -(animationDuration / numStrips) * i;
            const bgY = -stripHeight * i;
            
            keyframesCSS += `
                @keyframes glitch-strip-${i} {
                    0% { background-position: 0 ${bgY}px; }
                    2.5% { background-position: 30px ${bgY}px; }
                    2.75% { background-position: -10px ${bgY}px; }
                    3.6% { background-position: 15px ${bgY}px; }
                    4.7% { background-position: -17px ${bgY}px; }
                    5% { background-position: -22px ${bgY}px; }
                    7% { background-position: 150px ${bgY}px; }
                    7.2% { background-position: 26px ${bgY}px; }
                    8.5% { background-position: 28px ${bgY}px; }
                    8.6% { background-position: 0 ${bgY}px; }
                    8.9% { background-position: -5px ${bgY}px; }
                    9.2% { background-position: -4px ${bgY}px; }
                    10.4% { background-position: -105px ${bgY}px; }
                    12.5% { background-position: 0 ${bgY}px; }
                    100% { background-position: 0 ${bgY}px; }
                }
            `;
        }
        
        styleSheet.textContent = keyframesCSS;
        document.head.appendChild(styleSheet);
        console.log('Keyframes generated');
    }
    
    // Generate strips HTML
    function generateStrips() {
        const strips = [];
        
        for (let i = 0; i < numStrips; i++) {
            const bgY = -stripHeight * i;
            const delay = -(animationDuration / numStrips) * i;
            
            const stripHTML = `
                <div class="line" style="
                    height: ${stripHeight}px;
                    width: ${imageWidth}px;
                    background: url('assets/images/profile.jpg') no-repeat;
                    background-position: 0 ${bgY}px;
                    background-size: ${imageWidth}px ${imageHeight}px;
                    position: absolute;
                    top: ${stripHeight * i}px;
                    left: 0;
                    animation: glitch-strip-${i} ${animationDuration}ms ${delay}ms infinite;
                "></div>
            `;
            
            strips.push(stripHTML);
        }
        
        glitchStrips.innerHTML = strips.join('');
        console.log(`Generated ${numStrips} strips`);
    }
    
    // Initialize glitch effect
    function initGlitch() {
        generateKeyframes();
        generateStrips();
    }
    
    // Trigger glitch effect
    function triggerGlitch() {
        console.log('Glitch triggered!');
        imageContainer.classList.add('glitching');
        
        // Stop glitch after one animation cycle (500ms = 12.5% of 4000ms)
        setTimeout(() => {
            imageContainer.classList.remove('glitching');
            console.log('Glitch stopped');
        }, 500);
    }
    
    // Initialize on load
    initGlitch();
    
    // Trigger immediately after 2 seconds for testing
    setTimeout(() => {
        triggerGlitch();
    }, 2000);
    
    // Run glitch every 6 seconds
    setInterval(() => {
        if (Math.random() < 0.6) {
            triggerGlitch();
        }
    }, 6000);
} else {
    console.error('Glitch elements not found!', {imageContainer, glitchStrips});
}

// Mobile menu toggle
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
        text: "TWhat If Changing The World Was Just About Being Here, By Showing Up No Matter How Many Times We Get Told We Don’t Belong...",
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