document.addEventListener("DOMContentLoaded",function(){
    const canvas = document.getElementById('canvas-main');
	const ctx = canvas.getContext("2d");
	const score = document.getElementById('score');
	const clear = '#818c90';
	const numberOfRows = 12;
	const numberOfColumns = 20;
	const sizeOfTile = 24;

    canvas.width = numberOfRows * sizeOfTile;
	canvas.height = numberOfColumns * sizeOfTile;

    const $playBtn = $('.play-btn');
	const $playerName = $('#player-name span');
	const $gameTime = $('#game-time span');

    let board = [];								// Create game-board, fill in with empty strings
	for (let i = 0; i < numberOfColumns; i++) {
		board[i] = [];
		for (let j = 0; j < numberOfRows; j++) {
			board[i][j] = false;
		}
	}

    const drawPoint = (x, y) => {					// Drow single square on game-board
		ctx.fillRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		let style = ctx.strokeStyle;
		ctx.strokeStyle = "#5d5c5c";
		ctx.strokeRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		ctx.strokeStyle = style;
	}

	const drawBoard = () => {			// drow shapes on board
		let backCol = ctx.fillStyle;
		for (let i = 0; i < numberOfColumns; i++) {
			for (let j = 0; j < numberOfRows; j++) {
				ctx.fillStyle = board[i][j] || clear;
				drawPoint(j, i, sizeOfTile, sizeOfTile);
			}
		}
		ctx.fillStyle = backCol;
	}

    class Shape {
		constructor(shapesArr, color) { 			// Class Shape
			this.shapesArr = shapesArr;
			this.firstShape = shapesArr[0];
			this.currIndex = 0;
			this.color = color;
			this.x = numberOfRows/2-parseInt(Math.ceil(this.firstShape.length/2), 10);
			this.y = -2;
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
				currentShape = newShape();
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
						clearInterval(timer);
						return;
					}
					if (!this.firstShape[i][j]) {
						continue;
					}
					board[this.y + j][this.x + i] = this.color;
				}
			}
			let fullRow = 0;							// Remove full row and add points
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
				fullRow += fullRow;
				drawBoard();
				score.textContent = fullRow;
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
	};
});
