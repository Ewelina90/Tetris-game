import { Z } from './shapes.js';
import { S } from './shapes.js';
import { J } from './shapes.js';
import { L } from './shapes.js';
import { O } from './shapes.js';
import { I } from './shapes.js';
import { T } from './shapes.js';

const config = {
    apiKey: "AIzaSyC7T5R2opJNWtT6-fQ-KXcI8PRxGLwfnt0",
    databaseURL: "https://tetris-555a0.firebaseio.com",
};
const app = firebase.initializeApp(config);

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
    const nOfRowsNext = 4;
    const nOfColNext = 4;

    canvasNext.width = nOfRowsNext * sizeOfTile;
    canvasNext.height = nOfColNext * sizeOfTile;

    // Information displays on gamepad screen
    const startPage = document.querySelector('.start-game-info');
    const playBtn = document.querySelector('.play-btn');
	const playerName = document.querySelector('#player-name span');
	// const gameTime = document.querySelector('#game-time span');
    const score = document.getElementById('score');
    const gameLevel = document.getElementById('level');

    // GamePad buttons
    const leftBtn = document.querySelector('.arrow-buttons .left-btn');
    const rightBtn = document.querySelector('.arrow-buttons .right-btn');
    const downBtn = document.querySelector('.arrow-buttons .down-btn');
    const rotateBtn = document.querySelector('.rotate-btn button');
    const soundBtn = document.querySelector('.sound-btn');
    const pauseBtn = document.querySelector('.pause-btn');

    // Sounds
    const tetrisMusic = new Audio('./sounds/Tetris.mp3');
    const touchDownMusic = new Audio('./sounds/SFX_PieceTouchDown.ogg');
    const moveLRMusic = new Audio('./sounds/SFX_PieceMoveLR.ogg');
    const rotateLRMusic = new Audio('./sounds/SFX_PieceRotateLR.ogg');
    const lineClearMusic = new Audio('./sounds/SFX_SpecialLineClearTriple.ogg');

    let animationFrameId = 0;
    let pause = false;
    let musicOn = true;

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


    const countTime = (a = 0,b = 0) => { 		// Start counting game time
		const min = document.querySelector('#minutes');
		const sec = document.querySelector('#seconds');
		let minutes = a;
		let seconds = b;
		timerId = setInterval(function(){
			seconds++;
			if (seconds < 10){
				 sec.innerText = ('0' + seconds);
			}
			else if( seconds > 59 ){
				seconds = 0;
				sec.innerText = ('0' + seconds);
				minutes++;
				if( minutes < 10 ){
				  min.innerText = ('0' + minutes);
				  }
				  else if( minutes > 59 ){
					//   gameOver();
				  }else{ min.innerText = minutes; }
			}else{ sec.innerText = seconds; }
		}, 1000);
	};

    const playTheGame = () => {
        startPage.style.display = "none";
        if(gameOn === false){
            // const setName = prompt('Type your name: ');
    		// if(setName === null){
    		// 	return;
    		// }else{
            //     playerName.innerText = setName;
                gameOn = true;
                tetrisMusic.pause();
            // }
        }else {
            const newGame = confirm('Are you sure you want to start a new game?');
            if(newGame === true){
                clearInterval(timerId);
                cancelAnimationFrame(animationFrameId);
                singleRow = 0;
                level = 1;
                done = false;
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
		currentShape = arrOfShapes[0];
        nextShape = arrOfShapes[1];
	    drawBoard();
        drawBoardOnNext();
		startGame();
    }

	playBtn.addEventListener('click',function(e){				// Btn play - starts the game
        playTheGame();

	});
    playBtn.addEventListener('mouseup',function(e){
        this.blur();
    });

    // tetrisMusic.play();

    soundBtn.addEventListener('click',function(e){
        const icon = this.firstElementChild.classList;
        if(musicOn){
            tetrisMusic.pause();
            musicOn = false;
            icon.remove("fa-volume-up");
            icon.add("fa-volume-off");
        }else if(gameOn){
            tetrisMusic.pause();
            musicOn = true;
            icon.remove("fa-volume-off");
            icon.add("fa-volume-up");
        }else{
            tetrisMusic.play();
            musicOn = true;
            icon.remove("fa-volume-off");
            icon.add("fa-volume-up");
        }
    });
    soundBtn.addEventListener('mouseup',function(e){
        this.blur();
    });

    pauseBtn.addEventListener('click',function(e){
        const min = document.querySelector('#minutes');
		const sec = document.querySelector('#seconds');
		let a = parseInt(min.textContent);
		let b = parseInt(sec.textContent);
        if(pause){
            pause = false;
            countTime(a,b);
            startGame();
        }else{
            cancelAnimationFrame(animationFrameId);
            clearInterval(timerId);
            pause = true;
        }
    });
    pauseBtn.addEventListener('mouseup',function(e){
        this.blur();
    });

    document.body.addEventListener("keydown", function (e) {
		e.preventDefault();
		switch (e.keyCode) {
			case 38:					// up
                if(musicOn){
                    rotateLRMusic.play();
                }
				currentShape.rotate();
				break;
			case 40:					// down
                if(musicOn){
                    moveLRMusic.play();
                }
                currentShape.moveDown();
				break;
			case 37:					// left
                if(musicOn){
                    moveLRMusic.play();
                }
				currentShape.moveLeft();
				break;
			case 39:					// right
                if(musicOn){
                    moveLRMusic.play();
                }
                currentShape.moveRight();
                break;
            case 32:                    // space
                playTheGame();
			default:
		};
	});

    leftBtn.addEventListener("click", function(e){
        currentShape.moveLeft();
    });
    leftBtn.addEventListener('mouseup',function(e){
        this.blur();
    });
    rightBtn.addEventListener("click", function(e){
        currentShape.moveRight();
    });
    rightBtn.addEventListener('mouseup',function(e){
        this.blur();
    });
    downBtn.addEventListener("click", function(e){
        currentShape.moveDown();
    });
    downBtn.addEventListener('mouseup',function(e){
        this.blur();
    });
    rotateBtn.addEventListener("click", function(e){
        currentShape.rotate();
    });
    rotateBtn.addEventListener('mouseup',function(e){
        this.blur();
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
			animationFrameId = requestAnimationFrame(startGame);
		}
	};

    const gameOver = () => {
        // alert("Game Over!"); // Game over!
        done = true;
        clearInterval(timerId);
        const players = app.database().ref('players');

        const sortable = [];
        players.once("value", function(data) {
            let dane = data.val();
            for (const key of Object.keys(dane)) {
                sortable.push([dane[key].imie, dane[key].punkty]);
            }
        }, function (error) {
            console.log("Error: " + error.code);
        });

        // sortable.sort(function(a, b) {
        //     return b[1] - a[1];
        // });
        console.log(sortable);
        console.log(sortable["0"]);
        // let obiekt = {
        //     imie: "Ola",
        //     punkty: 380
        // };
    }

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
						if (board[y][x] !== false) {
                            if(musicOn){
                                touchDownMusic.play();
                            }
                            return hitBlock;
                        }
					}
					continue;
				}
			}
			return 0;
		};

		moveDown(){
			if (this.detectColision(0, 1, this.firstShape)) {
                if(musicOn){
                    touchDownMusic.play();
                }
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
            if(!done){
    			for (let i = 0; i < this.firstShape.length; i++) {
    				for (let j = 0; j < this.firstShape.length; j++) {
    					if (this.y + j < 0) {
    		                gameOver();
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
                    if(musicOn){
                        lineClearMusic.play();
                    }
    				drawBoard();
    				score.textContent = singleRow;
    			}
                gameLevel.textContent = level;
            }
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
