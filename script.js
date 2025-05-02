// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;
const WINNING_SCORE = 5;

// Game elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const gameOver = document.getElementById('game-over');
const winnerText = document.getElementById('winner-text');
const p1v1Btn = document.getElementById('1v1-btn');
const p1vaiBtn = document.getElementById('1vai-btn');
const menuBtn = document.getElementById('menu-btn');

// Game state
let gameMode = null;
let gameRunning = false;
let player1Score = 0;
let player2Score = 0;
let animationId = null;

// Game objects
const player1 = {
    x: 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    upKey: 'w',
    downKey: 's'
};

const player2 = {
    x: canvas.width - 20 - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    upKey: 'ArrowUp',
    downKey: 'ArrowDown'
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: BALL_SPEED,
    dy: BALL_SPEED
};

// Event listeners
p1v1Btn.addEventListener('click', () => startGame('1v1'));
p1vaiBtn.addEventListener('click', () => startGame('1vai'));
menuBtn.addEventListener('click', returnToMenu);

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    // Player 1 controls
    if (e.key === player1.upKey) player1.dy = -PADDLE_SPEED;
    if (e.key === player1.downKey) player1.dy = PADDLE_SPEED;
    
    // Player 2 controls (only in 1v1 mode)
    if (gameMode === '1v1') {
        if (e.key === player2.upKey) player2.dy = -PADDLE_SPEED;
        if (e.key === player2.downKey) player2.dy = PADDLE_SPEED;
    }
});

document.addEventListener('keyup', (e) => {
    if (!gameRunning) return;
    
    // Player 1
    if (e.key === player1.upKey || e.key === player1.downKey) player1.dy = 0;
    
    // Player 2
    if (gameMode === '1v1') {
        if (e.key === player2.upKey || e.key === player2.downKey) player2.dy = 0;
    }
});

// Game functions
function startGame(mode) {
    gameMode = mode;
    gameRunning = true;
    player1Score = 0;
    player2Score = 0;
    resetBall();
    menu.classList.add('hidden');
    gameOver.classList.add('hidden');
    animate();
}

function returnToMenu() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    menu.classList.remove('hidden');
    gameOver.classList.add('hidden');
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Move paddles
    player1.y += player1.dy;
    player2.y += player2.dy;
    
    // Paddle boundaries
    player1.y = Math.max(0, Math.min(canvas.height - player1.height, player1.y));
    player2.y = Math.max(0, Math.min(canvas.height - player2.height, player2.y));
    
    // AI movement in 1vAI mode
    if (gameMode === '1vai') {
        const paddleCenter = player2.y + player2.height / 2;
        const ballCenter = ball.y + ball.size / 2;
        
        if (paddleCenter < ballCenter - 20) {
            player2.y += PADDLE_SPEED * 0.7;
        } else if (paddleCenter > ballCenter + 20) {
            player2.y -= PADDLE_SPEED * 0.7;
        }
    }
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy *= -1;
    }
    
    // Ball collision with paddles
    if (
        ball.x <= player1.x + player1.width &&
        ball.x + ball.size >= player1.x &&
        ball.y + ball.size >= player1.y &&
        ball.y <= player1.y + player1.height
    ) {
        ball.dx = Math.abs(ball.dx) * 1.1;
        ball.dy *= 1.1;
    }
    
    if (
        ball.x + ball.size >= player2.x &&
        ball.x <= player2.x + player2.width &&
        ball.y + ball.size >= player2.y &&
        ball.y <= player2.y + player2.height
    ) {
        ball.dx = -Math.abs(ball.dx) * 1.1;
        ball.dy *= 1.1;
    }
    
    // Scoring
    if (ball.x <= 0) {
        player2Score++;
        checkGameOver();
        resetBall();
    }
    
    if (ball.x + ball.size >= canvas.width) {
        player1Score++;
        checkGameOver();
        resetBall();
    }
}

function checkGameOver() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        
        if (player1Score >= WINNING_SCORE) {
            winnerText.textContent = "Player 1 Wins!";
        } else {
            winnerText.textContent = gameMode === '1v1' ? "Player 2 Wins!" : "AI Wins!";
        }
        
        gameOver.classList.remove('hidden');
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = 'white';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    
    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
    
    // Draw score
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player1Score, canvas.width / 4, 50);
    ctx.fillText(player2Score, (canvas.width / 4) * 3, 50);
}

function animate() {
    update();
    draw();
    
    if (gameRunning) {
        animationId = requestAnimationFrame(animate);
    }
}

// Initialize menu
menu.classList.remove('hidden');
