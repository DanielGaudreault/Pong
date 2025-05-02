// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 5;
const WINNING_SCORE = 5;

// Game elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const gameOver = document.getElementById('game-over');
const winnerText = document.getElementById('winner-text');
const finalScore = document.getElementById('final-score');
const p1v1Btn = document.getElementById('1v1-btn');
const p1vaiBtn = document.getElementById('1vai-btn');
const aivaiBtn = document.getElementById('aivai-btn');
const menuBtn = document.getElementById('menu-btn');
const rematchBtn = document.getElementById('rematch-btn');
const difficultyContainer = document.getElementById('difficulty-container');
const difficultySelect = document.getElementById('difficulty');
const scoreDisplay = document.getElementById('score');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');

// Set canvas size based on container
function resizeCanvas() {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Reset player positions
    if (player1) player1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    if (player2) player2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
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
let player1Score = 0;
let player2Score = 0;
let animationId = null;
let ballSpeed = INITIAL_BALL_SPEED;

// Game objects
const player1 = {
    x: 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    upKey: 'w',
    downKey: 's',
    isAI: false
};

const player2 = {
    x: canvas.width - 20 - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    upKey: 'ArrowUp',
    downKey: 'ArrowDown',
    isAI: false
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED
};

// Event listeners
p1v1Btn.addEventListener('click', () => {
    difficultyContainer.classList.add('hidden');
    startGame('1
