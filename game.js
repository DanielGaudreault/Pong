// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game elements
const paddleHeight = 100;
const paddleWidth = 15;
const ballSize = 15;

// Game state
let leftPaddleY = canvas.height/2 - paddleHeight/2;
let rightPaddleY = canvas.height/2 - paddleHeight/2;
let ballX = canvas.width/2;
let ballY = canvas.height/2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let leftScore = 0;
let rightScore = 0;
let gameRunning = false;
let gameMode = '1v1'; // '1v1' or '1vai'
let difficulty = 'medium';
let scoreCap = 7;
let animationId = null;

// DOM elements
const menu = document.getElementById('menu');
const scoreDisplay = document.getElementById('score-display');
const leftScoreDisplay = document.getElementById('left-score');
const rightScoreDisplay = document.getElementById('right-score');
const gameOverScreen = document.getElementById('game-over');
const winnerText = document.getElementById('winner-text');

// Control flags
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

// Initialize game
function init() {
    // Set up event listeners
    document.getElementById('btn-1v1').addEventListener('click', () => {
        gameMode = '1v1';
        startGame();
    });
    
    document.getElementById('btn-1vai').addEventListener('click', () => {
        gameMode = '1vai';
        startGame();
    });
    
    document.getElementById('btn-menu').addEventListener('click', returnToMenu);
    
    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
    });
    
    document.getElementById('score-cap').addEventListener('change', (e) => {
        scoreCap = parseInt(e.target.value);
    });
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if(!gameRunning) return;
        
        if(e.key === 'w') wPressed = true;
        if(e.key === 's') sPressed = true;
        if(e.key === 'ArrowUp') upPressed = true;
        if(e.key === 'ArrowDown') downPressed = true;
        
        // Pause game with Escape
        if(e.key === 'Escape') {
            togglePause();
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if(!gameRunning) return;
        
        if(e.key === 'w') wPressed = false;
        if(e.key === 's') sPressed = false;
        if(e.key === 'ArrowUp') upPressed = false;
        if(e.key === 'ArrowDown') downPressed = false;
    });
}

function startGame() {
    // Reset scores
    leftScore = 0;
    rightScore = 0;
    updateScoreDisplay();
    
    // Reset positions
    leftPaddleY = canvas.height/2 - paddleHeight/2;
    rightPaddleY = canvas.height/2 - paddleHeight/2;
    resetBall();
    
    // Show game elements
    menu.style.display = 'none';
    canvas.style.display = 'block';
    scoreDisplay.style.display = 'flex';
    gameOverScreen.style.display = 'none';
    
    // Start game loop
    gameRunning = true;
    if(animationId) {
        cancelAnimationFrame(animationId);
    }
    gameLoop();
}

function returnToMenu() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    animationId = null;
    
    menu.style.display = 'block';
    canvas.style.display = 'none';
    scoreDisplay.style.display = 'none';
    gameOverScreen.style.display = 'none';
}

function togglePause() {
    if(!gameRunning) return;
    
    gameRunning = !gameRunning;
    if(gameRunning) {
        gameLoop();
    } else {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function updateScoreDisplay() {
    leftScoreDisplay.textContent = leftScore;
    rightScoreDisplay.textContent = rightScore;
}

function moveAI() {
    // AI difficulty settings
    let reactionSpeed;
    switch(difficulty) {
        case 'easy': reactionSpeed = 0.6; break;
        case 'medium': reactionSpeed = 0.8; break;
        case 'hard': reactionSpeed = 0.95; break;
        default: reactionSpeed = 0.8;
    }
    
    // Predict ball position
    const paddleCenter = rightPaddleY + paddleHeight/2;
    const ballFutureY = ballY + (ballSpeedY * (canvas.width - ballX) / ballSpeedX);
    
    // Move paddle toward predicted position
    if(paddleCenter < ballFutureY - 10) {
        rightPaddleY += 6 * reactionSpeed;
    } else if(paddleCenter > ballFutureY + 10) {
        rightPaddleY -= 6 * reactionSpeed;
    }
    
    // Keep paddle on screen
    if(rightPaddleY < 0) rightPaddleY = 0;
    if(rightPaddleY > canvas.height - paddleHeight) rightPaddleY = canvas.height - paddleHeight;
}

function checkGameOver() {
    if(leftScore >= scoreCap || rightScore >= scoreCap) {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        
        if(leftScore >= scoreCap) {
            winnerText.textContent = gameMode === '1vai' ? 'You Win!' : 'Player 1 Wins!';
        } else {
            winnerText.textContent = gameMode === '1vai' ? 'AI Wins!' : 'Player 2 Wins!';
        }
        
        gameOverScreen.style.display = 'flex';
    }
}

function gameLoop() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Move paddles
    if(wPressed && leftPaddleY > 0) leftPaddleY -= 8;
    if(sPressed && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += 8;
    
    if(gameMode === '1v1') {
        if(upPressed && rightPaddleY > 0) rightPaddleY -= 8;
        if(downPressed && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += 8;
    } else {
        moveAI();
    }
    
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Ball collision with top/bottom
    if(ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY;
    }
    
    // Ball collision with paddles
    if(ballX <= paddleWidth && 
       ballY + ballSize >= leftPaddleY && 
       ballY <= leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX * 1.05;
    }
    
    if(ballX >= canvas.width - paddleWidth - ballSize && 
       ballY + ballSize >= rightPaddleY && 
       ballY <= rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX * 1.05;
    }
    
    // Ball out of bounds (scoring)
    if(ballX < 0) {
        rightScore++;
        updateScoreDisplay();
        resetBall();
        checkGameOver();
    }
    if(ballX > canvas.width) {
        leftScore++;
        updateScoreDisplay();
        resetBall();
        checkGameOver();
    }
    
    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    
    // Draw ball
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
    
    // Draw center line
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Continue game loop
    if(gameRunning) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Start the game
window.addEventListener('load', init);
