// Get the canvas and its context
const canvas = document.getElementById('bouncingBalls');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
        this.dy = (Math.random() - 0.5) * 8; // Random vertical velocity
        this.mass = radius; // Mass proportional to radius
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(balls) {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Keep balls within bounds
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        // Check collision with other balls
        balls.forEach(ball => {
            if (ball === this) return; // Skip self

            // Calculate distance between ball centers
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if balls are colliding
            if (distance < this.radius + ball.radius) {
                // Collision detected - calculate collision response
                const normalX = dx / distance;
                const normalY = dy / distance;

                // Relative velocity
                const relativeVelocityX = this.dx - ball.dx;
                const relativeVelocityY = this.dy - ball.dy;

                // Calculate impulse
                const speed = relativeVelocityX * normalX + relativeVelocityY * normalY;
                
                if (speed < 0) return; // Already moving apart

                const impulse = 2 * speed / (this.mass + ball.mass);

                // Apply impulse
                this.dx -= (impulse * ball.mass * normalX);
                this.dy -= (impulse * ball.mass * normalY);
                ball.dx += (impulse * this.mass * normalX);
                ball.dy += (impulse * this.mass * normalY);

                // Separate balls to prevent sticking
                const overlap = (this.radius + ball.radius - distance) / 2;
                this.x -= overlap * normalX;
                this.y -= overlap * normalY;
                ball.x += overlap * normalX;
                ball.y += overlap * normalY;
            }
        });

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create original balls
const colors = ['red', 'blue', 'green', 'orange', 'white'];
const balls = [];

for (let i = 0; i < colors.length; i++) {
    const radius = 20;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    balls.push(new Ball(x, y, radius, colors[i]));
}

// Add four more green balls
for (let i = 0; i < 4; i++) {
    const radius = 20;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    balls.push(new Ball(x, y, radius, 'green'));
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach(ball => {
        ball.update(balls);
    });

    requestAnimationFrame(animate);
}

// Start animation
animate(); 