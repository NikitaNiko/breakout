var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//first ball
var x1 = Math.floor(canvas.width / 2);
var y1 = canvas.height - 80;
var dx1 = 2;
var dy1 = -2;
var ballRarius = 10;

//paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;

//moving
var rightPress = false;
var leftPress = false;

//bricks
var brickRowCount = 3;
var brickColumnCount = 7;
var brickWidth = 70;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var done = 0;

//score
var score = 0;

//lives
var lives = 3;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};

    }
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) { 
            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

            if (bricks[c][r].status == 1) {
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
            }
            else {
                bricks[c][r].x = canvas.width;
                bricks[c][r].y = canvas.height;
            }
            
            ctx.beginPath();
            ctx.rect(bricks[c][r].x, bricks[c][r].y,  brickWidth, brickHeight);
            ctx.fillStyle = "#4102ff";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(bricks[c][r].x, bricks[c][r].y,  brickWidth, brickHeight);
            ctx.strokeStyle = "#ff0048";
            ctx.stroke();
            ctx.closePath();

        }
    }
}


function drawBall() {

    ctx.beginPath();
    ctx.arc(x1, y1, ballRarius, 0, Math.PI * 2, false);
    ctx.fillStyle = "#c0114b";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x1, y1, ballRarius, 0, Math.PI * 2, false);
    ctx.strokeStyle = "#55037b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawPaddle() {

    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#55037b";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.strokeStyle = "#c0114b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}
//DESTROY BRICKS
function destroyBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            //cheking ball's taps at bricks
            var b = bricks[c][r];

            if (x1 >= b.x - ballRarius && x1 <= b.x + brickWidth + ballRarius && y1 >= b.y - ballRarius && y1 <= b.y + brickHeight + ballRarius) {
                if (y1 >= b.y && y1 <= b.y + brickHeight) {
                    dx1 = -dx1;
                }
                else {
                    dy1 = -dy1;
                }
                bricks[c][r].status = 0;
                done++;
                score += 10;
            }
        }

    }

}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.strokeStyle = "#461ca9";
    ctx.strokeText("Score: " + score, 8, 20);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#df0950";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "df0950";
    ctx.fillText(lives + " lives", canvas.width - 80, 20)
}

function isWin() {
    
    alert("You Win!\nScore: " + score);
    document.location.reload();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    destroyBricks();
    drawPaddle();
    drawScore();
    drawLives();
    checking();
    requestAnimationFrame(draw);

function checking() {
    if (done == brickColumnCount * brickRowCount) {
        isWin();
    }
    
    //Checking bariers
    //for ball
    if (x1 + ballRarius > canvas.width || x1 < ballRarius) {
        dx1 = -dx1;
    }
    else if (y1 < ballRarius) {
        dy1 = -dy1;
    }
    else if (canvas.height-(paddleHeight + ballRarius) < y1) {
        //checking bounce at pad (left, middle left, middle right, right).

        //if bounced at left pad's side.
        if (x1 > paddleX && x1 < paddleX + Math.floor(paddleWidth / 2)) {
            //if bounced at just left pad's side.
            if (x1 < paddleX + Math.floor(paddleWidth / 4)) {
                dy1 = -2;
                dx1 = -3;
            }
            //it's for left-middle pad's side.
            else {
                dy1 = -3;
                dx1 = -2;
            }
        }
        //if bounced at right pad's side:
        else if (x1 > paddleX + Math.floor(paddleWidth / 2) && x1 < paddleX	+ paddleWidth) {
            //if ball tap a right pad's side
            if (x1 > paddleX + Math.floor(paddleWidth * 0.75)) {
                dy1 = -2;
                dx1 = 3;
            }
            //if was tap at middle-right pad's side:
            else {
                dy1 = -3;
                dx1 = 2;
            }
        }
        
        else {
            lives--;
            x1 = Math.floor(canvas.width / 2);
            y1 = Math.floor(canvas.height / 2);
            dx1 = 0;
            dy1 = 1;
            paddleX = (canvas.width - paddleWidth) / 2;
        }

        if (!lives) {
            alert("GAME OVER\nScore: " + score);
            document.location.reload();
        }

        if (score > 0) {
            score--;
        }
        
    }

    //for paddle
    if (rightPress && (paddleX + paddleWidth) < canvas.width) {
        paddleX += 4;
    }
    else if (leftPress && (paddleX > 0)) {
        paddleX -= 4;
    }

    x1 += dx1;
    y1 += dy1;
}
}

    //keys and mouse:
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPress = true;
    }
    else if (e.keyCode == 37) {
        leftPress = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPress = false;
    }
    else if (e.keyCode == 37) {
        leftPress = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

draw();