var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var gameover = true;
var high = false;
var paused = false;

var ballRadius = 10;

var x = canvas.width/2;
var y = canvas.height-30;

var brickRowCount = 18;
var brickColumnCount = 11;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding =5 ;
var brickOffsetTop = 25;
var brickOffsetLeft = 42.5;

var bricks = [];
for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 ,status: 1};
    }
}
var absoluteSpeed = 2*1.41;
var dx = 0;
var dy = -absoluteSpeed;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;
var slow = false;
var speedUp = false;
var paddSpeed = 7;

var lastColidded = false;
var timer = 2;
var paddleMoveTime = 0;

var start = false;
var lives = 3;

var collisionBox = 10;

function brokeBlocks(){
    var brokenBlocks=0;
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status==0) brokenBlocks++;
        }
    }
    return brokenBlocks;
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "darkred";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+brokeBlocks(), 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall(X=x,Y=y){
/*    X=x
    Y=y*/
    ctx.beginPath();
    ctx.arc(X, Y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    x=X;
    y=Y;
}

function computeMaxMoveTime (padSpeed) {
    var result;
    if(padSpeed>0){
        result = padSpeed*2.85714;
    }
    else if(padSpeed<0){
        result = -padSpeed*2.85714;
    }
    return result;
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var maxMoveTime = computeMaxMoveTime(paddSpeed);

    if(brokeBlocks()==(brickRowCount*brickColumnCount)){    //checkIfWon();?
        if(timer==0){
            alert("AYY HARAMBA!!!. YOU WON!");
            document.location.reload();
        } else {
            timer--;                    //here setter and getter;
        }
    }

    drawScore();
    drawPaddle();
    drawBricks();
    collisionDetection();
    if (start === false) {
        drawBall((paddleX+(paddleWidth/2)), (canvas.height-paddleHeight-ballRadius));
        absoluteSpeed=paddSpeed/2;
        if(rightPressed){
            dx=absoluteSpeed*paddleMoveTime/maxMoveTime;
        }
        else if(leftPressed){
            dx=-absoluteSpeed*paddleMoveTime/maxMoveTime;
        }
        if(dx>absoluteSpeed*0.99) dx=absoluteSpeed*0.99;
        else if(dx<-absoluteSpeed*0.99) dx=-absoluteSpeed*0.99;
        dy=-Math.sqrt((absoluteSpeed*absoluteSpeed)-(dx*dx));

    }                   //kurwa co
    else{
        drawBall();
    }

    drawScore();
    drawLives();

    if (paused === false) {

        if(y + dy < ballRadius){
            dy = -dy;
        }
        else if(y + dy > (canvas.height+ballRadius)){
            if(lives>0){
                lives--;
                start=false;
            }
            else {
                alert("FAIL \n You have broke "+brokeBlocks()+" out of "+(brickRowCount*brickColumnCount)+" possible bricks.");
                document.location.reload();
            }
        }
        else if(y + dy > canvas.height - ballRadius-paddleHeight+2){
            if(x >paddleX && x < paddleX+paddleWidth){
                lastColidded=false;
                if(absoluteSpeed<4.7)  absoluteSpeed+=0.3;
                if(dx==0){
                    if(rightPressed){
                        dx=dx+absoluteSpeed*paddleMoveTime/maxMoveTime/2;
                    }
                    else if(leftPressed){
                        dx=dx-absoluteSpeed*paddleMoveTime/maxMoveTime/2;
                    }
                }
                else if(dx>0){
                    dx=dx+absoluteSpeed*paddleMoveTime/maxMoveTime/2;
                }
                else if(dx<0){
                    dx=dx-absoluteSpeed*paddleMoveTime/maxMoveTime/2;
                }
                if(dx>absoluteSpeed*0.99) dx=absoluteSpeed*0.99;
                else if(dx<-absoluteSpeed*0.99) dx=-absoluteSpeed*0.99;

                dx=dx*0.9
                dy=-Math.sqrt((absoluteSpeed*absoluteSpeed)-(dx*dx));
            }
        }

        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
            dx = -dx;
        }

        x += dx;
        y += dy;
        if(slow) paddSpeed  = 4;
        else if(speedUp) paddSpeed =10;
        else paddSpeed = 7;


        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += paddSpeed;
            if(paddleMoveTime<maxMoveTime){
                paddleMoveTime++;
            }
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= paddSpeed;
            if(paddleMoveTime<maxMoveTime){
                paddleMoveTime++;
            }
        }
        else{
            paddleMoveTime=0;
        }
    }                   // nawet nie pytam...

    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    if(e.keyCode == 65){
        slow= true;
    }
    if(e.keyCode == 68){
        speedUp = true;
    }
    if(e.keyCode == 32){
        start = true;
        console.log(absoluteSpeed);
    }
    if(e.keyCode == 187){
        absoluteSpeed += 0.1;
    }
    if(e.keyCode == 80){
        if(paused) paused=false;
        else paused=true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    if(e.keyCode == 65){
        slow= false;
    }
    if(e.keyCode == 68){
        speedUp = false;
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status ==1){
                if(x > b.x-collisionBox && x < b.x+brickWidth+collisionBox && y > b.y-collisionBox && y < b.y+brickHeight+collisionBox) {
                    //top and bottom
                    if(((y>= b.y-collisionBox && y <= b.y) || (y >= b.y+brickHeight && y <= b.y+brickHeight+collisionBox )) && (x>b.x && x<b.x+brickWidth)){
                        dy=-dy;
                        b.status =0;
                    }
                    //left and right
                    else if(((x>= b.x-collisionBox && x <= b.x ) || (x >= b.x+brickWidth && y <= b.x+brickWidth+collisionBox )) && (y>b.y && y<b.y+brickHeight)){
                        dx=-dx;
                        b.status =0;
                    }
                    //inside
                    else if(x>b.x && x< b.x+brickWidth && y>b.y && y<b.y+brickHeight){
                        dy=-dy;
                        b.status =0;
                    }
                    if(lastColidded == true && absoluteSpeed<4.7){
                        absoluteSpeed+=0.05;
                    }
                    lastColidded=true;
                }
            }
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

draw();