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
});
