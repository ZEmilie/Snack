document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const gridSize = 20;
    const tileCount = 20;
    const speeds = [400,200,100,50];

    let speedIndex = 1;
    let snake = [{ x: 10, y: 10 }];
    let dx = 0, dy = 0;
    let foodX, foodY;
    let score = 0;
    let isPaused = false;
    let gameInterval;

    function clearCanvas() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    function drawSnake() {
        snake.forEach(function(snakePart, index) {
            if (index===0) drawSnakePart(snakePart,"#1dc06a");
            else drawSnakePart(snakePart,"#a1e876");
        });
    }
    
    function drawSnakePart(snakePart, color) {
        ctx.fillStyle = color;
        ctx.fillRect(snakePart.x*gridSize,snakePart.y*gridSize,gridSize,gridSize);
    }

    function drawFood() {
        ctx.fillStyle = "#ff414a";
        const radius = gridSize/2;
        const centerX = (foodX*gridSize)+radius;
        const centerY = (foodY*gridSize)+radius;
        ctx.beginPath();
        ctx.arc(centerX,centerY,radius,0,Math.PI*2);
        ctx.fill();
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random()*(max-min))+min;
    }

    function createFood() {
        foodX = getRandomInt(0, tileCount);
        foodY = getRandomInt(0, tileCount);
        snake.forEach(function (part) {
            if (part.x===foodX && part.y===foodY) {
                createFood();
            }
        });
    }

    function checkCollision() {
        if (snake[0].x<0 || snake[0].x>=tileCount || snake[0].y<0 || snake[0].y>=tileCount) {
            return true;
        }
        for (let i=1; i<snake.length; i++) {
            if (snake[i].x===snake[0].x && snake[i].y===snake[0].y) {
                return true;
            }
        }
        return false;
    }

    function updateScore() {
        score++;
        document.getElementById("score").innerText = "Score: "+score;
    }

    function togglePause() {
        if (isPaused) {
            gameInterval = setInterval(gameLoop,speeds[speedIndex]);
            document.getElementById("pause-button").innerHTML = '<img src="img/pause.png" alt="Pause">';
        } else {
            clearInterval(gameInterval);
            document.getElementById("pause-button").innerHTML = '<img src="img/play.png" alt="Play">';
        }
        isPaused = !isPaused;
    }

    function changeSpeed(change) {
        speedIndex += change;
        if (speedIndex<0) speedIndex = 0;
        else if (speedIndex>=speeds.length) speedIndex += -1;
        if (!isPaused) {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop,speeds[speedIndex]);
        }
        document.getElementById("speed").innerText = "Speed: "+(speedIndex+1);
        showMessage("Speed changed to: "+speeds[speedIndex]+"ms");
    }

    function showMessage(message) {
        const messageDiv = document.getElementById("message");
        messageDiv.textContent = message;
        messageDiv.style.display = "block";
        setTimeout(function() { messageDiv.style.display = "none"; }, 2000);
    }

    function gameLoop() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        if (checkCollision()) {
            clearInterval(gameInterval);
            alert("Game Over! Your Score: "+score);
            window.location.reload();
        }
    }

    function moveSnake() {
        const head = { x: snake[0].x+dx, y: snake[0].y+dy };
        snake.unshift(head);
        if (head.x===foodX && head.y===foodY) {
            updateScore();
            createFood();
        } else snake.pop();
    }

    createFood();
    gameInterval = setInterval(gameLoop, 100);

    document.addEventListener("keydown", function (event) {
        const keyPressed = event.key;
        if (keyPressed==="ArrowUp" && dy===0) {
            dx = 0;
            dy = -1;
        } else if (keyPressed==="ArrowDown" && dy===0) {
            dx = 0;
            dy = 1;
        } else if (keyPressed==="ArrowLeft" && dx===0) {
            dx = -1;
            dy = 0;
        } else if (keyPressed==="ArrowRight" && dx===0) {
            dx = 1;
            dy = 0;
        }
    });

    document.getElementById("pause-button").addEventListener("click", togglePause);
    document.addEventListener("keydown", function(event) {
        if (event.code==="Space") {
            togglePause();
            event.preventDefault();
        }
    });

    document.getElementById("fast-button").addEventListener("click", function() { changeSpeed(1); });
    document.getElementById("slow-button").addEventListener("click", function() { changeSpeed(-1); });

});
