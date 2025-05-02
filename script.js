// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game elements
const paddleHeight = 100;
const paddleWidth = 15;
const ballSize = 15;

// Paddle positions
let leftPaddleY = canvas.height/2 - paddleHeight/2;
let rightPaddleY = canvas.height/2 - paddleHeight/2;

// Ball position and speed
let ballX = canvas.width/2;
let ballY = canvas.height/2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Scores
let leftScore = 0;
let rightScore = 0;

// Control flags
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

// Event listeners
document.addEventListener('keydown', function(e) {
    if(e.key === 'w') wPressed = true;
    if(e.key === 's') sPressed = true;
    if(e.key === 'ArrowUp') upPressed = true;
    if(e.key === 'ArrowDown') downPressed = true;
});

document.addEventListener('keyup', function(e) {
    if(e.key === 'w') wPressed = false;
    if(e.key === 's') sPressed = false;
    if(e.key === 'ArrowUp') upPressed = false;
    if(e.key === 'ArrowDown') downPressed = false;
});

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Move paddles
    if(wPressed && leftPaddleY > 0) leftPaddleY -= 8;
    if(sPressed && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += 8;
    if(upPressed && rightPaddleY > 0) rightPaddleY -= 8;
    if(downPressed && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += 8;
    
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
        ballSpeedX = -ballSpeedX * 1.1; // Increase speed slightly
    }
    
    if(ballX >= canvas.width - paddleWidth - ballSize && 
       ballY + ballSize >= rightPaddleY && 
       ballY <= rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX * 1.1; // Increase speed slightly
    }
    
    // Ball out of bounds (scoring)
    if(ballX < 0) {
        rightScore++;
        resetBall();
    }
    if(ballX > canvas.width) {
        leftScore++;
        resetBall();
    }
    
    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    
    // Draw ball
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
    
    // Draw scores
    ctx.font = '32px Arial';
    ctx.fillText(leftScore, canvas.width/4, 50);
    ctx.fillText(rightScore, 3*canvas.width/4, 50);
    
    // Draw center line
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    
    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

// Start the game
resetBall();
gameLoop();
