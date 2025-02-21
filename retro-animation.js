// Star field animation
class Star {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.z = Math.random() * 1500 + 500;
        this.px = this.x;
        this.py = this.y;
    }

    update() {
        this.px = this.x;
        this.py = this.y;
        this.z -= 10;
        
        if (this.z <= 0) {
            this.reset();
        } else {
            this.x = (this.x - this.canvas.width/2) * (1000/this.z) + this.canvas.width/2;
            this.y = (this.y - this.canvas.height/2) * (1000/this.z) + this.canvas.height/2;
        }
    }

    draw(ctx) {
        const size = Math.max(0.1, (1000 - this.z) / 1000 * 3);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize starfield
const starsCanvas = document.createElement('canvas');
starsCanvas.style.position = 'absolute';
starsCanvas.style.top = '0';
starsCanvas.style.left = '0';
document.getElementById('starsCanvas').appendChild(starsCanvas);
const ctx = starsCanvas.getContext('2d');

// Make canvas full screen
function resizeCanvas() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create stars
const stars = Array(200).fill().map(() => new Star(starsCanvas));

// Animate stars
function animateStars() {
    ctx.fillStyle = 'rgba(0, 0, 51, 0.2)';
    ctx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);
    
    stars.forEach(star => {
        star.update();
        star.draw(ctx);
    });
    
    requestAnimationFrame(animateStars);
}
animateStars();

// Animation effects for text
const animationEffects = {
    typewriter: (text, element) => {
        let i = 0;
        element.textContent = '';
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
            } else {
                clearInterval(interval);
            }
        }, 100);
    },

    matrix: (text, element) => {
        const chars = '0123456789ABCDEF';
        let iterations = 0;
        const interval = setInterval(() => {
            element.textContent = text.split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return char;
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iterations >= text.length) {
                clearInterval(interval);
            }
            iterations += 1/3;
        }, 50);
    },

    glitch: (text, element) => {
        let iterations = 0;
        const glitchText = () => {
            if (iterations > 20) {
                element.textContent = text;
                return;
            }
            
            element.textContent = text
                .split('')
                .map((char) => Math.random() > 0.8 ? String.fromCharCode(33 + Math.random() * 94) : char)
                .join('');
            
            iterations++;
            setTimeout(glitchText, 100);
        };
        glitchText();
    }
};

// Button click messages and animations
const buttonEffects = {
    animationBtn: {
        messages: [
            "Loading epic animation sequence...",
            "Initializing particle system...",
            "Generating awesome effects..."
        ],
        effect: 'matrix'
    },
    downloadBtn: {
        messages: [
            "Downloading at 56.6k...",
            "Please insert floppy disk...",
            "Buffering... Please wait..."
        ],
        effect: 'typewriter'
    },
    guestbookBtn: {
        messages: [
            "Accessing guest book database...",
            "Loading visitor comments...",
            "Connecting to BBS system..."
        ],
        effect: 'glitch'
    }
};

// Setup button click handlers
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(buttonEffects).forEach(btnId => {
        const button = document.getElementById(btnId);
        if (button) {
            const effect = buttonEffects[btnId];
            button.addEventListener('click', () => {
                const randomMessage = effect.messages[Math.floor(Math.random() * effect.messages.length)];
                const textElement = document.getElementById('animatedText');
                if (textElement && effect.effect in animationEffects) {
                    animationEffects[effect.effect](randomMessage, textElement);
                }
            });
        }
    });

    // Initial animation
    const textElement = document.getElementById('animatedText');
    if (textElement) {
        animationEffects.typewriter("Click the buttons for retro effects!", textElement);
    }
}); 