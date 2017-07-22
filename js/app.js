import { Z } from './shapes.js';
import { S } from './shapes.js';
import { J } from './shapes.js';
import { L } from './shapes.js';
import { O } from './shapes.js';
import { I } from './shapes.js';
import { T } from './shapes.js';

document.addEventListener("DOMContentLoaded",function(){
    const canvas = document.getElementById('canvas-main');
	const ctx = canvas.getContext("2d");
	const clear = '#97b289';
	const numberOfRows = 10;
	const numberOfColumns = 20;
	const sizeOfTile = 15;

    canvas.width = numberOfRows * sizeOfTile;
	canvas.height = numberOfColumns * sizeOfTile;

    const canvasNext = document.getElementById('canvas-next');
    const ctxNext = canvasNext.getContext("2d");
    const nOfRowsNext = 6;
    const nOfColNext = 6;

    canvasNext.width = nOfRowsNext * sizeOfTile;
    canvasNext.height = nOfColNext * sizeOfTile;

    const $playBtn = $('.play-btn');
	const $playerName = $('#player-name span');
	const $gameTime = $('#game-time span');
    const score = document.getElementById('score');
    const gameLevel = document.getElementById('level');
    const leftBtn = document.querySelector('.arrow-buttons .left-btn');
    const rightBtn = document.querySelector('.arrow-buttons .right-btn');
    const downBtn = document.querySelector('.arrow-buttons .down-btn');
    const rotateBtn = document.querySelector('.rotate-btn button');

    let hitWall = 1;
	let hitBlock = 2;
	let singleRow = 0;
	let done = false;
    let timerId = 0;

    const shapes = [[I, "#0ff"],[J, "#a0f"],[L, "#ffa500"],[O, "#0000ff"],[S, "#f00"],[T, "#0f0"],[Z, "#ff0"]];

    let arrOfShapes = ['',''];
    let currentShape = null;
    let nextShape = null;
	let setStart = Date.now();
    let gameSpeed = 500;
    let level = 1;
    let board = [];
    let boardNext = [];
    let gameOn = false;


    const countTime = () => { 		// Start counting game time
		const $min = $('#minutes');
		const $sec = $('#seconds');
		let minutes = 0;
		let seconds = 0;
		timerId = setInterval(function(){
			seconds++;
			if (seconds < 10){
				 $sec.text('0' + seconds);
			}
			else if( seconds > 59 ){
				seconds = 0;
				$sec.text('0' + seconds);
				minutes++;
				if( minutes < 10 ){
				  $min.text('0' + minutes);
				  }
				  else if( minutes > 59 ){
					  const timeout = alert('Game over!');
				  }else{ $min.text(minutes); }
			}else{ $sec.text(seconds); }
		}, 1000);
	};

	$playBtn.on('click',function(e){				// Btn play - starts the game
        if(gameOn === false){
            const $setName = prompt('Type your name: ');
    		if($setName === null){
    			return;
    		}else{
                $playerName.text($setName);
                gameOn = true;
            }
        }else {
            const $newGame = confirm('Are you sure you want to start a new game?');
            if($newGame === true){
                clearInterval(timerId);
                singleRow = 0;
                level = 1;
                score.textContent = singleRow;
                gameLevel.textContent = level;

                board = [];
                boardNext = [];
            }else{
                return;
            }
        }

        for (let i = 0; i < numberOfColumns; i++) { // Create game-board
    		board[i] = [];
    		for (let j = 0; j < numberOfRows; j++) {
    			board[i][j] = false;
    		}
    	}

        for (let i = 0; i < nOfColNext; i++) {  	// Create board for next canvas
    		boardNext[i] = [];
    		for (let j = 0; j < nOfRowsNext; j++) {
    			boardNext[i][j] = false;
    		}
    	}
		countTime();
        arrOfShapes[0] = newShape();
        arrOfShapes[1] = newShape();
            // console.log(arrOfShapes);
		currentShape = arrOfShapes[0];
        nextShape = arrOfShapes[1];
	    drawBoard();
        drawBoardOnNext();
		startGame();

	});

    document.body.addEventListener("keydown", function (e) {
		e.preventDefault();
		switch (e.keyCode) {
			case 38:					// up
				currentShape.rotate();
				break;
			case 40:					// down
				currentShape.moveDown();
				break;
			case 37:					// left
				currentShape.moveLeft();
				break;
			case 39:					// right
				currentShape.moveRight();
			default:
		};
	});

    leftBtn.addEventListener("click", function(e){
        currentShape.moveLeft();
    });
    rightBtn.addEventListener("click", function(e){
        currentShape.moveRight();
    });
    downBtn.addEventListener("click", function(e){
        currentShape.moveDown();
    });
    rotateBtn.addEventListener("click", function(e){
        currentShape.rotate();
    });

    const newShape = () => {					// Get random shape
		let randonShape = shapes[parseInt(Math.random() * shapes.length, 10)];
		return new Shape(randonShape[0], randonShape[1]);
	}

    const startGame = () => {			// game loop
		let now = Date.now();
		let timer = now - setStart;
		if (timer > gameSpeed) {
			currentShape.moveDown();
            nextShape.drawOnBoardNext();
			setStart = now;
		}
		if (!done) {
			requestAnimationFrame(startGame);
		}
	};

    const drawPoint = (x, y) => {					// Drow single square on game-board
		ctx.fillRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		let style = ctx.strokeStyle;
        let fillstyle = ctx.fillStyle;
		ctx.strokeStyle = "#5d5c5c";
		ctx.strokeRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
        ctx.fillStyle = "rgba(105, 111, 102, 0.3)";
        ctx.fillRect(x * sizeOfTile + 2*sizeOfTile/8, y * sizeOfTile + 2*sizeOfTile/8, sizeOfTile/2, sizeOfTile/2);
        ctx.fillStyle = fillstyle;
        ctx.strokeStyle = style;
	}

    const drawPointOnNext = (x, y) => {					// Drow single square on next block board
		ctxNext.fillRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		let style = ctxNext.strokeStyle;
		ctxNext.strokeStyle = "#5d5c5c";
		ctxNext.strokeRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		ctxNext.strokeStyle = style;
	}


	const drawBoard = () => {			// drow board on first canvas
		let backCol = ctx.fillStyle;
		for (let i = 0; i < numberOfColumns; i++) {
			for (let j = 0; j < numberOfRows; j++) {
				ctx.fillStyle = board[i][j] || clear;
				drawPoint(j, i, sizeOfTile, sizeOfTile);
			}
		}
		ctx.fillStyle = backCol;
	}

    const drawBoardOnNext = () => {			// drow board on next canvas
		let backCol = ctxNext.fillStyle;
		for (let i = 0; i < nOfColNext; i++) {
			for (let j = 0; j < nOfRowsNext; j++) {
				ctxNext.fillStyle = boardNext[i][j] || clear;
				drawPointOnNext(j, i, sizeOfTile, sizeOfTile);
			}
		}
		ctxNext.fillStyle = backCol;
	}

    class Shape {
		constructor(shapesArr, color) { 			// Class Shape
			this.shapesArr = shapesArr;
			this.firstShape = shapesArr[0];
			this.currIndex = 0;
			this.color = color;
			this.x = numberOfRows/2 - parseInt(Math.ceil(this.firstShape.length/2), 10);
			this.y = -2;
            this.xNext = nOfColNext/2 - parseInt(Math.ceil(this.firstShape.length/2), 10);
            this.yNext = nOfColNext/2 - parseInt(Math.ceil(this.firstShape.length/2), 10);
		}

		rotate(){
			let sticky = 0;
			let nextPattern = this.shapesArr[(this.currIndex + 1) % this.shapesArr.length];

			if (this.detectColision(0, 0, nextPattern)) {
				if(this.x > (numberOfRows / 2)){
					sticky = -1;
				}else{
					sticky = 1;
				}
			}

			if (!this.detectColision(sticky, 0, nextPattern)) {
				this.clearPoint();
				this.x += sticky;
				this.currIndex = (this.currIndex + 1) % this.shapesArr.length;
				this.firstShape = this.shapesArr[this.currIndex];
				this.drawOnBoard();
			}
		};

		detectColision(xMove, yMove, sh){  // Check for colision with walls and blocks
			for (let i = 0; i < sh.length; i++) {
				for (let j = 0; j < sh.length; j++) {
					if (sh[i][j]) {
						let x = this.x + i + xMove;
						let y = this.y + j + yMove;
						if (y >= numberOfColumns || x < 0 || x >= numberOfRows) {
							return hitWall;
						}
						if (y < 0) { continue; }
						if (board[y][x] !== false) { return hitBlock; }
					}
					continue;
				}
			}
			return 0;
		};

		moveDown(){
			if (this.detectColision(0, 1, this.firstShape)) {
				this.stopMove();
                arrOfShapes[0] = arrOfShapes[1];
                arrOfShapes[1] = newShape();
				currentShape = arrOfShapes[0];
                drawBoardOnNext();
                nextShape = arrOfShapes[1];

			} else {
				this.clearPoint();
				this.y += 1 ;
				this.drawOnBoard();
			}
		};

		moveRight(){
			if (!this.detectColision(1, 0, this.firstShape)) {
				this.clearPoint();
				this.x += 1;
				this.drawOnBoard();
			}
		};

		moveLeft(){
			if (!this.detectColision(-1, 0, this.firstShape)) {
				this.clearPoint();
				this.x -= 1;
				this.drawOnBoard();
			}
		};

		stopMove(){                   // Stops shape moving
			for (let i = 0; i < this.firstShape.length; i++) {
				for (let j = 0; j < this.firstShape.length; j++) {
					if (this.y + j < 0) {
						alert("Game Over!"); // Game over!
						done = true;
						clearInterval(timerId);
						return;
					}
					if (!this.firstShape[i][j]) {
						continue;
					}
					board[this.y + j][this.x + i] = this.color;
				}
			}
			let fullRow = 0; // Remove full row and add points
			for (let i = 0; i < numberOfColumns; i++) {
				let singleRow = true;
				for (let j = 0; j < numberOfRows; j++) {
					singleRow = singleRow && board[i][j] !== false;
				}
				if (singleRow) {
					for (let i2 = i; i2 > 1; i2--) {
						for (let j = 0; j < numberOfRows; j++) {
							board[i2][j] = board[i2-1][j];
						}
					}
					for (let i = 0; i < numberOfRows; i++) {
						board[0][i] = false;
					}
					fullRow++;
				}
			}

			if (fullRow > 0) {
				singleRow += fullRow * 10;
                if(singleRow%50 === 0){
                    if(gameSpeed === 150){
                        gameSpeed = 150;
                        level;
                    }else{
                        gameSpeed -= 50;
                        level += 1;
                    }
                }else{
                    level;
                }
				drawBoard();
				score.textContent = singleRow;
			}
            gameLevel.textContent = level;
		};

		clearPoint(){		// Clear color
			let backCol = ctx.fillStyle;
			ctx.fillStyle = clear;
			let x = this.x;
			let y = this.y;
			let numberOfBlocks = this.firstShape.length;
			for (let ix = 0; ix < numberOfBlocks; ix++) {
				for (let iy = 0; iy < numberOfBlocks; iy++) {
					if (this.firstShape[ix][iy]) {
						drawPoint(x + ix, y + iy);
					}
				}
			}
			ctx.fillStyle = backCol;
		};

		drawOnBoard(){
			let backCol = ctx.fillStyle;
			ctx.fillStyle = this.color;
			let x = this.x;
			let y = this.y;
			let numberOfBlocks = this.firstShape.length;
			for (let ix = 0; ix < numberOfBlocks; ix++) {
				for (let iy = 0; iy < numberOfBlocks; iy++) {
					if (this.firstShape[ix][iy]) {
						drawPoint(x + ix, y + iy);
					}
				}
			}
			ctx.fillStyle = backCol;
		};

        drawOnBoardNext(){
            let x = this.xNext;
			let y = this.yNext;
            let numberOfBlocks = this.firstShape.length;
            for (let ix = 0; ix < numberOfBlocks; ix++) {
                for (let iy = 0; iy < numberOfBlocks; iy++) {
                    if (this.firstShape[ix][iy]) {
                        ctxNext.fillStyle = this.color;
                        drawPointOnNext(x + ix, y + iy);
                    }
                }
            }
        }
	};
});
