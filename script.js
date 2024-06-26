window.onload = function () {


let gameBoard;
let snake;
let moveDirection = 'right';
let gameExecutor;
let gameSpeed=100;
let roundNum = 1;

let eatenItemsCount =0;
let MAX_FOOD_ITEMS = 12;

	const startButton = document.getElementById("start-button");
	const restartButton = document.getElementById("restart-button");
	const startScreen = document.getElementById("start-screen");
	const gameScreen = document.getElementById("game");
	startButton.addEventListener("click", function () {
	 startScreen.style.display = "none" ;
	 gameScreen.style.display = "block";
	});

//actual field size(400px) divided by corresponding bodypart size(8px)
let gameFieldRelativeWidth = 50;
let gameFieldRelativeHeight = 50;

//width and height of snake body element
let snakeElementWidth = 8;
let snakeElementHeight = 8;

//game keys
let ESC = 27;
let SPACE = 32;
let LEFT_ARROW = 37;
let UP_ARROW = 38;
let RIGHT_ARROW = 39;
let DOWN_ARROW = 40;

let food;

$(document).ready(function() {
    $('body').keydown(keyPressedHandler);
});

function move() {
	generateFood();
	snake.move(moveDirection);
	
	if(snake.holdsPosition(food.xPos,food.yPos))
		eatFood();
		
	drawSnake();
};

function keyPressedHandler(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	
	switch(code) {
		case LEFT_ARROW:
			moveDirection = 'left';
			break;
		case UP_ARROW:
			moveDirection = 'up';
			break;
		case RIGHT_ARROW:
			moveDirection = 'right';
			break;
		case DOWN_ARROW:
			moveDirection = 'down';
			break;
		case SPACE:
			startGame();
			break;
		case ESC:
			endGame();
			break;
	}
 }

function startGame() {
    //this.startScreen.style.display = "none";
    //this.gameScreen.style.display = "block";
	
	gameBoard = new GameBoard();
	moveDirection = 'right';
	eatenItemsCount = 0;
	roundNum = 1;
	gameSpeed=100;
	endGame();
	gameBoard.clearGameInfo();

	
	snake = new Snake(80,80);
	snake.onCrash(snakeCrashHandler,{xPos:400,yPos:400});
	drawSnake();
	gameExecutor = setInterval(move,gameSpeed);
};
function endGame() {
	if(gameExecutor)
		clearInterval(gameExecutor);
	
	gameBoard.clearBoard();
};

function drawSnake() {
	gameBoard.removeSnakeBody();
	
	//draw the new snake
	var snakeBody = snake.getBody();
	
	for(var i=0; i<snakeBody.length; i++){
		gameBoard.drawElement('bodypart',snakeBody[i].xPos,snakeBody[i].yPos);
	}
};

function generateFood() {
	if(gameBoard.hasNoCreatedFood()){
		do{
			xpos = Math.floor(Math.random() * gameFieldRelativeWidth) * snakeElementWidth;
			ypos = Math.floor(Math.random() * gameFieldRelativeHeight)* snakeElementHeight;
		}
		while(snake.holdsPosition(xpos,ypos));
		food = {xPos:xpos,yPos:ypos};
		gameBoard.drawElement('food',xpos,ypos);
	}
};

function eatFood() {
	snake.eatFood();
	gameBoard.removeSnakeFood();
	
	eatenItemsCount++;
	if(eatenItemsCount >= MAX_FOOD_ITEMS)
		startNextRound();
	
	gameBoard.updateScore(roundNum);
};

function snakeCrashHandler() {
	endGame();
	gameBoard.showLoseMessage();
};

function startNextRound() {
	roundNum++;
	eatenItemsCount = 0;
	gameBoard.showNextRoundMsg();
	gameSpeed = Math.floor(gameSpeed * 0.8);
	clearInterval(gameExecutor);
	gameExecutor = setInterval(move,gameSpeed);
};

}

