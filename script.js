// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 10;
const INITIAL_BALL_SPEED = 6;
const MAX_BALL_SPEED = 20;

// Game elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const menuScreen = document.getElementById('menu');
const gameOverScreen = document.getElementById('game-over');
const pauseScreen = document.getElementById('pause-screen');
const winnerText = document.getElementById('winner-text');
const finalScore = document.getElementById('final-score');
const p1v1Btn = document.getElementById('1v1-btn');
const p1vaiBtn = document.getElementById('1vai-btn');
const aivaiBtn = document.getElementById('aivai-btn');
const menuBtn = document.getElementById('menu-btn');
const rematchBtn = document.getElementById('rematch-btn');
const difficultySelect = document.getElementById('difficulty');
const winningScoreSelect = document.getElementById('winning-score');
const scoreDisplay = document.getElementById('score-display');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');

// Set canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reset positions when resizing
    if (player1) {
        player1.x = 30;
        player1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    }
    if (player2) {
        player2.x = canvas.width - 30 - PADDLE_WIDTH;
        player2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    }
    if (ball) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game state
let gameMode = null;
let gameRunning = false;
let gamePaused = false;
let player1Score = 0;
let player2Score = 0;
let animationId = null;
let ballSpeed = INITIAL_BALL_SPEED;
let winningScore = parseInt(winningScoreSelect.value);

// Game objects
const player1 = {
    x: 30,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    upKey: 'w',
    downKey: 's',
    isAI: false,
    color: '#4CAF50'
};

const player2 = {
    x: canvas.width - 30 - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    upKey: 'ArrowUp',
    downKey: 'ArrowDown',
    isAI: false,
    color: '#2196F3'
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    color: '#FFFFFF'
};

// Event listeners
p1v1Btn.addEventListener('click', () => startGame('1v1'));
p1vaiBtn.addEventListener('click', () => startGame('1vai'));
aivaiBtn.addEventListener('click', () => startGame('aivai'));
menuBtn.addEventListener('click', returnToMenu);
rematchBtn.addEventListener('click', rematch);
winningScoreSelect.addEventListener('change', () => {
    winningScore = parseInt(winningScoreSelect.value);
});

// Keyboard controls
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(e) {
    // Pause game with Escape key
    if (e.key === 'Escape') {
        togglePause();
        return;
    }
    
    if (!gameRunning || gamePaused) return;
    
    // Player 1 controls
    if (!player1.isAI) {
        if (e.key.toLowerCase() === player1.upKey.toLowerCase()) player1.dy = -PADDLE_SPEED;
        if (e.key.toLowerCase() === player1.downKey.toLowerCase()) player1.dy = PADDLE_SPEED;
    }
    
    // Player 2 controls (only in 1v1 mode)
    if (!player2.isAI && gameMode === '1v1') {
        if (e.key === player2.upKey) player2.dy = -PADDLE_SPEED;
        if (e.key === player2.downKey) player2.dy = PADDLE_SPEED;
    }
}

function handleKeyUp(e) {
    if (!gameRunning || gamePaused) return;
    
    // Player 1
    if (!player1.isAI && (e.key.toLowerCase() === player1.upKey.toLowerCase() || 
                          e.key.toLowerCase() === player1.downKey.toLowerCase())) {
        player1.dy = 0;
    }
    
    // Player 2
    if (!player2.isAI && gameMode === '1v1' && 
        (e.key === player2.upKey || e.key === player2.downKey)) {
        player2.dy = 0;
    }
}

// Touch controls for mobile
let touchStartY = {};
const mobileUpBtn1 = document.createElement('div');
const mobileDownBtn1 = document.createElement('div');
const mobileUpBtn2 = document.createElement('div');
const mobileDownBtn2 = document.createElement('div');

function setupMobileControls() {
    const mobileControls = document.createElement('div');
    mobileControls.className = 'mobile-controls';
    
    mobileUpBtn1.className = 'mobile-btn';
    mobileUpBtn1.textContent = '↑';
    mobileUpBtn1.style.marginRight = 'auto';
    mobileDownBtn1.className = 'mobile-btn';
    mobileDownBtn1.textContent = '↓';
    mobileDownBtn1.style.marginRight = 'auto';
    
    mobileUpBtn2.className = 'mobile-btn';
    mobileUpBtn2.textContent = '↑';
    mobileDownBtn2.className = 'mobile-btn';
    mobileDownBtn2.textContent = '↓';
    
    if (gameMode === '1v1') {
        const player1Controls = document.createElement('div');
        player1Controls.style.display = 'flex';
        player1Controls.appendChild(mobileUpBtn1);
        player1Controls.appendChild(mobileDownBtn1);
        
        const player2Controls = document.createElement('div');
        player2Controls.style.display = 'flex';
        player2Controls.appendChild(mobileUpBtn2);
        player2Controls.appendChild(mobileDownBtn2);
        
        mobileControls.appendChild(player1Controls);
        mobileControls.appendChild(player2Controls);
    } else {
        mobileControls.appendChild(mobileUpBtn1);
        mobileControls.appendChild(mobileDownBtn1);
    }
    
    document.body.appendChild(mobileControls);
    
    // Touch event handlers
    mobileUpBtn1.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player1.dy = -PADDLE_SPEED;
    });
    
    mobileDownBtn1.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player1.dy = PADDLE_SPEED;
    });
    
    mobileUpBtn2.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player2.dy = -PADDLE_SPEED;
    });
    
    mobileDownBtn2.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player2.dy = PADDLE_SPEED;
    });
    
    // Touch end handlers
    const handleTouchEnd = (e) => {
        e.preventDefault();
        player1.dy = 0;
        player2.dy = 0;
    };
    
    mobileUpBtn1.addEventListener('touchend', handleTouchEnd);
    mobileDownBtn1.addEventListener('touchend', handleTouchEnd);
    mobileUpBtn2.addEventListener('touchend', handleTouchEnd);
    mobileDownBtn2.addEventListener('touchend', handleTouchEnd);
}

// Game functions
function startGame(mode) {
    gameMode = mode;
    gameRunning = true;
    gamePaused = false;
    player1Score = 0;
    player2Score = 0;
    ballSpeed = INITIAL_BALL_SPEED;
    winningScore = parseInt(winningScoreSelect.value);
    
    // Set AI players based on mode
    player1.isAI = (mode === 'aivai');
    player2.isAI = (mode !== '1v1');
    
    // Reset positions
    player1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    player2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    
    resetBall();
    menuScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    scoreDisplay.style.display = 'flex';
    updateScoreDisplay();
    
    // Setup mobile controls if needed
    if (window.innerWidth <= 768) {
        setupMobileControls();
    }
    
    animate();
}

function returnToMenu() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    menuScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    scoreDisplay.style.display = 'none';
    
    // Remove mobile controls
    const mobileControls = document.querySelector('.mobile-controls');
    if (mobileControls) {
        mobileControls.remove();
    }
}

function rematch() {
    gameOverScreen.classList.add('hidden');
    startGame(gameMode);
}

function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    if (gamePaused) {
        pauseScreen.classList.remove('hidden');
        cancelAnimationFrame(animationId);
    } else {
        pauseScreen.classList.add('hidden');
        animate();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Random direction but not too vertical
    const angle = (Math.random() * Math.PI/3) - Math.PI/6; // -30 to 30 degrees
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    ball.dx = direction * ballSpeed * Math.cos(angle);
    ball.dy = ballSpeed * Math.sin(angle);
    
    // Add some randomness to the speed
    const speedVariation = 0.2;
    const speedMultiplier = 1 + (Math.random() * speedVariation * 2 - speedVariation);
    ball.dx *= speedMultiplier;
    ball.dy *= speedMultiplier;
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
        moveAI(player1, ball, getAIDifficultyFactor());
    }
    if (player2.isAI) {
        moveAI(player2, ball, getAIDifficultyFactor());
    }
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy *= -1;
    }
    
    // Ball collision with paddles
    if (checkPaddleCollision(player1, ball)) {
        const hitPosition = (ball.y - (player1.y + player1.height/2)) / (player1.height/2);
        ball.dx = Math.abs(ball.dx) * 1.05;
        ball.dy = hitPosition * ballSpeed * 1.5;
        
        // Add slight speed increase after each hit (with max limit)
        ballSpeed = Math.min(ballSpeed * 1.02, MAX_BALL_SPEED);
    }
    
    if (checkPaddleCollision(player2, ball)) {
        const hitPosition = (ball.y - (player2.y + player2.height/2)) / (player2.height/2);
        ball.dx = -Math.abs(ball.dx) * 1.05;
        ball.dy = hitPosition * ballSpeed * 1.5;
        
        // Add slight speed increase after each hit (with max limit)
        ballSpeed = Math.min(ballSpeed * 1.02, MAX_BALL_SPEED);
    }
    
    // Scoring
    if (ball.x <= 0) {
        player2Score++;
        updateScoreDisplay();
        checkGameOver();
        resetBall();
    }
    
    if (ball.x + ball.size >= canvas.width) {
        player1Score++;
        updateScoreDisplay();
        checkGameOver();
        resetBall();
    }
}

function checkPaddleCollision(paddle, ball) {
    return (
        ball.x <= paddle.x + paddle.width &&
        ball.x + ball.size >= paddle.x &&
        ball.y + ball.size >= paddle.y &&
        ball.y <= paddle.y + paddle.height
    );
}

function moveAI(paddle, ball, difficultyFactor) {
    const paddleCenter = paddle.y + paddle.height / 2;
    const ballCenter = ball.y + ball.size / 2;
    
    // Only move if ball is coming towards the paddle
    if ((paddle === player1 && ball.dx < 0) || (paddle === player2 && ball.dx > 0)) {
        // Calculate where the ball will intersect with the paddle's x-position
        const timeToReachPaddle = Math.abs((paddle.x - ball.x) / ball.dx);
        const predictedY = ball.y + ball.dy * timeToReachPaddle;
        
        // Adjust for difficulty
        const reactionError = (1 - difficultyFactor) * 100; // More error on lower difficulty
        const targetY = predictedY + (Math.random() * reactionError * 2 - reactionError);
        
        // Keep target within bounds
        const boundedTarget = Math.max(paddle.height/2, 
                                     Math.min(canvas.height - paddle.height/2, targetY));
        
        // Move paddle towards target
        if (paddleCenter < boundedTarget - 5) {
            paddle.y += PADDLE_SPEED * difficultyFactor;
        } else if (paddleCenter > boundedTarget + 5) {
            paddle.y -= PADDLE_SPEED * difficultyFactor;
        }
    } else {
        // Return to center when ball is moving away
        const centerY = canvas.height / 2 - paddle.height / 2;
        if (paddle.y < centerY - 10) {
            paddle.y += PADDLE_SPEED * 0.5;
        } else if (paddle.y > centerY + 10) {
            paddle.y -= PADDLE_SPEED * 0.5;
        }
    }
}

function getAIDifficultyFactor() {
    switch(difficultySelect.value) {
        case 'easy': return 0.5;
        case 'medium': return 0.75;
        case 'hard': return 0.9;
        case 'impossible': return 1.0;
        default: return 0.75;
    }
}

function checkGameOver() {
    if (player1Score >= winningScore || player2Score >= winningScore) {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        
        if (player1Score >= winningScore) {
            winnerText.textContent = player1.isAI ? "AI 1 Wins!" : "Player 1 Wins!";
            winnerText.style.color = player1.color;
        } else {
            winnerText.textContent = player2.isAI ? "AI 2 Wins!" : "Player 2 Wins!";
            winnerText.style.color = player2.color;
        }
        
        finalScore.textContent = `${player1Score} - ${player2Score}`;
        gameOverScreen.classList.remove('hidden');
        
        // Remove mobile controls
        const mobileControls = document.querySelector('.mobile-controls');
        if (mobileControls) {
            mobileControls.remove();
        }
    }
}

function updateScoreDisplay() {
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;
}

function draw() {
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#111');
    gradient.addColorStop(1, '#000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line with glow effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.setLineDash([20, 15]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    
    // Draw paddles with 3D effect
    drawPaddle(player1);
    drawPaddle(player2);
    
    // Draw ball with glow effect
    drawBall(ball);
}

function drawPaddle(paddle) {
    // Paddle main body
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // Paddle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // Paddle inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(paddle.x + 2, paddle.y + 2, paddle.width - 4, paddle.height - 4);
}

function drawBall(ball) {
    // Ball glow effect
    const gradient = ctx.createRadialGradient(
        ball.x + ball.size/2, ball.y + ball.size/2, 0,
        ball.x + ball.size/2, ball.y + ball.size/2, ball.size*2
    );
    gradient.addColorStop(0, ball.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        ball.x + ball.size/2, 
        ball.y + ball.size/2, 
        ball.size*2, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
    
    // Ball main body
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function animate() {
    if (!gamePaused) {
        update();
    }
    draw();
    
    if (gameRunning) {
        animationId = requestAnimationFrame(animate);
    }
}

// Initialize game
menuScreen.classList.remove('hidden');
scoreDisplay.style.display = 'none';
