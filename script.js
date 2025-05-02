// Game elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const menuScreen = document.getElementById('menu');
const gameOverScreen = document.getElementById('game-over');
const winnerText = document.getElementById('winner-text');

// Buttons
const btn1v1 = document.getElementById('btn-1v1');
const btn1vAI = document.getElementById('btn-1vai');
const btnAIvAI = document.getElementById('btn-aivai');
const btnMenu = document.getElementById('btn-menu');

// Game settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;
const WINNING_SCORE = 5;

// Game state
let gameRunning = false;
let gameMode = null;
let animationId = null;

// Game objects
const player1 = {
    x: 30,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0,
    isAI: false
};

const player2 = {
    x: canvas.width - 30 - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0,
    isAI: false
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: BALL_SPEED,
    dy: BALL_SPEED
};

// Initialize game
function init() {
    // Set canvas size
    resizeCanvas();
    
    // Event listeners
    btn1v1.addEventListener('click', () => startGame('1v1'));
    btn1vAI.addEventListener('click', () => startGame('1vai'));
    btnAIvAI.addEventListener('click', () => startGame('aivai'));
    btnMenu.addEventListener('click', returnToMenu);
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reset positions
    player1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    player2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
}

function startGame(mode) {
    console.log(`Starting game: ${mode}`);
    
    // Set game mode
    gameMode = mode;
    gameRunning = true;
    
    // Reset scores
    player1.score = 0;
    player2.score = 0;
    
    // Set AI players
    player1.isAI = (mode === 'aivai');
    player2.isAI = (mode !== '1v1');
    
    // Reset ball
    resetBall();
    
    // Show game screen
    menuScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Start game loop
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    animate();
}

function returnToMenu() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    menuScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

function handleKeyDown(e) {
    if (!gameRunning) return;
    
    // Player 1 controls
    if (!player1.isAI) {
        if (e.key === 'w') player1.dy = -PADDLE_SPEED;
        if (e.key === 's') player1.dy = PADDLE_SPEED;
    }
    
    // Player 2 controls
    if (!player2.isAI && gameMode === '1v1') {
        if (e.key === 'ArrowUp') player2.dy = -PADDLE_SPEED;
        if (e.key === 'ArrowDown') player2.dy = PADDLE_SPEED;
    }
}

function handleKeyUp(e) {
    if (!gameRunning) return;
    
    // Player 1
    if (!player1.isAI && (e.key === 'w' || e.key === 's')) {
        player1.dy = 0;
    }
    
    // Player 2
    if (!player2.isAI && gameMode === '1v1' && 
        (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        player2.dy = 0;
    }
}

function update() {
    // Move paddles
    player1.y += player1.dy;
    player2.y += player2.dy;
    
    // Paddle boundaries
    player1.y = Math.max(0, Math.min(canvas.height - player1.height, player1.y));
    player2.y = Math.max(0, Math.min(canvas.height - player2.height, player2.y));
    
    // AI movement
    if (player1.isAI) {
        moveAI(player1);
    }
    if (player2.isAI) {
        moveAI(player2);
    }
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with walls
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy *= -1;
    }
    
    // Ball collision with paddles
    if (checkCollision(player1) || checkCollision(player2)) {
        ball.dx *= -1.1;
        ball.dy *= 1.1;
    }
    
    // Scoring
    if (ball.x <= 0) {
        player2.score++;
        checkGameOver();
        resetBall();
    }
    
    if (ball.x + ball.size >= canvas.width) {
        player1.score++;
        checkGameOver();
        resetBall();
    }
}

function moveAI(paddle) {
    const paddleCenter = paddle.y + paddle.height / 2;
    const ballCenter = ball.y + ball.size / 2;
    
    if (paddleCenter < ballCenter - 10) {
        paddle.y += PADDLE_SPEED * 0.7;
    } else if (paddleCenter > ballCenter + 10) {
        paddle.y -= PADDLE_SPEED * 0.7;
    }
}

function checkCollision(paddle) {
    return (
        ball.x <= paddle.x + paddle.width &&
        ball.x + ball.size >= paddle.x &&
        ball.y + ball.size >= paddle.y &&
        ball.y <= paddle.y + paddle.height
    );
}

function checkGameOver() {
    if (player1.score >= WINNING_SCORE || player2.score >= WINNING_SCORE) {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        
        if (player1.score >= WINNING_SCORE) {
            winnerText.textContent = player1.isAI ? "AI 1 Wins!" : "Player 1 Wins!";
        } else {
            winnerText.textContent = player2.isAI ? "AI 2 Wins!" : "Player 2 Wins!";
        }
        
        gameOverScreen.classList.remove('hidden');
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
    
    // Draw scores
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player1.score, canvas.width / 4, 50);
    ctx.fillText(player2.score, (canvas.width / 4) * 3, 50);
}

function animate() {
    update();
    draw();
    
    if (gameRunning) {
        animationId = requestAnimationFrame(animate);
    }
}

// Start the game when loaded
window.addEventListener('load', init);
