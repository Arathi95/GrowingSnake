// Classic Snake Game using HTML5 Canvas

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

const box = 20; // size of one grid square
const canvasSize = 400;
const row = canvasSize / box;
const col = canvasSize / box;

let snake, food, direction, score, gameInterval, gameOver;

function resetGame() {
    snake = [
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 }
    ];
    direction = 'RIGHT';
    score = 0;
    gameOver = false;
    food = randomFood();
    scoreEl.textContent = 'Score: 0';
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 100);
}

function randomFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * col),
            y: Math.floor(Math.random() * row)
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            return newFood;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw snake using image
    const snakeImg = new window.Image();
    snakeImg.src = 'Images/snake.jpeg';
    for (let i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeImg, snake[i].x * box, snake[i].y * box, box, box);
    }
    // Draw food using image
    const foodImg = new window.Image();
    foodImg.src = 'Images/food.jpeg';
    ctx.drawImage(foodImg, food.x * box, food.y * box, box, box);

    // Move snake
    let head = { ...snake[0] };
    if (direction === 'LEFT') head.x--;
    if (direction === 'UP') head.y--;
    if (direction === 'RIGHT') head.x++;
    if (direction === 'DOWN') head.y++;

    // Check collision with wall
    if (head.x < 0 || head.x >= col || head.y < 0 || head.y >= row) {
        endGame();
        return;
    }
    // Check collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }
    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = 'Score: ' + score;
        food = randomFood();
        // Don't remove tail (snake grows)
    } else {
        snake.pop(); // Remove tail
    }
    snake.unshift(head); // Add new head
}

function endGame() {
    clearInterval(gameInterval);
    gameOver = true;
    // Draw overlay
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.font = 'bold 48px Segoe UI, Arial, sans-serif';
    ctx.fillStyle = '#ff5252';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width/2, canvas.height/2 + 18);
    ctx.restore();
}

document.addEventListener('keydown', e => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

restartBtn.addEventListener('click', resetGame);

// Start the game on load
resetGame();
