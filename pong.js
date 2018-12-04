var canvas;
var canvasContext;

var ballR = 10; //radius of ball

var ballX = 50; //initial x-coordinate of ball
var ballSpeedX = 5; //horizontal speed of ball

var ballY = 300; //initial y-coordinate of ball
var ballSpeedY = 5; //vertical speed of ball

var paddleLeftY = 250; //initial position of left paddle
var paddleRightY = 250; //initial position of right paddle
const PADDLE_HEIGHT = 100; //height of paddle
const PADDLE_THICK = 20; //thickness of paddle

var leftScore = 0; //left score
var rightScore = 0; //right score

const WINNING_SCORE = 11;
var winScreen = false;

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left;
	var mouseY = evt.clientY - rect.top;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(winScreen) {
		leftScore = 0;
		rightScore = 0;
		winScreen = false;
	}
}

window.onload = function() {
	console.log("Hello World!");
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown',
		handleMouseClick);

	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddleLeftY = mousePos.y - (PADDLE_HEIGHT/2);
		});
};

function ballReset() {
	if(leftScore >= WINNING_SCORE ||
	rightScore >= WINNING_SCORE) {
		winScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballSpeedY = 5; //initialise vert. speed of ball
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovement() {
	var paddleRightC = paddleRightY + (PADDLE_HEIGHT/2); //center of right paddle
	if(paddleRightC < ballY-35) { //stops when ball is 35 pxls from C
		paddleRightY += 6;
	} else if(paddleRightC > ballY+35) { //stops when ball is 35 pxls from C
		paddleRightY -= 6;
	}
}

function moveEverything() {
	//checks is a player won
	if(winScreen) {
		return;
	}

	//movement of right paddle
	computerMovement();

	//x-axis motion
	ballX = ballX + ballSpeedX;
	
	if(ballX + ballR > canvas.width - PADDLE_THICK) { //ball passes right paddle
		if(ballY > paddleRightY &&
		ballY < (paddleRightY + PADDLE_HEIGHT)) {
			ballSpeedX =-ballSpeedX;

			var deltaY = ballY
				-(paddleRightY + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.4;
		} else {
			leftScore++; //before resetting
			ballReset();
		}
	}
	
	if(ballX - ballR < 0 + PADDLE_THICK) { //ball passes left paddle
		if(ballY > paddleLeftY && 
		ballY < (paddleLeftY + PADDLE_HEIGHT)) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY
				-(paddleLeftY + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.4;
		} else {
			rightScore++; //before resetting
			ballReset();
		}
	}

	//y-axis motion, ball bounces off up/down walls
	ballY = ballY + ballSpeedY;
	if(ballY - ballR < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY + ballR > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function colorCircle(color,centerX,centerY,radius) {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
	canvasContext.fill();
}

function colorRect(color,leftX,topY,width,height) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(leftX,topY,width,height)
}

function drawNet() {
	for(var i=0;i<canvas.height;i+=40) {
		colorRect('white',canvas.width/2 - 1,i,2,20);
	}
}

function drawEverything() {
	//background
	colorRect('black',0,0,canvas.width,canvas.height);

	//if a player won
	if(winScreen) {
		canvasContext.fillStyle = 'white';
		canvasContext.font = '20px Verdana';
		var width = canvasContext.measureText
		if(leftScore >= WINNING_SCORE) {
			canvasContext.fillText("Left Player Won!",250,200);
		} else if (rightScore >= WINNING_SCORE) {
			canvasContext.fillText("Right Player Won!",250,200);
		}

		canvasContext.fillText("Click to continue",250,400);
		return;
	}

	//net
	drawNet();

	//score region
	colorRect('grey',PADDLE_THICK,0,1,canvas.height);
	colorRect('grey',canvas.width - PADDLE_THICK,0,1,canvas.height);
	
	//left paddle
	colorRect('white',0,paddleLeftY,PADDLE_THICK,PADDLE_HEIGHT);

	//right paddle
	colorRect('white',canvas.width-PADDLE_THICK,paddleRightY,PADDLE_THICK,PADDLE_HEIGHT);
	
	//ball
	colorCircle('blue',ballX,ballY,ballR);

	//scoring system
	canvasContext.fillStyle = 'white';
	canvasContext.font = '20px Verdana';
	canvasContext.fillText(leftScore,100,100);
	canvasContext.fillText(rightScore,canvas.width-100,100);
}