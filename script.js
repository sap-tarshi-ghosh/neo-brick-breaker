const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

/* Paddle */
let paddle = {
    width: 120,
    height: 15,
    x: canvas.width / 2 - 60,
    y: canvas.height - 40,
    speed: 8
};

/* Ball */
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    radius: 8,
    dx: 4,
    dy: -4
};

/* Bricks */
const rows = 5;
const cols = 8;
const brickPadding = 10;
const brickWidth = canvas.width / cols - brickPadding;
const brickHeight = 25;

let bricks = [];

for (let r = 0; r < rows; r++) {
    bricks[r] = [];
    for (let c = 0; c < cols; c++) {
        bricks[r][c] = {
            x: c * (brickWidth + brickPadding) + 5,
            y: r * (brickHeight + brickPadding) + 40,
            status: 1,
            power: Math.random() < 0.2
        };
    }
}

/* Score */
let score = 0;
let combo = 0;

/* Controls */
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") rightPressed = true;
    if (e.key === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowRight") rightPressed = false;
    if (e.key === "ArrowLeft") leftPressed = false;
});

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left - paddle.width / 2;
});

canvas.addEventListener("touchmove", e => {
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.touches[0].clientX - rect.left - paddle.width / 2;
});

/* Draw */
function drawPaddle() {
    ctx.shadowBlur = 20;
    ctx.shadowColor = "cyan";
    ctx.fillStyle = "cyan";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "magenta";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "magenta";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let b = bricks[r][c];
            if (b.status) {
                ctx.fillStyle = b.power ? "orange" : "lime";
                ctx.shadowBlur = 15;
                ctx.fillRect(b.x, b.y, brickWidth, brickHeight);
            }
        }
    }
}

/* Collision */
function collision() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let b = bricks[r][c];
            if (b.status &&
                ball.x > b.x &&
                ball.x < b.x + brickWidth &&
                ball.y > b.y &&
                ball.y < b.y + brickHeight
            ) {
                ball.dy *= -1;
                b.status = 0;

                combo++;
                score += 10 * combo;

                if (b.power) {
                    paddle.width += 30;
                    setTimeout(() => paddle.width -= 30, 5000);
                }
            }
        }
    }
}

/* Game Loop */
function update() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    collision();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x < 0 || ball.x > canvas.width)
        ball.dx *= -1;

    if (ball.y < 0)
        ball.dy *= -1;

    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy *= -1;
        combo = 0;
    }

    if (ball.y > canvas.height) {
        gameOver();
    }

    function gameOver() {
    gameRunning = false;

    setTimeout(() => {
        alert("Game Over!");

        // Reset paddle
        paddle.width = 120;
        paddle.x = canvas.width / 2 - 60;

        // Reset ball
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 60;
        ball.dx = 4;
        ball.dy = -4;

        // Reset bricks
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                bricks[r][c].status = 1;
            }
        }

        score = 0;
        combo = 0;

        gameRunning = true;
        update();

    }, 100);
}

    if (rightPressed) paddle.x += paddle.speed;
    if (leftPressed) paddle.x -= paddle.speed;

    paddle.x = Math.max(0,
        Math.min(canvas.width - paddle.width, paddle.x)
    );

    document.getElementById("score").innerText =
        "Score: " + score;

    requestAnimationFrame(update);
}

update();
